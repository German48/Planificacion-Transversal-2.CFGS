/**
 * ============================================
 * GANTT RENDERER - Diagrama de Gantt para Proyectos Transversales
 * Panel de Coordinación Docente - 1º CFGS
 * ============================================
 */

window.GanttRenderer = (function () {
    'use strict';

    // ============ CONFIGURACIÓN ============
    const config = {
        containerId: 'gantt-container',
        phases: ['F0', 'F1', 'F2', 'F3', 'F4', 'F5'],
        evaluations: ['E1', 'E2', 'FEOE'],
        evalColors: {
            'E1': 'var(--e1-color)',
            'E2': 'var(--e2-color)',
            'FEOE': 'var(--feoe-color)'
        },
        evalNames: {
            'E1': window.MASTER_PLAN?.pedagogical_context?.E1?.title || 'Cocina Lineal (Anteproyecto)',
            'E2': window.MASTER_PLAN?.pedagogical_context?.E2?.title || 'Cocina Lineal (Ejecutivo)',
            'FEOE': window.MASTER_PLAN?.pedagogical_context?.FEOE?.title || 'Formación en Empresa'
        },
        phaseIcons: {
            'F0': '🚀',
            'F1': '🔍',
            'F2': '📐',
            'F3': '📋',
            'F4': '🔨',
            'F5': '🎯'
        },
        phaseNames: {
            'F0': 'Lanzamiento',
            'F1': 'Investigación',
            'F2': 'Diseño/Repr.',
            'F3': 'Planificación',
            'F4': 'Fabricación',
            'F5': 'Cierre'
        }
    };

    // ============ ESTADO ============
    let state = {
        filterEval: 'all',
        filterModule: 'all',
        collapsedEvals: {},
        currentWeekId: null
    };

    // ============ MODO ============
    // docente | alumnado
    let mode = 'docente';

    // Claves de almacenamiento por modo
    function getCurrentYear() {
        if (window.AcademicYearManager?.getCurrentYear) {
            return window.AcademicYearManager.getCurrentYear();
        }
        return window.MASTER_PLAN?.config?.academic_year || '2025-2026';
    }

    function storageKey(base) {
        const year = getCurrentYear();
        return `${base}_${year}_${mode}`;
    }

    function legacyStorageKey(base) {
        return `${base}_${mode}`;
    }

    // ============ INICIALIZACIÓN ============
    function init() {
        console.log('📊 Gantt Renderer inicializado');
        calculateCurrentWeek();
        loadCollapsedState();
        loadFiltersState();
    }

    // ============ CALCULAR SEMANA ACTUAL ============
    function calculateCurrentWeek() {
        if (!window.MASTER_PLAN || !window.MASTER_PLAN.weeks) return;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const week of window.MASTER_PLAN.weeks) {
            const from = new Date(week.date_from);
            const to = new Date(week.date_to);
            from.setHours(0, 0, 0, 0);
            to.setHours(23, 59, 59, 999);

            if (today >= from && today <= to) {
                state.currentWeekId = week.week_id;
                break;
            }
        }
    }

    function getProgressPolicy() {
        // alumnado: proceso (DoD)
        if (mode === 'alumnado') return 'process';
        // docente: mixto (DoD si existe; si no, evidencias)
        return 'mixed';
    }

    // ============ OBTENER PROGRESO DE SEMANA ============
    function getWeekProgress(weekId) {
        // Si hay timeline DoDs: calcular por DoDs de esa semana concreta
        if (window.raTracker?.data?.timelineDods) {
            const dods = window.raTracker.data.timelineDods;
            const evalLower = weekId.split('-')[0].toLowerCase();   // e1/e2/e3
            const weekNum = weekId.split('-')[1].replace('S', '');   // "01"

            let total = 0, completed = 0;
            Object.keys(dods).forEach(k => {
                // ej: e2_week3_dod0
                if (k.startsWith(`${evalLower}_week${parseInt(weekNum, 10)}_`)) {
                    total++;
                    if (dods[k]) completed++;
                }
            });

            if (total > 0) return Math.round((completed / total) * 100);
        }

        // Fallback: 0 (alumnado) o evidencias (docente)
        if (getProgressPolicy() === 'process') return 0;

        // Intentar obtener progreso del raTracker si existe
        if (!window.raTracker || !window.raTracker.data) {
            return 0;
        }

        const eval_id = weekId.split('-')[0].toLowerCase();
        const evidences = window.raTracker.data.evidences || {};

        // Calcular progreso basado en evidencias de esa evaluación
        let total = 0;
        let completed = 0;

        Object.keys(evidences).forEach(key => {
            if (key.startsWith(eval_id + '_')) {
                total++;
                if (evidences[key] && evidences[key].completed) {
                    completed++;
                }
            }
        });

        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    }

    // ============ OBTENER SEMANAS POR EVALUACIÓN ============
    function getWeeksByEvaluation(evalId) {
        if (!window.MASTER_PLAN || !window.MASTER_PLAN.weeks) return [];
        return window.MASTER_PLAN.weeks.filter(w => w.eval === evalId);
    }

    // ============ CALCULAR PROGRESO EVALUACIÓN ============
    function getEvaluationProgress(evalId) {
        const policy = getProgressPolicy();

        const weeks = getWeeksByEvaluation(evalId);
        if (weeks.length === 0) return 0;

        // 1) PROCESO (DoD) - alumnado y docente (si hay)
        if (window.raTracker && window.raTracker.data.timelineDods) {
            const dods = window.raTracker.data.timelineDods;
            let total = 0;
            let completed = 0;

            Object.keys(dods).forEach(key => {
                if (key.startsWith(evalId.toLowerCase() + '_')) {
                    total++;
                    if (dods[key]) completed++;
                }
            });

            if (total > 0) {
                return Math.round((completed / total) * 100);
            }
        }

        // 2) Si alumnado => no mezclar con evidencias
        if (policy === 'process') return 0;

        // 3) Fallback evidencias (docente)
        const evalIdLower = evalId.toLowerCase();
        const evidences = window.raTracker?.data?.evidences || {};
        let total = 0;
        let completed = 0;

        Object.keys(evidences).forEach(key => {
            if (key.startsWith(evalIdLower + '_')) {
                total++;
                if (evidences[key]?.completed) completed++;
            }
        });

        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    // ============ OBTENER MÓDULO LÍDER DE LA SEMANA ============
    function getWeekLeaderModule(week) {
        if (!week.modules_focus) return 'all';

        const modules = Object.keys(week.modules_focus);
        if (modules.length > 0) {
            return modules[0].toLowerCase();
        }
        return 'all';
    }

    // ============ FORMATEAR FECHA ============
    function formatDateRange(dateFrom, dateTo) {
        const from = new Date(dateFrom);
        const to = new Date(dateTo);

        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const dayFrom = from.getDate();
        const dayTo = to.getDate();
        const monthFrom = months[from.getMonth()];
        const monthTo = months[to.getMonth()];

        if (monthFrom === monthTo) {
            return `${dayFrom}-${dayTo} ${monthFrom}`;
        } else {
            return `${dayFrom} ${monthFrom} - ${dayTo} ${monthTo}`;
        }
    }

    // ============ RENDERIZAR GANTT ============
    function render() {
        const container = document.getElementById(config.containerId);
        if (!container || !window.MASTER_PLAN) {
            console.warn('Gantt: Contenedor no encontrado o MASTER_PLAN no disponible');
            return;
        }

        let html = '';

        // Toolbar
        html += renderToolbar();

        // Contenedor principal
        html += '<div class="gantt-container">';

        // Renderizar cada evaluación
        config.evaluations.forEach(evalId => {
            if (state.filterEval !== 'all' && state.filterEval !== evalId) {
                return;
            }
            html += renderEvaluation(evalId);
        });

        html += '</div>';

        // Resumen
        html += renderSummary();

        container.innerHTML = html;

        // Restaurar estado de colapso
        restoreCollapsedState();
    }

    // ============ RENDERIZAR TOOLBAR ============
    function renderToolbar() {
        const modules = window.MASTER_PLAN?.modules || {};
        const isStudent = mode === 'alumnado';

        return `
            <div class="gantt-toolbar">
                <div class="gantt-filters">
                    <div class="gantt-filter-group">
                        <label>📅 Evaluación:</label>
                        <select id="gantt-filter-eval" onchange="GanttRenderer.setFilter('eval', this.value)">
                            <option value="all" ${state.filterEval === 'all' ? 'selected' : ''}>Todas</option>
                            <option value="E1" ${state.filterEval === 'E1' ? 'selected' : ''}>E1 - ${window.SettingsManager?.settings?.pedagogical?.projectNames?.E1 || window.MASTER_PLAN?.pedagogical_context?.E1?.title || 'Proyecto'}</option>
                            <option value="E2" ${state.filterEval === 'E2' ? 'selected' : ''}>E2 - ${window.SettingsManager?.settings?.pedagogical?.projectNames?.E2 || window.MASTER_PLAN?.pedagogical_context?.E2?.title || 'Proyecto'}</option>
                            <option value="FEOE" ${state.filterEval === 'FEOE' ? 'selected' : ''}>FEOE - ${window.SettingsManager?.settings?.pedagogical?.projectNames?.FEOE || window.MASTER_PLAN?.pedagogical_context?.FEOE?.title || 'Empresa'}</option>
                        </select>
                    </div>
                    ${isStudent ? '' : `
                    <div class="gantt-filter-group">
                        <label>🏷️ Módulo:</label>
                        <select id="gantt-filter-module" onchange="GanttRenderer.setFilter('module', this.value)">
                            <option value="all" ${state.filterModule === 'all' ? 'selected' : ''}>Todos</option>
                            ${Object.entries(modules).map(([id, m]) => `
                                <option value="${id.toLowerCase()}" ${state.filterModule === id.toLowerCase() ? 'selected' : ''}>
                                    ${m.icon} ${m.short}
                                </option>
                            `).join('')}
                        </select>
                    </div>
                    `}
                </div>
                ${isStudent ? '' : `
                <div class="gantt-legend">
                    ${Object.entries(modules).map(([id, m]) => `
                        <div class="gantt-legend-item">
                            <div class="gantt-legend-dot" style="background: ${m.color}"></div>
                            <span>${m.short}</span>
                        </div>
                    `).join('')}
                </div>
                `}
            </div>
        `;
    }

    // ============ RENDERIZAR EVALUACIÓN ============
    function renderEvaluation(evalId) {
        const weeks = getWeeksByEvaluation(evalId);
        const progress = getEvaluationProgress(evalId);
        const isCollapsed = state.collapsedEvals[evalId] || false;

        return `
            <div class="gantt-evaluation" id="gantt-eval-${evalId}">
                <div class="gantt-eval-header ${evalId.toLowerCase()} ${isCollapsed ? 'collapsed' : ''}" 
                     onclick="GanttRenderer.toggleEvaluation('${evalId}')">
                    <div class="gantt-eval-title">
                        <h3>${evalId}: ${window.SettingsManager?.settings?.pedagogical?.projectNames?.[evalId] || window.MASTER_PLAN?.pedagogical_context?.[evalId]?.title || evalId}</h3>
                        <span class="gantt-eval-badge ${evalId.toLowerCase()}">${weeks.length} semanas</span>
                    </div>
                    <div class="gantt-eval-meta">
                        <div class="gantt-eval-progress">
                            <div class="gantt-eval-progress-bar">
                                <div class="gantt-eval-progress-fill ${evalId.toLowerCase()}" 
                                     style="width: ${progress}%"></div>
                            </div>
                            <span class="gantt-eval-percent">${progress}%</span>
                        </div>
                        <span class="gantt-eval-toggle">▼</span>
                    </div>
                </div>
                <div class="gantt-eval-body ${isCollapsed ? 'collapsed' : ''}" id="gantt-body-${evalId}">
                    ${renderGanttChart(weeks, evalId)}
                </div>
            </div>
        `;
    }

    // ============ RENDERIZAR DIAGRAMA GANTT ============
    function renderGanttChart(weeks, evalId) {
        if (weeks.length === 0) {
            return '<p style="padding: 20px; text-align: center;">No hay semanas para esta evaluación</p>';
        }

        let html = '<div class="gantt-chart">';

        // Columna de etiquetas de semanas
        html += '<div class="gantt-weeks-header">';
        html += '<div class="gantt-week-label" style="height: 45px; font-weight: 700; color: var(--text-secondary);">Semana</div>';

        weeks.forEach(week => {
            const isCurrent = week.week_id === state.currentWeekId;
            html += `
                <div class="gantt-week-label ${isCurrent ? 'current' : ''}" 
                     onclick="GanttRenderer.navigateToWeek('${week.week_id}')"
                     style="cursor: pointer;">
                    <span class="gantt-week-id">${week.week_id}</span>
                    <span class="gantt-week-dates">${formatDateRange(week.date_from, week.date_to)}</span>
                </div>
            `;
        });
        html += '</div>';

        // Grid de fases
        html += '<div class="gantt-phases-grid">';

        config.phases.forEach(phase => {
            html += `<div class="gantt-phase-column">`;
            html += `<div class="gantt-phase-header">${config.phaseIcons[phase]} ${config.phaseNames[phase]}</div>`;

            weeks.forEach(week => {
                const isCurrentPhase = week.phase_common === phase;
                const leaderModule = getWeekLeaderModule(week);
                const progress = getWeekProgress(week.week_id);

                // Aplicar filtro de módulo
                let showBar = true;
                if (state.filterModule !== 'all') {
                    const weekModules = Object.keys(week.modules_focus || {}).map(m => m.toLowerCase());
                    showBar = weekModules.includes(state.filterModule);
                }

                html += `<div class="gantt-phase-cell">`;

                if (isCurrentPhase && showBar) {
                    html += `
                        <div class="gantt-bar ${leaderModule}" 
                             onclick="GanttRenderer.navigateToWeek('${week.week_id}')"
                             title="${week.week_goal || ''}">
                            <span class="gantt-bar-label">${week.week_goal?.substring(0, 30) || phase}...</span>
                            ${week.gate ? '<span class="gantt-bar-icon">🚦</span>' : ''}
                            <div class="gantt-bar-progress" style="width: ${progress}%"></div>
                            <div class="gantt-tooltip">
                                <div class="gantt-tooltip-title">${week.week_id}: ${week.phase_common}</div>
                                <div class="gantt-tooltip-info">
                                    ${week.week_goal || 'Sin objetivo definido'}<br>
                                    <strong>Gate:</strong> ${week.gate?.title || 'N/A'}<br>
                                    <strong>Progreso:</strong> ${progress}%
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    html += `<div class="gantt-bar-empty"></div>`;
                }

                html += `</div>`;
            });

            html += `</div>`;
        });

        html += '</div>'; // gantt-phases-grid
        html += '</div>'; // gantt-chart

        return html;
    }

    // ============ RENDERIZAR RESUMEN ============
    function renderSummary() {
        const totalWeeks = window.MASTER_PLAN?.weeks?.length || 0;
        const currentWeekIndex = window.MASTER_PLAN?.weeks?.findIndex(w => w.week_id === state.currentWeekId) + 1 || 0;

        let totalProgress = 0;
        config.evaluations.forEach(evalId => {
            totalProgress += getEvaluationProgress(evalId);
        });
        totalProgress = Math.round(totalProgress / 3);

        return `
            <div class="gantt-summary">
                <div class="gantt-summary-card">
                    <div class="gantt-summary-title">📅 Semana Actual</div>
                    <div class="gantt-summary-value">${state.currentWeekId || 'N/A'}</div>
                    <div class="gantt-summary-subtitle">${currentWeekIndex} de ${totalWeeks} semanas</div>
                </div>
                <div class="gantt-summary-card">
                    <div class="gantt-summary-title">📈 Progreso Global</div>
                    <div class="gantt-summary-value">${totalProgress}%</div>
                    <div class="gantt-summary-subtitle">Promedio de las 3 evaluaciones</div>
                </div>
                <div class="gantt-summary-card">
                    <div class="gantt-summary-title">🎯 Próximo Hito</div>
                    <div class="gantt-summary-value" style="font-size: 1.2rem;">${getNextMilestone()}</div>
                    <div class="gantt-summary-subtitle">Gate pendiente</div>
                </div>
            </div>
        `;
    }

    // ============ OBTENER PRÓXIMO HITO ============
    function getNextMilestone() {
        if (!window.MASTER_PLAN?.weeks || !state.currentWeekId) return 'N/A';

        const currentIndex = window.MASTER_PLAN.weeks.findIndex(w => w.week_id === state.currentWeekId);
        if (currentIndex === -1) return 'N/A';

        for (let i = currentIndex; i < window.MASTER_PLAN.weeks.length; i++) {
            const week = window.MASTER_PLAN.weeks[i];
            if (week.gate && week.gate.title) {
                return `${week.week_id}: ${week.gate.title}`;
            }
        }

        return 'Curso completado 🎉';
    }

    // ============ TOGGLE EVALUACIÓN ============
    function toggleEvaluation(evalId) {
        const body = document.getElementById(`gantt-body-${evalId}`);
        const header = body?.previousElementSibling;

        if (!body || !header) return;

        const isCollapsed = body.classList.contains('collapsed');

        if (isCollapsed) {
            body.classList.remove('collapsed');
            header.classList.remove('collapsed');
            state.collapsedEvals[evalId] = false;
        } else {
            body.classList.add('collapsed');
            header.classList.add('collapsed');
            state.collapsedEvals[evalId] = true;
        }

        saveCollapsedState();
    }

    // ============ GUARDAR/CARGAR ESTADO COLAPSADO ============
    function saveCollapsedState() {
        localStorage.setItem(storageKey('gantt_collapsed_state'), JSON.stringify(state.collapsedEvals));
    }

    function loadCollapsedState() {
        try {
            const storageId = storageKey('gantt_collapsed_state');
            const saved = localStorage.getItem(storageId);
            if (saved) {
                state.collapsedEvals = JSON.parse(saved);
                return;
            }

            const legacySaved = localStorage.getItem(legacyStorageKey('gantt_collapsed_state'));
            if (legacySaved) {
                state.collapsedEvals = JSON.parse(legacySaved);
                localStorage.setItem(storageId, legacySaved);
            }
        } catch (e) {
            console.warn('Error cargando estado de Gantt:', e);
        }
    }

    function saveFiltersState() {
        localStorage.setItem(storageKey('gantt_filters_state'), JSON.stringify({
            filterEval: state.filterEval,
            filterModule: state.filterModule
        }));
    }

    function loadFiltersState() {
        try {
            const storageId = storageKey('gantt_filters_state');
            const saved = localStorage.getItem(storageId);
            if (saved) {
                const data = JSON.parse(saved);
                state.filterEval = data.filterEval || 'all';
                state.filterModule = data.filterModule || 'all';
                return;
            }

            const legacySaved = localStorage.getItem(legacyStorageKey('gantt_filters_state'));
            if (legacySaved) {
                const data = JSON.parse(legacySaved);
                state.filterEval = data.filterEval || 'all';
                state.filterModule = data.filterModule || 'all';
                localStorage.setItem(storageId, legacySaved);
            }
        } catch (e) {
            console.warn('Error cargando filtros de Gantt:', e);
        }
    }

    function restoreCollapsedState() {
        Object.keys(state.collapsedEvals).forEach(evalId => {
            if (state.collapsedEvals[evalId]) {
                const body = document.getElementById(`gantt-body-${evalId}`);
                const header = body?.previousElementSibling;
                if (body && header) {
                    body.classList.add('collapsed');
                    header.classList.add('collapsed');
                }
            }
        });
    }

    // ============ ESTABLECER FILTRO ============
    function setFilter(type, value) {
        if (type === 'eval') {
            state.filterEval = value;
        } else if (type === 'module') {
            state.filterModule = value;
        }
        saveFiltersState();
        render();
    }

    // ============ NAVEGAR A SEMANA ============
    function navigateToWeek(weekId) {
        // Cambiar a vista Timeline y seleccionar la semana
        if (typeof switchView === 'function') {
            switchView(2); // Vista Timeline
        }

        // Buscar y resaltar la semana en el timeline
        setTimeout(() => {
            const evalId = weekId.split('-')[0].toLowerCase();
            const content = document.getElementById(`content-${evalId}`);
            const header = document.getElementById(`toggle-${evalId}`)?.parentElement;

            // Expandir la evaluación si está colapsada
            if (content && content.classList.contains('collapsed')) {
                content.classList.remove('collapsed');
                header?.classList.remove('collapsed');
            }

            // Scroll al elemento de la semana
            const weekElement = document.querySelector(`[data-week-id="${weekId}"]`);
            if (weekElement) {
                weekElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                weekElement.style.boxShadow = '0 0 20px rgba(52, 152, 219, 0.5)';
                setTimeout(() => {
                    weekElement.style.boxShadow = '';
                }, 2000);
            }
        }, 300);
    }

    // ============ API PÚBLICA ============
    init();

    return {
        render: render,
        toggleEvaluation: toggleEvaluation,
        setFilter: setFilter,
        navigateToWeek: navigateToWeek,
        getState: () => state,
        setMode: (newMode) => {
            mode = (newMode === 'alumnado') ? 'alumnado' : 'docente';
            // recargar estados por perfil
            state.collapsedEvals = {};
            state.filterEval = 'all';
            state.filterModule = 'all';
            loadCollapsedState();
            loadFiltersState();
            render();
        },
        getMode: () => mode,
        refresh: () => {
            calculateCurrentWeek();
            render();
        }
    };

})();

// Hacer disponible globalmente
window.ganttRenderer = window.GanttRenderer;
