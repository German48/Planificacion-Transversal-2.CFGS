/**
 * Dashboard de Progreso - Renderizado
 * Sistema de Planificación Transversal
 */

const DashboardRenderer = {

    /**
     * Renderizar Dashboard Resumen (Vista 6)
     */
    renderSummaryDashboard() {
        const container = document.getElementById('dashboard-summary');
        if (!container) return;

        const stats = ProgressTracker.getStats();
        const config = ProgressTracker.state.config;

        container.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <div class="dashboard-title">
                        <span class="emoji">📊</span>
                        <h2>Dashboard Resumen</h2>
                    </div>
                    <div class="team-user-selector">
                        <div class="selector-group">
                            <label>👥 Equipo:</label>
                            <select id="teamSelector" onchange="DashboardRenderer.changeTeam(this.value)">
                                ${config.teams.map(t =>
            `<option value="${t}" ${t === config.currentTeam ? 'selected' : ''}>${t}</option>`
        ).join('')}
                            </select>
                        </div>
                        <div class="selector-group">
                            <label>👤 Alumno:</label>
                            <select id="userSelector" onchange="DashboardRenderer.changeUser(this.value)">
                                <option value="Alumno_01">Alumno 1</option>
                                <option value="Alumno_02">Alumno 2</option>
                                <option value="Alumno_03">Alumno 3</option>
                                <option value="Alumno_04">Alumno 4</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- Tarjetas de Progreso General -->
                <div class="progress-cards-grid">
                    <div class="progress-card highlight">
                        <div class="progress-card-header">
                            <span class="progress-card-title">📈 Progreso General</span>
                        </div>
                        <div class="progress-card-value">${stats.overall.percentage}%</div>
                        <div class="progress-card-subtitle">${stats.overall.completed} de ${stats.overall.total} tareas completadas</div>
                        <div class="progress-bar-container">
                            <div class="progress-bar">
                                <div class="progress-bar-fill" style="width: ${stats.overall.percentage}%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="progress-card">
                        <div class="progress-card-header">
                            <span class="progress-card-title">🚪 Gates Superados</span>
                        </div>
                        <div class="progress-card-value">${stats.gates.passed}/${stats.gates.total}</div>
                        <div class="progress-card-subtitle">Puntos de control</div>
                    </div>

                    <div class="progress-card">
                        <div class="progress-card-header">
                            <span class="progress-card-title">📅 Semana Actual</span>
                        </div>
                        <div class="progress-card-value">${this.getCurrentWeek()}</div>
                        <div class="progress-card-subtitle">${this.getCurrentEval()}</div>
                    </div>
                </div>

                <!-- Paneles por Evaluación -->
                <div class="eval-panels">
                    ${(window.MASTER_PLAN?.config?.evaluations || ['E1', 'E2', 'E3']).map(ev =>
            this.renderEvalPanel(ev, window.MASTER_PLAN?.pedagogical_context?.[ev]?.title || `Evaluación ${ev}`)
        ).join('')}
                </div>

                <!-- Progreso por Módulos -->
                <h3 style="margin-bottom: 15px;">📚 Progreso por Módulo</h3>
                <div class="modules-progress-grid">
                    ${Object.entries(window.MASTER_PLAN?.modules || {}).filter(([id]) => id !== 'ALL').map(([id, mod]) =>
            this.renderModuleCard(id, mod.name)
        ).join('')}
                </div>
            </div>
        `;
    },

    getDashboardDefaults() {
        return {
            selectionGlobal: {
                mode: 'team',
                teamId: 'all',
                studentId: 'all'
            },
            moduleOverrides: {}
        };
    },

    getDashboardSettings() {
        const defaults = this.getDashboardDefaults();
        const settings = window.SettingsManager?.settings;
        if (settings) {
            if (!settings.dashboard) {
                settings.dashboard = { ...defaults };
            }
            settings.dashboard.selectionGlobal = {
                ...defaults.selectionGlobal,
                ...(settings.dashboard.selectionGlobal || {})
            };
            settings.dashboard.moduleOverrides = settings.dashboard.moduleOverrides || {};
            return settings.dashboard;
        }

        try {
            const stored = localStorage.getItem(this.getDashboardStorageKey());
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    selectionGlobal: { ...defaults.selectionGlobal, ...(parsed.selectionGlobal || {}) },
                    moduleOverrides: parsed.moduleOverrides || {}
                };
            }
            const legacyStored = localStorage.getItem('dashboard_selection');
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                const migrated = {
                    selectionGlobal: { ...defaults.selectionGlobal, ...(parsed.selectionGlobal || {}) },
                    moduleOverrides: parsed.moduleOverrides || {}
                };
                localStorage.setItem(this.getDashboardStorageKey(), JSON.stringify(migrated));
                return migrated;
            }
        } catch (error) {
            console.warn('Error leyendo selección de dashboard:', error);
        }

        return { ...defaults };
    },

    saveDashboardSettings(state) {
        const settings = window.SettingsManager?.settings;
        if (settings) {
            settings.dashboard = state;
            window.SettingsManager.saveSettings();
            return;
        }

        try {
            localStorage.setItem(this.getDashboardStorageKey(), JSON.stringify(state));
        } catch (error) {
            console.warn('Error guardando selección de dashboard:', error);
        }
    },

    getDashboardStorageKey() {
        const stored = localStorage.getItem('selected_academic_year');
        const year = stored
            || window.MASTER_PLAN?.config?.academic_year
            || window.MASTER_PLAN?.config?.year
            || '2025-2026';
        return `dashboard_selection_${year}`;
    },

    getTeamsList() {
        const teams = window.ProgressTracker?.state?.config?.teams;
        if (Array.isArray(teams) && teams.length) return teams;
        const teamNames = window.SettingsManager?.settings?.teams?.teamNames || {};
        return Object.values(teamNames).filter(Boolean);
    },

    getStudentGroups() {
        const settings = window.SettingsManager?.settings;
        const teamNames = settings?.teams?.teamNames || {};
        const individualTeamId = settings?.teams?.individualTeamId;
        const students = Array.isArray(settings?.teams?.students) ? settings.teams.students : [];
        const groupsMap = {};

        students.forEach(student => {
            const teamId = student.individualized ? individualTeamId : student.teamId;
            if (!teamId) return;
            if (!groupsMap[teamId]) {
                const label = teamNames[teamId] || teamId;
                groupsMap[teamId] = { label, members: [] };
            }
            groupsMap[teamId].members.push(student.name);
        });

        const groups = Object.values(groupsMap).filter(group => group.members.length);
        if (groups.length) return groups;

        const teamMembers = settings?.teams?.teamMembers || {};
        Object.entries(teamMembers).forEach(([teamId, members]) => {
            const cleanMembers = (members || []).map(member => String(member).trim()).filter(Boolean);
            if (!cleanMembers.length) return;
            const label = teamNames[teamId] || teamId;
            groups.push({ label, members: cleanMembers });
        });

        if (!groups.length) {
            const fallbackUsers = window.ProgressTracker?.state?.config?.users || [];
            if (fallbackUsers.length) {
                groups.push({ label: 'Alumnado', members: fallbackUsers });
            }
        }

        return groups;
    },

    normalizeSelection(selection) {
        const normalized = {
            mode: selection?.mode || 'team',
            teamId: selection?.teamId || 'all',
            studentId: selection?.studentId || 'all'
        };
        if (normalized.mode === 'team') {
            normalized.studentId = selection?.studentId || 'all';
        }
        if (normalized.mode === 'individual') {
            normalized.teamId = selection?.teamId || 'all';
        }
        return normalized;
    },

    getEffectiveSelection(moduleId, state) {
        const trackingMode = window.ProgressTracker?.state?.config?.trackingMode?.[moduleId] || 'team';
        const override = state.moduleOverrides?.[moduleId];
        let baseSelection = this.normalizeSelection(override || state.selectionGlobal || {});

        if (!override && trackingMode === 'individual' && baseSelection.mode !== 'individual') {
            baseSelection = { ...baseSelection, mode: 'individual' };
        }

        return {
            selection: baseSelection,
            override: override || null,
            trackingMode
        };
    },

    renderTeamOptions(selected) {
        const teams = this.getTeamsList();
        const options = ['<option value="all">Todos los equipos</option>'];
        teams.forEach(team => {
            options.push(`<option value="${team}" ${team === selected ? 'selected' : ''}>${team}</option>`);
        });
        return options.join('');
    },

    renderStudentOptions(selected) {
        const groups = this.getStudentGroups();
        const options = ['<option value="all">Todos los alumnos</option>'];
        if (!groups.length) {
            options.push('<option value="none" disabled>Sin alumnado definido</option>');
            return options.join('');
        }
        groups.forEach(group => {
            const groupOptions = group.members.map(member =>
                `<option value="${member}" ${member === selected ? 'selected' : ''}>${member}</option>`
            ).join('');
            options.push(`<optgroup label="${group.label}">${groupOptions}</optgroup>`);
        });
        return options.join('');
    },

    renderGlobalSelectionControls(state) {
        const selection = this.normalizeSelection(state.selectionGlobal || {});
        const isTeam = selection.mode === 'team';
        const targetOptions = isTeam
            ? this.renderTeamOptions(selection.teamId)
            : this.renderStudentOptions(selection.studentId);

        return `
            <div class="dashboard-selection">
                <div class="dashboard-selection-group">
                    <label>Ámbito</label>
                    <select class="dashboard-selection-select" onchange="DashboardRenderer.changeGlobalSelectionMode(this.value)">
                        <option value="team" ${selection.mode === 'team' ? 'selected' : ''}>Equipo</option>
                        <option value="individual" ${selection.mode === 'individual' ? 'selected' : ''}>Individual</option>
                    </select>
                </div>
                <div class="dashboard-selection-group">
                    <label>${isTeam ? 'Equipo' : 'Alumno'}</label>
                    <select class="dashboard-selection-select" onchange="DashboardRenderer.changeGlobalSelectionTarget(this.value)">
                        ${targetOptions}
                    </select>
                </div>
            </div>
        `;
    },

    renderModuleOverrides(state) {
        const modules = Object.keys(window.MASTER_PLAN?.modules || {}).filter(id => id !== 'ALL');
        const moduleCards = modules.map(moduleId => {
            const module = window.MASTER_PLAN?.getModule?.(moduleId);
            const label = module?.name || moduleId;
            const effective = this.getEffectiveSelection(moduleId, state);
            const selection = effective.selection;
            const isTeam = selection.mode === 'team';
            const targetOptions = isTeam
                ? this.renderTeamOptions(selection.teamId)
                : this.renderStudentOptions(selection.studentId);
            const overrideActive = !!effective.override;

            return `
                <div class="module-override-row ${overrideActive ? 'override-active' : ''}">
                    <div class="module-override-label">
                        <span class="module-override-code">${moduleId}</span>
                        <span class="module-override-name">${label}</span>
                    </div>
                    <select class="dashboard-selection-select" onchange="DashboardRenderer.changeModuleSelectionMode('${moduleId}', this.value)">
                        <option value="team" ${selection.mode === 'team' ? 'selected' : ''}>Equipo</option>
                        <option value="individual" ${selection.mode === 'individual' ? 'selected' : ''}>Individual</option>
                    </select>
                    <select class="dashboard-selection-select" onchange="DashboardRenderer.changeModuleSelectionTarget('${moduleId}', this.value)">
                        ${targetOptions}
                    </select>
                    <div class="module-override-actions">
                        ${overrideActive ? `<button class="module-override-clear" onclick="DashboardRenderer.clearModuleOverride('${moduleId}')">Usar global</button>` : ''}
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="module-overrides">
                <div class="module-overrides-header">
                    <span>Overrides por módulo</span>
                </div>
                ${moduleCards}
            </div>
        `;
    },

    updateSelectionUI() {
        const state = this.getDashboardSettings();
        const controls = document.getElementById('dashboard-selection-controls');
        if (controls) {
            controls.innerHTML = this.renderGlobalSelectionControls(state);
        }
        const overrides = document.getElementById('dashboard-module-overrides');
        if (overrides) {
            overrides.innerHTML = this.renderModuleOverrides(state);
        }
    },

    changeGlobalSelectionMode(mode) {
        const state = this.getDashboardSettings();
        state.selectionGlobal = {
            ...state.selectionGlobal,
            mode,
            teamId: 'all',
            studentId: 'all'
        };
        this.saveDashboardSettings(state);
        this.renderRAVisualDashboard();
    },

    changeGlobalSelectionTarget(value) {
        const state = this.getDashboardSettings();
        const mode = state.selectionGlobal?.mode || 'team';
        if (mode === 'team') {
            state.selectionGlobal.teamId = value;
        } else {
            state.selectionGlobal.studentId = value;
        }
        this.saveDashboardSettings(state);
        this.renderRAVisualDashboard();
    },

    changeModuleSelectionMode(moduleId, mode) {
        const state = this.getDashboardSettings();
        const base = state.moduleOverrides?.[moduleId] || state.selectionGlobal || this.getDashboardDefaults().selectionGlobal;
        state.moduleOverrides = state.moduleOverrides || {};
        state.moduleOverrides[moduleId] = {
            mode,
            teamId: base.teamId || 'all',
            studentId: base.studentId || 'all'
        };
        if (mode === 'team') {
            state.moduleOverrides[moduleId].studentId = 'all';
        } else {
            state.moduleOverrides[moduleId].teamId = 'all';
        }
        this.saveDashboardSettings(state);
        this.renderRAVisualDashboard();
    },

    changeModuleSelectionTarget(moduleId, value) {
        const state = this.getDashboardSettings();
        const effective = this.getEffectiveSelection(moduleId, state);
        const mode = effective.selection.mode || 'team';
        state.moduleOverrides = state.moduleOverrides || {};
        if (!state.moduleOverrides[moduleId]) {
            state.moduleOverrides[moduleId] = { ...effective.selection };
        }
        if (mode === 'team') {
            state.moduleOverrides[moduleId].teamId = value;
        } else {
            state.moduleOverrides[moduleId].studentId = value;
        }
        this.saveDashboardSettings(state);
        this.renderRAVisualDashboard();
    },

    clearModuleOverride(moduleId) {
        const state = this.getDashboardSettings();
        if (state.moduleOverrides?.[moduleId]) {
            delete state.moduleOverrides[moduleId];
            this.saveDashboardSettings(state);
            this.renderRAVisualDashboard();
        }
    },

    getFilteredStats() {
        const state = this.getDashboardSettings();
        const selectionResolver = (moduleId) => {
            if (!moduleId || moduleId === 'GLOBAL') {
                return this.normalizeSelection(state.selectionGlobal || {});
            }
            return this.getEffectiveSelection(moduleId, state).selection;
        };
        return ProgressTracker.getStats(selectionResolver);
    },

    /**
     * Renderizar Dashboard Detallado (Vista 7)
     */
    renderDetailedDashboard() {
        const container = document.getElementById('dashboard-detailed');
        if (!container) return;

        const config = ProgressTracker.state.config;

        container.innerHTML = `
            <div class="dashboard-container">
                <div class="dashboard-header">
                    <div class="dashboard-title">
                        <span class="emoji">⚙️</span>
                        <h2>Dashboard de Progreso Detallado</h2>
                    </div>
                </div>

                <!-- Configuración de Seguimiento -->
                <div class="tracking-config-panel">
                    <div class="tracking-config-title">
                        <span>🔧</span> Configuración de Seguimiento por Módulo
                    </div>
                    <div class="tracking-config-grid">
                        ${Object.entries(window.MASTER_PLAN?.modules || {}).filter(([id]) => id !== 'ALL').map(([id, mod]) =>
            this.renderTrackingConfig(id, config.trackingMode[id])
        ).join('')}
                    </div>
                </div>

                <!-- Lista de Semanas con Progreso -->
                <h3 style="margin-bottom: 15px;">📋 Progreso Detallado por Semana</h3>
                ${this.renderWeeksList()}

                <!-- Actividad Reciente -->
                <div class="recent-activity" style="margin-top: 30px;">
                    <div class="recent-activity-title">
                        <span>🕐</span> Actividad Reciente
                    </div>
                    <ul class="activity-list">
                        ${this.renderRecentActivity()}
                    </ul>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar panel de evaluación
     */
    renderEvalPanel(evalNum, projectName) {
        const weeks = window.MASTER_PLAN?.timeline?.find(t => t.eval === evalNum)?.weeks || [];
        let completedWeeks = 0;

        const weekItems = weeks.map(week => {
            const gateStatus = ProgressTracker.getGate(week.id);
            if (gateStatus) completedWeeks++;

            return `
                <li class="eval-week-item ${gateStatus ? 'completed' : ''}">
                    <span class="eval-week-status">${gateStatus ? '✅' : '⬜'}</span>
                    <span class="eval-week-id">${week.id}</span>
                    <span class="eval-week-goal">${week.goal}</span>
                </li>
            `;
        }).join('');

        const percentage = weeks.length > 0 ? Math.round((completedWeeks / weeks.length) * 100) : 0;

        return `
            <div class="eval-panel ${evalNum.toLowerCase()}">
                <div class="eval-panel-header">
                    <span class="eval-panel-title">${evalNum}: ${projectName}</span>
                    <span class="eval-percentage">${percentage}%</span>
                </div>
                <ul class="eval-weeks-list">
                    ${weekItems}
                </ul>
            </div>
        `;
    },

    /**
     * Renderizar tarjeta de módulo
     */
    renderModuleCard(module, name) {
        const stats = ProgressTracker.getStats();
        const moduleStats = stats.byModule[module] || { total: 0, completed: 0 };
        const percentage = moduleStats.total > 0
            ? Math.round((moduleStats.completed / moduleStats.total) * 100)
            : 0;

        const mode = ProgressTracker.state.config.trackingMode[module];
        const modeIcon = mode === 'individual' ? '👤' : '👥';
        const modeText = mode === 'individual' ? 'Individual' : 'Equipo';

        return `
            <div class="module-progress-card ${module.toLowerCase()}">
                <div class="module-progress-name">${module}</div>
                <div class="module-progress-circle">${percentage}%</div>
                <div style="font-size: 0.85rem; color: var(--text-secondary);">${name}</div>
                <div class="module-tracking-mode">
                    <span class="icon">${modeIcon}</span>
                    <span>${modeText}</span>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar configuración de seguimiento
     */
    renderTrackingConfig(module, currentMode) {
        return `
            <div class="tracking-config-item">
                <span class="tracking-config-label">
                    <span style="color: var(--col-${module.toLowerCase()})">${module}</span>
                </span>
                <div class="tracking-toggle">
                    <button class="${currentMode === 'team' ? 'active' : ''}" 
                            onclick="DashboardRenderer.setTrackingMode('${module}', 'team')">
                        👥 Equipo
                    </button>
                    <button class="${currentMode === 'individual' ? 'active' : ''}"
                            onclick="DashboardRenderer.setTrackingMode('${module}', 'individual')">
                        👤 Individual
                    </button>
                </div>
            </div>
        `;
    },

    /**
     * Renderizar lista de semanas
     */
    renderWeeksList() {
        const weeks = window.MASTER_PLAN?.weeks || [];

        return weeks.map(week => {
            const gateStatus = ProgressTracker.getGate(week.week_id);
            const dods = week.min_deliverable?.evidence_required || [];

            return `
                <div class="eval-week-item" style="margin-bottom: 10px; padding: 15px; background: var(--card-bg); border-radius: 10px;">
                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                        ${createSyncedCheckbox(
                `gate-${week.week_id}`,
                'gate',
                { weekId: week.week_id },
                ''
            )}
                        <span class="eval-week-id" style="font-weight: 700;">${week.week_id}</span>
                        <span class="eval-week-goal" style="flex: 1;">${week.week_goal}</span>
                        <span class="eval-week-status">${gateStatus ? '✅ Gate OK' : '⏳ En curso'}</span>
                    </div>
                    ${dods.length > 0 ? `
                        <div style="margin-top: 10px; padding-left: 35px; display: flex; flex-wrap: wrap; gap: 10px;">
                            ${dods.map((dod, i) => createSyncedCheckbox(
                `dod-${week.week_id}-${i}`,
                'dod',
                { weekId: week.week_id, dodId: `dod${i}`, module: 'DDR' },
                dod
            )).join('')}
                        </div>
                    ` : ''}
                </div>
            `;
        }).join('');
    },

    /**
     * Renderizar actividad reciente
     */
    renderRecentActivity() {
        // Placeholder - se podría implementar con timestamps reales
        return `
            <li class="activity-item">
                <div class="activity-icon">✅</div>
                <div class="activity-content">
                    <div class="activity-title">Sin actividad reciente</div>
                    <div class="activity-time">Marca checkboxes para ver tu progreso aquí</div>
                </div>
            </li>
        `;
    },

    /**
     * Helpers
     */
    getCurrentWeek() {
        const today = new Date().toISOString().split('T')[0];
        const week = window.MASTER_PLAN?.weeks?.find(w =>
            today >= w.date_from && today <= w.date_to
        );
        return week?.week_id || 'N/A';
    },

    getCurrentEval() {
        const today = new Date().toISOString().split('T')[0];
        const week = window.MASTER_PLAN?.weeks?.find(w =>
            today >= w.date_from && today <= w.date_to
        );
        return week?.eval || 'N/A';
    },

    /**
     * Cambiar equipo
     */
    changeTeam(team) {
        ProgressTracker.setCurrentTeam(team);
        this.refreshAll();
    },

    /**
     * Cambiar usuario
     */
    changeUser(user) {
        ProgressTracker.setCurrentUser(user);
        this.refreshAll();
    },

    /**
     * Cambiar modo de seguimiento
     */
    setTrackingMode(module, mode) {
        ProgressTracker.setTrackingMode(module, mode);
        this.refreshAll();
    },

    /**
     * Renderizar Dashboard Visual de Entregas (Vista 5)
     */
    renderRAVisualDashboard() {
        const container = document.getElementById('ra-visual-dashboard');
        if (!container) return;

        // Si el container está vacío o no tiene la estructura de canvas, inicializar
        if (!container.querySelector('canvas')) {
            container.innerHTML = `
                <div class="dashboard-controls-row">
                    <div id="dashboard-selection-controls"></div>
                    <button class="reset-db-btn" onclick="DashboardRenderer.resetAllData()">
                        🗑️ Reiniciar Todo a 0%
                    </button>
                </div>
                <div class="dashboard-grid">
                    <div class="dashboard-card progress-overview">
                        <h3>📈 Progreso de Entregas</h3>
                        <div class="chart-wrapper">
                            <canvas id="progressChart"></canvas>
                            <div class="chart-overlay-text" id="global-percent-text">0%</div>
                        </div>
                    </div>

                    <div class="dashboard-card modules-summary">
                        <h3>📚 Entregas por Módulos</h3>
                        <div class="chart-wrapper">
                            <canvas id="modulesChart"></canvas>
                        </div>
                        <div id="dashboard-module-overrides"></div>
                    </div>

                    <div class="dashboard-card competencies-radar">
                        <h3>🎯 Rendimiento en Hitos</h3>
                        <div class="chart-wrapper">
                            <canvas id="competenciesChart"></canvas>
                        </div>
                    </div>

                    <div class="dashboard-card evaluations-timeline">
                        <h3>📅 Entregas por Evaluaciones</h3>
                        <div class="chart-wrapper">
                            <canvas id="evaluationsChart"></canvas>
                        </div>
                    </div>

                    <div class="dashboard-card metacognition-comparison">
                        <h3>🧠 Percepción vs Realidad</h3>
                        <div class="chart-wrapper" style="min-height: 300px;">
                            <canvas id="metacognitionChart"></canvas>
                        </div>
                    </div>
                </div>
                <div id="insights-panel" class="insights-container"></div>
            `;
        }

        this.updateSelectionUI();
        const stats = this.getFilteredStats();
        this.updateCharts(stats);
    },

    /**
     * Reiniciar todos los datos del curso (Punto Limpio)
     */
    resetAllData() {
        if (confirm('¿Estás seguro de reiniciar todos los datos de progreso del curso? Esta acción no se puede deshacer.')) {
            ProgressTracker.reset();
            if (window.RubricManager) {
                localStorage.removeItem(window.RubricManager.storageKey);
                window.RubricManager.data = {};
            }
            this.refreshAll();
            this.showNotification('🧹 Todos los datos han sido reiniciados', 'info');
        }
    },

    /**
     * Instancias de gráficos para actualización
     */
    charts: {},

    /**
     * Actualizar todos los gráficos con nuevos datos
     */
    updateCharts(stats) {
        if (typeof window.Chart === 'undefined') {
            console.warn('⚠️ Chart.js no disponible para updateCharts (2nd CFGS), reintentando...');
            setTimeout(() => this.updateCharts(stats), 200);
            return;
        }
        this.renderProgressChart(stats);
        this.renderModulesChart(stats);
        this.renderCompetenciesChart(stats);
        this.renderEvaluationsChart(stats);
        this.renderMetacognitionChart(stats);
        this.renderInsightsPanel(stats);
    },

    /**
     * Gráfico de Progreso Global (Doughnut)
     */
    renderProgressChart(stats) {
        if (typeof window.Chart === 'undefined') return;

        const ctx = document.getElementById('progressChart')?.getContext('2d');
        if (!ctx) return;

        const percent = stats.overall.percentage;
        document.getElementById('global-percent-text').textContent = `${percent}%`;

        if (this.charts.progress) {
            this.charts.progress.data.datasets[0].data = [percent, 100 - percent];
            this.charts.progress.update();
            return;
        }

        this.charts.progress = new window.Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percent, 100 - percent],
                    backgroundColor: ['#27ae60', '#ecf0f1'],
                    borderWidth: 0
                }]
            },
            options: {
                cutout: '80%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } }
            }
        });
    },

    /**
     * Gráfico de Módulos (Barra Horizontal)
     */
    renderModulesChart(stats) {
        if (typeof window.Chart === 'undefined') return;

        const ctx = document.getElementById('modulesChart')?.getContext('2d');
        if (!ctx) return;

        const modules = ['DDR', 'IYO', 'ATZ', 'GNE', 'PIM'];
        const data = modules.map(m => stats.byModule[m]?.total > 0
            ? Math.round((stats.byModule[m].completed / stats.byModule[m].total) * 100)
            : 0
        );
        const colors = modules.map(m => {
            const mod = window.MASTER_PLAN?.getModule(m);
            return mod?.color || '#34495e';
        });

        if (this.charts.modules) {
            this.charts.modules.data.datasets[0].data = data;
            this.charts.modules.update();
            return;
        }

        this.charts.modules = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: modules,
                datasets: [{
                    label: 'Progreso %',
                    data: data,
                    backgroundColor: colors,
                    borderRadius: 5
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: true, max: 100, grid: { display: false } },
                    y: { grid: { display: false } }
                }
            }
        });
    },

    /**
     * Gráfico de Competencias (Radar)
     */
    renderCompetenciesChart(stats) {
        if (typeof window.Chart === 'undefined') return;

        const ctx = document.getElementById('competenciesChart')?.getContext('2d');
        if (!ctx) return;

        const comps = Object.keys(stats.competencies);
        const data = comps.map(c => stats.competencies[c].percentage);

        if (this.charts.competencies) {
            this.charts.competencies.data.datasets[0].data = data;
            this.charts.competencies.update();
            return;
        }

        this.charts.competencies = new window.Chart(ctx, {
            type: 'radar',
            data: {
                labels: comps,
                datasets: [{
                    label: 'Nivel Alcanzado',
                    data: data,
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    borderColor: '#3498db',
                    pointBackgroundColor: '#3498db',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 100,
                        ticks: { display: false, stepSize: 20 },
                        grid: { color: 'rgba(0,0,0,0.05)' }
                    }
                },
                plugins: { legend: { display: false } }
            }
        });
    },

    /**
     * Gráfico de Evaluaciones (Línea/Barras)
     */
    renderEvaluationsChart(stats) {
        if (typeof window.Chart === 'undefined') return;

        const ctx = document.getElementById('evaluationsChart')?.getContext('2d');
        if (!ctx) return;

        const labels = ['E1', 'E2', 'E3'];
        const data = labels.map(e => stats.byEval[e]?.total > 0
            ? Math.round((stats.byEval[e].completed / stats.byEval[e].total) * 100)
            : 0
        );

        if (this.charts.evaluations) {
            this.charts.evaluations.data.datasets[0].data = data;
            this.charts.evaluations.update();
            return;
        }

        this.charts.evaluations = new window.Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['E1: Anteproyecto', 'E2: Ejecutivo', 'E3: Empresa'],
                datasets: [{
                    label: 'Completado %',
                    data: data,
                    backgroundColor: ['#2980b9', '#27ae60', '#d35400'],
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });
    },

    renderMetacognitionChart(stats) {
        const ctx = document.getElementById('metacognitionChart');
        if (!ctx) return;

        const modules = ['RRC', 'DRP', 'FAT', 'PMB', 'DJK', 'PUB'];

        const realProgress = modules.map(m => {
            const modStats = stats.byModule[m];
            return modStats && modStats.total > 0 ? Math.round((modStats.completed / modStats.total) * 100) : 0;
        });

        const selfAssess = modules.map(m => {
            if (!window.RubricManager) return 0;
            const evalId = this.getCurrentEval();
            const criteria = window.RubricManager.getCriteriaForEval(evalId);
            const modCriteria = criteria.filter(c => c.includes(m));

            if (modCriteria.length === 0) {
                const genericCrit = `RA/${m}`;
                const data = window.RubricManager.getAssessment(evalId, genericCrit);
                return data ? (data.level / 4) * 100 : 0;
            }

            const totalScore = modCriteria.reduce((acc, crit) => {
                const data = window.RubricManager.getAssessment(evalId, crit);
                return acc + (data ? (data.level / 4) * 100 : 0);
            }, 0);
            return Math.round(totalScore / modCriteria.length);
        });

        if (this.charts.metacognition) this.charts.metacognition.destroy();
        this.charts.metacognition = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: modules,
                datasets: [
                    {
                        label: 'Progreso Real',
                        data: realProgress,
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        pointBackgroundColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 2
                    },
                    {
                        label: 'Autoevaluación',
                        data: selfAssess,
                        backgroundColor: 'rgba(241, 196, 15, 0.2)',
                        borderColor: 'rgba(241, 196, 15, 1)',
                        pointBackgroundColor: 'rgba(241, 196, 15, 1)',
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { display: true },
                        suggestedMin: 0,
                        suggestedMax: 100,
                        ticks: { stepSize: 20, display: false }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, padding: 10, font: { size: 11 } }
                    }
                }
            }
        });
    },

    renderInsightsPanel(stats) {
        const container = document.getElementById('insights-panel');
        if (!container) return;

        const insights = this.calculateInsights();

        container.innerHTML = `
            <div class="insights-grid">
                <div class="insight-card speed-metric">
                    <h4>🚀 Velocidad de Entrega</h4>
                    <div class="metric-value ${insights.avgDelay > 2 ? 'warning' : 'good'}">
                        ${insights.avgDelay} <span class="unit">días de retraso medio</span>
                    </div>
                    <p class="metric-hint">${this.getSpeedHint(insights.avgDelay)}</p>
                </div>
                
                <div class="insight-card heatmap-metric">
                    <h4>🔥 Carga de Trabajo por Semanas</h4>
                    <div class="heatmap-grid" id="insights-heatmap">
                        ${this.generateHeatmapHTML(insights.weeklyWorkload)}
                    </div>
                    <div class="heatmap-legend">
                        <span>Poca carga</span>
                        <div class="gradient-bar"></div>
                        <span>Mucha carga</span>
                    </div>
                </div>
            </div>
        `;
    },

    getSpeedHint(delay) {
        if (delay <= 0) return '✨ ¡Eres un rayo! Entregas todo a tiempo.';
        if (delay <= 2) return '👍 Buen ritmo. Pequeños retrasos aceptables.';
        if (delay <= 5) return '⚠️ Cuidado. Empiezas a acumular retraso significativo.';
        return '🚨 ¡SOS! Necesitas reorganizar tu tiempo urgentemente.';
    },

    calculateInsights() {
        const workload = {};
        let totalDelay = 0;
        let delayCount = 0;

        Object.entries(ProgressTracker.state.weeklyDod).forEach(([key, dods]) => {
            const weekId = key.split('_')[0];
            const weekData = window.MASTER_PLAN.weeks.find(w => w.week_id === weekId);
            if (!weekData) return;
            if (!workload[weekId]) workload[weekId] = { total: 0, completed: 0 };
            const deadline = new Date(weekData.date_to + 'T23:59:59').getTime();
            Object.values(dods).forEach(dod => {
                workload[weekId].total++;
                if (dod.completed) {
                    workload[weekId].completed++;
                    if (dod.timestamp) {
                        const delay = (dod.timestamp - deadline) / (1000 * 60 * 60 * 24);
                        if (delay > 0) {
                            totalDelay += delay;
                            delayCount++;
                        }
                    }
                }
            });
        });

        Object.entries(ProgressTracker.state.dailyTasks).forEach(([key, tasks]) => {
            const dateStr = key.split('_')[0];
            const weekId = window.MASTER_PLAN.weeks.find(w => dateStr >= w.date_from && dateStr <= w.date_to)?.week_id;
            if (!weekId) return;
            if (!workload[weekId]) workload[weekId] = { total: 0, completed: 0 };
            const deadline = new Date(dateStr + 'T23:59:59').getTime();
            Object.values(tasks).forEach(task => {
                workload[weekId].total++;
                if (task.completed) {
                    workload[weekId].completed++;
                    if (task.timestamp) {
                        const delay = (task.timestamp - deadline) / (1000 * 60 * 60 * 24);
                        if (delay > 0) {
                            totalDelay += delay;
                            delayCount++;
                        }
                    }
                }
            });
        });

        return {
            avgDelay: delayCount > 0 ? (totalDelay / delayCount).toFixed(1) : 0,
            weeklyWorkload: workload
        };
    },

    generateHeatmapHTML(workload) {
        return window.MASTER_PLAN.weeks.map(w => {
            const stats = workload[w.week_id] || { total: 0, completed: 0 };
            const intensity = stats.total > 0 ? (stats.completed / Math.max(stats.total, 5)) : 0;
            const loadLevel = Math.min(Math.floor(intensity * 10), 10);
            return `<div class="heatmap-cell" style="background-color: var(--heatmap-lv${loadLevel})" title="Semana ${w.week_id}: ${stats.completed}/${stats.total} tareas"><span class="cell-label">${w.week_id.split('-S')[1]}</span></div>`;
        }).join('');
    },

    /**
     * Refrescar todos los dashboards
     */
    refreshAll() {
        if (this.viewMode === 'resumen') this.renderSummaryDashboard();
        else {
            this.updateSelectionUI();
            const stats = this.getFilteredStats();
            this.updateCharts(stats);
        }
    }
};

// Exponer globalmente
window.DashboardRenderer = DashboardRenderer;

// Escuchar actualizaciones de progreso
window.addEventListener('progressUpdated', () => {
    DashboardRenderer.refreshAll();
});
