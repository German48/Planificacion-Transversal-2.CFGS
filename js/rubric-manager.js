/**
 * RUBRIC MANAGER
 * Sistema de Autoevaluación y Metacognición para Alumnado
 */

class RubricManager {
    constructor() {
        this.storageKey = 'edutrack_self_assessments';
        this.data = this.loadData();
    }

    /**
     * Cargar autoevaluaciones desde localStorage
     */
    loadData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    /**
     * Guardar autoevaluaciones
     */
    saveData() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        if (window.ProgressTracker) {
            window.ProgressTracker.state.selfAssessments = this.data;
            window.ProgressTracker.saveToStorage();
        }
    }

    /**
     * Obtener autoevaluación para un hito/evaluación específica
     */
    getAssessment(evalId, critId) {
        if (!this.data[evalId]) return null;
        return this.data[evalId][critId] || { level: 0, comment: '' };
    }

    /**
     * Guardar nivel y comentario de autoevaluación
     */
    setAssessment(evalId, critId, level, comment = null) {
        if (!this.data[evalId]) this.data[evalId] = {};

        const current = this.data[evalId][critId] || { level: 0, comment: '' };

        this.data[evalId][critId] = {
            level: level !== null ? level : current.level,
            comment: comment !== null ? comment : current.comment,
            timestamp: new Date().toISOString()
        };

        this.saveData();
        return this.data[evalId][critId];
    }

    /**
     * Extraer criterios (RA/CE) para una evaluación basada en el Master Plan
     */
    getCriteriaForEval(evalId) {
        const masterPlan = window.MASTER_PLAN;
        if (!masterPlan) return [];

        const criteria = new Set();

        const evalData = masterPlan.timeline.find(e => e.eval === evalId);
        if (evalData) {
            evalData.weeks.forEach(w => {
                if (w.leader) criteria.add(`RA/${w.leader}`);
            });
        }

        masterPlan.weeks.forEach(w => {
            if (w.eval === evalId && w.modules_focus) {
                Object.entries(w.modules_focus).forEach(([mod, focus]) => {
                    if (focus.enables) criteria.add(focus.enables);
                });
            }
        });

        return Array.from(criteria).sort();
    }
}

const rubricManager = new RubricManager();
window.RubricManager = rubricManager;

