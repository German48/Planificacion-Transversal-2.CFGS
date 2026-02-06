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
            'E1': window.MASTER_PLAN?.pedagogical_context?.E1?.title || 'Cocina Lineal (Anteproyecto)',
            'E2': window.MASTER_PLAN?.pedagogical_context?.E2?.title || 'Cocina Lineal (Ejecutivo)',
            'E3': window.MASTER_PLAN?.pedagogical_context?.E3?.title || 'Formación en Empresa'
        },
        phaseIcons: {
            'F0': '🚀',
            'F1': '🔍',
            'F2': '📐',
            'F3': '📋',
            'F4': '🔨',
            'F5': '🎯'
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
        if (!container || !window.MASTER_PLAN) return;

        // Limpiar
        container.innerHTML = '';

        // Header de meses/semanas
        const header = createHeader();
        container.appendChild(header);

        // Grid principal
        const grid = document.createElement('div');
        grid.className = 'gantt-grid';

        // Estructura: Agrupar semanas por Evaluación
        const evals = config.evaluations;

        evals.forEach(ev => {
            if (state.filterEval !== 'all' && state.filterEval !== ev) return;

            const section = createEvalSection(ev);
            grid.appendChild(section);
        });

        container.appendChild(grid);

        // Sincronizar scroll si es necesario
        syncCurrentWeek();
    }

    function createHeader() {
        const header = document.createElement('div');
        header.className = 'gantt-header';

        // Espacio para la columna de títulos
        const titleSpace = document.createElement('div');
        titleSpace.className = 'gantt-header-title-space';
        header.appendChild(titleSpace);

        // Contenedor de semanas
        const weeksCont = document.createElement('div');
        weeksCont.className = 'gantt-header-weeks';

        window.MASTER_PLAN.weeks.forEach((w, index) => {
            // Filtrar si es necesario
            if (state.filterEval !== 'all' && w.eval !== state.filterEval) return;

            const wCell = document.createElement('div');
            wCell.className = 'gantt-header-week-cell';
            if (index === state.currentWeekIndex) wCell.classList.add('current');

            const weekNum = w.week_id.split('-S')[1];
            wCell.innerHTML = `
                <div class="w-label">S${weekNum}</div>
                <div class="w-dates">${formatDateRange(w.date_from, w.date_to)}</div>
            `;

            wCell.onclick = () => {
                if (window.showDayDetail) {
                    window.showDayDetail(w.date_from);
                }
            };

            weeksCont.appendChild(wCell);
        });

        header.appendChild(weeksCont);
        return header;
    }

    function createEvalSection(evalId) {
        const isCollapsed = state.collapsedEvals[evalId];
        const section = document.createElement('div');
        section.className = `gantt-eval-section ${isCollapsed ? 'collapsed' : ''}`;

        // Fila de encabezado de evaluación
        const rowHeader = document.createElement('div');
        rowHeader.className = 'gantt-eval-row-header';
        rowHeader.style.setProperty('--eval-color', config.evalColors[evalId]);

        const titleCol = document.createElement('div');
        titleCol.className = 'gantt-eval-title-col';

        // Obtener nombre del proyecto (desde settings o masterplan)
        let projName = config.evalNames[evalId];
        if (window.SettingsManager?.settings?.pedagogical?.customProjectNames?.[evalId]) {
            projName = window.SettingsManager.settings.pedagogical.customProjectNames[evalId];
        }

        titleCol.innerHTML = `
            <span class="toggle-icon">${isCollapsed ? '▶' : '▼'}</span>
            <span class="eval-tag">${evalId}</span>
            <span class="eval-name">${projName}</span>
        `;

        titleCol.onclick = () => {
            state.collapsedEvals[evalId] = !state.collapsedEvals[evalId];
            saveCollapsedState();
            render();
        };

        rowHeader.appendChild(titleCol);

        // Barra de progreso de la evaluación en el header (solo si está colapsado)
        const timelineCont = document.createElement('div');
        timelineCont.className = 'gantt-eval-timeline-cont';

        if (isCollapsed) {
            const weeks = window.MASTER_PLAN.weeks.filter(w => w.eval === evalId);
            const totalWidth = weeks.length * 100; // Ajuste CSS
            const prog = window.ProgressManager?.getEvaluationProgress(evalId) || 0;

            const progBar = document.createElement('div');
            progBar.className = 'gantt-eval-mini-progress';
            progBar.style.width = `${prog * 100}%`;
            timelineCont.appendChild(progBar);
        } else {
            // Si no está colapsado, mostrar las fases como bloques
            const weeks = window.MASTER_PLAN.weeks.filter(w => w.eval === evalId);
            weeks.forEach(w => {
                const block = document.createElement('div');
                block.className = `gantt-week-block phase-${w.phase_common}`;
                block.innerHTML = `<span>${config.phaseIcons[w.phase_common] || ''}</span>`;
                block.title = `${w.week_goal}`;
                timelineCont.appendChild(block);
            });
        }

        rowHeader.appendChild(timelineCont);
        section.appendChild(rowHeader);

        // Filas de módulos (solo si no está colapsado)
        if (!isCollapsed) {
            const modules = getModulesForEval(evalId);
            modules.forEach(mod => {
                if (state.filterModule !== 'all' && state.filterModule !== mod) return;
                section.appendChild(createModuleRow(evalId, mod));
            });
        }

        return section;
    }

    function createModuleRow(evalId, moduleId) {
        const row = document.createElement('div');
        row.className = 'gantt-module-row';

        const titleCol = document.createElement('div');
        titleCol.className = 'gantt-module-title-col';
        titleCol.innerHTML = `<span class="mod-code">${moduleId}</span>`;
        row.appendChild(titleCol);

        const timelineCont = document.createElement('div');
        timelineCont.className = 'gantt-module-timeline-cont';

        const weeks = window.MASTER_PLAN.weeks.filter(w => w.eval === evalId);
        weeks.forEach(w => {
            const cell = document.createElement('div');
            cell.className = 'gantt-module-cell';

            // Buscar si hay contenido para este módulo en esta semana
            const content = w.contents.find(c => c.module === moduleId);
            if (content) {
                const bar = document.createElement('div');
                bar.className = `gantt-task-bar phase-${w.phase_common}`;
                if (window.ProgressManager?.getWeekProgress(w.week_id) >= 1) {
                    bar.classList.add('completed');
                }

                bar.innerHTML = `<span class="task-icon">${config.phaseIcons[w.phase_common] || ''}</span>`;
                bar.title = `${moduleId}: ${content.topics.join(', ')}`;

                bar.onclick = () => {
                    if (window.UI?.showWeekDetail) {
                        window.UI.showWeekDetail(w.week_id);
                    }
                };

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
        const weeks = window.MASTER_PLAN.weeks.filter(w => w.eval === evalId);
        const mods = new Set();
        weeks.forEach(w => {
            w.contents.forEach(c => mods.add(c.module));
        });
        return Array.from(mods).sort();
    }

    function formatDateRange(from, to) {
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
        refresh: () => {
            calculateCurrentWeek();
            render();
        }
    };

})();

// Hacer disponible globalmente
window.GanttRenderer = GanttRenderer;
window.ganttRenderer = window.GanttRenderer;
