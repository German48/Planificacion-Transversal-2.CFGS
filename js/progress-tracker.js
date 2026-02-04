/**
 * Sistema de Seguimiento de Progreso - Planificación Transversal
 * Almacenamiento: LocalStorage
 * Versión: 1.0
 */

const ProgressTracker = {
    STORAGE_KEY_BASE: 'planificacion_transversal_progress',

    // Configuración por defecto de seguimiento por módulo
    defaultConfig: {
        trackingMode: {
            ATZ: 'individual',  // Automatización - Por defecto individual
            IYO: 'individual',  // Instalaciones - Por defecto individual
            DDR: 'team',        // Diseño - Por defecto equipo
            GNE: 'team',        // Gestión - Por defecto equipo
            PIM: 'team'         // Proyecto - Por defecto equipo
        },
        currentTeam: 'Equipo_01',
        currentUser: 'Alumno_01',
        teams: ['Equipo_01', 'Equipo_02', 'Equipo_03', 'Equipo_04', 'Equipo_05', 'Equipo_06'],
        users: []
    },

    // Estado actual
    state: {
        config: null,
        progress: {},
        dailyTasks: {},
        weeklyDod: {},
        gates: {},
        raProgress: {},
        dailyDeliverables: {}
    },

    /**
     * Inicializar el sistema de seguimiento
     */
    init() {
        this.loadFromStorage();
        console.log('🔄 ProgressTracker inicializado');
        return this;
    },

    getCurrentYear() {
        const stored = localStorage.getItem('selected_academic_year');
        if (stored) return stored;
        return window.MASTER_PLAN?.config?.academic_year
            || window.MASTER_PLAN?.config?.year
            || '2025-2026';
    },

    getStorageKey() {
        const year = this.getCurrentYear();
        return `${this.STORAGE_KEY_BASE}_${year}`;
    },

    getLegacyStorageKey() {
        return this.STORAGE_KEY_BASE;
    },

    /**
     * Reiniciar todo el progreso
     */
    reset() {
        this.state = {
            config: this.state.config || { ...this.defaultConfig },
            progress: {},
            dailyTasks: {},
            weeklyDod: {},
            gates: {},
            raProgress: {},
            dailyDeliverables: {}
        };
        this.saveToStorage();
        console.log('🧹 ProgressTracker reiniciado');
    },

    /**
     * Cargar datos desde LocalStorage
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem(this.getStorageKey());
            if (stored) {
                const data = JSON.parse(stored);
                this.state = {
                    config: data.config || { ...this.defaultConfig },
                    progress: data.progress || {},
                    dailyTasks: data.dailyTasks || {},
                    weeklyDod: data.weeklyDod || {},
                    gates: data.gates || {},
                    raProgress: data.raProgress || {},
                    dailyDeliverables: data.dailyDeliverables || {}
                };
            } else {
                const legacyStored = localStorage.getItem(this.getLegacyStorageKey());
                if (legacyStored) {
                    const data = JSON.parse(legacyStored);
                    this.state = {
                        config: data.config || { ...this.defaultConfig },
                        progress: data.progress || {},
                        dailyTasks: data.dailyTasks || {},
                        weeklyDod: data.weeklyDod || {},
                        gates: data.gates || {},
                        raProgress: data.raProgress || {},
                        dailyDeliverables: data.dailyDeliverables || {}
                    };
                    this.saveToStorage();
                } else {
                    this.state.config = { ...this.defaultConfig };
                    this.saveToStorage();
                }
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            this.state.config = { ...this.defaultConfig };
        }
    },

    /**
     * Guardar datos en LocalStorage
     */
    saveToStorage() {
        try {
            localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state));
            this.notifyDashboards();
        } catch (error) {
            console.error('Error guardando datos:', error);
        }
    },

    /**
     * Notificar a los dashboards para actualización
     */
    notifyDashboards() {
        window.dispatchEvent(new CustomEvent('progressUpdated', {
            detail: this.getStats()
        }));
    },

    // ============================================
    // GESTIÓN DE TAREAS DIARIAS
    // ============================================

    /**
     * Marcar/desmarcar tarea diaria
     * @param {string} date - Fecha en formato YYYY-MM-DD
     * @param {string} taskId - ID único de la tarea
     * @param {boolean} completed - Estado de completado
     * @param {string} module - Módulo asociado (para determinar individual/equipo)
     */
    setDailyTask(date, taskId, completed, module = 'DDR') {
        const key = this.getTrackingKey(date, module);

        if (!this.state.dailyTasks[key]) {
            this.state.dailyTasks[key] = {};
        }

        this.state.dailyTasks[key][taskId] = {
            completed,
            timestamp: Date.now(),
            module
        };

        this.saveToStorage();
        return completed;
    },

    getDailyTask(date, taskId, module = 'DDR') {
        const key = this.getTrackingKey(date, module);
        return this.state.dailyTasks[key]?.[taskId]?.completed || false;
    },

    getDailyTasksForDate(date) {
        const tasks = {};
        Object.keys(this.state.dailyTasks).forEach(key => {
            if (key.includes(date)) {
                Object.assign(tasks, this.state.dailyTasks[key]);
            }
        });
        return tasks;
    },

    /**
     * Marcar/desmarcar entregable diario
     */
    setDailyDeliverable(date, idx, completed) {
        if (!this.state.dailyDeliverables) this.state.dailyDeliverables = {};
        const key = `deliverable_${date}_${idx}`;
        this.state.dailyDeliverables[key] = completed;
        this.saveToStorage();
    },

    /**
     * Verificar si un entregable diario está completado
     */
    isDailyDeliverableCompleted(date, idx) {
        if (!this.state.dailyDeliverables) return false;
        const key = `deliverable_${date}_${idx}`;
        return !!this.state.dailyDeliverables[key];
    },

    // ============================================
    // GESTIÓN DE DOD SEMANAL
    // ============================================

    /**
     * Marcar/desmarcar DoD semanal
     * @param {string} weekId - ID de la semana (E1-S03, E2-S01, etc.)
     * @param {string} dodId - ID del DoD
     * @param {boolean} completed - Estado de completado
     * @param {string} module - Módulo asociado
     */
    setWeeklyDod(weekId, dodId, completed, module = 'DDR') {
        const key = this.getTrackingKey(weekId, module);

        if (!this.state.weeklyDod[key]) {
            this.state.weeklyDod[key] = {};
        }

        this.state.weeklyDod[key][dodId] = {
            completed,
            timestamp: Date.now(),
            module
        };

        this.saveToStorage();
        return completed;
    },

    getWeeklyDod(weekId, dodId, module = 'DDR') {
        const key = this.getTrackingKey(weekId, module);
        return this.state.weeklyDod[key]?.[dodId]?.completed || false;
    },

    getWeeklyDodsForWeek(weekId) {
        const dods = {};
        Object.keys(this.state.weeklyDod).forEach(key => {
            if (key.includes(weekId)) {
                Object.assign(dods, this.state.weeklyDod[key]);
            }
        });
        return dods;
    },

    // ============================================
    // GESTIÓN DE GATES
    // ============================================

    /**
     * Marcar/desmarcar Gate superado
     * @param {string} weekId - ID de la semana
     * @param {boolean} passed - Gate superado o no
     */
    setGate(weekId, passed) {
        this.state.gates[weekId] = {
            passed,
            timestamp: Date.now()
        };
        this.saveToStorage();
        return passed;
    },

    getGate(weekId) {
        return this.state.gates[weekId]?.passed || false;
    },

    // ============================================
    // GESTIÓN DE RA/CE (Resultados de Aprendizaje)
    // ============================================

    /**
     * Marcar progreso de RA/CE
     * @param {string} eval - Evaluación (E1, E2, E3)
     * @param {string} module - Módulo (DDR, IYO, ATZ, GNE, PIM)
     * @param {string} raId - ID del RA (RA1, RA2, etc.)
     * @param {string} ceId - ID del CE (opcional)
     * @param {string} status - Estado: 'pending', 'in_progress', 'completed'
     */
    setRAProgress(eval_, module, raId, ceId, status) {
        const key = this.getTrackingKey(`${eval_}-${module}-${raId}`, module);

        if (!this.state.raProgress[key]) {
            this.state.raProgress[key] = {};
        }

        if (ceId) {
            this.state.raProgress[key][ceId] = {
                status,
                timestamp: Date.now()
            };
        } else {
            this.state.raProgress[key]._status = status;
        }

        this.saveToStorage();
    },

    getRAProgress(eval_, module, raId, ceId = null) {
        const key = this.getTrackingKey(`${eval_}-${module}-${raId}`, module);
        if (ceId) {
            return this.state.raProgress[key]?.[ceId]?.status || 'pending';
        }
        return this.state.raProgress[key]?._status || 'pending';
    },

    // ============================================
    // UTILIDADES
    // ============================================

    /**
     * Obtener clave de seguimiento según modo (individual/equipo)
     */
    getTrackingKey(baseKey, module) {
        const mode = this.state.config.trackingMode[module] || 'team';
        if (mode === 'individual') {
            return `${baseKey}_${this.state.config.currentUser}`;
        }
        return `${baseKey}_${this.state.config.currentTeam}`;
    },

    matchesSelectionKey(key, selection) {
        if (!selection || !selection.mode) return true;
        if (selection.mode === 'team') {
            if (!selection.teamId || selection.teamId === 'all') return true;
            return key.endsWith(`_${selection.teamId}`);
        }
        if (selection.mode === 'individual') {
            if (!selection.studentId || selection.studentId === 'all') return true;
            return key.endsWith(`_${selection.studentId}`);
        }
        return true;
    },

    /**
     * Cambiar modo de seguimiento para un módulo
     */
    setTrackingMode(module, mode) {
        if (['individual', 'team'].includes(mode)) {
            this.state.config.trackingMode[module] = mode;
            this.saveToStorage();
        }
    },

    /**
     * Cambiar equipo actual
     */
    setCurrentTeam(team) {
        this.state.config.currentTeam = team;
        this.saveToStorage();
    },

    /**
     * Cambiar usuario actual
     */
    setCurrentUser(user) {
        this.state.config.currentUser = user;
        this.saveToStorage();
    },

    // ============================================
    // ESTADÍSTICAS PARA DASHBOARDS
    // ============================================

    /**
     * Obtener estadísticas generales
     */
    getStats(selectionResolver = null) {
        return this.getStatsFiltered(selectionResolver);
    },

    getStatsFiltered(selectionResolver = null) {
        const stats = {
            overall: { total: 0, completed: 0, percentage: 0 },
            byEval: { E1: { total: 0, completed: 0 }, E2: { total: 0, completed: 0 }, FEOE: { total: 0, completed: 0 } },
            byModule: {},
            byWeek: {},
            competencies: {
                'Fabricación': { total: 0, completed: 0, percentage: 0, icon: '🔧' },
                'Diseño Técnico': { total: 0, completed: 0, percentage: 0, icon: '📐' },
                'PRL': { total: 0, completed: 0, percentage: 0, icon: '🛡️' },
                'Planificación': { total: 0, completed: 0, percentage: 0, icon: '📊' },
                'Gestión': { total: 0, completed: 0, percentage: 0, icon: '💼' },
                'Automatización': { total: 0, completed: 0, percentage: 0, icon: '🤖' },
                'Instalaciones': { total: 0, completed: 0, percentage: 0, icon: '🔌' },
                'Integración': { total: 0, completed: 0, percentage: 0, icon: '🧩' }
            },
            gates: { total: 0, passed: 0 },
            recentActivity: []
        };

        const compMap = {
            'ATZ': ['Fabricación', 'Automatización'],
            'IYO': ['Instalaciones', 'PRL'],
            'DDR': ['Diseño Técnico', 'Planificación'],
            'GNE': ['Gestión', 'Planificación'],
            'PIM': ['Gestión', 'Planificación', 'Integración']
        };

        const isAllSelection = (selection) => {
            if (!selection || !selection.mode) return true;
            if (selection.mode === 'team') {
                return !selection.teamId || selection.teamId === 'all';
            }
            if (selection.mode === 'individual') {
                return !selection.studentId || selection.studentId === 'all';
            }
            return true;
        };

        const resolveSelection = (module) => (selectionResolver ? selectionResolver(module) : null);
        const shouldInclude = (key, module) => this.matchesSelectionKey(key, resolveSelection(module));
        const shouldIncludeShared = (module) => isAllSelection(resolveSelection(module));

        // Contar tareas diarias
        Object.entries(this.state.dailyTasks).forEach(([key, tasks]) => {
            Object.values(tasks).forEach(task => {
                const moduleId = task.module || 'DDR';
                if (!shouldInclude(key, moduleId)) return;

                stats.overall.total++;
                if (task.completed) stats.overall.completed++;

                // Por módulo
                if (!stats.byModule[moduleId]) {
                    stats.byModule[moduleId] = { total: 0, completed: 0 };
                }
                stats.byModule[moduleId].total++;
                if (task.completed) stats.byModule[moduleId].completed++;

                // Actividad reciente (si está completada)
                if (task.completed) {
                    stats.recentActivity.push({
                        type: 'task',
                        module: moduleId,
                        timestamp: task.timestamp,
                        id: key
                    });
                }
            });
        });

        // Contar DoDs del Timeline (de raTracker)
        if (window.raTracker && window.raTracker.data && window.raTracker.data.timelineDods) {
            Object.entries(window.raTracker.data.timelineDods).forEach(([key, completed]) => {
                const parts = key.split('_');
                const evalId = parts[0].toUpperCase();

                let mod = 'DDR';
                if (window.MASTER_PLAN) {
                    const weekIdNum = parts[1].replace('week', '');
                    const weekId = `${evalId}-S${weekIdNum.padStart(2, '0')}`;
                    const weekData = window.MASTER_PLAN.getWeek(weekId);
                    if (weekData && weekData.leader_module) {
                        mod = weekData.leader_module.toUpperCase();
                    }
                }

                if (!shouldIncludeShared(mod)) return;

                stats.overall.total++;
                if (completed) stats.overall.completed++;

                if (stats.byEval[evalId]) {
                    stats.byEval[evalId].total++;
                    if (completed) stats.byEval[evalId].completed++;
                }

                if (!stats.byModule[mod]) stats.byModule[mod] = { total: 0, completed: 0 };
                stats.byModule[mod].total++;
                if (completed) stats.byModule[mod].completed++;

                if (parts[1]) {
                    const weekId = `${evalId}-${parts[1].replace('week', 'S').padStart(3, '0')}`;
                    if (!stats.byWeek[weekId]) stats.byWeek[weekId] = { total: 0, completed: 0 };
                    stats.byWeek[weekId].total++;
                    if (completed) stats.byWeek[weekId].completed++;
                }
            });
        }

        // Contar Entregables Diarios (Paquete Mínimo)
        Object.entries(this.state.dailyDeliverables).forEach(([key, completed]) => {
            const parts = key.split('_');
            if (parts.length < 3) return;
            const date = parts[1];
            const day = window.MASTER_PLAN?.getDay(date);
            if (!day) return;

            const evalId = day.eval.toUpperCase();
            const moduleId = day.leader_module.toUpperCase();

            if (!shouldIncludeShared(moduleId)) return;

            stats.overall.total++;
            if (completed) stats.overall.completed++;

            if (stats.byEval[evalId]) {
                stats.byEval[evalId].total++;
                if (completed) stats.byEval[evalId].completed++;
            }

            if (!stats.byModule[moduleId]) {
                stats.byModule[moduleId] = { total: 0, completed: 0 };
            }
            stats.byModule[moduleId].total++;
            if (completed) stats.byModule[moduleId].completed++;
        });

        // Contar DODs semanales (estado local específico de ProgressTracker, si se usa)
        Object.entries(this.state.weeklyDod).forEach(([key, dods]) => {
            const weekMatch = key.match(/E(\d)-S\d+/);
            const evalNum = weekMatch ? `E${weekMatch[1]}` : null;

            Object.values(dods).forEach((dod, dodId) => {
                const mod = dod.module || 'DDR';
                if (!shouldInclude(key, mod)) return;

                stats.overall.total++;
                if (dod.completed) stats.overall.completed++;

                if (evalNum) {
                    if (!stats.byEval[evalNum]) stats.byEval[evalNum] = { total: 0, completed: 0 };
                    stats.byEval[evalNum].total++;
                    if (dod.completed) stats.byEval[evalNum].completed++;
                }

                if (!stats.byModule[mod]) {
                    stats.byModule[mod] = { total: 0, completed: 0 };
                }
                stats.byModule[mod].total++;
                if (dod.completed) stats.byModule[mod].completed++;

                if (dod.completed) {
                    stats.recentActivity.push({
                        type: 'dod',
                        module: mod,
                        weekId: key.split('_')[0],
                        timestamp: dod.timestamp,
                        id: `${key}_${dodId}`
                    });
                }
            });
        });

        // Calcular Competencias a partir de módulos
        Object.entries(stats.byModule).forEach(([mod, mStats]) => {
            const comps = compMap[mod] || [];
            comps.forEach(comp => {
                if (stats.competencies[comp]) {
                    stats.competencies[comp].total += mStats.total;
                    stats.competencies[comp].completed += mStats.completed;
                }
            });
        });

        // Contar RA Evidencias (de raTracker)
        if (window.raTracker && window.raTracker.data && window.raTracker.data.evidences) {
            Object.entries(window.raTracker.data.evidences).forEach(([key, ev]) => {
                const parts = key.split('_');
                if (parts.length >= 2) {
                    const evalId = parts[0].toUpperCase();
                    const moduleId = parts[1].toUpperCase();

                    if (!shouldIncludeShared(moduleId)) return;

                    stats.overall.total++;
                    if (ev.completed) stats.overall.completed++;

                    if (stats.byEval[evalId]) {
                        stats.byEval[evalId].total++;
                        if (ev.completed) stats.byEval[evalId].completed++;
                    }

                    if (!stats.byModule[moduleId]) {
                        stats.byModule[moduleId] = { total: 0, completed: 0 };
                    }
                    stats.byModule[moduleId].total++;
                    if (ev.completed) stats.byModule[moduleId].completed++;

                    let comp = null;
                    if (moduleId === 'ATZ' || moduleId === 'IYO') comp = 'Fabricación';
                    if (moduleId === 'DDR') comp = 'Diseño Técnico';
                    if (moduleId === 'GNE' || moduleId === 'PIM') comp = 'Gestión';

                    if (comp && stats.competencies[comp]) {
                        stats.competencies[comp].total++;
                        if (ev.completed) stats.competencies[comp].completed++;
                    }
                }
            });
        }

        // Calcular porcentajes de competencias (re-calcular después de RA)
        Object.keys(stats.competencies).forEach(comp => {
            const c = stats.competencies[comp];
            c.percentage = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0;
        });

        // Contar gates
        if (shouldIncludeShared('GLOBAL')) {
            Object.entries(this.state.gates).forEach(([weekId, gate]) => {
                stats.gates.total++;
                if (gate.passed) stats.gates.passed++;
            });
        }

        // Calcular porcentaje general
        stats.overall.percentage = stats.overall.total > 0
            ? Math.round((stats.overall.completed / stats.overall.total) * 100)
            : 0;

        // Ordenar actividad reciente por timestamp (desc)
        stats.recentActivity.sort((a, b) => b.timestamp - a.timestamp);
        stats.recentActivity = stats.recentActivity.slice(0, 10);

        return stats;
    },

    /**
     * Obtener progreso por evaluación
     */
    getEvalProgress(evalNum) {
        const weeks = window.MASTER_PLAN?.weeks?.filter(w => w.eval === evalNum) || [];
        const progress = {
            weeks: [],
            totalTasks: 0,
            completedTasks: 0,
            gates: { total: weeks.length, passed: 0 }
        };

        weeks.forEach(week => {
            const weekDods = this.getWeeklyDodsForWeek(week.week_id);
            const gateStatus = this.getGate(week.week_id);

            const totalDods = Object.keys(weekDods).length;
            const completedDods = Object.values(weekDods).filter(d => d.completed).length;

            progress.weeks.push({
                weekId: week.week_id,
                goal: week.week_goal,
                dods: { total: totalDods, completed: completedDods },
                gatePassed: gateStatus
            });

            progress.totalTasks += totalDods;
            progress.completedTasks += completedDods;
            if (gateStatus) progress.gates.passed++;
        });

        return progress;
    },

    /**
     * Exportar todos los datos
     */
    exportData() {
        return JSON.stringify(this.state, null, 2);
    },

    /**
     * Importar datos
     */
    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            this.state = {
                config: data.config || this.state.config,
                progress: data.progress || {},
                dailyTasks: data.dailyTasks || {},
                weeklyDod: data.weeklyDod || {},
                gates: data.gates || {},
                raProgress: data.raProgress || {},
                dailyDeliverables: data.dailyDeliverables || {}
            };
            this.saveToStorage();
            return true;
        } catch (error) {
            console.error('Error importando datos:', error);
            return false;
        }
    },

    /**
     * Resetear todos los datos
     */
    reset() {
        this.state = {
            config: { ...this.defaultConfig },
            progress: {},
            dailyTasks: {},
            weeklyDod: {},
            gates: {},
            raProgress: {},
            dailyDeliverables: {}
        };
        this.saveToStorage();
    }
};

// Inicializar al cargar
window.ProgressTracker = ProgressTracker.init();

// Función helper para crear checkbox sincronizado
function createSyncedCheckbox(id, type, params, label = '') {
    const { date, weekId, taskId, dodId, module, evalNum, raId, ceId } = params;

    let checked = false;
    let onChangeHandler = '';

    switch (type) {
        case 'daily':
            checked = ProgressTracker.getDailyTask(date, taskId, module);
            onChangeHandler = `ProgressTracker.setDailyTask('${date}', '${taskId}', this.checked, '${module}')`;
            break;
        case 'dod':
            checked = ProgressTracker.getWeeklyDod(weekId, dodId, module);
            onChangeHandler = `ProgressTracker.setWeeklyDod('${weekId}', '${dodId}', this.checked, '${module}')`;
            break;
        case 'gate':
            checked = ProgressTracker.getGate(weekId);
            onChangeHandler = `ProgressTracker.setGate('${weekId}', this.checked)`;
            break;
        case 'ra':
            const status = ProgressTracker.getRAProgress(evalNum, module, raId, ceId);
            checked = status === 'completed';
            onChangeHandler = `ProgressTracker.setRAProgress('${evalNum}', '${module}', '${raId}', '${ceId || ''}', this.checked ? 'completed' : 'pending')`;
            break;
    }

    return `
        <label class="sync-checkbox ${checked ? 'checked' : ''}" data-sync-id="${id}">
            <input type="checkbox" 
                   id="${id}" 
                   ${checked ? 'checked' : ''} 
                   onchange="${onChangeHandler}; this.parentElement.classList.toggle('checked', this.checked);">
            <span class="checkmark"></span>
            ${label ? `<span class="checkbox-label">${label}</span>` : ''}
        </label>
    `;
}

// Exponer función global
window.createSyncedCheckbox = createSyncedCheckbox;

window.addEventListener('settingsApplied', (event) => {
    const settings = event.detail;
    if (!settings || !ProgressTracker?.state?.config) return;

    if (settings.evaluation?.trackingMode) {
        ProgressTracker.state.config.trackingMode = {
            ...ProgressTracker.state.config.trackingMode,
            ...settings.evaluation.trackingMode
        };
    }

    if (settings.teams?.teamNames) {
        const teams = Object.values(settings.teams.teamNames).filter(Boolean);
        if (teams.length) {
            ProgressTracker.state.config.teams = teams;
            if (!teams.includes(ProgressTracker.state.config.currentTeam)) {
                ProgressTracker.state.config.currentTeam = teams[0];
            }
        }
    }

    ProgressTracker.saveToStorage();
});
