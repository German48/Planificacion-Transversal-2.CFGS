/**
 * SETTINGS UI RENDERER - VERSIÓN ALUMNADO
 * Interfaz simplificada de configuraciones para estudiantes
 */

const SettingsUIStudent = {

    /**
     * Renderizar el modal de configuraciones para alumnado
     */
    render() {
        const settings = window.SettingsManager.settings;

        return `
            <div class="settings-modal-overlay" id="settings-modal-overlay" onclick="SettingsUIStudent.close(event)">
                <div class="settings-modal settings-modal-student" onclick="event.stopPropagation()">
                    <div class="settings-header">
                        <h2>⚙️ Mis Preferencias</h2>
                        <button class="settings-close-btn" onclick="SettingsUIStudent.close()">&times;</button>
                    </div>
                    
                    <div class="settings-body">
                        <div class="settings-sidebar">
                            <button class="settings-tab active" data-tab="appearance" onclick="SettingsUIStudent.switchTab('appearance')">
                                <span class="tab-icon">🎨</span>
                                <span class="tab-label">Apariencia</span>
                            </button>
                            <button class="settings-tab" data-tab="study" onclick="SettingsUIStudent.switchTab('study')">
                                <span class="tab-icon">📚</span>
                                <span class="tab-label">Estudio</span>
                            </button>
                            <button class="settings-tab" data-tab="notifications" onclick="SettingsUIStudent.switchTab('notifications')">
                                <span class="tab-icon">🔔</span>
                                <span class="tab-label">Notificaciones</span>
                            </button>
                            <button class="settings-tab" data-tab="myteam" onclick="SettingsUIStudent.switchTab('myteam')">
                                <span class="tab-icon">👥</span>
                                <span class="tab-label">Mi Equipo</span>
                            </button>
                            <button class="settings-tab" data-tab="help" onclick="SettingsUIStudent.switchTab('help')">
                                <span class="tab-icon">❓</span>
                                <span class="tab-label">Ayuda</span>
                            </button>
                        </div>
                        
                        <div class="settings-content">
                            ${this.renderAppearanceTab(settings.general, settings.student)}
                            ${this.renderStudyTab(settings.student)}
                            ${this.renderNotificationsTab(settings.student)}
                            ${this.renderMyTeamTab(settings.student)}
                            ${this.renderHelpTab()}
                        </div>
                    </div>
                    
                    <div class="settings-footer">
                        <button class="settings-btn settings-btn-secondary" onclick="SettingsUIStudent.resetToDefaults()">
                            🔄 Restablecer
                        </button>
                        <div class="settings-footer-right">
                            <button class="settings-btn settings-btn-secondary" onclick="SettingsUIStudent.close()">
                                Cancelar
                            </button>
                            <button class="settings-btn settings-btn-primary" onclick="SettingsUIStudent.save()">
                                💾 Guardar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Tab 1: Apariencia
     */
    renderAppearanceTab(general, student) {
        return `
            <div class="settings-tab-content active" data-tab-content="appearance">
                <h3>🎨 Apariencia y Visualización</h3>
                <p class="settings-description">Personaliza cómo ves la aplicación</p>
                
                <div class="settings-section">
                    <label class="settings-label">Tema Visual</label>
                    <select class="settings-input" id="setting-theme">
                        <option value="light" ${general.theme === 'light' ? 'selected' : ''}>☀️ Claro</option>
                        <option value="dark" ${general.theme === 'dark' ? 'selected' : ''}>🌙 Oscuro</option>
                        <option value="auto" ${general.theme === 'auto' ? 'selected' : ''}>🔄 Automático (según tu dispositivo)</option>
                    </select>
                    <small class="settings-hint">El tema oscuro puede ayudar a reducir la fatiga visual</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Tamaño de Texto</label>
                    <select class="settings-input" id="setting-fontSize">
                        <option value="small" ${general.fontSize === 'small' ? 'selected' : ''}>Pequeño</option>
                        <option value="normal" ${general.fontSize === 'normal' ? 'selected' : ''}>Normal (recomendado)</option>
                        <option value="large" ${general.fontSize === 'large' ? 'selected' : ''}>Grande</option>
                    </select>
                    <small class="settings-hint">Aumenta el tamaño si tienes dificultades para leer</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Densidad de Información</label>
                    <select class="settings-input" id="setting-density">
                        <option value="compact" ${general.density === 'compact' ? 'selected' : ''}>Compacta (ver más en pantalla)</option>
                        <option value="normal" ${general.density === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="spacious" ${general.density === 'spacious' ? 'selected' : ''}>Espaciosa (más aire)</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Vista al Iniciar</label>
                    <select class="settings-input" id="setting-defaultView">
                        <option value="daily" ${general.defaultView === 'daily' ? 'selected' : ''}>📋 Ficha del Día</option>
                        <option value="radar" ${general.defaultView === 'radar' ? 'selected' : ''}>📆 Calendario Mensual</option>
                        <option value="timeline" ${general.defaultView === 'timeline' ? 'selected' : ''}>🗓️ Timeline Semanal</option>
                    </select>
                    <small class="settings-hint">Elige qué vista ver primero al abrir la app</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-showWelcome" ${general.showWelcome ? 'checked' : ''}>
                        <span>Mostrar consejos al iniciar</span>
                    </label>
                </div>
            </div>
        `;
    },

    /**
     * Tab 2: Estudio y Enfoque
     */
    renderStudyTab(student) {
        const studySettings = student?.study || {
            focusMode: false,
            showOnlyMyTasks: false,
            highlightPending: true,
            hideCompleted: false,
            studyTimer: false,
            pomodoroLength: 25
        };

        return `
            <div class="settings-tab-content" data-tab-content="study">
                <h3>📚 Estudio y Enfoque</h3>
                <p class="settings-description">Configura herramientas para mejorar tu concentración</p>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-focusMode" ${studySettings.focusMode ? 'checked' : ''}>
                        <span>🎯 Modo Enfoque</span>
                    </label>
                    <small class="settings-hint">Oculta distracciones y resalta solo lo importante para hoy</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-showOnlyMyTasks" ${studySettings.showOnlyMyTasks ? 'checked' : ''}>
                        <span>👤 Mostrar solo mis tareas</span>
                    </label>
                    <small class="settings-hint">Oculta tareas de otros equipos</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-highlightPending" ${studySettings.highlightPending ? 'checked' : ''}>
                        <span>⚠️ Resaltar tareas pendientes</span>
                    </label>
                    <small class="settings-hint">Las tareas sin completar se mostrarán en rojo</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-hideCompleted" ${studySettings.hideCompleted ? 'checked' : ''}>
                        <span>✅ Ocultar tareas completadas</span>
                    </label>
                    <small class="settings-hint">Esconde automáticamente las tareas marcadas como hechas</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-studyTimer" ${studySettings.studyTimer ? 'checked' : ''}>
                        <span>⏱️ Activar temporizador Pomodoro</span>
                    </label>
                    <div class="settings-subsection" ${!studySettings.studyTimer ? 'style="display:none"' : ''}>
                        <label class="settings-label">Duración de cada sesión (minutos)</label>
                        <input type="number" class="settings-input" id="setting-pomodoroLength" 
                               min="15" max="60" step="5" value="${studySettings.pomodoroLength}">
                        <small class="settings-hint">Técnica Pomodoro: estudia concentrado, luego descansa 5 minutos</small>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Tab 3: Notificaciones y Recordatorios
     */
    renderNotificationsTab(student) {
        const notifSettings = student?.notifications || {
            enabled: true,
            pendingTasks: true,
            upcomingDeadlines: true,
            teamUpdates: false,
            soundEnabled: false,
            daysBeforeDeadline: 2
        };

        return `
            <div class="settings-tab-content" data-tab-content="notifications">
                <h3>🔔 Notificaciones y Recordatorios</h3>
                <p class="settings-description">Configura cómo y cuándo recibir avisos</p>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-notificationsEnabled" ${notifSettings.enabled ? 'checked' : ''}>
                        <span>🔔 Activar notificaciones</span>
                    </label>
                </div>
                
                <div class="settings-subsection" ${!notifSettings.enabled ? 'style="display:none"' : ''}>
                    <div class="settings-section">
                        <label class="settings-checkbox">
                            <input type="checkbox" id="setting-pendingTasks" ${notifSettings.pendingTasks ? 'checked' : ''}>
                            <span>📋 Avisar de tareas pendientes</span>
                        </label>
                    </div>
                    
                    <div class="settings-section">
                        <label class="settings-checkbox">
                            <input type="checkbox" id="setting-upcomingDeadlines" ${notifSettings.upcomingDeadlines ? 'checked' : ''}>
                            <span>⏰ Avisar de fechas de entrega próximas</span>
                        </label>
                        <div class="settings-subsection" ${!notifSettings.upcomingDeadlines ? 'style="display:none"' : ''}>
                            <label class="settings-label">Días de antelación</label>
                            <input type="number" class="settings-input" id="setting-daysBeforeDeadline" 
                                   min="1" max="7" value="${notifSettings.daysBeforeDeadline}">
                            <small class="settings-hint">Recibirás un aviso X días antes de cada entrega</small>
                        </div>
                    </div>
                    
                    <div class="settings-section">
                        <label class="settings-checkbox">
                            <input type="checkbox" id="setting-teamUpdates" ${notifSettings.teamUpdates ? 'checked' : ''}>
                            <span>👥 Avisar cuando mi equipo complete tareas</span>
                        </label>
                    </div>
                    
                    <div class="settings-section">
                        <label class="settings-checkbox">
                            <input type="checkbox" id="setting-soundEnabled" ${notifSettings.soundEnabled ? 'checked' : ''}>
                            <span>🔊 Sonido en notificaciones</span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Tab 4: Mi Equipo
     */
    renderMyTeamTab(student) {
        const teamSettings = student?.team || {
            myTeamId: 'Equipo01',
            showTeamProgress: true,
            showTeammates: true,
            celebrateAchievements: true
        };

        // Obtener equipos disponibles
        const teams = window.SettingsManager?.settings?.teams?.teamNames || {};

        return `
            <div class="settings-tab-content" data-tab-content="myteam">
                <h3>👥 Mi Equipo</h3>
                <p class="settings-description">Información y preferencias de tu equipo</p>
                
                <div class="settings-section">
                    <label class="settings-label">Mi Equipo</label>
                    <select class="settings-input" id="setting-myTeamId">
                        ${Object.keys(teams).map(teamId => `
                            <option value="${teamId}" ${teamSettings.myTeamId === teamId ? 'selected' : ''}>
                                ${teams[teamId]}
                            </option>
                        `).join('')}
                    </select>
                    <small class="settings-hint">Selecciona tu equipo para ver solo vuestro progreso</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-showTeamProgress" ${teamSettings.showTeamProgress ? 'checked' : ''}>
                        <span>📊 Mostrar progreso del equipo en el header</span>
                    </label>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-showTeammates" ${teamSettings.showTeammates ? 'checked' : ''}>
                        <span>👤 Mostrar quién completó cada tarea</span>
                    </label>
                    <small class="settings-hint">Ver qué compañero marcó cada DoD</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-celebrateAchievements" ${teamSettings.celebrateAchievements ? 'checked' : ''}>
                        <span>🎉 Celebrar logros con animaciones</span>
                    </label>
                    <small class="settings-hint">Confeti cuando tu equipo complete un hito 🎊</small>
                </div>
            </div>
        `;
    },

    /**
     * Tab 5: Ayuda y Tutoriales
     */
    renderHelpTab() {
        return `
            <div class="settings-tab-content" data-tab-content="help">
                <h3>❓ Ayuda y Guías</h3>
                <p class="settings-description">Recursos para aprender a usar la aplicación</p>
                
                <div class="settings-section">
                    <div class="help-card">
                        <h4>📖 Guía Rápida</h4>
                        <p>Aprende lo básico en 5 minutos</p>
                        <button class="settings-btn settings-btn-secondary" onclick="SettingsUIStudent.showQuickGuide()">
                            Ver Guía
                        </button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <div class="help-card">
                        <h4>🎯 ¿Qué son los DoD?</h4>
                        <p>Definition of Done: criterios para considerar una tarea terminada</p>
                        <button class="settings-btn settings-btn-secondary" onclick="SettingsUIStudent.showDoDExplanation()">
                            Más Info
                        </button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <div class="help-card">
                        <h4>🚦 Fases del Proyecto (Gates)</h4>
                        <p>F0-F5: Lanzamiento → Investigación → Diseño → Planificación → Fabricación → Cierre</p>
                        <button class="settings-btn settings-btn-secondary" onclick="SettingsUIStudent.showPhasesGuide()">
                            Ver Fases
                        </button>
                    </div>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Versión de la Aplicación</label>
                    <p class="settings-info">v2.0 - Panel de Alumnado</p>
                    <small class="settings-hint">Última actualización: Enero 2026</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Atajos de Teclado</label>
                    <div class="keyboard-shortcuts">
                        <div class="shortcut-item">
                            <kbd>←</kbd> <kbd>→</kbd>
                            <span>Navegar entre días</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Espacio</kbd>
                            <span>Marcar tarea como completada</span>
                        </div>
                        <div class="shortcut-item">
                            <kbd>Esc</kbd>
                            <span>Cerrar modal/ventana</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Abrir modal de configuraciones
     */
    open() {
        let modal = document.getElementById('settings-modal-overlay');
        if (!modal) {
            const container = document.createElement('div');
            container.innerHTML = this.render();
            document.body.appendChild(container.firstElementChild);
        } else {
            modal.style.display = 'flex';
        }
        document.body.style.overflow = 'hidden';
    },

    /**
     * Cerrar modal
     */
    close(event) {
        if (event && event.target !== event.currentTarget) return;
        const modal = document.getElementById('settings-modal-overlay');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    },

    /**
     * Cambiar de pestaña
     */
    switchTab(tabName) {
        document.querySelectorAll('.settings-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.settings-tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tabContent === tabName);
        });
    },

    /**
     * Guardar configuraciones
     */
    save() {
        const settings = window.SettingsManager.settings;

        // Asegurar que existe la sección student
        if (!settings.student) {
            settings.student = {
                study: {},
                notifications: {},
                team: {}
            };
        }

        // General (apariencia)
        settings.general.theme = document.getElementById('setting-theme').value;
        settings.general.fontSize = document.getElementById('setting-fontSize').value;
        settings.general.density = document.getElementById('setting-density').value;
        settings.general.defaultView = document.getElementById('setting-defaultView').value;
        settings.general.showWelcome = document.getElementById('setting-showWelcome').checked;

        // Estudio
        settings.student.study = {
            focusMode: document.getElementById('setting-focusMode')?.checked || false,
            showOnlyMyTasks: document.getElementById('setting-showOnlyMyTasks')?.checked || false,
            highlightPending: document.getElementById('setting-highlightPending')?.checked ?? true,
            hideCompleted: document.getElementById('setting-hideCompleted')?.checked || false,
            studyTimer: document.getElementById('setting-studyTimer')?.checked || false,
            pomodoroLength: parseInt(document.getElementById('setting-pomodoroLength')?.value || 25)
        };

        // Notificaciones
        settings.student.notifications = {
            enabled: document.getElementById('setting-notificationsEnabled')?.checked ?? true,
            pendingTasks: document.getElementById('setting-pendingTasks')?.checked ?? true,
            upcomingDeadlines: document.getElementById('setting-upcomingDeadlines')?.checked ?? true,
            teamUpdates: document.getElementById('setting-teamUpdates')?.checked || false,
            soundEnabled: document.getElementById('setting-soundEnabled')?.checked || false,
            daysBeforeDeadline: parseInt(document.getElementById('setting-daysBeforeDeadline')?.value || 2)
        };

        // Equipo
        settings.student.team = {
            myTeamId: document.getElementById('setting-myTeamId')?.value || 'Equipo01',
            showTeamProgress: document.getElementById('setting-showTeamProgress')?.checked ?? true,
            showTeammates: document.getElementById('setting-showTeammates')?.checked ?? true,
            celebrateAchievements: document.getElementById('setting-celebrateAchievements')?.checked ?? true
        };

        // Guardar y aplicar
        if (window.SettingsManager.saveSettings()) {
            window.SettingsManager.applyAll();
            alert('✅ Preferencias guardadas correctamente');
            this.close();
        } else {
            alert('❌ Error al guardar las preferencias');
        }
    },

    /**
     * Restablecer a valores por defecto
     */
    resetToDefaults() {
        if (confirm('¿Restablecer todas tus preferencias a valores por defecto?\n\nEsto NO borrará tu progreso ni tus entregas.')) {
            window.SettingsManager.resetToDefaults(true);
            this.close();
            setTimeout(() => this.open(), 100);
            alert('✅ Preferencias restablecidas');
        }
    },

    /**
     * Mostrar guía rápida
     */
    showQuickGuide() {
        alert(`📖 GUÍA RÁPIDA\n\n1️⃣ CALENDARIO: Ve el mes completo y haz clic en un día\n2️⃣ TIMELINE: Semanas con DoDs (Definition of Done)\n3️⃣ FICHA DIARIA: Tareas y evidencias del día\n4️⃣ MARCA LOS DoD: Checkbox verdes cuando completes tareas\n5️⃣ REVISA TU PROGRESO: Widget superior derecho\n\n💡 Consejo: Marca los DoDs a diario para no olvidar qué has hecho.`);
    },

    /**
     * Explicación de DoD
     */
    showDoDExplanation() {
        alert(`🎯 DEFINITION OF DONE (DoD)\n\n"Definition of Done" son los CRITERIOS que deben cumplirse para considerar una tarea TERMINADA.\n\nEjemplo:\n✅ Plano de conjunto dibujado\n✅ 3 vistas (planta, alzado, perfil)\n✅ Acotación completa\n✅ PDF subido a Moodle\n\nSi falta UNO, la tarea NO está terminada.\n\n💡 Los DoD evitan malentendidos: todos sabemos QUÉ significa "hecho".`);
    },

    /**
     * Guía de fases
     */
    showPhasesGuide() {
        alert(`🚦 FASES DEL PROYECTO (GATES)\n\nF0 🚀 Lanzamiento\n→ Comprender el encargo\n\nF1 🔍 Investigación\n→ Buscar referencias y generar ideas\n\nF2 📐 Diseño/Representación\n→ Planos y documentación técnica\n\nF3 📋 Planificación\n→ Material, proceso, tiempos\n\nF4 🔨 Fabricación/Prototipo\n→ Construir el producto\n\nF5 🎯 Cierre/Entrega\n→ Dossier, presentación, entrega\n\n💡 Cada fase tiene un "gate" (hito) que hay que superar para avanzar.`);
    }
};

// Exponer globalmente
window.SettingsUIStudent = SettingsUIStudent;

console.log('✅ Settings UI Student loaded');

