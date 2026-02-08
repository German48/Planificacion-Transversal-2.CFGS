/**
 * ============================================
 * GANTT RENDERER - Diagrama de Gantt para Proyectos Transversales
 * Panel de Coordinación Docente - 2º CFGS
 * ============================================
 */

const GanttRenderer = (function () {
    'use strict';

    // ============ CONFIGURACIÓN ============
    const config = {
        containerId: 'gantt-container',
        phases: ['F0', 'F1', 'F2', 'F3', 'F4', 'F5'],
        evaluations: ['E1', 'E2', 'E3'],
        evalColors: {
            'E1': 'var(--e1-color)',
            'E2': 'var(--e2-color)',
            'E3': 'var(--e3-color)'
        },
        evalNames: {
            'E1': 'Proyecto Inicial',
            'E2': 'Proyecto Intermedio',
            'E3': 'Proyecto Final'
        },
        phaseIcons: {
            'F0': '🚀', // Lanzamiento
            'F1': '🔍', // Investigación/Diseño (Frío)
            'F2': '📐', // Doc Técnica (Frío)
            'F3': '📋', // Planificación (Transición)
            'F4': '🔨', // Fabricación (Cálido)
            'F5': '🎯'  // Entrega (Neutro)
        },
        phaseLabels: {
            'F0': 'Lanzamiento (Análisis)',
            'F1': 'Investigación y Diseño',
            'F2': 'Documentación Técnica',
            'F3': 'Planificación Industrial',
            'F4': 'Producción / Taller',
            'F5': 'Entrega y Defensa'
        }
    };

    // ============ ESTADO INTERNO ============
    let mode = 'docente'; // 'docente' o 'alumno'
    let state = {
        allWeeks: [],
        currentWeekIndex: -1,
        collapsedEvals: {},
        filterEval: 'all',
        filterModule: 'all'
    };

    // ============ MÉTODOS PRIVADOS ============

    /**
     * Cargar estado guardado en localStorage
     */
    function loadCollapsedState() {
        const stored = localStorage.getItem('gantt_collapsed_evals');
        if (stored) {
            try {
                state.collapsedEvals = JSON.parse(stored);
            } catch (e) {
                state.collapsedEvals = {};
            }
        }
    }

    function saveCollapsedState() {
        localStorage.setItem('gantt_collapsed_evals', JSON.stringify(state.collapsedEvals));
    }

    function loadFiltersState() {
        const stored = localStorage.getItem('gantt_filters');
        if (stored) {
            try {
                const filters = JSON.parse(stored);
                state.filterEval = filters.eval || 'all';
                state.filterModule = filters.module || 'all';
            } catch (e) { }
        }
    }

    function saveFiltersState() {
        localStorage.setItem('gantt_filters', JSON.stringify({
            eval: state.filterEval,
            module: state.filterModule
        }));
    }

    /**
     * Calcular qué semana es la actual basado en la fecha
     */
    function calculateCurrentWeek() {
        if (!window.MASTER_PLAN) return;

        const today = new Date();
        const todayStr = today.toISOString().split('T')[0];

        state.currentWeekIndex = window.MASTER_PLAN.weeks.findIndex(w =>
            todayStr >= w.date_from && todayStr <= w.date_to
        );
    }

    /**
     * Renderizar el componente completo
     */
    function render() {
        const container = document.getElementById(config.containerId);
        if (!container) return;

        calculateCurrentWeek();

        container.innerHTML = '';

        // 1. Render Legend (Pedagogical) - NEW
        const legend = document.createElement('div');
        legend.className = 'gantt-pedagogical-legend';
        legend.innerHTML = `
            <strong style="margin-right:10px">Leyenda:</strong>
            ${config.phases.map(p => `
                <div class="gantt-legend-item" title="${config.phaseLabels[p]}" style="cursor:pointer" onclick="if(window.UI?.showPhaseDetail) window.UI.showPhaseDetail('${p}')">
                    <span class="gantt-legend-color phase-${p}"></span>
                    <span>${config.phaseIcons[p]} ${p}</span>
                </div>
            `).join('')}
            <div class="gantt-legend-item" style="margin-left:15px; border-left:1px solid #ccc; padding-left:10px; cursor:help" title="Ficha diaria con evidencias evaluables">
                <span class="gantt-icon-badge">📄</span> <span style="font-size:0.9em">Evidencia</span>
            </div>
            <div class="gantt-legend-item" style="cursor:help" title="Entrega de producto físico o prototipo">
                <span class="gantt-icon-badge">🧩</span> <span style="font-size:0.9em">Producto</span>
            </div>
            <div class="gantt-legend-item" style="cursor:help" title="Fase de taller o fabricación">
                <span class="gantt-icon-badge">🔧</span> <span style="font-size:0.9em">Taller</span>
            </div>
            <div class="gantt-legend-item" style="cursor:help" title="Hito de evaluación (Gate)">
                <span style="font-size:1.2em">⚑</span> <span style="font-size:0.9em">Hito</span>
            </div>
            <div class="gantt-legend-item" style="margin-left:15px; border-left:1px solid #ccc; padding-left:10px; display:flex; gap:5px; align-items:center;">
                ${Object.values(window.MASTER_PLAN.modules).filter(m => m.short !== 'ALL').map(m => `
                    <span style="background-color:${m.color}; color:#fff; padding:2px 6px; border-radius:4px; font-size:0.75em; font-weight:bold; box-shadow:0 1px 2px rgba(0,0,0,0.1); cursor:help;" title="${m.name}">${m.short}</span>
                `).join('')}
            </div>
        `;
        container.appendChild(legend);


        // 2. Render Header (Semains)
        const headerRow = document.createElement('div');
        headerRow.className = 'gantt-header';

        // Espacio vacío para titulos
        const titleSpace = document.createElement('div');
        titleSpace.className = 'gantt-header-title-space';
        titleSpace.innerHTML = '';
        headerRow.appendChild(titleSpace);

        // Semanas
        const weeksContainer = document.createElement('div');
        weeksContainer.className = 'gantt-header-weeks';

        // Filtrar semanas según evaluación seleccionada
        let weeksToRender = window.MASTER_PLAN.weeks;
        if (state.filterEval !== 'all') {
            weeksToRender = weeksToRender.filter(w => w.eval === state.filterEval);
        }

        weeksToRender.forEach(w => {
            const cell = document.createElement('div');
            const isCurrent = (w.week_id === (window.MASTER_PLAN.weeks[state.currentWeekIndex]?.week_id));
            cell.className = `gantt-header-week-cell ${isCurrent ? 'current' : ''}`;

            // Determinar etiqueta S01...
            const weekNum = w.week_id.split('-S')[1] || w.week_id;

            cell.innerHTML = `
                <div class="w-label">${w.eval}-${weekNum}</div>
                <div class="w-dates">${formatDateRange(w.date_from, w.date_to)}</div>
                ${isCurrent ? '<div class="today-marker-label">SEMANA ACTUAL</div>' : ''}
            `;

            // Navegación rápida
            cell.onclick = () => {
                if (window.UI?.showWeekDetail) window.UI.showWeekDetail(w.week_id);
            };

            weeksContainer.appendChild(cell);
        });

        headerRow.appendChild(weeksContainer);
        container.appendChild(headerRow);

        // 3. Render Evaluations
        const evals = config.evaluations; // ['E1', 'E2', 'E3']
        evals.forEach(evalId => {
            if (state.filterEval !== 'all' && state.filterEval !== evalId) return;

            // Importante: Pasar las semanas visibles para alinear columnas
            const section = createEvalSection(evalId, weeksToRender);
            container.appendChild(section);
        });

        // Scroll initial
        setTimeout(syncCurrentWeek, 500);
    }

    function createEvalSection(evalId, visibleWeeks) {
        const isCollapsed = state.collapsedEvals[evalId];
        const section = document.createElement('div');
        section.className = `gantt-eval-section ${isCollapsed ? 'collapsed' : ''}`;

        // Fila de encabezado de evaluación
        const rowHeader = document.createElement('div');
        rowHeader.className = 'gantt-eval-row-header';
        rowHeader.style.setProperty('--eval-color', config.evalColors[evalId]);

        const titleCol = document.createElement('div');
        titleCol.className = 'gantt-eval-title-col';

        // Obtener nombre del proyecto
        let projName = config.evalNames[evalId];
        if (window.SettingsManager?.settings?.pedagogical?.projectNames?.[evalId]) {
            projName = window.SettingsManager.settings.pedagogical.projectNames[evalId];
        }

        titleCol.innerHTML = `
            <span class="toggle-icon">${isCollapsed ? '▶' : '▼'}</span>
            <span class="eval-tag">${evalId}</span>
            <span class="eval-name" title="Ver detalle del Proyecto">${projName}</span>
        `;

        // Click en la fila
        titleCol.onclick = (e) => {
            if (e.target.classList.contains('eval-name')) {
                const firstWeek = window.MASTER_PLAN.weeks.find(w => w.eval === evalId);
                if (firstWeek && window.UI?.showWeekDetail) {
                    window.UI.showWeekDetail(firstWeek.week_id);
                    e.stopPropagation();
                }
                return;
            }
            state.collapsedEvals[evalId] = !state.collapsedEvals[evalId];
            saveCollapsedState();
            render();
        };

        rowHeader.appendChild(titleCol);

        // Timeline Container
        const timelineCont = document.createElement('div');
        timelineCont.className = 'gantt-eval-timeline-cont';

        if (isCollapsed) {
            // Barra de progreso mini
            const prog = window.ProgressManager?.getEvaluationProgress(evalId) || 0;
            const progBar = document.createElement('div');
            progBar.className = 'gantt-eval-mini-progress';
            progBar.style.width = `${prog * 100}%`;
            timelineCont.appendChild(progBar);
        } else {
            // Fases como bloques CLICKABLES
            visibleWeeks.forEach(w => {
                const containerDiv = document.createElement('div');
                // Estilo inline para asegurar ancho igual al header
                containerDiv.style.minWidth = '110px';
                containerDiv.style.flex = '1';
                containerDiv.style.display = 'flex';
                containerDiv.style.borderRight = '1px solid var(--border-color, #eee)';
                containerDiv.style.padding = '0'; // Reset padding

                if (w.eval === evalId) {
                    const block = document.createElement('div');
                    block.className = `gantt-week-block phase-${w.phase_common}`;
                    block.style.width = '100%';

                    // Badges Logic
                    const hasEvidence = w.min_deliverable?.evidence_required?.length > 0;
                    const isProduct = (w.min_deliverable?.title || '').match(/producto|prototipo|maqueta|entrega/i);
                    const hasGate = w.gate !== null;
                    const isWorkshop = w.phase_common === 'F4';

                    block.innerHTML = `
                        <div class="gantt-block-content" style="position: relative; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                            <div style="display:flex; flex-direction:column; align-items:center; gap:4px; margin-top: 4px; z-index: 1;">    
                                <span style="font-size: 1.6rem; line-height: 1;">${config.phaseIcons[w.phase_common] || ''}</span>
                                <span style="font-size:0.75rem; font-weight: bold; opacity:0.9;">S${w.week_id.split('-S')[1]}</span>
                            </div>
                            
                            <!-- Badges distributed in corners -->
                            ${hasEvidence ? '<span class="gantt-badge badge-evidence" title="Requiere evidencia evaluable" style="position: absolute; top: 4px; left: 4px;">📄</span>' : ''}
                            ${isProduct ? '<span class="gantt-badge badge-product" title="Entrega de producto" style="position: absolute; bottom: 4px; left: 4px;">🧩</span>' : ''}
                            ${isWorkshop && !isProduct ? '<span class="gantt-badge badge-workshop" title="Taller/Fabricación" style="position: absolute; bottom: 4px; right: 4px;">🔧</span>' : ''}
                            
                            ${hasGate ? '<div class="gantt-milestone-marker" title="Hito de Evaluación" style="position: absolute; top: -8px; right: -4px;">⚑</div>' : ''}
                        </div>
                    `;

                    block.title = `Semana ${w.week_id}: ${w.week_goal}\n${w.gate ? 'HITO: ' + w.gate.title : ''}`;
                    block.style.cursor = 'pointer';
                    block.onclick = () => { if (window.UI?.showWeekDetail) window.UI.showWeekDetail(w.week_id); };
                    containerDiv.appendChild(block);
                }

                timelineCont.appendChild(containerDiv);
            });
        }

        rowHeader.appendChild(timelineCont);
        section.appendChild(rowHeader);

        // Filas de módulos
        if (!isCollapsed) {
            const modules = getModulesForEval(evalId);
            modules.forEach(mod => {
                if (state.filterModule !== 'all' && state.filterModule !== mod) return;
                section.appendChild(createModuleRow(evalId, mod, visibleWeeks));
            });
        }

        return section;
    }

    function createModuleRow(evalId, moduleId, visibleWeeks) {
        const row = document.createElement('div');
        row.className = mode === 'docente' ? 'gantt-module-row teacher-view-row' : 'gantt-module-row';

        const titleCol = document.createElement('div');
        titleCol.className = 'gantt-module-title-col';

        const moduleInfo = window.MASTER_PLAN.modules[moduleId] || { name: moduleId, short: moduleId, color: '#999' };
        titleCol.innerHTML = `
            <span class="module-badge" style="background-color: ${moduleInfo.color}; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 0.75em; font-weight: bold; min-width: 40px; text-align: center;">
                ${moduleInfo.short || moduleId}
            </span>
            <span style="font-size: 0.7em; margin-left: 5px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${moduleInfo.name}">
                ${moduleInfo.name}
            </span>
        `;
        row.appendChild(titleCol);

        const timelineCont = document.createElement('div');
        timelineCont.className = 'gantt-module-timeline';

        visibleWeeks.forEach(w => {
            const cell = document.createElement('div');
            cell.className = 'gantt-module-cell';

            // Check modules_focus from Master Plan (Data Source of Truth)
            const modData = w.modules_focus?.[moduleId];

            if (modData && w.eval === evalId) {
                const bar = document.createElement('div');
                bar.className = `gantt-bar ${moduleId.toLowerCase()}`;
                bar.classList.add(`phase-${w.phase_common}`);

                if (moduleInfo.color) {
                    bar.style.background = moduleInfo.color;
                    bar.style.opacity = '0.9';
                }

                // Show RA content only in Docente mode
                if (mode === 'docente') {
                    const label = modData.ra ? (Array.isArray(modData.ra) ? modData.ra.join(' ') : modData.ra) : (modData.focus ? modData.focus.substring(0, 15) + '..' : '');
                    bar.innerHTML = `<div class="gantt-ra-segment" style="font-size:9px">${label}</div>`;
                }

                // Tooltip with details
                bar.title = `${moduleId}: ${modData.focus || ''}\nEntregable: ${modData.deliverable || '-'}`;

                bar.onclick = () => { if (window.UI?.showWeekDetail) window.UI.showWeekDetail(w.week_id); };
                cell.appendChild(bar);
            }

            timelineCont.appendChild(cell);
        });

        row.appendChild(timelineCont);
        return row;
    }

    /**
     * Obtener módulos únicos de una evaluación
     */
    function getModulesForEval(evalId) {
        // En base a los datos visualizados en MasterPlan para esta evaluación
        const weeks = window.MASTER_PLAN.weeks.filter(w => w.eval === evalId);
        const mods = new Set();
        weeks.forEach(w => {
            if (w.modules_focus) {
                Object.keys(w.modules_focus).forEach(m => mods.add(m));
            } else if (w.contents && Array.isArray(w.contents)) {
                // Fallback for old structure if exists
                w.contents.forEach(c => mods.add(c.module));
            }
        });
        return Array.from(mods).sort();
    }

    function formatDateRange(from, to) {
        if (!from || !to) return '';
        const d1 = new Date(from);
        const d2 = new Date(to);
        const options = { day: '2-digit', month: 'short' };
        return `${d1.toLocaleDateString('es-ES', options)} - ${d2.toLocaleDateString('es-ES', options)}`;
    }

    function syncCurrentWeek() {
        const currentCell = document.querySelector('.gantt-header-week-cell.current');
        if (currentCell) {
            setTimeout(() => {
                currentCell.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }, 100);
        }
    }

    // ============ INTERFAZ PÚBLICA ============
    return {
        init: function (targetMode = 'docente') {
            mode = targetMode;
            calculateCurrentWeek();
            loadCollapsedState();
            loadFiltersState();
            render();

            // Escuchar cambios de progreso
            window.addEventListener('progressUpdated', () => render());
            // Escuchar cambios de configuración
            window.addEventListener('settingsApplied', () => render());

            console.log('🚀 GanttRenderer initialized in mode:', mode);
        },
        updateFilters: function (filters) {
            if (filters.eval !== undefined) state.filterEval = filters.eval;
            if (filters.module !== undefined) state.filterModule = filters.module;
            saveFiltersState();
            render();
        },
        resetState: () => {
            state.collapsedEvals = {};
            state.filterEval = 'all';
            state.filterModule = 'all';
            loadCollapsedState();
            loadFiltersState();
            render();
        },
        getMode: () => mode,
        setMode: (newMode) => {
            mode = newMode;
            render();
        },
        refresh: () => {
            calculateCurrentWeek();
            render();
        },
        render: render
    };

})();

// Hacer disponible globalmente
window.GanttRenderer = GanttRenderer;
window.ganttRenderer = window.GanttRenderer;
