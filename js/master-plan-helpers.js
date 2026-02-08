/**
 * MASTER PLAN HELPERS
 * Funciones auxiliares para el objeto MASTER_PLAN
 */

// Esperar a que MASTER_PLAN esté cargado
if (window.MASTER_PLAN) {
    initializeHelpers();
} else {
    document.addEventListener('DOMContentLoaded', initializeHelpers);
}

function initializeHelpers() {
    if (!window.MASTER_PLAN) {
        console.warn('⚠️ MASTER_PLAN no está disponible');
        return;
    }

    /**
     * Obtener semana por ID
     * @param {string} weekId - ID de la semana (ej: "E1-S01")
     * @returns {object|null} - Objeto de la semana o null si no existe
     */
    if (!window.MASTER_PLAN.getWeek) {
        window.MASTER_PLAN.getWeek = function (weekId) {
            if (!weekId || !Array.isArray(window.MASTER_PLAN.weeks)) return null;
            return window.MASTER_PLAN.weeks.find(w => w.week_id === weekId) || null;
        };
    }

    /**
     * Obtener módulo por código
     * @param {string} moduleCode - Código del módulo (ej: "DDR", "IYO")
     * @returns {object|null} - Objeto del módulo o null si no existe
     */
    if (!window.MASTER_PLAN.getModule) {
        window.MASTER_PLAN.getModule = function (moduleCode) {
            if (!moduleCode || !window.MASTER_PLAN.modules) return null;
            // modules es un objeto, no un array
            const module = window.MASTER_PLAN.modules[moduleCode];
            if (!module) return null;
            // Añadir el código corto como propiedad 'code' si no existe
            return { ...module, code: module.code || moduleCode };
        };
    }

    /**
     * Obtener día por ID o Fecha
     * @param {string} identifier - ID del día (ej: "E1-S01-D1") o fecha (ISO)
     * @returns {object|null} - Objeto del día o null si no existe
     */
    if (!window.MASTER_PLAN.getDay) {
        window.MASTER_PLAN.getDay = function (identifier) {
            if (!identifier || !Array.isArray(window.MASTER_PLAN.days)) return null;
            // Intentar por ID
            let day = window.MASTER_PLAN.days.find(d => d.day_id === identifier);
            // Intentar por fecha
            if (!day) day = window.MASTER_PLAN.days.find(d => d.date === identifier);
            return day || null;
        };
    } else {
        // Si ya existe, nos aseguramos de que pueda buscar por ID también si es necesario
        // pero el de master-plan.js es el principal y soporta síntesis.
    }

    /**
     * Obtener fase por ID
     * @param {string} phaseId - ID de la fase (ej: "F0", "F1")
     * @returns {object|null} - Objeto de la fase o null si no existe
     */
    if (!window.MASTER_PLAN.getPhase) {
        window.MASTER_PLAN.getPhase = function (phaseId) {
            if (!phaseId || !this.phases) return null;
            return this.phases[phaseId] || null;
        };
    }

    /**
     * Obtener detalle de módulos
     * @param {object} week - Objeto de la semana
     * @param {object} rhythm - Ritmo diario
     * @returns {object} - Detalle por módulo
     */
    if (!window.MASTER_PLAN.getModulesDetail) {
        window.MASTER_PLAN.getModulesDetail = function (week, rhythm) {
            const detail = {};
            if (!week || !week.modules_focus) return detail;
            Object.entries(week.modules_focus).forEach(([modId, focus]) => {
                detail[modId] = {
                    micro_goal: focus.focus || "",
                    tasks: rhythm ? [rhythm.task] : [],
                    deliverable: focus.deliverable || "",
                    evidence: rhythm ? [rhythm.evidence] : [],
                    ra_ce: focus.ra ? (Array.isArray(focus.ra) ? focus.ra.join(', ') : focus.ra) : (focus.enables || "Habilitar siguiente fase")
                };
            });
            return detail;
        };
    }

    console.log('✅ MASTER_PLAN helpers loaded -',
        window.MASTER_PLAN.weeks?.length || 0, 'weeks,',
        Object.keys(window.MASTER_PLAN.modules || {}).length, 'modules');
}

