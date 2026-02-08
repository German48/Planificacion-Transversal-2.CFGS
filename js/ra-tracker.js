/**
 * Sistema de Gestión de Evidencias - RA Tracker
 * Funcionalidades: Checklist, Progreso, Búsqueda, Notas, Exportación
 */

class RATracker {
    constructor() {
        this.storageKey = this.buildStorageKey('ra_tracker_data');
        this.data = this.loadData();
        // No llamar a init() aquí - se llamará cuando el DOM esté listo
        console.log('✅ RA Tracker creado (esperando DOM)');
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
        const courseId = window.MASTER_PLAN?.config?.course_id || '2cfgm';
        return `${courseId}_${baseKey}_${year}`;
    }

    getLegacyStorageKey(baseKey) {
        return baseKey;
    }

    // ============ INICIALIZACIÓN ============

    init() {
        this.setupEventListeners();
        this.restoreState();
        this.updateAllProgress();
        this.updateDashboard();
        console.log('✅ RA Tracker completamente inicializado');
    }

    setupEventListeners() {
        // Búsqueda
        const searchBox = document.getElementById('searchBox');
        if (searchBox) {
            searchBox.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Filtro de módulos
        const moduleFilter = document.getElementById('moduleFilter');
        if (moduleFilter) {
            moduleFilter.addEventListener('change', (e) => this.filterByModule(e.target.value));
        }

        // Auto-guardar cada 30 segundos
        setInterval(() => this.saveData(), 30000);
    }

    resetData() {
        this.data = {
            evidences: {},
            notes: {},
            dailyNotes: {},
            timelineDods: {},
            lastUpdate: new Date().toISOString()
        };
        this.saveData();
        console.log('🧹 RATracker reiniciado');
    }

    // ============ GESTIÓN DE DATOS ============

    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
            const legacyStored = localStorage.getItem(this.getLegacyStorageKey('ra_tracker_data'));
            if (legacyStored) {
                const parsed = JSON.parse(legacyStored);
                localStorage.setItem(this.storageKey, JSON.stringify(parsed));
                return parsed;
            }
            return {
                evidences: {},
                notes: {},
                dailyNotes: {},
                timelineDods: {},
                lastUpdate: null
            };
        } catch (error) {
            console.error('Error cargando datos:', error);
            return { evidences: {}, notes: {}, dailyNotes: {}, timelineDods: {}, lastUpdate: null };
        }
    }

    saveData() {
        try {
            this.data.lastUpdate = new Date().toISOString();
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
            console.log('💾 Datos guardados');
        } catch (error) {
            console.error('Error guardando datos:', error);
        }
    }

    // ============ CHECKLIST DE EVIDENCIAS ============

    toggleEvidence(evalId, moduleId, evidenceType) {
        const key = `${evalId}_${moduleId}_${evidenceType}`;

        if (!this.data.evidences[key]) {
            this.data.evidences[key] = {
                completed: false,
                date: null
            };
        }

        this.data.evidences[key].completed = !this.data.evidences[key].completed;
        this.data.evidences[key].date = this.data.evidences[key].completed ? new Date().toISOString() : null;

        this.saveData();
        this.updateProgress(evalId);
        this.updateDashboard();

        // Notificar al sistema de progreso
        window.dispatchEvent(new CustomEvent('progressUpdated'));

        // Feedback visual
        this.showNotification(
            this.data.evidences[key].completed ? '✅ Evidencia completada' : '⬜ Evidencia desmarcada',
            'success'
        );
    }

    isEvidenceCompleted(evalId, moduleId, evidenceType) {
        const key = `${evalId}_${moduleId}_${evidenceType}`;
        return this.data.evidences[key]?.completed || false;
    }

    restoreState() {
        // Restaurar checkboxes
        document.querySelectorAll('.evidence-checkbox').forEach(checkbox => {
            const evalId = checkbox.dataset.eval;
            const moduleId = checkbox.dataset.module;
            const evidenceType = checkbox.dataset.type;

            checkbox.checked = this.isEvidenceCompleted(evalId, moduleId, evidenceType);
        });

        // Restaurar notas
        Object.keys(this.data.notes).forEach(key => {
            const [evalId, moduleId] = key.split('_');
            this.displayNote(evalId, moduleId, this.data.notes[key]);
        });
    }

    // ============ PROGRESO ============

    updateProgress(evalId) {
        const section = document.getElementById(evalId);
        if (!section) return;

        const checkboxes = section.querySelectorAll('.evidence-checkbox');
        const total = checkboxes.length;
        const completed = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Actualizar barra de progreso
        const progressBar = section.querySelector('.progress-bar');
        const progressText = section.querySelector('.progress-text');

        if (progressBar) {
            progressBar.style.width = percentage + '%';
            progressBar.textContent = percentage + '%';
        }

        if (progressText) {
            progressText.textContent = `${completed}/${total} evidencias completadas`;
        }

        return { total, completed, percentage };
    }

    updateAllProgress() {
        ['e1', 'e2', 'e3'].forEach(evalId => this.updateProgress(evalId));
    }

    // ============ DASHBOARD ============

    updateDashboard() {
        const stats = this.calculateStats();

        // Actualizar estadísticas generales
        this.updateElement('total-ras', stats.totalRAs);
        this.updateElement('total-evidences', stats.totalEvidences);
        this.updateElement('completed-evidences', stats.completedEvidences);
        this.updateElement('completion-rate', stats.completionRate + '%');

        // Actualizar barras de comparación
        ['e1', 'e2', 'e3'].forEach(evalId => {
            const progress = this.updateProgress(evalId);
            const bar = document.getElementById(`${evalId}-comparison`);
            if (bar) {
                bar.style.width = progress.percentage + '%';
                bar.textContent = progress.percentage + '%';
            }
        });
    }

    calculateStats() {
        const allCheckboxes = document.querySelectorAll('.evidence-checkbox');
        const totalEvidences = allCheckboxes.length;
        const completedEvidences = Array.from(allCheckboxes).filter(cb => cb.checked).length;
        const completionRate = totalEvidences > 0 ? Math.round((completedEvidences / totalEvidences) * 100) : 0;

        const totalRAs = document.querySelectorAll('.ra-block').length;

        return {
            totalRAs,
            totalEvidences,
            completedEvidences,
            completionRate
        };
    }

    updateElement(id, value) {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    // ============ BÚSQUEDA ============

    handleSearch(query) {
        const lowerQuery = query.toLowerCase().trim();

        if (lowerQuery.length < 2) {
            this.clearSearch();
            return;
        }

        document.querySelectorAll('.module-card').forEach(card => {
            const text = card.textContent.toLowerCase();
            const matches = text.includes(lowerQuery);

            card.style.display = matches ? 'block' : 'none';

            if (matches) {
                this.highlightText(card, query);
            }
        });

        this.updateSearchResults(query);
    }

    clearSearch() {
        document.querySelectorAll('.module-card').forEach(card => {
            card.style.display = 'block';
        });
        this.removeHighlights();
    }

    highlightText(element, query) {
        // Implementación simple de resaltado
        const textNodes = this.getTextNodes(element);
        textNodes.forEach(node => {
            const text = node.textContent;
            if (text.toLowerCase().includes(query.toLowerCase())) {
                const span = document.createElement('span');
                span.className = 'search-highlight';
                span.textContent = text;
                node.parentNode.replaceChild(span, node);
            }
        });
    }

    removeHighlights() {
        document.querySelectorAll('.search-highlight').forEach(span => {
            const text = document.createTextNode(span.textContent);
            span.parentNode.replaceChild(text, span);
        });
    }

    getTextNodes(element) {
        const textNodes = [];
        const walk = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walk.nextNode()) {
            if (node.textContent.trim()) textNodes.push(node);
        }
        return textNodes;
    }

    updateSearchResults(query) {
        const visible = document.querySelectorAll('.module-card[style*="display: block"]').length;
        const total = document.querySelectorAll('.module-card').length;

        const resultsDiv = document.getElementById('search-results');
        if (resultsDiv) {
            resultsDiv.textContent = `${visible} de ${total} módulos encontrados`;
            resultsDiv.style.display = 'block';
        }
    }

    // ============ FILTROS ============

    filterByModule(moduleCode) {
        document.querySelectorAll('.module-card').forEach(card => {
            if (moduleCode === 'all') {
                card.style.display = 'block';
            } else {
                const hasModule = card.classList.contains(`card-${moduleCode.toLowerCase()}`);
                card.style.display = hasModule ? 'block' : 'none';
            }
        });
    }

    // ============ NOTAS ============

    addNote(evalId, moduleId) {
        const key = `${evalId}_${moduleId}`;
        const currentNote = this.data.notes[key] || '';

        const note = prompt('Añadir nota:', currentNote);

        if (note !== null) {
            if (note.trim()) {
                this.data.notes[key] = note.trim();
                this.displayNote(evalId, moduleId, note.trim());
                this.showNotification('📝 Nota guardada', 'success');
            } else {
                delete this.data.notes[key];
                this.removeNote(evalId, moduleId);
                this.showNotification('🗑️ Nota eliminada', 'info');
            }
            this.saveData();
        }
    }

    displayNote(evalId, moduleId, note) {
        const card = document.querySelector(`#${evalId} .card-${moduleId}`);
        if (!card) return;

        let noteDiv = card.querySelector('.module-notes');
        if (!noteDiv) {
            noteDiv = document.createElement('div');
            noteDiv.className = 'module-notes';
            card.appendChild(noteDiv);
        }

        noteDiv.innerHTML = `
            <div class="note-item">
                <div class="note-header">
                    <span class="note-icon">📝</span>
                    <button class="note-delete" onclick="raTracker.addNote('${evalId}', '${moduleId}')">✏️</button>
                </div>
                <div class="note-text">${this.escapeHtml(note)}</div>
            </div>
        `;
    }

    removeNote(evalId, moduleId) {
        const card = document.querySelector(`#${evalId} .card-${moduleId}`);
        if (!card) return;

        const noteDiv = card.querySelector('.module-notes');
        if (noteDiv) noteDiv.remove();
    }

    // ============ NOTAS DIARIAS (ACTAS) ============

    saveDailyNote(dateStr, content) {
        if (content && content.trim()) {
            this.data.dailyNotes[dateStr] = content.trim();
        } else {
            delete this.data.dailyNotes[dateStr];
        }
        this.saveData();
        return true;
    }

    getDailyNote(dateStr) {
        return this.data.dailyNotes[dateStr] || '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ============ EXPORTACIÓN ============

    exportToJSON(evalId = null) {
        const data = {
            exportDate: new Date().toISOString(),
            evaluation: evalId || 'all',
            evidences: this.data.evidences,
            notes: this.data.notes,
            dailyNotes: this.data.dailyNotes,
            timelineDods: this.data.timelineDods || {},
            progress: {}
        };

        const evals = evalId ? [evalId] : ['e1', 'e2', 'e3'];
        evals.forEach(id => {
            data.progress[id] = this.updateProgress(id);
        });

        this.downloadFile(
            JSON.stringify(data, null, 2),
            `evidencias_${evalId || 'todas'}_${this.getDateString()}.json`,
            'application/json'
        );

        this.showNotification('📥 JSON exportado (incluye Timeline DoD)', 'success');
    }

    exportToCSV(evalId) {
        let csv = 'Evaluación,Módulo,RA,Evidencia Clave,Evidencia Recomendada,Completada,Nota\n';

        const section = evalId ? document.getElementById(evalId) : document;

        section.querySelectorAll('.module-card').forEach(card => {
            const evalName = card.closest('.eval-section')?.id || '';
            const moduleName = card.querySelector('.module-title')?.textContent.trim() || '';
            const moduleId = Array.from(card.classList).find(c => c.startsWith('card-'))?.replace('card-', '') || '';

            const ras = Array.from(card.querySelectorAll('.ra-title')).map(r => r.textContent.trim());
            const evidences = Array.from(card.querySelectorAll('.evidence-text')).map(e => e.textContent.trim());

            const keyCompleted = this.isEvidenceCompleted(evalName, moduleId, 'key') ? 'Sí' : 'No';
            const recCompleted = this.isEvidenceCompleted(evalName, moduleId, 'rec') ? 'Sí' : 'No';

            const note = this.data.notes[`${evalName}_${moduleId}`] || '';

            csv += `"${evalName}","${moduleName}","${ras.join('; ')}","${evidences[0] || ''}","${evidences[1] || ''}","${keyCompleted}/${recCompleted}","${note}"\n`;
        });

        this.downloadFile(
            csv,
            `evidencias_${evalId || 'todas'}_${this.getDateString()}.csv`,
            'text/csv'
        );

        this.showNotification('📥 CSV exportado', 'success');
    }

    exportProgress() {
        const stats = this.calculateStats();
        const progressData = {
            e1: this.updateProgress('e1'),
            e2: this.updateProgress('e2'),
            e3: this.updateProgress('e3'),
            global: stats
        };

        const text = `
INFORME DE PROGRESO - ${new Date().toLocaleDateString('es-ES')}
================================================================

RESUMEN GLOBAL:
- Total RAs: ${stats.totalRAs}
- Total Evidencias: ${stats.totalEvidences}
- Completadas: ${stats.completedEvidences}
- Tasa de Completitud: ${stats.completionRate}%

PROGRESO POR EVALUACIÓN:
- E1: ${progressData.e1.completed}/${progressData.e1.total} (${progressData.e1.percentage}%)
- E2: ${progressData.e2.completed}/${progressData.e2.total} (${progressData.e2.percentage}%)
- E3: ${progressData.e3.completed}/${progressData.e3.total} (${progressData.e3.percentage}%)

================================================================
        `.trim();

        this.downloadFile(
            text,
            `progreso_${this.getDateString()}.txt`,
            'text/plain'
        );

        this.showNotification('📥 Informe exportado', 'success');
    }

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getDateString() {
        return new Date().toISOString().split('T')[0];
    }

    // ============ IMPORTACIÓN ============

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const imported = JSON.parse(event.target.result);

                    if (confirm('¿Importar datos? Esto sobrescribirá los datos actuales.')) {
                        this.data.evidences = imported.evidences || {};
                        this.data.notes = imported.notes || {};
                        this.data.dailyNotes = imported.dailyNotes || {};
                        this.data.timelineDods = imported.timelineDods || {};
                        this.saveData();
                        this.restoreState();
                        this.updateAllProgress();
                        this.updateDashboard();
                        this.showNotification('✅ Datos importados correctamente (incluye Timeline DoD)', 'success');
                        location.reload();
                    }
                } catch (error) {
                    this.showNotification('❌ Error importando datos', 'error');
                    console.error(error);
                }
            };

            reader.readAsText(file);
        };

        input.click();
    }

    // ============ UTILIDADES ============

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    resetData() {
        if (confirm('¿Estás seguro? Esto eliminará TODOS los datos guardados.')) {
            localStorage.removeItem(this.storageKey);
            this.data = { evidences: {}, notes: {}, lastUpdate: null };
            location.reload();
        }
    }

    getStats() {
        return {
            data: this.data,
            stats: this.calculateStats(),
            progress: {
                e1: this.updateProgress('e1'),
                e2: this.updateProgress('e2'),
                e3: this.updateProgress('e3')
            }
        };
    }
}

// Instancia global - inicializada inmediatamente (para que addNote esté disponible)
window.raTracker = new RATracker();

// Inicialización completa cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    if (window.raTracker) {
        window.raTracker.init();
    }
});

