/**
 * ============================================
 * SISTEMA DE FICHAS DIARIAS Y SEMANALES
 * Renderizado dinámico para Profesorado y Alumnado
 * ============================================
 */

class FichasRenderer {
    constructor() {
        this.viewMode = 'profesorado'; // 'profesorado' | 'alumnado'
        this.storageKey = this.buildStorageKey('fichas_data');
        this.overridesStorageKey = this.buildStorageKey('fichas_overrides');
        this.data = this.loadData();
        console.log('✅ FichasRenderer inicializado');
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

    // ============ UTILIDADES DE FORMATO ============
    formatDateEuropean(dateStr) {
        if (!dateStr) return '';
        // Si ya viene formateada (ej: 07/01/2026), no tocamos
        if (dateStr.includes('/') && dateStr.split('/').length === 3) return dateStr;

        const [year, month, day] = dateStr.split('-');
        if (!year || !month || !day) return dateStr;
        return `${day}/${month}/${year}`;
    }

    normalizeEuropeanDates(text) {
        if (!text) return text;
        return text.replace(/(\d{4})-(\d{2})-(\d{2})/g, (_, year, month, day) => `${day}/${month}/${year}`);
    }

    // ============ GESTIÓN DE DATOS ============
    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
            const legacyStored = localStorage.getItem(this.getLegacyStorageKey('fichas_data'));
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                localStorage.setItem(this.storageKey, JSON.stringify(parsed));
                return parsed;
            }
            return {
                dailyChecks: {},
                dodStatus: {},
                prlChecks: {},
                teacherLogs: {},
                lastUpdate: null
            };
        } catch (error) {
            console.error('Error cargando datos de fichas:', error);
            return { dailyChecks: {}, dodStatus: {}, prlChecks: {}, teacherLogs: {}, lastUpdate: null };
        }
    }

    saveData() {
        try {
            this.data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (error) {
            console.error('Error guardando datos de fichas:', error);
        }
    }

    // ============ OVERRIDES DE FICHAS ============
    getOverridesRoot() {
        const settings = window.SettingsManager?.settings;
        if (settings) {
            if (!settings.pedagogical) {
                settings.pedagogical = {};
            }
            if (!settings.pedagogical.fichasOverrides) {
                settings.pedagogical.fichasOverrides = { daily: {}, weekly: {} };
            }
            return settings.pedagogical.fichasOverrides;
        }

        try {
            const stored = localStorage.getItem(this.overridesStorageKey);
            if (stored) {
                return JSON.parse(stored);
            }
            const legacyStored = localStorage.getItem(this.getLegacyStorageKey('fichas_overrides'));
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                localStorage.setItem(this.overridesStorageKey, JSON.stringify(parsed));
                return parsed;
            }
        } catch (error) {
            console.error('Error cargando overrides de fichas:', error);
        }
        return { daily: {}, weekly: {} };
    }

    saveOverridesRoot(overrides) {
        if (window.SettingsManager) {
            if (!window.SettingsManager.settings.pedagogical) {
                window.SettingsManager.settings.pedagogical = {};
            }
            window.SettingsManager.settings.pedagogical.fichasOverrides = overrides;
            window.SettingsManager.saveSettings();
            return;
        }

        try {
            localStorage.setItem(this.overridesStorageKey, JSON.stringify(overrides));
        } catch (error) {
            console.error('Error guardando overrides de fichas:', error);
        }
    }

    deepClone(value) {
        if (value === null || value === undefined) return value;
        return JSON.parse(JSON.stringify(value));
    }

    applyOverrides(base, overrides) {
        if (!overrides) return base;

        const merge = (target, source) => {
            if (!source || typeof source !== 'object') return target;
            Object.keys(source).forEach(key => {
                const sourceValue = source[key];
                if (Array.isArray(sourceValue)) {
                    target[key] = this.deepClone(sourceValue);
                } else if (sourceValue && typeof sourceValue === 'object') {
                    if (!target[key] || typeof target[key] !== 'object') {
                        target[key] = {};
                    }
                    merge(target[key], sourceValue);
                } else {
                    target[key] = sourceValue;
                }
            });
            return target;
        };

        return merge(base, overrides);
    }

    getDailyData(dateStr) {
        const base = this.deepClone(window.MASTER_PLAN?.getDay?.(dateStr));
        if (!base) return null;
        const overrides = this.getOverridesRoot().daily?.[dateStr];
        return this.applyOverrides(base, overrides);
    }

    getWeeklyData(weekId) {
        const base = this.deepClone(window.MASTER_PLAN?.getWeek?.(weekId));
        if (!base) return null;
        const overrides = this.getOverridesRoot().weekly?.[weekId];
        return this.applyOverrides(base, overrides);
    }

    getValueByPath(source, path) {
        if (!source || !path) return undefined;
        return path.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), source);
    }

    setValueByPath(target, path, value) {
        if (!path) return;
        const keys = path.split('.');
        let cursor = target;
        for (let i = 0; i < keys.length - 1; i += 1) {
            const key = keys[i];
            if (!cursor[key] || typeof cursor[key] !== 'object') {
                cursor[key] = {};
            }
            cursor = cursor[key];
        }
        cursor[keys[keys.length - 1]] = value;
    }

    parseEditableValue(value, arrayMode) {
        if (arrayMode === 'comma') {
            return value
                ? value.split(',').map(item => item.trim()).filter(Boolean)
                : [];
        }
        return value;
    }

    saveOverrideValue(scope, key, fieldPath, value, index, subfield) {
        const overrides = this.getOverridesRoot();
        if (!overrides[scope]) {
            overrides[scope] = {};
        }

        const entry = overrides[scope][key] ? this.deepClone(overrides[scope][key]) : {};

        if (index !== null && index !== undefined) {
            const current = scope === 'weekly' ? this.getWeeklyData(key) : this.getDailyData(key);
            const currentArray = this.getValueByPath(current, fieldPath);
            const nextArray = Array.isArray(currentArray)
                ? currentArray.map(item => (item && typeof item === 'object' ? { ...item } : item))
                : [];

            if (subfield) {
                const item = nextArray[index] && typeof nextArray[index] === 'object'
                    ? { ...nextArray[index] }
                    : {};
                item[subfield] = value;
                nextArray[index] = item;
            } else {
                nextArray[index] = value;
            }

            this.setValueByPath(entry, fieldPath, nextArray);
        } else {
            this.setValueByPath(entry, fieldPath, value);
        }

        overrides[scope][key] = entry;
        this.saveOverridesRoot(overrides);
    }

    handleEditableBlur(element) {
        const scope = element.dataset.scope;
        const key = element.dataset.key;
        const field = element.dataset.field;
        if (!scope || !key || !field) return;

        const index = element.dataset.index !== undefined ? Number(element.dataset.index) : null;
        const subfield = element.dataset.subfield || null;
        const arrayMode = element.dataset.arrayMode || null;
        let value = element.textContent.trim();
        value = this.normalizeEuropeanDates(value);
        element.textContent = value;

        const parsedValue = this.parseEditableValue(value, arrayMode);
        this.saveOverrideValue(scope, key, field, parsedValue, index, subfield);
    }

    attachEditableListeners(container) {
        if (this.viewMode !== 'profesorado') return;
        const editables = container.querySelectorAll('[data-editable="true"]');
        editables.forEach(el => {
            if (el.dataset.listenerAttached) return;
            el.addEventListener('blur', () => this.handleEditableBlur(el));
            el.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && el.dataset.singleLine === 'true') {
                    event.preventDefault();
                    el.blur();
                }
            });
            el.dataset.listenerAttached = 'true';
        });
    }

    getEditableAttributes(scope, key, field, options = {}) {
        if (this.viewMode !== 'profesorado') return '';
        const attrs = [
            'contenteditable="true"',
            'data-editable="true"',
            `data-scope="${scope}"`,
            `data-key="${key}"`,
            `data-field="${field}"`,
            'data-single-line="true"'
        ];
        if (options.index !== undefined && options.index !== null) {
            attrs.push(`data-index="${options.index}"`);
        }
        if (options.subfield) {
            attrs.push(`data-subfield="${options.subfield}"`);
        }
        if (options.arrayMode) {
            attrs.push(`data-array-mode="${options.arrayMode}"`);
        }
        if (options.singleLine === false) {
            const singleIndex = attrs.indexOf('data-single-line="true"');
            if (singleIndex >= 0) {
                attrs.splice(singleIndex, 1);
            }
        }
        return attrs.join(' ');
    }

    getEditableClass(baseClass = '') {
        if (this.viewMode !== 'profesorado') return baseClass;
        return baseClass ? `${baseClass} ficha-editable` : 'ficha-editable';
    }

    renderRestoreButton(scope, key) {
        if (this.viewMode !== 'profesorado') return '';
        return `
            <button class="ficha-restore-btn" type="button" onclick="fichasRenderer.restoreBaseFicha('${scope}', '${key}')">
                Restaurar ficha base
            </button>
        `;
    }

    restoreBaseFicha(scope, key) {
        const overrides = this.getOverridesRoot();
        if (overrides[scope] && overrides[scope][key]) {
            delete overrides[scope][key];
            this.saveOverridesRoot(overrides);
        }

        if (scope === 'daily') {
            this.renderDailyFicha(key);
        }
        if (scope === 'weekly') {
            this.renderWeeklyFicha(key);
        }

        this.showNotification('♻️ Ficha restaurada a valores base', 'info');
    }

    // ============ CAMBIO DE VISTA ============
    setViewMode(mode) {
        this.viewMode = mode;
        document.body.classList.remove('view-profesorado', 'view-alumnado');
        document.body.classList.add(`view-${mode}`);

        // Actualizar botones
        document.querySelectorAll('.view-mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Re-renderizar fichas activas
        this.refreshCurrentView();
    }

    refreshCurrentView() {
        const activeView = document.querySelector('.view-container.active');
        if (activeView && activeView.id === 'view-level-3') {
            this.renderDailyFicha(this.currentDate);
        }
    }

    // ============ RENDERIZADO FICHA DIARIA - PROFESORADO ============
    renderDailyFicha(dateStr) {
        this.currentDate = dateStr;
        const day = this.getDailyData(dateStr);

        if (!day) {
            return this.renderEmptyFicha(dateStr);
        }

        const container = document.getElementById('fichas-container');
        if (!container) return;

        const module = window.MASTER_PLAN.getModule(day.leader_module);
        const phase = window.MASTER_PLAN.getPhase(day.phase_common);

        const html = `
            <div class="ficha-card ${this.viewMode === 'alumnado' ? 'ficha-alumnado' : ''}">
                <!-- HEADER -->
                ${this.renderFichaHeader(day, module, phase)}
                
                <!-- BODY -->
                <div class="ficha-body">
                    <!-- Objetivo simple (solo alumnado) -->
                    <div class="objetivo-simple">
                        <h3>🎯 Objetivo de hoy</h3>
                        <p>"Al final de la sesión podrás <strong><span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'simple_goal')}>${this.getSimpleGoal(day)}</span></strong>"</p>
                    </div>
                    
                    <!-- Intención Didáctica (solo profesorado) -->
                    ${this.renderIntencionDidactica(day)}
                    
                    <!-- Entregable Mínimo -->
                    ${this.renderEntregableMinimo(day)}
                    
                    <!-- Definition of Done (solo profesorado) -->
                    ${this.viewMode === 'profesorado' ? this.renderDoD(day) : ''}
                    
                    <!-- Dependencias -->
                    ${this.renderDependencias(day)}
                    
                    <!-- Módulos Grid -->
                    ${this.renderModulosGrid(day)}
                    
                    <!-- Seguridad y PRL (si aplica) -->
                    ${day.safety && day.safety.applies ? this.renderPRL(day) : ''}
                    
                    <!-- Control de Calidad -->
                    ${day.safety && day.safety.qc_check ? this.renderQC(day) : ''}
                    
                    <!-- Diferenciación -->
                    ${this.renderDiferenciacion(day)}
                    
                    <!-- Registro Docente (solo profesorado) -->
                    ${this.renderRegistroDocente(day)}
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.attachEventListeners(day);
        this.attachEditableListeners(container);
    }

    renderFichaHeader(day, module, phase) {
        const date = new Date(day.date);
        const weekday = date.toLocaleDateString('es-ES', { weekday: 'long' });
        const dayNum = date.getDate();
        const month = date.toLocaleDateString('es-ES', { month: 'short' });

        return `
            <div class="ficha-header" style="background: linear-gradient(135deg, ${module?.color || 'var(--col-all)'} 0%, #2c3e50 100%);">
                <div class="ficha-header-top">
                    <div class="ficha-date-badge">
                        <span class="ficha-date">${this.formatDateEuropean(day.date)}</span>
                        <span class="ficha-weekday">${weekday}</span>
                    </div>
                    <div class="ficha-badges">
                        <span class="ficha-badge badge-eval">${day.eval} - ${day.week_id}</span>
                        <span class="ficha-badge badge-phase">${phase?.icon || '📌'} ${day.phase_common}</span>
                        <span class="ficha-badge badge-type ${day.day_type}">${this.getDayTypeLabel(day.day_type)}</span>
                    </div>
                    ${this.viewMode === 'profesorado' ? `<div class="ficha-header-actions">${this.renderRestoreButton('daily', day.date)}</div>` : ''}
                </div>
                <div class="ficha-title-row">
                    <h2 class="ficha-title">${day.project}</h2>
                    <div class="ficha-leader">
                        <span class="leader-icon">${module?.icon || '📋'}</span>
                        <span class="leader-text">Líder: ${day.leader_module}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderIntencionDidactica(day) {
        const intent = day.learning_intent;
        if (!intent) return '';

        return `
            <div class="intencion-didactica">
                <div class="intencion-header">
                    <span class="intencion-icon">🎯</span>
                    <span class="intencion-label">Intención Didáctica</span>
                </div>
                
                <div class="proposito-texto">
                    "<span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'learning_intent.purpose')}>${intent.purpose}</span>"
                </div>
                
                <div class="criterios-exito">
                    <h4>✓ Criterios de éxito observables</h4>
                    <ul class="criterios-list">
                        ${intent.success_criteria.map((c, idx) => `
                            <li><span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'learning_intent.success_criteria', { index: idx })}>${c}</span></li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="errores-tipicos">
                    <h4>⚠ Errores típicos a anticipar</h4>
                    <ul class="errores-list">
                        ${intent.common_mistakes.map((e, idx) => `
                            <li><span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'learning_intent.common_mistakes', { index: idx })}>${e}</span></li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="intervencion-docente">
                    <h4>💬 Intervención docente (1 minuto)</h4>
                    <p class="pregunta-guia">"<span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'learning_intent.teacher_prompt.question')}>${intent.teacher_prompt.question}</span>"</p>
                    <p class="chequeo-clave"><strong>Chequeo:</strong> <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'learning_intent.teacher_prompt.check')}>${intent.teacher_prompt.check}</span></p>
                </div>
            </div>
        `;
    }

    renderEntregableMinimo(day) {
        const entregable = day.min_deliverable;
        if (!entregable) return '';

        const checklistHTML = entregable.checklist.map((item, idx) => {
            const deliverableKey = `deliverable_${day.date}_${idx}`;
            const isChecked = window.ProgressTracker ? window.ProgressTracker.isDailyDeliverableCompleted(day.date, idx) : false;

            return `
                <li class="deliverable-item ${isChecked ? 'completed' : ''}">
                    <input type="checkbox" 
                           id="${deliverableKey}" 
                           ${isChecked ? 'checked' : ''} 
                           onchange="fichasRenderer.toggleDailyDeliverable('${day.date}', ${idx}, this.checked)">
                    <span class="deliverable-text ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'min_deliverable.checklist', { index: idx })}>${item}</span>
                </li>
            `;
        }).join('');

        return `
            <div class="entregable-section">
                <div class="entregable-header">
                    <div class="entregable-title">
                        <span class="entregable-icon">📦</span>
                        <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'min_deliverable.title')}>${entregable.title}</span>
                    </div>
                    <span class="entregable-formato ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'min_deliverable.format')}>${entregable.format}</span>
                </div>
                
                <ul class="entregable-checklist">
                    ${checklistHTML}
                </ul>
                
                <div class="entregable-meta">
                    <div class="meta-item">
                        <span class="meta-label">Nomenclatura</span>
                        <span class="meta-value ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'min_deliverable.naming')}>${entregable.naming}</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">Repositorio</span>
                        <span class="meta-value ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'min_deliverable.delivery_url')}>${entregable.delivery_url}</span>
                    </div>
                </div>
            </div>
        `;
    }

    renderDoD(day) {
        if (!day.dod || day.dod.length === 0) return '';

        const dodHTML = day.dod.map((item, idx) => `
            <li>
                <span class="dod-bullet">▸</span>
                <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'dod', { index: idx })}>${item}</span>
            </li>
        `).join('');

        return `
            <div class="dod-section">
                <div class="dod-header">
                    <div class="dod-title">
                        <span>🚦</span>
                        Condiciones de Entrega (DoD)
                    </div>
                </div>
                
                <ul class="dod-list bullet-list">
                    ${dodHTML}
                </ul>
                
                <div class="gate-rule">
                    <span class="gate-rule-icon">🚧</span>
                    <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'gate_rule')}>${day.gate_rule}</span>
                </div>
            </div>
        `;
    }

    renderDependencias(day) {
        const deps = day.dependencies;
        if (!deps) return '';

        return `
            <div class="dependencias-section">
                <div class="dependencias-header">
                    <span>🔗</span>
                    Dependencias entre Módulos
                </div>
                
                <div class="dependencia-group">
                    <div class="dependencia-label">📥 Hoy depende de:</div>
                    <ul class="dependencia-list">
                        ${deps.today_depends_on.map((d, idx) => `
                            <li>← <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'dependencies.today_depends_on', { index: idx })}>${d}</span></li>
                        `).join('')}
                    </ul>
                </div>
                
                <div class="dependencia-group">
                    <div class="dependencia-label">⚠️ Mañana se bloquea si falta:</div>
                    <ul class="dependencia-list bloqueante">
                        ${deps.tomorrow_blocked_if.map((d, idx) => `
                            <li>🚧 <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'dependencies.tomorrow_blocked_if', { index: idx })}>${d}</span></li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
    }

    renderModulosGrid(day) {
        const modulesDetail = day.modules_detail;
        if (!modulesDetail) return '';

        const modulesHTML = Object.entries(modulesDetail).map(([moduleId, detail]) => {
            const module = window.MASTER_PLAN.getModule(moduleId);
            const evidenceList = Array.isArray(detail.evidence)
                ? detail.evidence
                : (detail.evidence ? [detail.evidence] : []);
            return `
                <div class="modulo-mini-card" style="border-top: 4px solid ${module?.color || 'var(--col-all)'}">
                    <div class="modulo-mini-header">
                        <span class="modulo-mini-icon">${module?.icon || '📋'}</span>
                        <span class="modulo-mini-name">${module?.name || moduleId}</span>
                        <span class="modulo-mini-sigla">${moduleId}</span>
                    </div>
                    <div class="modulo-mini-body">
                        <div class="modulo-micro-goal ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, `modules_detail.${moduleId}.micro_goal`)}>${detail.micro_goal}</div>
                        <ul class="modulo-tasks">
                            ${detail.tasks.map((t, idx) => `
                                <li><span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, `modules_detail.${moduleId}.tasks`, { index: idx })}>${t}</span></li>
                            `).join('')}
                        </ul>
                        <div class="modulo-evidence">
                            <span class="modulo-evidence-icon">📎</span>
                            <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, `modules_detail.${moduleId}.evidence`, { arrayMode: 'comma' })}>${evidenceList.join(', ')}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="modulos-section">
                <h3 style="margin-bottom: 15px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary);">
                    📚 Actividad por Módulos
                </h3>
                <div class="modulos-grid">
                    ${modulesHTML}
                </div>
            </div>
        `;
    }

    renderPRL(day) {
        const safety = day.safety;
        if (!safety || !safety.applies) return '';

        const epiHTML = safety.epi_required.map((epi, idx) => `
            <div class="epi-item ${epi.mandatory ? 'mandatory' : ''}">
                <span class="epi-icon">${epi.icon}</span>
                <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.epi_required', { index: idx, subfield: 'item' })}>${epi.item}</span>
                ${epi.mandatory ? '<strong>*</strong>' : ''}
            </div>
        `).join('');

        const prlChecksHTML = safety.prl_checks.map((check, idx) => {
            const taskId = `prl_${idx}`;
            const isChecked = window.ProgressManager ? window.ProgressManager.isTaskCompleted(day.date, taskId) : (this.data.prlChecks[`${day.date}_${taskId}`] || false);
            return `
                <li>
                    <input type="checkbox" id="${day.date}_${taskId}" ${isChecked ? 'checked' : ''}
                           onchange="fichasRenderer.toggleTask('${day.date}', '${taskId}', this.checked)">
                    <span class="prl-check-text ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.prl_checks', { index: idx })}>${check}</span>
                </li>
            `;
        }).join('');

        return `
            <div class="prl-section">
                <div class="prl-header">
                    <div class="prl-title">
                        <span>🛡️</span>
                        Seguridad y PRL
                    </div>
                    <span class="prl-risk-badge ${this.getRiskClass(safety.risk_main)}">
                        <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.risk_main')}>${safety.risk_main}</span>
                    </span>
                </div>
                
                <div class="epi-grid">
                    ${epiHTML}
                </div>
                
                <div class="prl-checks">
                    <h4>Verificaciones obligatorias</h4>
                    <ul class="prl-checks-list">
                        ${prlChecksHTML}
                    </ul>
                </div>
                
                <div class="stop-rule">
                    <span class="stop-rule-icon">🛑</span>
                    <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.stop_rule')}>${safety.stop_rule}</span>
                </div>
            </div>
        `;
    }

    renderQC(day) {
        const qc = day.safety?.qc_check;
        if (!qc) return '';

        return `
            <div class="qc-section">
                <div class="qc-header">
                    <span>📏</span>
                    Control de Calidad (QC)
                </div>
                
                <div class="qc-measure-grid">
                    <div class="qc-measure-item">
                        <div class="qc-label">Medida</div>
                        <div class="qc-value ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.qc_check.measure')}>${qc.measure}</div>
                    </div>
                    <div class="qc-measure-item">
                        <div class="qc-label">Objetivo</div>
                        <div class="qc-value ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.qc_check.target')}>${qc.target || 'Ver plano'}</div>
                    </div>
                    <div class="qc-measure-item">
                        <div class="qc-label">Tolerancia</div>
                        <div class="qc-tolerance ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.qc_check.tolerance')}>${qc.tolerance}</div>
                    </div>
                    <div class="qc-measure-item">
                        <div class="qc-label">Método</div>
                        <div class="qc-value ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'safety.qc_check.method')}>${qc.method || 'Verificación directa'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderDiferenciacion(day) {
        const diff = day.differentiation;
        if (!diff) return '';

        return `
            <div class="diferenciacion-section">
                <div class="diferenciacion-header">
                    <span>⚡</span>
                    Diferenciación (UDL)
                </div>
                
                <div class="diferenciacion-tabs">
                    <button class="diferenciacion-tab base active" onclick="fichasRenderer.switchDiffTab(this, 'base')">
                        🟢 Base
                    </button>
                    <button class="diferenciacion-tab apoyo" onclick="fichasRenderer.switchDiffTab(this, 'apoyo')">
                        🟡 Apoyo
                    </button>
                    <button class="diferenciacion-tab extension" onclick="fichasRenderer.switchDiffTab(this, 'extension')">
                        🔵 Extensión
                    </button>
                </div>
                
                <div class="diferenciacion-content">
                    <div class="diferenciacion-panel base active" id="diff-base">
                        <h4>Mínimo exigible</h4>
                        <p class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'differentiation.base.description')}>${diff.base.description}</p>
                        <div class="diferenciacion-action">
                            <strong>Evidencia:</strong> <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'differentiation.base.evidence')}>${diff.base.evidence}</span>
                        </div>
                    </div>
                    
                    <div class="diferenciacion-panel apoyo" id="diff-apoyo">
                        <h4>Si van retrasados</h4>
                        <p class="diferenciacion-trigger">▸ <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'differentiation.support.trigger')}>${diff.support.trigger}</span></p>
                        <div class="diferenciacion-action ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'differentiation.support.action')}>${diff.support.action}</div>
                    </div>
                    
                    <div class="diferenciacion-panel extension" id="diff-extension">
                        <h4>Si van avanzados</h4>
                        <p class="diferenciacion-trigger">▸ <span class="${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'differentiation.extension.trigger')}>${diff.extension.trigger}</span></p>
                        <div class="diferenciacion-action ${this.getEditableClass()}" ${this.getEditableAttributes('daily', day.date, 'differentiation.extension.action')}>${diff.extension.action}</div>
                    </div>
                </div>
            </div>
        `;
    }

    renderRegistroDocente(day) {
        const logData = this.data.teacherLogs[day.date] || {};

        return `
            <div class="registro-docente-section">
                <div class="registro-docente-header">
                    <div class="registro-docente-title">
                        <span>📝</span>
                        Registro Docente (Coordinación)
                    </div>
                </div>
                
                <div class="registro-docente-grid">
                    <div class="registro-field">
                        <label>Incidencias</label>
                        <textarea id="log-incidents" placeholder="Registrar incidencias del día..."
                                  onchange="fichasRenderer.saveLog('${day.date}', 'incidents', this.value)"
                        >${logData.incidents || ''}</textarea>
                    </div>
                    <div class="registro-field">
                        <label>Acuerdos / Decisiones</label>
                        <textarea id="log-agreements" placeholder="Decisiones acordadas..."
                                  onchange="fichasRenderer.saveLog('${day.date}', 'agreements', this.value)"
                        >${logData.agreements || ''}</textarea>
                    </div>
                    <div class="registro-field">
                        <label>Adaptaciones / NEAE</label>
                        <textarea id="log-adaptations" placeholder="Adaptaciones realizadas..."
                                  onchange="fichasRenderer.saveLog('${day.date}', 'adaptations', this.value)"
                        >${logData.adaptations || ''}</textarea>
                    </div>
                    <div class="registro-field">
                        <label>Cambios en el Plan</label>
                        <textarea id="log-changes" placeholder="Qué cambió y por qué..."
                                  onchange="fichasRenderer.saveLog('${day.date}', 'changes', this.value)"
                        >${logData.changes || ''}</textarea>
                    </div>
                </div>
            </div>
        `;
    }

    renderEmptyFicha(dateStr) {
        const container = document.getElementById('fichas-container');
        if (!container) return;

        container.innerHTML = `
            <div class="ficha-card">
                <div class="ficha-header">
                    <h2 class="ficha-title">Sin ficha para ${this.formatDateEuropean(dateStr)}</h2>
                </div>
                <div class="ficha-body" style="text-align: center; padding: 50px;">
                    <p>No hay ficha definida para esta fecha.</p>
                    <p style="color: var(--text-secondary);">Puedes seleccionar otra fecha o crear una nueva ficha.</p>
                </div>
            </div>
        `;
    }

    // ============ UTILIDADES ============
    getDayTypeLabel(type) {
        const labels = {
            'aula': '🏫 Aula',
            'taller': '🔧 Taller',
            'mixta': '🔄 Mixta',
            'revision': '📋 Revisión',
            'entrega': '📦 Entrega'
        };
        return labels[type] || type;
    }

    getRiskClass(riskText) {
        if (!riskText) return 'bajo';
        const lower = riskText.toLowerCase();
        if (lower.includes('alto')) return 'alto';
        if (lower.includes('medio')) return 'medio';
        return 'bajo';
    }

    extractSimpleGoal(day) {
        // Extraer un objetivo simple del propósito completo
        const purpose = day.learning_intent?.purpose || '';
        // Buscar después de "aprende a" o similar
        const match = purpose.match(/(?:aprende a|podrás|hacer|generar|definir|fabricar)\s+(.+?)(?:\s+para|\.|$)/i);
        return match ? match[1] : purpose.substring(0, 100);
    }

    getSimpleGoal(day) {
        return day.simple_goal || this.extractSimpleGoal(day);
    }

    // ============ EVENT HANDLERS ============
    toggleWeeklyDod(weekId, dodIdx, completed) {
        if (!window.raTracker) return;

        // Construir el ID del DoD igual que en el timeline
        // weekId es tipo "E1-S03" -> eval="E1", num="3"
        const [evalId, sNum] = weekId.split('-S');
        const dodId = `${evalId}_week${parseInt(sNum)}_dod${dodIdx}`;

        if (!window.raTracker.data.timelineDods) {
            window.raTracker.data.timelineDods = {};
        }

        window.raTracker.data.timelineDods[dodId] = completed;
        window.raTracker.saveData();

        // Notificar al ProgressTracker para actualizar dashboards y widgets
        if (window.ProgressTracker && window.ProgressTracker.notifyDashboards) {
            window.ProgressTracker.notifyDashboards();
        }

        // Si existe la función de actualizar barra de semana (en Docente/Alumnado.html), llamarla
        if (typeof window.updateWeekCardProgress === 'function') {
            window.updateWeekCardProgress(weekId);
        }

        this.showNotification(
            completed ? '✅ Hito semanal completado' : '⬜ Hito semanal desmarcado',
            'success'
        );

        // Re-renderizamos para ver cambios visuales
        this.renderWeeklyFicha(weekId);
    }

    toggleDailyDeliverable(date, deliverableIdx, completed) {
        if (window.ProgressTracker) {
            window.ProgressTracker.setDailyDeliverable(date, deliverableIdx, completed);

            // Notificar dashboards
            if (window.ProgressTracker.notifyDashboards) {
                window.ProgressTracker.notifyDashboards();
            }

            this.showNotification(
                completed ? '✅ Entregable completado' : '⬜ Entregable desmarcado',
                'success'
            );

            // Re-renderizar la ficha para actualizar el estado visual
            this.renderDailyFicha(date);
        }
    }

    toggleTask(date, taskId, completed) {
        if (window.ProgressManager) {
            window.ProgressManager.toggleTask(date, taskId, completed);
            this.showNotification(
                completed ? '✅ Tarea completada' : '⬜ Tarea desmarcada',
                'success'
            );
        } else {
            if (taskId.startsWith('check_')) this.data.dailyChecks[`${date}_${taskId}`] = completed;
            if (taskId.startsWith('dod_')) this.data.dodStatus[`${date}_${taskId}`] = completed;
            if (taskId.startsWith('prl_')) this.data.prlChecks[`${date}_${taskId}`] = completed;
            this.saveData();
            this.showNotification('Estado actualizado (modo local)', 'info');
        }
    }

    toggleCheck(checkId) {
        const [date, type, idx] = checkId.split('_');
        this.toggleTask(date, `${type}_${idx}`, !this.data.dailyChecks[checkId]);
    }

    toggleDod(dodId) {
        const parts = dodId.split('_dod_');
        this.toggleTask(parts[0], `dod_${parts[1]}`, !this.data.dodStatus[dodId]);
    }

    togglePRL(checkId) {
        // Redirigir a toggleTask
        const [date, type, idx] = checkId.split('_');
        this.toggleTask(date, `${type}_${idx}`, !this.data.prlChecks[checkId]);
    }

    saveLog(dateStr, field, value) {
        if (!this.data.teacherLogs[dateStr]) {
            this.data.teacherLogs[dateStr] = {};
        }
        this.data.teacherLogs[dateStr][field] = value;
        this.saveData();
    }

    switchDiffTab(btn, tabId) {
        // Desactivar todos los tabs
        document.querySelectorAll('.diferenciacion-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.diferenciacion-panel').forEach(p => p.classList.remove('active'));

        // Activar el seleccionado
        btn.classList.add('active');
        document.getElementById(`diff-${tabId}`).classList.add('active');
    }

    attachEventListeners(day) {
        // Los eventos se manejan inline en el HTML renderizado
    }

    showNotification(message, type = 'info') {
        if (window.raTracker) {
            window.raTracker.showNotification(message, type);
        } else {
            console.log(`[${type}] ${message}`);
        }
    }

    // ============ RENDERIZADO FICHA SEMANAL ============
    renderWeeklyFicha(weekId) {
        const week = this.getWeeklyData(weekId);
        if (!week) {
            return this.renderEmptyWeek(weekId);
        }

        const container = document.getElementById('fichas-container');
        if (!container) return;

        const phase = window.MASTER_PLAN.getPhase(week.phase_common);

        container.innerHTML = `
            <div class="ficha-card">
                <!-- Header semanal -->
                <div class="ficha-header" style="background: linear-gradient(135deg, ${phase?.color || 'var(--col-all)'} 0%, #2c3e50 100%);">
                    <div class="ficha-header-top">
                        <div class="ficha-date-badge">
                            <span class="ficha-date">${week.week_id}</span>
                            <span class="ficha-weekday">${this.formatDateEuropean(week.date_from)} → ${this.formatDateEuropean(week.date_to)}</span>
                        </div>
                        <div class="ficha-badges">
                            <span class="ficha-badge badge-eval">${week.eval}</span>
                            <span class="ficha-badge badge-phase">${phase?.icon || '📌'} ${week.phase_common}</span>
                        </div>
                        ${this.viewMode === 'profesorado' ? `<div class="ficha-header-actions">${this.renderRestoreButton('weekly', week.week_id)}</div>` : ''}
                    </div>
                    <div class="ficha-title-row">
                        <h2 class="ficha-title">${week.project}</h2>
                    </div>
                </div>
                
                <div class="ficha-body">
                    <!-- Objetivo semanal -->
                    <div class="intencion-didactica">
                        <div class="intencion-header">
                            <span class="intencion-icon">🎯</span>
                            <span class="intencion-label">Resultado de Aprendizaje Funcional</span>
                        </div>
                        <div class="proposito-texto">"<span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, 'week_goal')}>${week.week_goal}</span>"</div>
                    </div>
                    
                    <!-- Gate semanal -->
                    <div class="dod-section">
                        <div class="dod-header">
                            <div class="dod-title">
                                <span>🚦</span>
                                <span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, 'gate.title')}>${week.gate.title}</span>
                            </div>
                        </div>
                        <ul class="dod-list">
                            ${week.gate.conditions.map((c, idx) => {
            // Construir el ID del DoD para buscarlo en raTracker
            const evalId = week.eval;
            const sNum = parseInt(week.week_id.split('S')[1]);
            const dodId = `${evalId}_week${sNum}_dod${idx}`;

            const isChecked = window.raTracker?.data?.timelineDods?.[dodId] || false;
            return `
                                    <li class="${isChecked ? 'completed' : ''}">
                                        <input type="checkbox" id="weekly_dod_${week.week_id}_${idx}" ${isChecked ? 'checked' : ''} 
                                               onchange="fichasRenderer.toggleWeeklyDod('${week.week_id}', ${idx}, this.checked)">
                                        <span class="dod-text ${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, 'gate.conditions', { index: idx })}>${c}</span>
                                    </li>
                                `;
        }).join('')}
                        </ul>
                    </div>
                    
                    <!-- Ritmo diario -->
                    ${this.renderDailyRhythm(week)}
                    
                    <!-- Foco por módulos -->
                    ${this.renderModulesFocus(week)}
                </div>
            </div>
        `;
        this.attachEditableListeners(container);
    }

    renderDailyRhythm(week) {
        if (!week.daily_rhythm) return '';

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const dayLabels = { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes' };

        const rhythmHTML = days.map(day => {
            const dayData = week.daily_rhythm[day];
            if (!dayData) return '';
            return `
                <div class="rhythm-day">
                    <div class="rhythm-day-label">${dayLabels[day]}</div>
                    <div class="rhythm-day-content">
                        <div class="rhythm-focus"><span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, `daily_rhythm.${day}.focus`)}>${dayData.focus}</span></div>
                        <div class="rhythm-task"><span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, `daily_rhythm.${day}.task`)}>${dayData.task}</span></div>
                        <div class="rhythm-evidence">📎 <span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, `daily_rhythm.${day}.evidence`)}>${dayData.evidence}</span></div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="rhythm-section" style="margin-bottom: 25px;">
                <h3 style="margin-bottom: 15px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary);">
                    📅 Ritmo de la Semana
                </h3>
                <div class="rhythm-grid" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px;">
                    ${rhythmHTML}
                </div>
            </div>
            <style>
                .rhythm-day {
                    background: var(--card-bg);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    overflow: hidden;
                }
                .rhythm-day-label {
                    background: var(--col-all);
                    color: white;
                    padding: 8px;
                    text-align: center;
                    font-weight: 700;
                    font-size: 0.85rem;
                }
                .rhythm-day-content {
                    padding: 10px;
                }
                .rhythm-focus {
                    font-weight: 600;
                    font-size: 0.85rem;
                    margin-bottom: 5px;
                }
                .rhythm-task {
                    font-size: 0.8rem;
                    color: var(--text-secondary);
                    margin-bottom: 8px;
                }
                .rhythm-evidence {
                    font-size: 0.75rem;
                    color: var(--qc-check);
                }
            </style>
        `;
    }

    renderModulesFocus(week) {
        if (!week.modules_focus) return '';

        const modulesHTML = Object.entries(week.modules_focus).map(([moduleId, focus]) => {
            const module = window.MASTER_PLAN.getModule(moduleId);
            return `
                <div class="modulo-mini-card" style="border-top: 4px solid ${module?.color || 'var(--col-all)'}">
                    <div class="modulo-mini-header">
                        <span class="modulo-mini-icon">${module?.icon || '📋'}</span>
                        <span class="modulo-mini-name">${moduleId}</span>
                    </div>
                    <div class="modulo-mini-body">
                        <div class="modulo-micro-goal"><span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, `modules_focus.${moduleId}.focus`)}>${focus.focus}</span></div>
                        <div class="modulo-evidence" style="margin-top: 10px;">
                            <span class="modulo-evidence-icon">📎</span>
                            <span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, `modules_focus.${moduleId}.deliverable`)}>${focus.deliverable}</span>
                        </div>
                        <div style="font-size: 0.75rem; color: var(--gate-success); margin-top: 8px;">
                            → Habilita: <span class="${this.getEditableClass()}" ${this.getEditableAttributes('weekly', week.week_id, `modules_focus.${moduleId}.enables`)}>${focus.enables}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="modulos-section">
                <h3 style="margin-bottom: 15px; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary);">
                    📚 Foco Semanal por Módulos
                </h3>
                <div class="modulos-grid">
                    ${modulesHTML}
                </div>
            </div>
        `;
    }

    renderEmptyWeek(weekId) {
        const container = document.getElementById('fichas-container');
        if (!container) return;

        container.innerHTML = `
            <div class="ficha-card">
                <div class="ficha-header">
                    <h2 class="ficha-title">Sin ficha semanal para ${weekId}</h2>
                </div>
                <div class="ficha-body" style="text-align: center; padding: 50px;">
                    <p>No hay ficha semanal definida.</p>
                </div>
            </div>
        `;
    }
}

// Instancia global
window.fichasRenderer = new FichasRenderer();

console.log('✅ FichasRenderer cargado');
