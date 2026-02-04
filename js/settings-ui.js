/**
 * SETTINGS UI RENDERER
 * Generador de interfaz para el panel de configuraciones
 */

const SettingsUI = {

    /**
     * Renderizar el modal completo de configuraciones
     */
    render() {
        const settings = window.SettingsManager.settings;

        return `
            <div class="settings-modal-overlay" id="settings-modal-overlay" onclick="SettingsUI.close(event)">
                <div class="settings-modal" onclick="event.stopPropagation()">
                    <div class="settings-header">
                        <h2>⚙️ Configuraciones del Sistema</h2>
                        <button class="settings-close-btn" onclick="SettingsUI.close()">&times;</button>
                    </div>
                    
                    <div class="settings-body">
                        <div class="settings-sidebar">
                            <button class="settings-tab active" data-tab="general" onclick="SettingsUI.switchTab('general')">
                                <span class="tab-icon">🎨</span>
                                <span class="tab-label">General</span>
                            </button>
                            <button class="settings-tab" data-tab="evaluation" onclick="SettingsUI.switchTab('evaluation')">
                                <span class="tab-icon">📊</span>
                                <span class="tab-label">Evaluación</span>
                            </button>
                            <button class="settings-tab" data-tab="pedagogical" onclick="SettingsUI.switchTab('pedagogical')">
                                <span class="tab-icon">📚</span>
                                <span class="tab-label">Pedagógico</span>
                            </button>
                            <button class="settings-tab" data-tab="data" onclick="SettingsUI.switchTab('data')">
                                <span class="tab-icon">💾</span>
                                <span class="tab-label">Datos</span>
                            </button>
                            <button class="settings-tab" data-tab="teams" onclick="SettingsUI.switchTab('teams')">
                                <span class="tab-icon">👥</span>
                                <span class="tab-label">Equipos</span>
                            </button>
                            <button class="settings-tab" data-tab="students" onclick="SettingsUI.switchTab('students')">
                                <span class="tab-icon">🧑‍🎓</span>
                                <span class="tab-label">Alumnados</span>
                            </button>
                            <button class="settings-tab" data-tab="integrations" onclick="SettingsUI.switchTab('integrations')">
                                <span class="tab-icon">🔗</span>
                                <span class="tab-label">Integraciones</span>
                            </button>
                            <button class="settings-tab" data-tab="advanced" onclick="SettingsUI.switchTab('advanced')">
                                <span class="tab-icon">🛠️</span>
                                <span class="tab-label">Avanzado</span>
                            </button>
                        </div>
                        
                        <div class="settings-content">
                            ${this.renderGeneralTab(settings.general)}
                            ${this.renderEvaluationTab(settings.evaluation)}
                            ${this.renderPedagogicalTab(settings.pedagogical)}
                            ${this.renderDataTab(settings.data)}
                            ${this.renderTeamsTab(settings.teams)}
                            ${this.renderStudentsTab(settings.teams)}
                            ${this.renderIntegrationsTab(settings.integrations)}
                            ${this.renderAdvancedTab(settings.advanced)}
                        </div>
                    </div>
                    
                    <div class="settings-footer">
                        <button class="settings-btn settings-btn-secondary" onclick="SettingsUI.resetToDefaults()">
                            🔄 Restablecer
                        </button>
                        <div class="settings-footer-right">
                            <button class="settings-btn settings-btn-secondary" onclick="SettingsUI.close()">
                                Cancelar
                            </button>
                            <button class="settings-btn settings-btn-primary" onclick="SettingsUI.save()">
                                💾 Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Tab 1: General y Personalización
     */
    renderGeneralTab(general) {
        return `
            <div class="settings-tab-content active" data-tab-content="general">
                <h3>🎨 General y Personalización</h3>
                <p class="settings-description">Ajusta la apariencia y comportamiento general del sistema</p>
                
                <div class="settings-section">
                    <label class="settings-label">Tema Visual</label>
                    <select class="settings-input" id="setting-theme">
                        <option value="light" ${general.theme === 'light' ? 'selected' : ''}>☀️ Claro</option>
                        <option value="dark" ${general.theme === 'dark' ? 'selected' : ''}>🌙 Oscuro</option>
                        <option value="auto" ${general.theme === 'auto' ? 'selected' : ''}>🔄 Automático</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Densidad de Información</label>
                    <select class="settings-input" id="setting-density">
                        <option value="compact" ${general.density === 'compact' ? 'selected' : ''}>Compacto</option>
                        <option value="normal" ${general.density === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="spacious" ${general.density === 'spacious' ? 'selected' : ''}>Espacioso</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Tamaño de Fuente</label>
                    <select class="settings-input" id="setting-fontSize">
                        <option value="small" ${general.fontSize === 'small' ? 'selected' : ''}>Pequeño (14px)</option>
                        <option value="normal" ${general.fontSize === 'normal' ? 'selected' : ''}>Normal (16px)</option>
                        <option value="large" ${general.fontSize === 'large' ? 'selected' : ''}>Grande (18px)</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Idioma</label>
                    <select class="settings-input" id="setting-language">
                        <option value="es" ${general.language === 'es' ? 'selected' : ''}>🇪🇸 Español</option>
                        <option value="ca" ${general.language === 'ca' ? 'selected' : ''}>🇪🇸 Valenciano</option>
                        <option value="en" ${general.language === 'en' ? 'selected' : ''}>🇬🇧 English</option>
                    </select>
                    <small class="settings-hint">⚠️ Requiere recarga de la página</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Vista por Defecto al Iniciar</label>
                    <select class="settings-input" id="setting-defaultView">
                        <option value="daily" ${general.defaultView === 'daily' ? 'selected' : ''}>📋 Diario</option>
                        <option value="radar" ${general.defaultView === 'radar' ? 'selected' : ''}>📆 Radar Mensual</option>
                        <option value="timeline" ${general.defaultView === 'timeline' ? 'selected' : ''}>🗓️ Timeline Semanal</option>
                        <option value="ra-dashboard" ${general.defaultView === 'ra-dashboard' ? 'selected' : ''}>📑 Dashboard RA</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-showWelcome" ${general.showWelcome ? 'checked' : ''}>
                        <span>Mostrar mensaje de bienvenida al iniciar</span>
                    </label>
                </div>
            </div>
        `;
    },

    /**
     * Tab 2: Evaluación y Seguimiento
     */
    renderEvaluationTab(evaluation) {
        return `
            <div class="settings-tab-content" data-tab-content="evaluation">
                <h3>📊 Evaluación y Seguimiento</h3>
                <p class="settings-description">Configura cómo se calcula y muestra el progreso</p>
                
                <div class="settings-section">
                    <label class="settings-label">Umbral de Completitud Semanal (%)</label>
                    <div class="settings-range-group">
                        <input type="range" class="settings-range" id="setting-weekThreshold" 
                               min="0" max="100" step="5" value="${evaluation.weekCompletionThreshold}"
                               oninput="document.getElementById('weekThresholdValue').textContent = this.value + '%'">
                        <span class="settings-range-value" id="weekThresholdValue">${evaluation.weekCompletionThreshold}%</span>
                    </div>
                    <small class="settings-hint">Porcentaje mínimo de DoDs marcados para considerar una semana superada</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Ponderación de Evaluaciones</label>
                    <div class="settings-weights-grid">
                        <div class="settings-weight-item">
                            <label>E1 (Anteproyecto)</label>
                            <input type="number" class="settings-input-small" id="setting-weight-e1" 
                                   min="0" max="100" value="${evaluation.evaluationWeights.E1}">
                            <span>%</span>
                        </div>
                        <div class="settings-weight-item">
                            <label>E2 (Ejecutivo)</label>
                            <input type="number" class="settings-input-small" id="setting-weight-e2" 
                                   min="0" max="100" value="${evaluation.evaluationWeights.E2}">
                            <span>%</span>
                        </div>
                        <div class="settings-weight-item">
                            <label>FEOE (Empresa)</label>
                            <input type="number" class="settings-input-small" id="setting-weight-feoe" 
                                   min="0" max="100" value="${evaluation.evaluationWeights.FEOE}">
                            <span>%</span>
                        </div>
                    </div>
                    <small class="settings-hint">Suma total debe ser 100%</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Modo de Seguimiento por Módulo</label>
                    <div class="settings-tracking-grid">
                        ${['DDR', 'IYO', 'ATZ', 'GNE', 'PIM'].map(mod => `
                            <div class="settings-tracking-item">
                                <span class="settings-tracking-label">${mod}</span>
                                <select class="settings-input-small settings-tracking-select" id="setting-tracking-${mod.toLowerCase()}">
                                    <option value="team" ${evaluation.trackingMode[mod] === 'team' ? 'selected' : ''}>👥 Equipo</option>
                                    <option value="individual" ${evaluation.trackingMode[mod] === 'individual' ? 'selected' : ''}>👤 Individual</option>
                                </select>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Mostrar Progreso Global</label>
                    <select class="settings-input" id="setting-showGlobalProgress">
                        <option value="header" ${evaluation.showGlobalProgress === 'header' ? 'selected' : ''}>En Header</option>
                        <option value="sidebar" ${evaluation.showGlobalProgress === 'sidebar' ? 'selected' : ''}>En Sidebar</option>
                        <option value="hidden" ${evaluation.showGlobalProgress === 'hidden' ? 'selected' : ''}>Oculto</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-delayAlerts" ${evaluation.delayAlerts ? 'checked' : ''}>
                        <span>Activar alertas de retraso</span>
                    </label>
                    <div class="settings-subsection" ${!evaluation.delayAlerts ? 'style="display:none"' : ''}>
                        <label class="settings-label">Días sin marcar DoDs antes de alerta</label>
                        <input type="number" class="settings-input" id="setting-delayThreshold" 
                               min="1" max="7" value="${evaluation.delayThresholdDays}">
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Tab 3: Configuraciones Pedagógicas
     */
    renderPedagogicalTab(pedagogical) {
        const holidayLines = (pedagogical.holidays || [])
            .map(date => this.formatHolidayDateForDisplay(date))
            .join('\n');
        return `
            <div class="settings-tab-content" data-tab-content="pedagogical">
                <h3>📚 Configuraciones Pedagógicas</h3>
                <p class="settings-description">Personaliza elementos pedagógicos del sistema</p>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-allowEditPedagogical" ${pedagogical.allowEditPedagogicalBlocks ? 'checked' : ''}>
                        <span>Permitir edición de bloques pedagógicos (Sentido e Intencionalidad)</span>
                    </label>
                    <small class="settings-hint">Si se activa, podrás modificar los textos directamente desde la interfaz</small>
                </div>

                <div class="settings-section">
                    <label class="settings-label">Nombres de Proyectos Personalizados (E1, E2, FEOE)</label>
                    <div class="settings-subsection">
                        <label>E1 (Anteproyecto):</label>
                        <input type="text" class="settings-input" id="setting-project-e1" value="${pedagogical.projectNames?.E1 || ''}" placeholder="Nombre del proyecto E1">
                    </div>
                    <div class="settings-subsection">
                        <label>E2 (Ejecutivo):</label>
                        <input type="text" class="settings-input" id="setting-project-e2" value="${pedagogical.projectNames?.E2 || ''}" placeholder="Nombre del proyecto E2">
                    </div>
                    <div class="settings-subsection">
                        <label>FEOE (Empresa/Dual):</label>
                        <input type="text" class="settings-input" id="setting-project-feoe" value="${pedagogical.projectNames?.FEOE || ''}" placeholder="Nombre del proyecto FEOE">
                    </div>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-showInstitutional" ${pedagogical.showInstitutionalPanel ? 'checked' : ''}>
                        <span>Mostrar panel institucional de evaluación</span>
                    </label>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Fechas Festivas Personalizadas</label>
                    <textarea class="settings-textarea" id="setting-holidays" placeholder="Introduce fechas en formato DD/MM/AAAA, una por línea&#10;Ejemplo:&#10;06/12/2025&#10;25/12/2025">${holidayLines}</textarea>
                    <small class="settings-hint">Estas fechas se marcaran en el calendario y no contaran para alertas de retraso</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Plantillas de Rúbricas (JSON)</label>
                    <textarea class="settings-textarea" id="setting-rubrics" placeholder='[{"name": "Rúbrica F0", "criteria": [...]}]'>${JSON.stringify(pedagogical.rubricTemplates || [], null, 2)}</textarea>
                    <small class="settings-hint">Define plantillas de rúbricas reutilizables</small>
                </div>
            </div>
        `;
    },

    /**
     * Tab 4: Datos y Copias de Seguridad
     */
    renderDataTab(data) {
        const storageSize = window.SettingsManager.getStorageSize();

        return `
            <div class="settings-tab-content" data-tab-content="data">
                <h3>💾 Datos y Copias de Seguridad</h3>
                <p class="settings-description">Gestiona exportaciones y respaldos del sistema</p>
                
                <div class="settings-section">
                    <label class="settings-label">Exportación Automática</label>
                    <select class="settings-input" id="setting-autoExport">
                        <option value="manual" ${data.autoExport === 'manual' ? 'selected' : ''}>Manual</option>
                        <option value="weekly" ${data.autoExport === 'weekly' ? 'selected' : ''}>Cada Semana</option>
                        <option value="evaluation" ${data.autoExport === 'evaluation' ? 'selected' : ''}>Cada Evaluación</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Formato de Exportación</label>
                    <select class="settings-input" id="setting-exportFormat">
                        <option value="json" ${data.exportFormat === 'json' ? 'selected' : ''}>JSON (completo)</option>
                        <option value="csv" ${data.exportFormat === 'csv' ? 'selected' : ''}>CSV (tabular)</option>
                        <option value="pdf" ${data.exportFormat === 'pdf' ? 'selected' : ''}>PDF (dossier)</option>
                    </select>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Sincronización con Nube</label>
                    <select class="settings-input" id="setting-cloudProvider" onchange="SettingsUI.toggleCloudInputs(this.value)">
                        <option value="none" ${data.cloudProvider === 'none' ? 'selected' : ''}>❌ Desactivada</option>
                        <option value="gsheets" ${data.cloudProvider === 'gsheets' ? 'selected' : ''}>📊 Google Sheets (Auto-Sync)</option>
                        <option value="other" ${data.cloudProvider === 'other' ? 'selected' : ''}>☁️ Otra Nube (Webhook/API)</option>
                        <option value="gdrive" ${data.cloudProvider === 'gdrive' ? 'selected' : ''}>📁 Google Drive (Manual)</option>
                        <option value="onedrive" ${data.cloudProvider === 'onedrive' ? 'selected' : ''}>☁️ OneDrive (Manual)</option>
                    </select>
                </div>

                <div id="gsheets-settings" class="settings-section" style="display: ${data.cloudProvider === 'gsheets' ? 'block' : 'none'}">
                    <label class="settings-label">URL de Google Apps Script</label>
                    <input type="url" class="settings-input" id="setting-gsheetsUrl" value="${data.gsheetsUrl || ''}" placeholder="https://script.google.com/macros/s/.../exec">
                    <small class="settings-hint">Introduce la URL del script publicado como Aplicación Web.</small>
                </div>

                <div id="other-cloud-settings" class="settings-section" style="display: ${data.cloudProvider === 'other' ? 'block' : 'none'}">
                    <label class="settings-label">URL del Servidor / Webhook</label>
                    <input type="url" class="settings-input" id="setting-otherCloudUrl" value="${data.otherCloudUrl || ''}" placeholder="https://api.tuservidor.com/backup">
                    <small class="settings-hint">Se enviará un POST con el JSON de respaldo.</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Tamaño de Datos Almacenados</label>
                    <div class="settings-storage-info">
                        <div class="storage-metric">
                            <span class="storage-value">${storageSize.kb}</span>
                            <span class="storage-unit">KB</span>
                        </div>
                        <div class="storage-metric">
                            <span class="storage-value">${storageSize.mb}</span>
                            <span class="storage-unit">MB</span>
                        </div>
                    </div>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Última Copia de Seguridad</label>
                    <p class="settings-info">${data.lastBackupDate ? new Date(data.lastBackupDate).toLocaleString('es-ES') : 'Nunca'}</p>
                </div>
                
                <div class="settings-section">
                    <div class="settings-button-group">
                        <button class="settings-btn settings-btn-primary" onclick="SettingsUI.exportAllData()">
                            📤 Exportar Todos los Datos
                        </button>
                        <button class="settings-btn settings-btn-secondary" onclick="SettingsUI.importData()">
                            📥 Importar Datos
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Tab 5: Gestión de Equipos
     */
    renderTeamsTab(teams) {
        const teamIds = this.getTeamIds(teams);
        return `
            <div class="settings-tab-content" data-tab-content="teams">
                <h3>👥 Gestión de Equipos</h3>
                <p class="settings-description">Configura equipos, miembros y liderazgos</p>
                
                <div class="settings-section">
                    <label class="settings-label">Nombres de Equipos Personalizados</label>
                    <div class="settings-teams-grid">
                        ${teamIds.map(teamId => `
                            <div class="settings-team-item">
                                <label>${teamId}</label>
                                <input type="text" class="settings-input" 
                                       data-team-id="${teamId}" 
                                       value="${teams.teamNames[teamId]}"
                                       placeholder="Nombre personalizado">
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-autoRotateLeaders" ${teams.autoRotateLeaders ? 'checked' : ''}>
                        <span>Rotar liderazgos automáticamente</span>
                    </label>
                    <small class="settings-hint">Cada semana se asigna automáticamente un nuevo equipo líder</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-requirePin" ${teams.requirePinForReset ? 'checked' : ''}>
                        <span>Requiere PIN para reiniciar progreso</span>
                    </label>
                    <div class="settings-subsection" ${!teams.requirePinForReset ? 'style="display:none"' : ''}>
                        <label class="settings-label">PIN de Seguridad (4 dígitos)</label>
                        <input type="password" class="settings-input" id="setting-resetPin" 
                               maxlength="4" pattern="[0-9]{4}" 
                               value="${teams.resetPin}"
                               placeholder="0000">
                    </div>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-studentPreview" ${teams.studentViewPreview ? 'checked' : ''}>
                        <span>Habilitar vista previa del alumno</span>
                    </label>
                    <small class="settings-hint">Permite previsualizar cómo ven los estudiantes la interfaz sin cambiar de archivo</small>
                </div>
            </div>
        `;
    },

    renderStudentsTab(teams) {
        const teamIds = this.getTeamIds(teams);
        const students = Array.isArray(teams.students) ? teams.students : [];
        const rows = students.length
            ? students.map((student, index) => this.renderStudentRow(student, `row-${index}`, teamIds, teams)).join('')
            : '<div class="students-empty">No hay alumnado registrado.</div>';

        return `
            <div class="settings-tab-content" data-tab-content="students">
                <h3>🧑‍🎓 Alumnados</h3>
                <p class="settings-description">Define el alumnado y su equipo. Marca individualizado para sincronizarlo con el equipo fijo.</p>

                <div class="settings-section">
                    <div class="students-toolbar">
                        <button class="settings-btn settings-btn-secondary" type="button" onclick="SettingsUI.addStudentRow()">➕ Añadir alumno</button>
                        <span class="settings-hint">Equipo fijo: ${this.getIndividualTeamLabel(teams)}</span>
                    </div>
                    <div class="students-table" id="students-list">
                        <div class="students-header">
                            <span>Nombre</span>
                            <span>Equipo</span>
                            <span>Individual</span>
                            <span></span>
                        </div>
                        ${rows}
                    </div>
                </div>
            </div>
        `;
    },

    renderStudentRow(student, rowId, teamIds, teams) {
        const individualTeamId = teams.individualTeamId || teamIds[0];
        const label = teams.teamNames?.[individualTeamId] || individualTeamId;
        const isIndividual = !!student.individualized;
        const teamValue = isIndividual ? individualTeamId : (student.teamId || individualTeamId);
        const teamOptions = teamIds.map(id => `
            <option value="${id}" ${teamValue === id ? 'selected' : ''}>${teams.teamNames?.[id] || id}</option>
        `).join('');

        return `
            <div class="students-row" data-student-row="${rowId}">
                <input type="text" class="settings-input" data-student-field="name" value="${student.name || ''}" placeholder="Nombre alumno">
                <select class="settings-input" data-student-field="teamId" ${isIndividual ? 'disabled' : ''}>
                    ${teamOptions}
                </select>
                <label class="settings-checkbox-inline">
                    <input type="checkbox" data-student-field="individualized" ${isIndividual ? 'checked' : ''}
                           onchange="SettingsUI.toggleStudentIndividual('${rowId}')">
                    <span>Sí</span>
                </label>
                <button class="student-remove-btn" type="button" onclick="SettingsUI.removeStudentRow('${rowId}')">🗑️</button>
            </div>
        `;
    },

    /**
     * Tab 6: Integraciones Externas
     */
    renderIntegrationsTab(integrations) {
        return `
            <div class="settings-tab-content" data-tab-content="integrations">
                <h3>🔗 Integraciones Externas</h3>
                <p class="settings-description">Conecta con plataformas y servicios externos</p>
                
                <div class="settings-section">
                    <label class="settings-label">URL Base del Repositorio Moodle</label>
                    <input type="url" class="settings-input" id="setting-moodleUrl" 
                           value="${integrations.moodleBaseUrl}"
                           placeholder="https://moodle.example.com/mod/folder/">
                    <small class="settings-hint">URL base para enlaces a evidencias en Moodle</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Patrón de Nomenclatura de Archivos</label>
                    <input type="text" class="settings-input" id="setting-filePattern" 
                           value="${integrations.fileNamingPattern}"
                           placeholder="{eval}_{team}_{file}">
                    <small class="settings-hint">Variables: {eval}, {team}, {file}, {date}, {module}</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-enableWebhooks" ${integrations.enableWebhooks ? 'checked' : ''}>
                        <span>Activar Webhooks</span>
                    </label>
                    <div class="settings-subsection" ${!integrations.enableWebhooks ? 'style="display:none"' : ''}>
                        <label class="settings-label">URL del Webhook</label>
                        <input type="url" class="settings-input" id="setting-webhookUrl" 
                               value="${integrations.webhookUrl}"
                               placeholder="https://discord.com/api/webhooks/...">
                        <small class="settings-hint">Envía notificaciones a Discord, Slack, etc.</small>
                        
                        <label class="settings-label">Eventos a Notificar</label>
                        <div class="settings-checkboxes-group">
                            <label class="settings-checkbox">
                                <input type="checkbox" value="gate_completed" ${integrations.webhookEvents?.includes('gate_completed') ? 'checked' : ''}>
                                <span>Gate completado</span>
                            </label>
                            <label class="settings-checkbox">
                                <input type="checkbox" value="week_completed" ${integrations.webhookEvents?.includes('week_completed') ? 'checked' : ''}>
                                <span>Semana completada</span>
                            </label>
                            <label class="settings-checkbox">
                                <input type="checkbox" value="evaluation_completed" ${integrations.webhookEvents?.includes('evaluation_completed') ? 'checked' : ''}>
                                <span>Evaluación completada</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Tab 7: Avanzado y Desarrollo
     */
    renderAdvancedTab(advanced) {
        return `
            <div class="settings-tab-content" data-tab-content="advanced">
                <h3>🛠️ Avanzado y Desarrollo</h3>
                <p class="settings-description">Opciones para desarrolladores y depuración</p>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-debugMode" ${advanced.debugMode ? 'checked' : ''}>
                        <span>Modo Debug (mostrar logs en consola)</span>
                    </label>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-serviceWorker" ${advanced.enableServiceWorker ? 'checked' : ''}>
                        <span>Activar Service Worker (PWA)</span>
                    </label>
                    <small class="settings-hint">⚠️ Requiere recarga de la página</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-performanceMode" ${advanced.performanceMode ? 'checked' : ''}>
                        <span>Modo Rendimiento (reducir animaciones)</span>
                    </label>
                </div>
                
                <div class="settings-section">
                    <label class="settings-checkbox">
                        <input type="checkbox" id="setting-experimental" ${advanced.experimentalFeatures ? 'checked' : ''}>
                        <span>Activar características experimentales</span>
                    </label>
                    <small class="settings-hint">⚠️ Puede contener funciones inestables</small>
                </div>
                
                <div class="settings-section">
                    <label class="settings-label">Versión del Schema de Datos</label>
                    <p class="settings-info">${advanced.dataSchemaVersion}</p>
                </div>
                
                <div class="settings-section">
                    <div class="settings-button-group">
                        <button class="settings-btn settings-btn-warning" onclick="SettingsUI.clearCache()">
                            🗑️ Limpiar Caché
                        </button>
                        <button class="settings-btn settings-btn-secondary" onclick="window.SettingsManager.exportSettings()">
                            📤 Exportar Configuración
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Abrir modal de configuraciones
     */
    open() {
        // Crear el modal si no existe
        let modal = document.getElementById('settings-modal-overlay');
        if (!modal) {
            const container = document.createElement('div');
            container.innerHTML = this.render();
            document.body.appendChild(container.firstElementChild);
        } else {
            modal.style.display = 'flex';
        }

        // Prevenir scroll del body
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
        // Actualizar botones
        document.querySelectorAll('.settings-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        // Actualizar contenido
        document.querySelectorAll('.settings-tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tabContent === tabName);
        });
    },

    toggleCloudInputs(provider) {
        const gsheets = document.getElementById('gsheets-settings');
        const other = document.getElementById('other-cloud-settings');
        if (gsheets) gsheets.style.display = (provider === 'gsheets' ? 'block' : 'none');
        if (other) other.style.display = (provider === 'other' ? 'block' : 'none');
    },

    isValidUrl(value) {
        if (!value) return true;
        try {
            const parsed = new URL(value);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch (error) {
            return false;
        }
    },

    validateSettings(settings) {
        const errors = [];
        const weights = settings.evaluation.evaluationWeights;
        const weightValues = [weights.E1 || 0, weights.E2 || 0, weights.FEOE || 0];
        const sum = weightValues.reduce((total, value) => total + value, 0);

        if (weightValues.some(value => Number.isNaN(value))) {
            errors.push('La ponderacion de evaluaciones debe ser numerica.');
        } else if (sum !== 100) {
            errors.push('La ponderacion de evaluaciones debe sumar 100%.');
        }

        if (settings.teams.requirePinForReset && !/^\d{4}$/.test(settings.teams.resetPin)) {
            errors.push('El PIN de seguridad debe tener 4 digitos cuando esta activado.');
        }

        if (!this.isValidUrl(settings.integrations.moodleBaseUrl)) {
            errors.push('La URL base de Moodle debe ser valida (http o https).');
        }

        if (settings.integrations.enableWebhooks) {
            if (!settings.integrations.webhookUrl) {
                errors.push('Debes indicar una URL de webhook cuando las notificaciones estan activas.');
            } else if (!this.isValidUrl(settings.integrations.webhookUrl)) {
                errors.push('La URL del webhook debe ser valida (http o https).');
            }
        }

        return errors;
    },

    normalizeHolidayDate(value) {
        const trimmed = value.trim();
        const europeanMatch = trimmed.match(/^(\d{2})[\/\-](\d{2})[\/\-](\d{4})$/);
        if (europeanMatch) {
            return `${europeanMatch[3]}-${europeanMatch[2]}-${europeanMatch[1]}`;
        }
        return trimmed;
    },

    formatHolidayDateForDisplay(value) {
        const trimmed = String(value || '').trim();
        const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (match) {
            return `${match[3]}/${match[2]}/${match[1]}`;
        }
        return trimmed;
    },

    getTeamIds(teams) {
        const teamNames = teams?.teamNames || {};
        const teamIds = Object.keys(teamNames)
            .filter(key => /^Equipo\d{2}$/.test(key))
            .sort()
            .slice(0, 6);
        if (teamIds.length) return teamIds;
        return ['Equipo01', 'Equipo02', 'Equipo03', 'Equipo04', 'Equipo05', 'Equipo06'];
    },

    getIndividualTeamLabel(teams) {
        const teamIds = this.getTeamIds(teams);
        const individualTeamId = teams?.individualTeamId || teamIds[0];
        const name = teams?.teamNames?.[individualTeamId] || individualTeamId;
        return name;
    },

    addStudentRow() {
        const container = document.getElementById('students-list');
        if (!container) return;
        const empty = container.querySelector('.students-empty');
        if (empty) {
            empty.remove();
        }
        const teams = window.SettingsManager?.settings?.teams || {};
        const teamIds = this.getTeamIds(teams);
        const rowId = `row-${Date.now()}`;
        const rowHtml = this.renderStudentRow({ name: '', teamId: teamIds[0], individualized: false }, rowId, teamIds, teams);
        container.insertAdjacentHTML('beforeend', rowHtml);
    },

    removeStudentRow(rowId) {
        const row = document.querySelector(`[data-student-row="${rowId}"]`);
        if (row) {
            row.remove();
        }
    },

    toggleStudentIndividual(rowId) {
        const row = document.querySelector(`[data-student-row="${rowId}"]`);
        if (!row) return;
        const checkbox = row.querySelector('[data-student-field="individualized"]');
        const select = row.querySelector('[data-student-field="teamId"]');
        const teams = window.SettingsManager?.settings?.teams || {};
        const teamIds = this.getTeamIds(teams);
        const individualTeamId = teams.individualTeamId || teamIds[0];
        if (checkbox?.checked) {
            if (select) {
                select.value = individualTeamId;
                select.disabled = true;
            }
        } else if (select) {
            select.disabled = false;
        }
    },

    buildTeamMembersFromStudents(students, teamIds, individualTeamId) {
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
        return teamMembers;
    },

    generateStudentId(name, index) {
        const base = name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '');
        return `${base || 'alumno'}-${index + 1}`;
    },

    formatTeamMembersForDisplay(members) {
        if (!Array.isArray(members)) return '';
        return members.filter(Boolean).join('\n');
    },

    parseTeamMembersText(value) {
        return value
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
    },

    /**
     * Guardar todos los cambios
     */
    save() {
        const previousLanguage = window.SettingsManager.settings.general.language;
        const settings = JSON.parse(JSON.stringify(window.SettingsManager.settings));

        // General
        settings.general.theme = document.getElementById('setting-theme').value;
        settings.general.density = document.getElementById('setting-density').value;
        settings.general.fontSize = document.getElementById('setting-fontSize').value;
        settings.general.language = document.getElementById('setting-language').value;
        settings.general.defaultView = document.getElementById('setting-defaultView').value;
        settings.general.showWelcome = document.getElementById('setting-showWelcome').checked;

        // Evaluation
        settings.evaluation.weekCompletionThreshold = parseInt(document.getElementById('setting-weekThreshold').value);
        settings.evaluation.evaluationWeights.E1 = parseInt(document.getElementById('setting-weight-e1').value, 10);
        settings.evaluation.evaluationWeights.E2 = parseInt(document.getElementById('setting-weight-e2').value, 10);
        settings.evaluation.evaluationWeights.FEOE = parseInt(document.getElementById('setting-weight-feoe').value, 10);
        ['ddr', 'iyo', 'atz', 'gne', 'pim'].forEach(mod => {
            settings.evaluation.trackingMode[mod.toUpperCase()] = document.getElementById(`setting-tracking-${mod}`).value;
        });
        settings.evaluation.showGlobalProgress = document.getElementById('setting-showGlobalProgress').value;
        settings.evaluation.delayAlerts = document.getElementById('setting-delayAlerts')?.checked;
        settings.evaluation.delayThresholdDays = parseInt(document.getElementById('setting-delayThreshold')?.value || 3);

        // Pedagogical
        settings.pedagogical.allowEditPedagogicalBlocks = document.getElementById('setting-allowEditPedagogical').checked;
        settings.pedagogical.showInstitutionalPanel = document.getElementById('setting-showInstitutional').checked;
        const holidaysText = document.getElementById('setting-holidays').value;
        settings.pedagogical.holidays = holidaysText
            .split('\n')
            .filter(line => line.trim())
            .map(line => this.normalizeHolidayDate(line));

        // Nombres de proyectos
        if (!settings.pedagogical.projectNames) settings.pedagogical.projectNames = {};
        settings.pedagogical.projectNames.E1 = document.getElementById('setting-project-e1')?.value || "";
        settings.pedagogical.projectNames.E2 = document.getElementById('setting-project-e2')?.value || "";
        settings.pedagogical.projectNames.FEOE = document.getElementById('setting-project-feoe')?.value || "";

        // Data
        settings.data.autoExport = document.getElementById('setting-autoExport').value;
        settings.data.exportFormat = document.getElementById('setting-exportFormat').value;
        settings.data.cloudProvider = document.getElementById('setting-cloudProvider').value;
        settings.data.gsheetsUrl = document.getElementById('setting-gsheetsUrl')?.value || '';
        settings.data.otherCloudUrl = document.getElementById('setting-otherCloudUrl')?.value || '';
        settings.data.cloudSync = (settings.data.cloudProvider === 'gsheets' || settings.data.cloudProvider === 'other');

        // Teams
        settings.teams.teamNames = {};
        document.querySelectorAll('[data-team-id]').forEach(input => {
            settings.teams.teamNames[input.dataset.teamId] = input.value;
        });
        const teamIds = this.getTeamIds(settings.teams);
        const individualTeamId = settings.teams.individualTeamId || teamIds[0];
        const students = [];
        document.querySelectorAll('[data-student-row]').forEach((row, index) => {
            const name = row.querySelector('[data-student-field="name"]')?.value.trim();
            if (!name) return;
            const individualized = !!row.querySelector('[data-student-field="individualized"]')?.checked;
            const teamId = individualized
                ? individualTeamId
                : row.querySelector('[data-student-field="teamId"]')?.value;
            students.push({
                id: this.generateStudentId(name, index),
                name,
                teamId: teamId || individualTeamId,
                individualized
            });
        });
        settings.teams.students = students;
        settings.teams.teamMembers = this.buildTeamMembersFromStudents(students, teamIds, individualTeamId);
        settings.teams.autoRotateLeaders = document.getElementById('setting-autoRotateLeaders').checked;
        settings.teams.requirePinForReset = document.getElementById('setting-requirePin').checked;
        settings.teams.resetPin = document.getElementById('setting-resetPin')?.value || '';
        settings.teams.studentViewPreview = document.getElementById('setting-studentPreview').checked;

        // Integrations
        settings.integrations.moodleBaseUrl = document.getElementById('setting-moodleUrl').value;
        settings.integrations.fileNamingPattern = document.getElementById('setting-filePattern').value;
        settings.integrations.enableWebhooks = document.getElementById('setting-enableWebhooks').checked;
        settings.integrations.webhookUrl = document.getElementById('setting-webhookUrl')?.value || '';

        // Advanced
        settings.advanced.debugMode = document.getElementById('setting-debugMode').checked;
        settings.advanced.enableServiceWorker = document.getElementById('setting-serviceWorker').checked;
        settings.advanced.performanceMode = document.getElementById('setting-performanceMode').checked;
        settings.advanced.experimentalFeatures = document.getElementById('setting-experimental').checked;

        const validationErrors = this.validateSettings(settings);
        if (validationErrors.length) {
            alert(`❌ No se pueden guardar los cambios:\n- ${validationErrors.join('\n- ')}`);
            return;
        }

        // Guardar y aplicar
        window.SettingsManager.settings = settings;
        if (window.SettingsManager.saveSettings()) {
            window.SettingsManager.applyAll();
            alert('✅ Configuración guardada correctamente');
            this.close();

            // Recargar si cambió el idioma
            if (previousLanguage !== settings.general.language) {
                if (confirm('El cambio de idioma requiere recargar la página. ¿Recargar ahora?')) {
                    location.reload();
                }
            }
        } else {
            alert('❌ Error al guardar la configuración');
        }
    },

    /**
     * Restablecer a valores por defecto
     */
    resetToDefaults() {
        if (confirm('¿Restablecer todas las configuraciones a valores por defecto?\n\nEsto NO borrará el progreso ni los datos de alumnos.')) {
            window.SettingsManager.resetToDefaults(true);
            this.close();
            setTimeout(() => this.open(), 100);
            alert('✅ Configuración restablecida');
        }
    },

    /**
     * Exportar todos los datos del sistema
     */
    exportAllData() {
        const allData = {
            version: '2.0',
            exportDate: new Date().toISOString(),
            settings: window.SettingsManager.settings,
            progress: window.ProgressManager?.data,
            raTracker: window.raTracker?.data,
            progressTracker: window.ProgressTracker?.data
        };

        const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `backup_completo_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);

        // Actualizar fecha de último backup
        window.SettingsManager.set('data', 'lastBackupDate', new Date().toISOString());

        alert('✅ Backup completo exportado correctamente');

        const provider = window.SettingsManager.settings?.data?.cloudProvider;
        if (provider && provider !== 'none') {
            if (confirm('¿Abrir el proveedor en una nueva pestaña para subir el backup manualmente?')) {
                window.SettingsManager.openCloudUpload(provider);
            }
        }
    },

    /**
     * Importar datos
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (confirm('¿Importar estos datos? Esto SOBRESCRIBIRÁ la configuración actual y el progreso guardado.')) {
                            const result = window.SettingsManager.importSettings(event.target.result);

                            if (result.success) {
                                alert('✅ Datos importados correctamente. Recargando...');
                                location.reload();
                            } else {
                                alert(`❌ Fallo en la importación: ${result.error}`);
                            }
                        }
                    } catch (error) {
                        alert('❌ Error al importar: archivo inválido');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    },

    /**
     * Limpiar caché del navegador
     */
    clearCache() {
        if (confirm('¿Limpiar caché del Service Worker y datos temporales?\n\nEsto NO afectará el progreso guardado.')) {
            if ('caches' in window) {
                caches.keys().then(names => {
                    names.forEach(name => caches.delete(name));
                });
            }
            alert('✅ Caché limpiada. Recarga la página para ver los cambios.');
        }
    }
};

// Exponer globalmente
window.SettingsUI = SettingsUI;

console.log('✅ Settings UI Renderer loaded');
