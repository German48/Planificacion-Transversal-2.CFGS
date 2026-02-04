/**
 * PROGRESS MANAGER
 * Sistema de seguimiento y progreso para el sistema de planificación
 * Gestiona el estado de completitud de tareas, evidencias y hitos
 */

class ProgressManager {
    constructor() {
        this.currentSchemaVersion = '1.1';
        this.storageKey = this.buildStorageKey('planificacion_progress');
        this.data = this.loadProgress();
    }

    getCurrentYear() {
        const stored = localStorage.getItem('selected_academic_year');
        if (stored) return stored;
        return window.MASTER_PLAN?.config?.academic_year
            || window.MASTER_PLAN?.config?.year
            || '2025-2026';
    }

    buildStorageKey(baseKey) {
        const year = this.getCurrentYear();
        return `${baseKey}_${year}`;
    }

    getLegacyStorageKey(baseKey) {
        return baseKey;
    }

    getDefaultProgress() {
        return {
            schemaVersion: this.currentSchemaVersion,
            version: '1.0',
            lastUpdated: new Date().toISOString(),
            days: {},
            weeks: {},
            phases: {},
            evaluations: {}
        };
    }

    /**
     * Reiniciar todo el progreso
     */
    resetProgress() {
        this.data = this.getDefaultProgress();
        this.saveProgress();
        console.log('🧹 ProgressManager reiniciado');
    }

    /**
     * Cargar progreso desde localStorage
     */
    loadProgress() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                return this.migrateProgress(parsed);
            }
            const legacyStored = localStorage.getItem(this.getLegacyStorageKey('planificacion_progress'));
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                const migrated = this.migrateProgress(parsed);
                localStorage.setItem(this.storageKey, JSON.stringify(migrated));
                return migrated;
            }
        } catch (error) {
            console.error('Error loading progress:', error);
        }

        return this.getDefaultProgress();
    }

    migrateProgress(storedData) {
        const migrated = { ...this.getDefaultProgress(), ...storedData };
        migrated.schemaVersion = this.currentSchemaVersion;
        migrated.days = storedData.days || {};
        migrated.weeks = storedData.weeks || {};
        migrated.phases = storedData.phases || {};
        migrated.evaluations = storedData.evaluations || {};
        return migrated;
    }

    /**
     * Guardar progreso en localStorage
     */
    saveProgress() {
        try {
            this.data.lastUpdated = new Date().toISOString();
            this.data.schemaVersion = this.currentSchemaVersion;
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));

            // Emitir evento para actualizar UI
            window.dispatchEvent(new CustomEvent('progressUpdated', {
                detail: this.data
            }));

            return true;
        } catch (error) {
            console.error('Error saving progress:', error);
            return false;
        }
    }

    /**
     * Marcar/desmarcar una tarea como completada
     */
    toggleTask(date, taskId, completed = null) {
        if (!this.data.days[date]) {
            this.data.days[date] = {
                tasks: [],
                notes: '',
                completedAt: null
            };
        }

        const dayData = this.data.days[date];
        const taskIndex = dayData.tasks.indexOf(taskId);

        if (completed === null) {
            // Toggle
            if (taskIndex > -1) {
                dayData.tasks.splice(taskIndex, 1);
            } else {
                dayData.tasks.push(taskId);
            }
        } else if (completed && taskIndex === -1) {
            dayData.tasks.push(taskId);
        } else if (!completed && taskIndex > -1) {
            dayData.tasks.splice(taskIndex, 1);
        }

        this.saveProgress();
        this.updateWeekProgress(date);
        return dayData.tasks.includes(taskId);
    }

    /**
     * Verificar si una tarea está completada
     */
    isTaskCompleted(date, taskId) {
        return this.data.days[date]?.tasks?.includes(taskId) || false;
    }

    /**
     * Obtener todas las tareas completadas de un día
     */
    getDayTasks(date) {
        return this.data.days[date]?.tasks || [];
    }

    /**
     * Añadir nota a un día
     */
    setDayNote(date, note) {
        if (!this.data.days[date]) {
            this.data.days[date] = {
                tasks: [],
                notes: '',
                completedAt: null
            };
        }

        this.data.days[date].notes = note;
        this.saveProgress();
    }

    /**
     * Obtener nota de un día
     */
    getDayNote(date) {
        return this.data.days[date]?.notes || '';
    }

    /**
     * Calcular progreso de un día (0-1)
     */
    getDayProgress(date, totalTasks = 5) {
        const completedTasks = this.getDayTasks(date).length;
        return totalTasks > 0 ? completedTasks / totalTasks : 0;
    }

    /**
     * Actualizar progreso de una semana basado en sus días
     */
    updateWeekProgress(date) {
        const weekData = window.MASTER_PLAN?.getWeek(this.getWeekIdFromDate(date));
        if (!weekData) return;

        const weekId = weekData.week_id;
        const weekDates = this.getWeekDates(weekData);

        let totalProgress = 0;
        let daysWithData = 0;

        weekDates.forEach(d => {
            if (this.data.days[d]) {
                totalProgress += this.getDayProgress(d);
                daysWithData++;
            }
        });

        const weekProgress = daysWithData > 0 ? totalProgress / weekDates.length : 0;

        this.data.weeks[weekId] = {
            completed: weekProgress,
            lastUpdated: new Date().toISOString()
        };

        this.saveProgress();
        this.updatePhaseProgress(weekData.phase_common);
    }

    /**
     * Obtener progreso de una semana (0-1)
     * Prioriza los DoDs de raTracker si existen, sino usa el progreso de tareas diarias
     */
    getWeekProgress(weekId) {
        // Obtener el total de DoDs de esta semana desde MASTER_PLAN
        const weekData = window.MASTER_PLAN?.getWeek(weekId);
        if (!weekData || !weekData.gate || !weekData.gate.conditions) {
            return 0;
        }

        const totalDods = weekData.gate.conditions.length;
        if (totalDods === 0) return 0;

        // Contar cuántos DoDs están completados en raTracker
        let completedCount = 0;

        if (window.raTracker && window.raTracker.data && window.raTracker.data.timelineDods) {
            // Extraer el número de semana del weekId (E1-S03 -> 3)
            const weekNum = parseInt(weekId.split('-S')[1]);
            const evalId = weekId.split('-S')[0];

            // Revisar cada DoD de esta semana
            for (let i = 0; i < totalDods; i++) {
                const dodId = `${evalId}_week${weekNum}_dod${i}`;
                if (window.raTracker.data.timelineDods[dodId] === true) {
                    completedCount++;
                }
            }
        }

        const progressRatio = completedCount / totalDods;

        // Debug logging
        return progressRatio;
    }

    /**
     * Actualizar progreso de una fase basado en sus semanas
     */
    updatePhaseProgress(phaseId) {
        const weeks = window.MASTER_PLAN?.weeks.filter(w => w.phase_common === phaseId) || [];

        if (weeks.length === 0) return;

        let totalProgress = 0;
        weeks.forEach(week => {
            totalProgress += this.getWeekProgress(week.week_id);
        });

        const phaseProgress = totalProgress / weeks.length;

        this.data.phases[phaseId] = {
            completed: phaseProgress,
            lastUpdated: new Date().toISOString()
        };

        this.saveProgress();
    }

    /**
     * Obtener progreso de una fase (0-1)
     */
    getPhaseProgress(phaseId) {
        return this.data.phases[phaseId]?.completed || 0;
    }

    /**
     * Obtener progreso de una evaluación (0-1)
     */
    getEvaluationProgress(evalId) {
        const weeks = window.MASTER_PLAN?.weeks.filter(w => w.week_id.startsWith(evalId)) || [];

        if (weeks.length === 0) return 0;

        let totalProgress = 0;
        weeks.forEach(week => {
            totalProgress += this.getWeekProgress(week.week_id);
        });

        return totalProgress / weeks.length;
    }

    /**
     * Obtener progreso global del curso (0-1)
     */
    getGlobalProgress() {
        const weights = window.SettingsManager?.settings?.evaluation?.evaluationWeights;
        if (weights) {
            const totalWeight = (weights.E1 || 0) + (weights.E2 || 0) + (weights.FEOE || 0);
            if (totalWeight > 0) {
                const e1 = this.getEvaluationProgress('E1');
                const e2 = this.getEvaluationProgress('E2');
                const feoe = this.getEvaluationProgress('FEOE');
                return ((e1 * (weights.E1 || 0)) + (e2 * (weights.E2 || 0)) + (feoe * (weights.FEOE || 0))) / totalWeight;
            }
        }

        const allWeeks = window.MASTER_PLAN?.weeks || [];
        if (allWeeks.length === 0) return 0;

        let totalProgress = 0;
        allWeeks.forEach(week => {
            totalProgress += this.getWeekProgress(week.week_id);
        });

        return totalProgress / allWeeks.length;
    }

    /**
     * Generar HTML para barra de progreso
     */
    generateProgressBar(progress, options = {}) {
        const {
            showPercentage = true,
            height = '8px',
            colorScheme = 'default',
            animated = true,
            label = ''
        } = options;

        const percentage = Math.round(progress * 100);

        // Determinar color basado en el progreso
        let color = '#3498db'; // Azul por defecto
        if (colorScheme === 'default') {
            if (percentage >= 80) color = '#27ae60'; // Verde
            else if (percentage >= 50) color = '#f39c12'; // Naranja
            else if (percentage >= 25) color = '#e67e22'; // Naranja oscuro
            else color = '#e74c3c'; // Rojo
        }

        const animationClass = animated ? 'progress-animated' : '';

        return `
            <div class="progress-container" style="margin: 8px 0;">
                ${label ? `<div class="progress-label" style="font-size: 0.85em; margin-bottom: 4px; color: #666;">${label}</div>` : ''}
                <div class="progress-bar-wrapper" style="background: #ecf0f1; border-radius: 4px; overflow: hidden; height: ${height};">
                    <div class="progress-bar-fill ${animationClass}" 
                         style="width: ${percentage}%; 
                                height: 100%; 
                                background: ${color}; 
                                transition: width 0.3s ease, background 0.3s ease;
                                border-radius: 4px;">
                    </div>
                </div>
                ${showPercentage ? `<div class="progress-percentage" style="font-size: 0.75em; color: #7f8c8d; margin-top: 4px; text-align: right;">${percentage}% completado</div>` : ''}
            </div>
        `;
    }

    /**
     * Generar HTML para checkbox de tarea
     */
    generateTaskCheckbox(date, taskId, label, options = {}) {
        const {
            disabled = false,
            showLabel = true
        } = options;

        const isChecked = this.isTaskCompleted(date, taskId);
        const checkedAttr = isChecked ? 'checked' : '';
        const disabledAttr = disabled ? 'disabled' : '';

        return `
            <label class="task-checkbox-label" style="display: flex; align-items: center; gap: 8px; cursor: ${disabled ? 'not-allowed' : 'pointer'}; user-select: none;">
                <input type="checkbox" 
                       class="task-checkbox" 
                       data-date="${date}" 
                       data-task-id="${taskId}"
                       ${checkedAttr}
                       ${disabledAttr}
                       style="cursor: ${disabled ? 'not-allowed' : 'pointer'}; width: 18px; height: 18px;">
                ${showLabel ? `<span style="flex: 1; ${isChecked ? 'text-decoration: line-through; opacity: 0.6;' : ''}">${label}</span>` : ''}
            </label>
        `;
    }

    /**
     * Inicializar event listeners para checkboxes
     */
    initializeCheckboxListeners() {
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-checkbox')) {
                const date = e.target.dataset.date;
                const taskId = e.target.dataset.taskId;
                const completed = e.target.checked;

                this.toggleTask(date, taskId, completed);

                // Actualizar UI del label
                const label = e.target.closest('.task-checkbox-label');
                if (label) {
                    const span = label.querySelector('span');
                    if (span) {
                        if (completed) {
                            span.style.textDecoration = 'line-through';
                            span.style.opacity = '0.6';
                        } else {
                            span.style.textDecoration = 'none';
                            span.style.opacity = '1';
                        }
                    }
                }
            }
        });
    }

    /**
     * Exportar progreso a JSON
     */
    exportProgress() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `progreso_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(url);
    }

    /**
     * Importar progreso desde JSON
     */
    importProgress(jsonData) {
        try {
            const imported = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

            // Validar estructura básica
            if (imported.days && imported.weeks) {
                this.data = imported;
                this.saveProgress();
                return true;
            }

            return false;
        } catch (error) {
            console.error('Error importing progress:', error);
            return false;
        }
    }

    /**
     * Resetear todo el progreso
     */
    resetProgress(confirm = true) {
        if (confirm && !window.confirm('¿Estás seguro de que quieres borrar todo el progreso? Esta acción no se puede deshacer.')) {
            return false;
        }

        this.data = {
            version: '1.0',
            lastUpdated: new Date().toISOString(),
            days: {},
            weeks: {},
            phases: {},
            evaluations: {}
        };

        this.saveProgress();
        return true;
    }

    /**
     * Utilidades: Obtener ID de semana desde fecha
     */
    getWeekIdFromDate(dateStr) {
        const weeks = window.MASTER_PLAN?.weeks || [];
        const week = weeks.find(w => dateStr >= w.date_from && dateStr <= w.date_to);
        return week ? week.week_id : null;
    }

    /**
     * Utilidades: Obtener fechas de una semana
     */
    getWeekDates(weekData) {
        if (!weekData.date_from || !weekData.date_to) return [];

        const dates = [];
        let curr = new Date(weekData.date_from + 'T00:00:00');
        let end = new Date(weekData.date_to + 'T00:00:00');

        while (curr <= end) {
            dates.push(curr.toISOString().split('T')[0]);
            curr.setDate(curr.getDate() + 1);
        }

        return dates;
    }

    /**
     * Generar estadísticas de progreso
     */
    getStatistics() {
        const totalDays = Object.keys(this.data.days).length;
        const totalWeeks = Object.keys(this.data.weeks).length;
        const globalProgress = this.getGlobalProgress();

        return {
            totalDays,
            totalWeeks,
            globalProgress: Math.round(globalProgress * 100),
            lastUpdated: this.data.lastUpdated,
            evaluations: {
                E1: Math.round(this.getEvaluationProgress('E1') * 100),
                E2: Math.round(this.getEvaluationProgress('E2') * 100),
                FEOE: Math.round(this.getEvaluationProgress('FEOE') * 100)
            }
        };
    }
}

// Inicializar instancia global
window.ProgressManager = new ProgressManager();

// Inicializar listeners cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.ProgressManager.initializeCheckboxListeners();
    });
} else {
    window.ProgressManager.initializeCheckboxListeners();
}

/**
 * PEDAGOGICAL LAYER COORDINATOR
 * Actualiza los bloques de Sentido del Proyecto e Intencionalidad Pedagógica.
 */
window.updatePedagogicalLayer = function (evalId) {
    if (!window.MASTER_PLAN || !window.MASTER_PLAN.pedagogical_context) return;

    // Si no se pasa evalId, intentar detectarlo por la fecha actual
    if (!evalId) {
        evalId = 'E1';
        const todayStr = new Date().toISOString().split('T')[0];
        const currentWeek = window.MASTER_PLAN.weeks.find(w => todayStr >= w.date_from && todayStr <= w.date_to);
        if (currentWeek) evalId = currentWeek.eval;
    }

    const baseContext = window.MASTER_PLAN.pedagogical_context[evalId];
    const overrideContext = window.SettingsManager?.settings?.pedagogical?.customContext?.[evalId];
    const context = overrideContext
        ? {
            sense: { ...(baseContext?.sense || {}), ...(overrideContext.sense || {}) },
            intent: { ...(baseContext?.intent || {}), ...(overrideContext.intent || {}) }
        }
        : baseContext;
    if (!context) return;

    // Mapeo de IDs de elementos a valores en MASTER_PLAN
    const elements = {
        'sense-objective': context.sense.objective,
        'sense-product': context.sense.product,
        'sense-profile': context.sense.profile,
        'intent-ras': context.intent.ras,
        'intent-competencies': context.intent.competencies,
        'intent-risks': context.intent.risks
    };

    // Actualizar cada elemento con una pequeña transición
    for (const [id, value] of Object.entries(elements)) {
        const el = document.getElementById(id);
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(5px)';

            setTimeout(() => {
                el.textContent = value;
                el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 100);
        }
    }
};

console.log('✅ Progress Manager & Pedagogical Coordinator loaded');
