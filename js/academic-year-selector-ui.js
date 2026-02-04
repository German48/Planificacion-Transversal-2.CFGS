/**
 * ============================================
 * ACADEMIC YEAR SELECTOR UI
 * Componente visual para seleccionar año académico
 * ============================================
 */

(function () {
    'use strict';

    // ============================================
    // RENDERIZAR SELECTOR EN HEADER
    // ============================================

    function renderYearSelector() {
        if (document.body && document.body.classList.contains('mode-alumnado')) {
            return;
        }
        if (document.getElementById('academic-year-select')) {
            return;
        }
        // Intentar buscar un contenedor ideal
        let container = document.querySelector('.header-controls') ||
            document.querySelector('.toolbar') ||
            document.querySelector('header') ||
            document.querySelector('.main-header');

        // Si no encuentra ningún contenedor, crear uno flotante
        if (!container) {
            console.log('💡 Creando selector flotante de año académico');
            const floatingSelector = document.createElement('div');
            floatingSelector.id = 'floating-year-selector';
            floatingSelector.style.cssText = `
                position: fixed;
                top: 60px;
                right: 20px;
                z-index: 9999;
                display: flex;
                gap: 8px;
                align-items: center;
            `;
            document.body.appendChild(floatingSelector);
            container = floatingSelector;
        }

        // Crear el selector
        const selectorHTML = `
            <div class="academic-year-selector">
                <span class="academic-year-label">📅 Curso</span>
                <input id="academic-year-select" class="academic-year-select" list="academic-year-list" inputmode="numeric" placeholder="2026-2027" aria-label="Año académico">
                <datalist id="academic-year-list">
                    ${generateYearOptions()}
                </datalist>
            </div>
            <button class="manage-years-btn" onclick="AcademicYearUI.openModal()">
                <span>⚙️</span>
                <span>Gestionar</span>
            </button>
        `;

        // Insertar
        if (container.id === 'floating-year-selector') {
            container.innerHTML = selectorHTML;
        } else {
            container.insertAdjacentHTML('afterbegin', selectorHTML);
        }

        // Añadir event listener
        const select = document.getElementById('academic-year-select');
        if (select) {
            select.addEventListener('keydown', handleYearChange);
            select.value = window.AcademicYearManager?.getCurrentYear() || '2025-2026';
        }
    }

    function generateYearOptions() {
        if (!window.AcademicYearManager) {
            return '<option>2025-2026</option>';
        }

        const years = window.AcademicYearManager.getAvailableYears();
        const currentYear = window.AcademicYearManager.getCurrentYear();

        return years.map(year => `<option value="${year}"></option>`).join('');
    }

    function handleYearChange(event) {
        if (event.key !== 'Enter') return;
        const input = event.target;
        const newYear = input.value.trim();
        const yearPattern = /^\d{4}-\d{4}$/;

        if (!yearPattern.test(newYear)) {
            alert('❌ Formato incorrecto. Usa el formato: YYYY-YYYY (ej: 2026-2027)');
            input.value = window.AcademicYearManager?.getCurrentYear() || '2025-2026';
            return;
        }

        if (!window.AcademicYearManager) return;

        const availableYears = window.AcademicYearManager.getAvailableYears();
        if (availableYears.includes(newYear)) {
            if (confirm(`¿Cambiar al año académico ${newYear}?\n\nLa página se recargará para aplicar los cambios.`)) {
                window.AcademicYearManager.setYear(newYear);
            } else {
                input.value = window.AcademicYearManager.getCurrentYear();
            }
            return;
        }

        if (!window.AcademicYearGenerator) {
            alert('❌ No está disponible el generador de años académicos');
            input.value = window.AcademicYearManager.getCurrentYear();
            return;
        }

        const sourceYear = window.AcademicYearManager.getCurrentYear();
        const newData = window.AcademicYearGenerator.generate(sourceYear, newYear, {
            updateDates: true,
            yearsOffset: 1,
            preserveWeekdays: true,
            copyProgress: false
        });

        if (!newData) {
            alert(`❌ Error al generar el año académico ${newYear}`);
            input.value = sourceYear;
            return;
        }

        window.AcademicYearManager.setYear(newYear);
    }

    // ============================================
    // MODAL DE GESTIÓN DE AÑOS
    // ============================================

    function renderModal() {
        if (document.body && document.body.classList.contains('mode-alumnado')) {
            return;
        }
        const modalHTML = `
            <div id="year-manager-modal" class="year-manager-modal">
                <div class="year-manager-content">
                    <div class="year-manager-header">
                        <h2>📚 Gestión de Años Académicos</h2>
                        <button class="close-modal-btn" onclick="AcademicYearUI.closeModal()">✕</button>
                    </div>

                    <div class="years-list" id="years-list">
                        <!-- Se llenará dinámicamente -->
                    </div>


                    <div class="add-year-section">
                        <h3>➕ Añadir Nuevo Año Académico</h3>
                        <div class="add-year-form">
                            <div class="form-group">
                                <label for="new-year-name">Año Académico</label>
                                <input type="text" id="new-year-name" placeholder="2026-2027" 
                                       pattern="\\d{4}-\\d{4}">
                            </div>
                            <div class="form-group">
                                <label for="clone-from">Clonar desde</label>
                                <select id="clone-from">
                                    <option value="">-- Crear vacío --</option>
                                    ${generateCloneOptions()}
                                </select>
                            </div>
                            <div class="form-group">
                                <label>
                                    <input type="checkbox" id="update-dates" checked>
                                    Actualizar fechas automáticamente (+1 año)
                                </label>
                            </div>
                            <div class="form-actions">
                                <button class="btn-primary" onclick="AcademicYearUI.createYear()">
                                    Crear Año Académico
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    function generateCloneOptions() {
        if (!window.AcademicYearManager) return '';

        const years = window.AcademicYearManager.getAvailableYears();
        return years.map(year => `<option value="${year}">${year}</option>`).join('');
    }

    function updateYearsList() {
        const yearsList = document.getElementById('years-list');
        if (!yearsList || !window.AcademicYearManager) return;

        const years = window.AcademicYearManager.getAvailableYears();
        const currentYear = window.AcademicYearManager.getCurrentYear();

        yearsList.innerHTML = years.map(year => {
            const isActive = year === currentYear;
            const activeClass = isActive ? 'active' : '';
            const activeBadge = '';

            // Obtener info del año
            const yearData = window.ACADEMIC_YEARS && window.ACADEMIC_YEARS[year];
            const weekCount = yearData && yearData.weeks ? yearData.weeks.length : 0;

            return `
                <div class="year-item ${activeClass}">
                    <div class="year-item-info">
                        <div class="year-item-name">
                            ${year} ${activeBadge}
                        </div>
                        <div class="year-item-meta">
                            ${weekCount} semanas planificadas
                        </div>
                    </div>
                    <div class="year-item-actions">
                        ${!isActive ? `
                            <button class="year-action-btn" onclick="AcademicYearUI.activateYear('${year}')">
                                Activar
                            </button>
                            <button class="year-action-btn" onclick="AcademicYearUI.duplicateYear('${year}')">
                                Duplicar
                            </button>
                            <button class="year-action-btn danger" onclick="AcademicYearUI.deleteYear('${year}')">
                                Eliminar
                            </button>
                        ` : ''}
                        ${isActive ? `
                            <button class="year-action-btn" onclick="AcademicYearUI.duplicateYear('${year}')">
                                Duplicar
                            </button>
                        ` : ''}
                        <button class="year-action-btn" onclick="AcademicYearUI.exportYear('${year}')">
                            Exportar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ============================================
    // FUNCIONES PÚBLICAS
    // ============================================

    function openModal() {
        const modal = document.getElementById('year-manager-modal');
        if (modal) {
            updateYearsList();
            modal.classList.add('active');
        }
    }

    function closeModal() {
        const modal = document.getElementById('year-manager-modal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    function createYear() {
        const yearName = document.getElementById('new-year-name').value.trim();
        const cloneFrom = document.getElementById('clone-from').value;
        const updateDates = document.getElementById('update-dates').checked;

        if (!yearName) {
            alert('❌ Por favor, introduce un nombre de año académico (ej: 2026-2027)');
            return;
        }

        // Validar formato
        if (!/^\d{4}-\d{4}$/.test(yearName)) {
            alert('❌ Formato incorrecto. Usa el formato: YYYY-YYYY (ej: 2026-2027)');
            return;
        }

        if (!window.AcademicYearManager) {
            alert('❌ Academic Year Manager no está disponible');
            return;
        }

        // Si se clona desde otro año
        if (cloneFrom) {
            const success = window.AcademicYearManager.cloneYear(cloneFrom, yearName, updateDates);
            if (success) {
                alert(`✅ Año académico ${yearName} creado exitosamente desde ${cloneFrom}`);
                updateYearsList();
                // Limpiar formulario
                document.getElementById('new-year-name').value = '';
                document.getElementById('clone-from').value = '';
            } else {
                alert(`❌ Error al crear el año académico ${yearName}`);
            }
        } else {
            // Crear año basado en 2025-2026
            if (confirm(`¿Crear año académico ${yearName} basado en 2025-2026?\n\nSe copiará toda la estructura de semanas del curso 2025-2026.\nPodrás editar las fechas y contenido después.`)) {
                const emptyYear = createEmptyYearStructure(yearName);
                const success = window.AcademicYearManager.addYear(yearName, emptyYear);

                if (success) {
                    const weekCount = emptyYear.weeks ? emptyYear.weeks.length : 0;
                    alert(`✅ Año académico ${yearName} creado exitosamente\n\n📊 ${weekCount} semanas copiadas de 2025-2026\n💡 Puedes exportarlo y editar las fechas si es necesario`);
                    updateYearsList();
                    // Limpiar formulario
                    document.getElementById('new-year-name').value = '';
                } else {
                    alert(`❌ Error al crear el año académico ${yearName}`);
                }
            }
        }
    }

    // Función auxiliar para crear estructura basada en año 2025-2026
    function createEmptyYearStructure(yearName) {
        // Obtener el año base (2025-2026) como plantilla
        const baseYear = window.ACADEMIC_YEARS && window.ACADEMIC_YEARS['2025-2026'];

        if (!baseYear) {
            console.error('❌ No se encontró el año base 2025-2026');
            // Retornar estructura mínima si no existe el año base
            return {
                config: {
                    course: "1º CFGS Diseño y Amueblamiento",
                    year: yearName,
                    repoBaseUrl: "https://moodle.example.com/mod/folder/",
                    evaluations: ["E1", "E2", "FEOE"],
                    defaultView: "daily"
                },
                pedagogical_context: {},
                modules: {},
                phases: {},
                weeks: [],
                days: {},
                academic: {},
                getWeek: function (weekId) { return this.weeks.find(w => w.week_id === weekId); },
                getPhase: function (phaseId) { return this.phases[phaseId]; },
                getModule: function (moduleId) { return this.modules[moduleId.toUpperCase()]; }
            };
        }

        // Clonar profundamente el año base
        const newYear = JSON.parse(JSON.stringify(baseYear));

        // Actualizar solo el año en la configuración
        newYear.config.year = yearName;

        // Limpiar progreso y datos específicos del año anterior
        if (newYear.progress) delete newYear.progress;
        if (newYear.completedTasks) delete newYear.completedTasks;

        // Restaurar las funciones (se pierden en JSON.parse)
        newYear.getWeek = function (weekId) { return this.weeks.find(w => w.week_id === weekId); };
        newYear.getPhase = function (phaseId) { return this.phases[phaseId]; };
        newYear.getModule = function (moduleId) { return this.modules[moduleId.toUpperCase()]; };

        console.log(`✅ Año ${yearName} creado con estructura completa de 2025-2026`);
        console.log(`📊 ${newYear.weeks ? newYear.weeks.length : 0} semanas copiadas`);

        return newYear;
    }

    function activateYear(year) {
        if (window.AcademicYearManager) {
            if (confirm(`¿Activar el año académico ${year}?\n\nLa página se recargará.`)) {
                window.AcademicYearManager.setYear(year);
            }
        }
    }

    function exportYear(year) {
        if (!window.ACADEMIC_YEARS || !window.ACADEMIC_YEARS[year]) {
            alert('❌ No se encontró el año académico');
            return;
        }

        const data = window.ACADEMIC_YEARS[year];
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `master-plan-${year}.json`;
        a.click();
        URL.revokeObjectURL(url);

        alert(`✅ Año académico ${year} exportado correctamente`);
    }

    function getNextYearLabel(year) {
        if (!year) return '';
        const parts = year.split('-').map(Number);
        if (parts.length !== 2 || !Number.isFinite(parts[0]) || !Number.isFinite(parts[1])) {
            return '';
        }
        return `${parts[0] + 1}-${parts[1] + 1}`;
    }

    function duplicateYear(sourceYear) {
        if (!window.AcademicYearManager) return;
        const suggestion = getNextYearLabel(sourceYear);
        const targetYear = prompt(`Nuevo año académico (formato YYYY-YYYY):`, suggestion);
        if (!targetYear) return;

        if (!/^\d{4}-\d{4}$/.test(targetYear)) {
            alert('❌ Formato incorrecto. Usa el formato: YYYY-YYYY (ej: 2026-2027)');
            return;
        }

        const updateDates = confirm('¿Actualizar fechas automáticamente (+1 año)?');
        const success = window.AcademicYearManager.cloneYear(sourceYear, targetYear, updateDates);

        if (success) {
            alert(`✅ Año académico ${targetYear} duplicado desde ${sourceYear}`);
            updateYearsList();
        } else {
            alert(`❌ No se pudo duplicar el año ${sourceYear}`);
        }
    }

    function deleteYear(year) {
        if (!window.AcademicYearManager) return;
        const current = window.AcademicYearManager.getCurrentYear();
        if (year === current) {
            alert('⚠️ No puedes eliminar el año académico activo. Activa otro primero.');
            return;
        }
        if (confirm(`¿Eliminar definitivamente el año académico ${year}?

Esta acción no se puede deshacer.`)) {
            const removed = window.AcademicYearManager.removeYear(year);
            if (removed) {
                updateYearsList();
            } else {
                alert('❌ No se pudo eliminar el año académico');
            }
        }
    }


    // ============================================
    // INICIALIZACIÓN
    // ============================================

    function initialize() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    }

    function init() {
        // Renderizar selector
        renderYearSelector();

        // Renderizar modal
        renderModal();

        console.log('✅ Academic Year Selector UI inicializado');
    }

    // ============================================
    // API PÚBLICA
    // ============================================

    if (!document.body || !document.body.classList.contains('mode-alumnado')) {
        window.AcademicYearUI = {
            openModal,
            closeModal,
            createYear,
            activateYear,
            exportYear,
            deleteYear,
            duplicateYear,
            refresh: () => {
                updateYearsList();
                const select = document.getElementById('academic-year-select');
                const list = document.getElementById('academic-year-list');
                if (list) {
                    list.innerHTML = generateYearOptions();
                }
                if (select) {
                    select.value = window.AcademicYearManager?.getCurrentYear() || '2025-2026';
                }
            }
        };
    } else {
        const logNoop = (action) => {
            if (logNoop.logged) return;
            console.warn(`AcademicYearUI deshabilitado en alumnado (${action}).`);
            logNoop.logged = true;
        };
        window.AcademicYearUI = {
            openModal: () => logNoop('openModal'),
            closeModal: () => logNoop('closeModal'),
            createYear: () => logNoop('createYear'),
            activateYear: () => logNoop('activateYear'),
            exportYear: () => logNoop('exportYear'),
            deleteYear: () => logNoop('deleteYear'),
            duplicateYear: () => logNoop('duplicateYear'),
            refresh: () => logNoop('refresh')
        };
    }

    // Escuchar cambios de año académico
    window.addEventListener('academicYearChanged', () => {
        if (window.AcademicYearUI) {
            window.AcademicYearUI.refresh();
        }
    });

    // Inicializar
    initialize();

})();
