/**
 * SETTINGS MANAGER
 * Sistema de gestión de configuraciones del Panel Docente
 * Gestiona preferencias de usuario, configuraciones pedagógicas y opciones avanzadas
 */

class SettingsManager {
    constructor() {
        this.currentSchemaVersion = '2.2';
        this.storageKey = this.buildStorageKey('planificacion_settings');
        this.webhookStateKey = this.buildStorageKey('planificacion_webhook_state');
        this.autoExportStateKey = this.buildStorageKey('planificacion_autoexport_state');
        this.autoExportTimer = null;
        this.webhookListenerAttached = false;
        this.settings = this.loadSettings();
        this.defaultSettings = this.getDefaultSettings();
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
        const courseId = window.MASTER_PLAN?.config?.course_id || '2cfgs';
        return `${courseId}_${baseKey}_${year}`;
    }

    getLegacyStorageKey(baseKey) {
        return baseKey;
    }

    /**
     * Configuración por defecto del sistema
     */
    getDefaultSettings() {
        return {
            schemaVersion: this.currentSchemaVersion,
            // ============ GENERAL Y PERSONALIZACIÓN ============
            general: {
                theme: 'light', // light, dark, auto
                density: 'normal', // compact, normal, spacious
                fontSize: 'normal', // small, normal, large
                language: 'es', // es, ca, en
                defaultView: 'daily', // daily, radar, timeline, ra-dashboard
                showWelcome: true // Mostrar mensaje de bienvenida al iniciar
            },

            // ============ EVALUACIÓN Y SEGUIMIENTO ============
            evaluation: {
                weekCompletionThreshold: 75, // % mínimo para considerar semana superada
                evaluationWeights: {
                    E1: 40,
                    E2: 40,
                    E3: 20
                },
                trackingMode: {
                    DDR: 'team',       // Diseño - team
                    IYO: 'individual', // Instalaciones - individual
                    ATZ: 'individual', // Automatización - individual
                    GNE: 'team',       // Gestión - team
                    PIM: 'team'        // Proyecto - team
                },
                showGlobalProgress: 'header', // header, sidebar, hidden
                delayAlerts: true, // Activar alertas de retraso
                delayThresholdDays: 3 // Días sin marcar DoDs antes de alerta
            },

            // ============ NOTIFICACIONES ============
            notifications: {
                enabled: false, // Por defecto desactivadas (requiere permiso)
                upcomingDeadlines: true, // Avisar entregas próximas
                overdueTasks: true, // Avisar tareas retrasadas
                daysBefore: 2, // Avisar X días antes del vencimiento
                lastCheck: null // Fecha de última revisión
            },

            // ============ CONFIGURACIONES PEDAGÓGICAS ============
            pedagogical: {
                allowEditPedagogicalBlocks: false, // Permitir edición de bloques
                customGates: {}, // Gates personalizados (vacío = usar defaults)
                rubricTemplates: [], // Plantillas de rúbricas personalizadas
                holidays: [], // Fechas festivas personalizadas ['2025-12-06', ...]
                showInstitutionalPanel: false, // Mostrar panel institucional
                projectNames: {
                    E1: window.MASTER_PLAN?.pedagogical_context?.E1?.title || "Proyecto E1",
                    E2: window.MASTER_PLAN?.pedagogical_context?.E2?.title || "Proyecto E2",
                    E3: window.MASTER_PLAN?.pedagogical_context?.E3?.title || "Proyecto E3"
                },
                customContext: {}, // Overrides de Sentido/Intencionalidad por evaluación
                fichasOverrides: { // Overrides de fichas diarias/semanales
                    daily: {},
                    weekly: {}
                }
            },

            // ============ DATOS Y COPIAS DE SEGURIDAD ============
            data: {
                autoExport: 'manual', // weekly, evaluation, manual
                exportFormat: 'json', // json, csv, pdf
                cloudSync: false, // Sincronización con nube
                cloudProvider: 'none', // none, gsheets, other
                gsheetsUrl: '', // URL de Google Apps Script para Sheets
                otherCloudUrl: '', // URL para otro proveedor (Webhook/API)
                lastBackupDate: null,
                autoBackupEnabled: false
            },

            // ============ GESTIÓN DE ALUMNOS Y EQUIPOS ============
            teams: {
                teamNames: {
                    'Equipo01': 'Equipo 01',
                    'Equipo02': 'Equipo 02',
                    'Equipo03': 'Equipo 03',
                    'Equipo04': 'Equipo 04',
                    'Equipo05': 'Equipo 05',
                    'Equipo06': 'Equipo 06'
                },
                individualTeamId: 'Equipo01',
                teamMembers: {}, // { 'Equipo01': ['Alumno1', 'Alumno2', ...] }
                students: [], // [{ id, name, teamId, individualized }]
                weeklyLeaders: {}, // { 'E1-S01': 'Equipo03', ... }
                autoRotateLeaders: false,
                requirePinForReset: false,
                resetPin: '',
                studentViewPreview: false
            },

            // ============ DASHBOARD DE ENTREGAS ============
            dashboard: {
                selectionGlobal: {
                    mode: 'team',
                    teamId: 'all',
                    studentId: 'all'
                },
                moduleOverrides: {}
            },

            // ============ INTEGRACIÓN EXTERNA ============
            integrations: {
                moodleBaseUrl: 'https://moodle.example.com/mod/folder/',
                fileNamingPattern: '{eval}_{team}_{file}', // Patrón de nomenclatura
                enableWebhooks: false,
                webhookUrl: '',
                webhookEvents: ['gate_completed', 'week_completed']
            },

            // ============ AVANZADO Y DESARROLLO ============
            advanced: {
                debugMode: false, // Mostrar logs en consola
                enableServiceWorker: true, // PWA
                dataSchemaVersion: this.currentSchemaVersion,
                performanceMode: false, // Reducir animaciones para mejor rendimiento
                experimentalFeatures: false
            },

            // ============ CONFIGURACIONES ESPECÍFICAS DE ALUMNADO ============
            student: {
                study: {
                    focusMode: false,
                    showOnlyMyTasks: false,
                    highlightPending: true,
                    hideCompleted: false,
                    studyTimer: false,
                    pomodoroLength: 25
                },
                notifications: {
                    enabled: true,
                    pendingTasks: true,
                    upcomingDeadlines: true,
                    teamUpdates: false,
                    soundEnabled: false,
                    daysBeforeDeadline: 2
                },
                team: {
                    myTeamId: 'Equipo01',
                    showTeamProgress: true,
                    showTeammates: true,
                    celebrateAchievements: true
                }
            }
        };
    }

    /**
     * Cargar configuraciones desde localStorage
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                const migrated = this.migrateSettings(parsed);
                // Merge con defaults para añadir nuevas configuraciones
                return this.deepMerge(this.getDefaultSettings(), migrated);
            }

            const legacyStored = localStorage.getItem(this.getLegacyStorageKey('planificacion_settings'));
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                const migrated = this.migrateSettings(parsed);
                const merged = this.deepMerge(this.getDefaultSettings(), migrated);
                localStorage.setItem(this.storageKey, JSON.stringify(merged));
                return merged;
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
        return this.getDefaultSettings();
    }

    migrateSettings(storedSettings) {
        const migrated = { ...storedSettings };
        const storedVersion = parseFloat(migrated.schemaVersion || '0');

        if (!migrated.schemaVersion) {
            migrated.schemaVersion = this.currentSchemaVersion;
        }

        if (!migrated.advanced) {
            migrated.advanced = {};
        }

        migrated.advanced.dataSchemaVersion = this.currentSchemaVersion;

        if (!migrated.general) {
            migrated.general = {};
        }

        if (storedVersion < 2.2) {
            if (!migrated.general.defaultView || migrated.general.defaultView === 'radar') {
                migrated.general.defaultView = 'daily';
            }
        }

        if (!migrated.teams) {
            migrated.teams = {};
        }

        const maxTeams = 6;
        const teamNames = migrated.teams.teamNames || {};
        const limitedTeamNames = {};
        Object.keys(teamNames)
            .filter(key => /^Equipo\d{2}$/.test(key))
            .sort()
            .slice(0, maxTeams)
            .forEach(key => {
                limitedTeamNames[key] = teamNames[key];
            });
        if (!Object.keys(limitedTeamNames).length) {
            for (let i = 1; i <= maxTeams; i += 1) {
                const key = `Equipo${String(i).padStart(2, '0')}`;
                limitedTeamNames[key] = `Equipo ${String(i).padStart(2, '0')}`;
            }
        }
        migrated.teams.teamNames = limitedTeamNames;

        if (!migrated.teams.individualTeamId || !limitedTeamNames[migrated.teams.individualTeamId]) {
            migrated.teams.individualTeamId = Object.keys(limitedTeamNames)[0];
        }

        if (!Array.isArray(migrated.teams.students)) {
            migrated.teams.students = [];
        }

        if (!migrated.teams.students.length && migrated.teams.teamMembers) {
            const students = [];
            Object.entries(migrated.teams.teamMembers).forEach(([teamId, members]) => {
                (members || []).forEach((member, index) => {
                    const name = String(member).trim();
                    if (!name) return;
                    students.push({
                        id: `${teamId}_${index + 1}`,
                        name,
                        teamId,
                        individualized: false
                    });
                });
            });
            migrated.teams.students = students;
        }

        const limitedMembers = {};
        Object.keys(limitedTeamNames).forEach(teamId => {
            limitedMembers[teamId] = [];
        });
        (migrated.teams.students || []).forEach(student => {
            const teamId = student.individualized
                ? migrated.teams.individualTeamId
                : student.teamId;
            if (!limitedMembers[teamId]) return;
            limitedMembers[teamId].push(student.name);
        });
        migrated.teams.teamMembers = limitedMembers;

        return migrated;
    }

    /**
     * Guardar configuraciones en localStorage
     */
    saveSettings() {
        try {
            this.settings.schemaVersion = this.currentSchemaVersion;
            if (!this.settings.advanced) {
                this.settings.advanced = {};
            }
            this.settings.advanced.dataSchemaVersion = this.currentSchemaVersion;
            localStorage.setItem(this.storageKey, JSON.stringify(this.settings));

            // Emitir evento para actualizar UI
            window.dispatchEvent(new CustomEvent('settingsUpdated', {
                detail: this.settings
            }));

            return true;
        } catch (error) {
            console.error('Error saving settings:', error);
            return false;
        }
    }

    /**
     * Obtener una configuración específica
     */
    get(category, key) {
        if (!this.settings[category]) return null;
        if (key) return this.settings[category][key];
        return this.settings[category];
    }

    /**
     * Establecer una configuración específica
     */
    set(category, key, value) {
        if (!this.settings[category]) {
            this.settings[category] = {};
        }

        if (typeof key === 'object') {
            // Si key es un objeto, merge completo de la categoría
            this.settings[category] = { ...this.settings[category], ...key };
        } else {
            this.settings[category][key] = value;
        }

        return this.saveSettings();
    }

    /**
     * Restablecer configuración de fábrica
     */
    resetToDefaults(preserveData = true) {
        if (preserveData) {
            // Mantener configuraciones de equipos y datos
            const preserve = {
                teams: this.settings.teams,
                data: this.settings.data
            };
            this.settings = { ...this.getDefaultSettings(), ...preserve };
        } else {
            this.settings = this.getDefaultSettings();
        }
        return this.saveSettings();
    }

    /**
     * Exportar configuraciones como JSON
     */
    exportSettings() {
        const exportData = {
            version: this.settings.advanced.dataSchemaVersion,
            exportDate: new Date().toISOString(),
            settings: this.settings
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `configuracion_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    openCloudUpload(provider) {
        const urls = {
            gdrive: 'https://drive.google.com/drive/my-drive',
            onedrive: 'https://onedrive.live.com/'
        };
        const target = urls[provider];
        if (target) {
            window.open(target, '_blank', 'noopener');
        }
    }

    /**
     * Importar configuraciones desde JSON con validación de integridad
     */
    importSettings(jsonString) {
        try {
            const imported = JSON.parse(jsonString);

            // 1. Validación de estructura básica
            if (!imported || typeof imported !== 'object' || !imported.settings) {
                console.error('❌ Estructura de backup inválida.');
                return { success: false, error: 'Estructura de backup inválida' };
            }

            // 2. Validación de campos obligatorios (Esquema ligero)
            const validationNotice = this.validateImportedSettings(imported.settings);
            if (!validationNotice.isValid) {
                console.error('❌ Error de validación en los datos importados:', validationNotice.errors);
                return { success: false, error: `Datos corruptos: ${validationNotice.errors[0]}` };
            }

            // 3. Aplicar datos
            this.settings = this.deepMerge(this.getDefaultSettings(), imported.settings);

            // Importar también el progreso si viene en el archivo
            if (imported.progress && window.ProgressManager) {
                window.ProgressManager.data = imported.progress;
                window.ProgressManager.save();
            }

            const saved = this.saveSettings();
            return { success: saved, error: saved ? null : 'Error al guardar en el storage' };
        } catch (error) {
            console.error('❌ Error crítico en la importación:', error);
            return { success: false, error: 'El archivo no es un JSON válido' };
        }
    }

    /**
     * Validador ligero de esquema para evitar inyecciones o datos corruptos
     */
    validateImportedSettings(s) {
        const errors = [];
        if (!s.general || typeof s.general !== 'object') errors.push('Falta categoría "general"');
        if (!s.evaluation || typeof s.evaluation !== 'object') errors.push('Falta categoría "evaluation"');
        if (!s.data || typeof s.data !== 'object') errors.push('Falta categoría "data"');

        // Verificar tipos críticos
        if (s.general && typeof s.general.theme !== 'string') errors.push('Campo "theme" inválido');
        if (s.evaluation && typeof s.evaluation.evaluationWeights !== 'object') errors.push('Ponderaciones inválidas');

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Aplicar tema visual
     */
    applyTheme() {
        const theme = this.settings.general.theme;
        const body = document.body;

        if (theme === 'auto') {
            // Detectar preferencia del sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            body.classList.toggle('dark-theme', prefersDark);
        } else {
            body.classList.toggle('dark-theme', theme === 'dark');
        }
    }

    /**
     * Aplicar nombres de proyectos personalizados
     */
    applyProjectNames() {
        const names = this.settings.pedagogical.projectNames;
        if (!names || !window.MASTER_PLAN) return;

        // Actualizar pedagogical_context
        if (window.MASTER_PLAN.pedagogical_context) {
            if (names.E1 && window.MASTER_PLAN.pedagogical_context.E1) {
                window.MASTER_PLAN.pedagogical_context.E1.title = names.E1;
            }
            if (names.E2 && window.MASTER_PLAN.pedagogical_context.E2) {
                window.MASTER_PLAN.pedagogical_context.E2.title = names.E2;
            }
            if (names.E3 && window.MASTER_PLAN.pedagogical_context.E3) {
                window.MASTER_PLAN.pedagogical_context.E3.title = names.E3;
            }
        }

        // Actualizar timeline
        if (window.MASTER_PLAN.timeline) {
            const e1Timeline = window.MASTER_PLAN.timeline.find(t => t.eval === 'E1');
            if (e1Timeline && names.E1) e1Timeline.title = names.E1;

            const e2Timeline = window.MASTER_PLAN.timeline.find(t => t.eval === 'E2');
            if (e2Timeline && names.E2) e2Timeline.title = names.E2;

            const e3Timeline = window.MASTER_PLAN.timeline.find(t => t.eval === 'E3');
            if (e3Timeline && names.E3) e3Timeline.title = names.E3;
        }

        // Actualizar academic
        if (window.MASTER_PLAN.academic) {
            const e1Academic = window.MASTER_PLAN.academic.find(a => a.id.toUpperCase() === 'E1');
            if (e1Academic && names.E1) {
                e1Academic.title = names.E1;
                e1Academic.project = names.E1;
            }

            const e2Academic = window.MASTER_PLAN.academic.find(a => a.id.toUpperCase() === 'E2');
            if (e2Academic && names.E2) {
                e2Academic.title = names.E2;
                e2Academic.project = names.E2;
            }

            const e3Academic = window.MASTER_PLAN.academic.find(a => a.id.toUpperCase() === 'E3');
            if (e3Academic && names.E3) {
                e3Academic.title = names.E3;
                e3Academic.project = names.E3;
            }
        }

        // Actualizar weeks
        if (window.MASTER_PLAN.weeks) {
            window.MASTER_PLAN.weeks.forEach(w => {
                if (w.eval === 'E1' && names.E1) w.project = names.E1;
                if (w.eval === 'E2' && names.E2) w.project = names.E2;
                if (w.eval === 'E3' && names.E3) w.project = names.E3;
            });
        }

        // Actualizar days
        if (window.MASTER_PLAN.days) {
            window.MASTER_PLAN.days.forEach(d => {
                if (d.eval === 'E1' && names.E1) d.project = names.E1;
                if (d.eval === 'E2' && names.E2) d.project = names.E2;
                if (d.eval === 'E3' && names.E3) d.project = names.E3;
            });
        }

        // Si existe el GanttRenderer, forzar actualización de sus nombres
        if (window.GanttRenderer) {
            // Actualizar config.evalNames si es accesible (no lo es directamente porque es una IIFE que devuelve un objeto)
            // Pero GanttRenderer.render() volverá a usar MASTER_PLAN si lo cambiamos arriba?
            // Mirando gantt-renderer.js, config.evalNames se inicializa una vez al cargar.
            // Hay que exponer una forma de actualizarlo o refrescarlo.

            // Forzamos un renderizado para que se vean los cambios si los títulos se sacan de MASTER_PLAN en el renderizado
            window.GanttRenderer.render();
        }
    }

    /**
     * Aplicar densidad de interfaz
     */
    applyDensity() {
        const density = this.settings.general.density;
        const body = document.body;

        body.classList.remove('density-compact', 'density-normal', 'density-spacious');
        body.classList.add(`density-${density}`);
    }

    /**
     * Aplicar tamaño de fuente
     */
    applyFontSize() {
        const fontSize = this.settings.general.fontSize;
        const root = document.documentElement;

        const sizes = {
            small: '14px',
            normal: '16px',
            large: '18px'
        };

        root.style.setProperty('--base-font-size', sizes[fontSize] || sizes.normal);
    }

    /**
     * Aplicar todas las configuraciones visuales
     */
    applyAll() {
        this.applyTheme();
        this.applyDensity();
        this.applyFontSize();
        this.applyProjectNames();
        this.applyProgressWidget();
        this.applyTrackingMode();
        this.applyTeamsConfig();
        this.applyIntegrations();
        this.applyAutoExport();
        this.applyNotifications();
        this.ensureWebhookListener();
        if (this.settings.general.language) {
            document.documentElement.lang = this.settings.general.language;
        }

        // Emitir evento
        window.dispatchEvent(new CustomEvent('settingsApplied', {
            detail: this.settings
        }));
    }

    /**
     * Aplicar configuraciones de notificaciones
     */
    applyNotifications() {
        if (window.NotificationManager && typeof window.NotificationManager.init === 'function') {
            window.NotificationManager.init();
        }
    }

    applyAutoExport() {
        if (this.autoExportTimer) {
            clearInterval(this.autoExportTimer);
            this.autoExportTimer = null;
        }

        const mode = this.settings.data?.autoExport || 'manual';
        if (mode === 'manual') return;

        this.checkAutoExport();
        this.autoExportTimer = setInterval(() => this.checkAutoExport(), 6 * 60 * 60 * 1000);
    }

    checkAutoExport() {
        const mode = this.settings.data?.autoExport || 'manual';
        if (mode === 'manual') return;

        if (mode === 'weekly') {
            const lastBackup = this.settings.data?.lastBackupDate
                ? new Date(this.settings.data.lastBackupDate)
                : null;
            const now = new Date();
            if (!lastBackup || (now - lastBackup) / (1000 * 60 * 60 * 24) >= 7) {
                this.exportAllDataNow('weekly');
            }
        }

        if (mode === 'evaluation') {
            this.checkEvaluationAutoExport();
        }
    }

    checkEvaluationAutoExport() {
        if (!window.ProgressManager) return;
        const state = this.getAutoExportState();
        const evaluations = ['E1', 'E2', 'E3'];

        evaluations.forEach(evalId => {
            const progress = window.ProgressManager.getEvaluationProgress(evalId);
            if (progress >= 1 && !state.evaluations[evalId]) {
                this.exportAllDataNow(`evaluation_${evalId}`);
                state.evaluations[evalId] = true;
            }
        });

        this.setAutoExportState(state);
    }

    exportAllDataNow(reason) {
        const exportData = {
            version: this.settings.advanced?.dataSchemaVersion || '2.2',
            exportDate: new Date().toISOString(),
            reason,
            settings: this.settings,
            progress: window.ProgressManager?.data,
            raTracker: window.raTracker?.data,
            progressTracker: window.ProgressTracker?.data
        };

        // Exportación local (siempre ocurre en auto-export)
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup_${reason}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        // Sincronización en la Nube (si está activa)
        if (this.settings.data?.cloudSync) {
            this.syncToCloud(exportData);
        }

        this.set('data', 'lastBackupDate', new Date().toISOString());
        this.saveSettings();
    }

    /**
     * Sincronizar datos con un proveedor de nube (Google Sheets o Webhook)
     */
    async syncToCloud(data) {
        const provider = this.settings.data?.cloudProvider;
        const gsheetsUrl = this.settings.data?.gsheetsUrl;
        const otherUrl = this.settings.data?.otherCloudUrl;

        let targetUrl = '';
        if (provider === 'gsheets') targetUrl = gsheetsUrl;
        else if (provider === 'other') targetUrl = otherUrl;

        if (!targetUrl) return;

        console.log(`☁️ Iniciando backup en la nube (${provider})...`);

        try {
            // Usamos un timeout para no bloquear
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            await fetch(targetUrl, {
                method: 'POST',
                mode: 'no-cors', // Necesario para Google Apps Script
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data),
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            console.log('✅ Datos enviados a la nube.');
        } catch (error) {
            console.error('❌ Error enviando a la nube:', error);
        }
    }

    ensureWebhookListener() {
        if (this.webhookListenerAttached) return;
        this.webhookListenerAttached = true;
        window.addEventListener('progressUpdated', () => {
            this.checkWebhookEvents();
            this.checkAutoExport();
        });
    }

    checkWebhookEvents() {
        const integrations = this.settings.integrations;
        if (!integrations?.enableWebhooks || !integrations.webhookUrl) return;

        const events = integrations.webhookEvents || [];
        const state = this.getWebhookState();
        const threshold = this.settings.evaluation?.weekCompletionThreshold || 100;

        if (events.includes('gate_completed') && window.ProgressTracker?.state?.gates) {
            Object.entries(window.ProgressTracker.state.gates).forEach(([weekId, gate]) => {
                if (gate?.passed && !state.gates[weekId]) {
                    this.sendWebhook('gate_completed', { weekId, timestamp: gate.timestamp });
                    state.gates[weekId] = true;
                }
            });
        }

        if (events.includes('week_completed') && window.MASTER_PLAN?.weeks && window.raTracker?.data?.timelineDods) {
            window.MASTER_PLAN.weeks.forEach(week => {
                const completion = this.getWeekCompletionPercent(week);
                if (completion === null) return;
                if (completion >= threshold && !state.weeks[week.week_id]) {
                    this.sendWebhook('week_completed', {
                        weekId: week.week_id,
                        eval: week.eval,
                        percent: completion
                    });
                    state.weeks[week.week_id] = true;
                }
            });
        }

        if (events.includes('evaluation_completed') && window.ProgressManager) {
            ['E1', 'E2', 'E3'].forEach(evalId => {
                const progress = window.ProgressManager.getEvaluationProgress(evalId);
                if (progress >= 1 && !state.evaluations[evalId]) {
                    this.sendWebhook('evaluation_completed', { eval: evalId });
                    state.evaluations[evalId] = true;
                }
            });
        }

        this.setWebhookState(state);
    }

    getWeekCompletionPercent(week) {
        if (!week?.week_id || !week?.gate?.conditions?.length) return null;
        const evalId = week.eval || week.week_id.split('-')[0];
        const weekNum = parseInt(week.week_id.split('S')[1], 10);
        if (!weekNum) return null;
        const total = week.gate.conditions.length;
        let completed = 0;

        week.gate.conditions.forEach((_, idx) => {
            const dodId = `${evalId}_week${weekNum}_dod${idx}`;
            if (window.raTracker?.data?.timelineDods?.[dodId]) {
                completed += 1;
            }
        });

        return total > 0 ? Math.round((completed / total) * 100) : 0;
    }

    sendWebhook(eventType, data) {
        const payload = {
            event: eventType,
            timestamp: new Date().toISOString(),
            data
        };

        fetch(this.settings.integrations.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(error => {
            console.warn('Error enviando webhook:', error);
        });
    }

    getWebhookState() {
        try {
            const stored = localStorage.getItem(this.webhookStateKey);
            if (stored) {
                return JSON.parse(stored);
            }
            const legacyStored = localStorage.getItem(this.getLegacyStorageKey('planificacion_webhook_state'));
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                localStorage.setItem(this.webhookStateKey, JSON.stringify(parsed));
                return parsed;
            }
        } catch (error) {
            console.warn('Error leyendo estado de webhooks:', error);
        }
        return { weeks: {}, evaluations: {}, gates: {} };
    }

    setWebhookState(state) {
        try {
            localStorage.setItem(this.webhookStateKey, JSON.stringify(state));
        } catch (error) {
            console.warn('Error guardando estado de webhooks:', error);
        }
    }

    getAutoExportState() {
        try {
            const stored = localStorage.getItem(this.autoExportStateKey);
            if (stored) {
                return JSON.parse(stored);
            }
            const legacyStored = localStorage.getItem(this.getLegacyStorageKey('planificacion_autoexport_state'));
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                localStorage.setItem(this.autoExportStateKey, JSON.stringify(parsed));
                return parsed;
            }
        } catch (error) {
            console.warn('Error leyendo estado de auto export:', error);
        }
        return { evaluations: {} };
    }

    setAutoExportState(state) {
        try {
            localStorage.setItem(this.autoExportStateKey, JSON.stringify(state));
        } catch (error) {
            console.warn('Error guardando estado de auto export:', error);
        }
    }

    applyProgressWidget() {
        const mode = this.settings.evaluation.showGlobalProgress || 'header';
        document.body.classList.toggle('progress-hidden', mode === 'hidden');
        document.body.classList.toggle('progress-sidebar', mode === 'sidebar');
    }

    applyTrackingMode() {
        if (!window.ProgressTracker?.state?.config) return;

        window.ProgressTracker.state.config.trackingMode = {
            ...window.ProgressTracker.state.config.trackingMode,
            ...this.settings.evaluation.trackingMode
        };
        window.ProgressTracker.saveToStorage();
    }

    applyTeamsConfig() {
        if (!window.ProgressTracker?.state?.config) return;

        const teamNames = this.settings.teams.teamNames || {};
        const teamIds = Object.keys(teamNames);
        const teams = Object.values(teamNames).filter(Boolean);
        if (teams.length) {
            window.ProgressTracker.state.config.teams = teams;
            if (!teams.includes(window.ProgressTracker.state.config.currentTeam)) {
                window.ProgressTracker.state.config.currentTeam = teams[0];
            }
            window.ProgressTracker.saveToStorage();
        }

        const students = this.settings.teams.students || [];
        const individualTeamId = this.settings.teams.individualTeamId;
        const teamMembers = {};
        teamIds.forEach(teamId => {
            teamMembers[teamId] = [];
        });
        students.forEach(student => {
            const teamId = student.individualized ? individualTeamId : student.teamId;
            if (!teamMembers[teamId]) {
                teamMembers[teamId] = [];
            }
            teamMembers[teamId].push(student.name);
        });
        this.settings.teams.teamMembers = teamMembers;

        const members = students
            .map(student => String(student.name).trim())
            .filter(Boolean);
        if (members.length) {
            const uniqueMembers = [...new Set(members)];
            window.ProgressTracker.state.config.users = uniqueMembers;
            if (!uniqueMembers.includes(window.ProgressTracker.state.config.currentUser)) {
                window.ProgressTracker.state.config.currentUser = uniqueMembers[0];
            }
            window.ProgressTracker.saveToStorage();
        }
    }

    applyIntegrations() {
        if (window.MASTER_PLAN?.config) {
            window.MASTER_PLAN.config.repoBaseUrl = this.settings.integrations.moodleBaseUrl;
        }
        window.FILE_NAMING_PATTERN = this.settings.integrations.fileNamingPattern;
    }

    /**
     * Obtener tamaño de datos almacenados
     */
    getStorageSize() {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return {
            bytes: total,
            kb: (total / 1024).toFixed(2),
            mb: (total / (1024 * 1024)).toFixed(2)
        };
    }

    /**
     * Merge profundo de objetos
     */
    deepMerge(target, source) {
        const output = { ...target };
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.deepMerge(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }
}

// Inicializar instancia global
window.SettingsManager = new SettingsManager();

// Aplicar configuraciones al cargar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.SettingsManager.applyAll();
    });
} else {
    window.SettingsManager.applyAll();
}

console.log('✅ Settings Manager loaded');
