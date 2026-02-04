/**
 * ============================================
 * ACADEMIC YEAR MANAGER
 * Gestión de múltiples años académicos
 * ============================================
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'academic_years_store';
    let helperFns = null;
    const basePlanByYear = {};

    if (window.MASTER_PLAN && window.MASTER_PLAN.config) {
        const baseLabel = window.MASTER_PLAN.config.academic_year
            || window.MASTER_PLAN.config.year
            || '2025-2026';
        basePlanByYear[baseLabel] = JSON.parse(JSON.stringify(window.MASTER_PLAN));
    }

    // ============================================
    // CONFIGURACIÓN INICIAL
    // ============================================

    // Guardar el MASTER_PLAN original como año 2025-2026
    if (!window.ACADEMIC_YEARS) {
        window.ACADEMIC_YEARS = {};
    }

    // Si MASTER_PLAN ya existe, guardarlo como 2025-2026
    if (window.MASTER_PLAN && !window.ACADEMIC_YEARS["2025-2026"]) {
        window.ACADEMIC_YEARS["2025-2026"] = window.MASTER_PLAN;
    }

    function captureHelperFunctions() {
        if (!window.MASTER_PLAN) return;
        helperFns = {
            getDay: window.MASTER_PLAN.getDay,
            getModulesDetail: window.MASTER_PLAN.getModulesDetail,
            getWeek: window.MASTER_PLAN.getWeek,
            getPhase: window.MASTER_PLAN.getPhase,
            getModule: window.MASTER_PLAN.getModule
        };
    }

    function attachHelperFunctions(target) {
        if (!target || !helperFns) return;
        if (helperFns.getDay) target.getDay = helperFns.getDay;
        if (helperFns.getModulesDetail) target.getModulesDetail = helperFns.getModulesDetail;
        if (helperFns.getWeek) target.getWeek = helperFns.getWeek;
        if (helperFns.getPhase) target.getPhase = helperFns.getPhase;
        if (helperFns.getModule) target.getModule = helperFns.getModule;
    }

    function loadStoredYears() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                window.ACADEMIC_YEARS = parsed;
            }
        } catch (err) {
            console.warn('⚠️ No se pudieron cargar los años guardados', err);
        }
    }

    function countWeeksWithRhythm(weeks) {
        if (!Array.isArray(weeks)) return 0;
        return weeks.filter(week => week && week.daily_rhythm).length;
    }

    function isYearStale(storedYear, baseYear) {
        if (!storedYear || !baseYear) return true;
        if (!Array.isArray(storedYear.weeks) || !Array.isArray(baseYear.weeks)) return true;
        if (storedYear.weeks.length !== baseYear.weeks.length) return true;

        const storedRhythm = countWeeksWithRhythm(storedYear.weeks);
        const baseRhythm = countWeeksWithRhythm(baseYear.weeks);

        return storedRhythm < baseRhythm;
    }

    function getAcademicLabel(plan) {
        return plan?.config?.academic_year || plan?.config?.year || '2025-2026';
    }

    function getYearBounds(label) {
        const parts = String(label).split('-').map(Number);
        const startYear = Number.isFinite(parts[0]) ? parts[0] : null;
        const endYear = Number.isFinite(parts[1]) ? parts[1] : (startYear ? startYear + 1 : null);
        return { startYear, endYear };
    }

    function getWeeksSpan(weeks) {
        if (!Array.isArray(weeks) || !weeks.length) return null;
        const dates = weeks
            .map(week => [week?.date_from, week?.date_to])
            .flat()
            .filter(Boolean)
            .sort();
        if (!dates.length) return null;
        return { first: dates[0], last: dates[dates.length - 1] };
    }

    function isYearRangeMismatch(plan) {
        if (!plan) return false;
        const label = getAcademicLabel(plan);
        const { startYear, endYear } = getYearBounds(label);
        const span = getWeeksSpan(plan.weeks);
        if (!startYear || !endYear || !span) return false;
        const firstYear = Number(span.first.slice(0, 4));
        const lastYear = Number(span.last.slice(0, 4));
        if (!Number.isFinite(firstYear) || !Number.isFinite(lastYear)) return false;
        return firstYear !== startYear || lastYear !== endYear;
    }

    function saveStoredYears() {
        try {
            const payload = JSON.stringify(window.ACADEMIC_YEARS || {});
            localStorage.setItem(STORAGE_KEY, payload);
        } catch (err) {
            console.warn('⚠️ No se pudieron guardar los años académicos', err);
        }
    }

    // ============================================
    // FUNCIONES DE GESTIÓN
    // ============================================

    /**
     * Obtener el año académico actual guardado o el más reciente
     */
    function getCurrentAcademicYear() {
        const saved = localStorage.getItem('selected_academic_year');
        if (saved && window.ACADEMIC_YEARS[saved]) {
            return saved;
        }
        // Por defecto, usar el año más reciente
        const years = Object.keys(window.ACADEMIC_YEARS).sort().reverse();
        return years[0] || "2025-2026";
    }

    /**
     * Establecer un año académico como activo
     */
    function setAcademicYear(year) {
        if (!window.ACADEMIC_YEARS[year]) {
            console.error(`❌ Año académico "${year}" no encontrado`);
            return false;
        }

        localStorage.setItem('selected_academic_year', year);
        window.MASTER_PLAN = window.ACADEMIC_YEARS[year];
        sanitizeYearDays(window.MASTER_PLAN);
        attachHelperFunctions(window.MASTER_PLAN);
        saveStoredYears();

        // Actualizar claves de localStorage para otros componentes
        updateStorageKeys(year);

        // Disparar evento para que otros componentes se actualicen
        window.dispatchEvent(new CustomEvent('academicYearChanged', {
            detail: { year, previousYear: getCurrentAcademicYear() }
        }));

        console.log(`✅ Año académico cambiado a: ${year}`);

        // Recargar la página para aplicar cambios
        setTimeout(() => location.reload(), 100);

        return true;
    }

    /**
     * Actualizar claves de localStorage para incluir el año académico
     */
    function updateStorageKeys(year) {
        // Esta función se puede expandir para migrar datos si es necesario
        console.log(`📦 Claves de localStorage actualizadas para: ${year}`);
    }

    /**
     * Obtener lista de años académicos disponibles
     */
    function getAvailableYears() {
        return Object.keys(window.ACADEMIC_YEARS).sort().reverse();
    }

    /**
     * Añadir un nuevo año académico
     */
    function addAcademicYear(year, data) {
        if (window.ACADEMIC_YEARS[year]) {
            console.warn(`⚠️ El año académico "${year}" ya existe`);
            return false;
        }

        window.ACADEMIC_YEARS[year] = data;
        saveStoredYears();
        console.log(`✅ Año académico "${year}" añadido`);
        return true;
    }

    function removeAcademicYear(year) {
        const current = getCurrentAcademicYear();
        if (year === current) {
            console.warn(`⚠️ No se puede eliminar el año académico activo (${year})`);
            return false;
        }
        if (!window.ACADEMIC_YEARS[year]) {
            console.warn(`⚠️ El año académico "${year}" no existe`);
            return false;
        }

        delete window.ACADEMIC_YEARS[year];
        saveStoredYears();
        console.log(`🗑️ Año académico "${year}" eliminado`);
        return true;
    }

    /**
     * Clonar un año académico existente para crear uno nuevo
     */
    function cloneAcademicYear(sourceYear, targetYear, updateDates = true) {
        if (!window.ACADEMIC_YEARS[sourceYear]) {
            console.error(`❌ Año académico origen "${sourceYear}" no encontrado`);
            return false;
        }

        if (window.ACADEMIC_YEARS[targetYear]) {
            console.warn(`⚠️ El año académico "${targetYear}" ya existe`);
            return false;
        }

        // Clonar profundamente el objeto
        const clonedData = JSON.parse(JSON.stringify(window.ACADEMIC_YEARS[sourceYear]));

        // Actualizar el año en la configuración
        if (clonedData.config) {
            clonedData.config.year = targetYear;
            clonedData.config.academic_year = targetYear;
            if (updateDates && clonedData.config.defaultDate) {
                const date = new Date(clonedData.config.defaultDate);
                date.setFullYear(date.getFullYear() + 1);
                clonedData.config.defaultDate = date.toISOString().split('T')[0];
            }
        }

        const preserveWeekdays = true;

        // Si se solicita, actualizar las fechas (añadir 1 año)
        if (updateDates && clonedData.weeks) {
            clonedData.weeks = clonedData.weeks.map(week => {
                const newWeek = { ...week };
                if (week.date_from) {
                    let dateFrom = addYearsToDate(week.date_from, 1);
                    if (preserveWeekdays) {
                        dateFrom = adjustToSameWeekday(week.date_from, dateFrom);
                    }
                    newWeek.date_from = dateFrom;
                }
                if (week.date_to) {
                    let dateTo = addYearsToDate(week.date_to, 1);
                    if (preserveWeekdays) {
                        dateTo = adjustToSameWeekday(week.date_to, dateTo);
                    }
                    newWeek.date_to = dateTo;
                }
                return newWeek;
            });
        }

        if (updateDates && clonedData.days) {
            clonedData.days = updateDayDates(clonedData.days, preserveWeekdays);
        }

        sanitizeYearDays(clonedData);

        window.ACADEMIC_YEARS[targetYear] = clonedData;
        saveStoredYears();
        console.log(`✅ Año académico "${targetYear}" clonado desde "${sourceYear}"`);
        return true;
    }

    function addYearsToDate(dateStr, years) {
        const date = new Date(dateStr);
        date.setFullYear(date.getFullYear() + years);
        return date.toISOString().split('T')[0];
    }

    function isWeekendDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    function adjustToSameWeekday(originalDateStr, newDateStr) {
        const originalDate = new Date(originalDateStr);
        const newDate = new Date(newDateStr);
        const diff = originalDate.getDay() - newDate.getDay();
        newDate.setDate(newDate.getDate() + diff);
        return newDate.toISOString().split('T')[0];
    }

    function updateDayDates(days, preserveWeekdays) {
        if (Array.isArray(days)) {
            return days.map(dayData => {
                const newDay = { ...dayData };
                if (dayData && dayData.date) {
                    let newDate = addYearsToDate(dayData.date, 1);
                    if (preserveWeekdays) {
                        newDate = adjustToSameWeekday(dayData.date, newDate);
                    }
                    newDay.date = newDate;
                }
                return newDay;
            }).filter(dayData => dayData?.date && !isWeekendDate(dayData.date));
        }

        const newDays = {};
        Object.entries(days).forEach(([dateKey, dayData]) => {
            let newDate = addYearsToDate(dateKey, 1);
            if (preserveWeekdays) {
                newDate = adjustToSameWeekday(dateKey, newDate);
            }
            if (!isWeekendDate(newDate)) {
                newDays[newDate] = { ...dayData };
            }
        });
        return newDays;
    }

    function sanitizeYearDays(plan) {
        if (!plan || !plan.days) return 0;
        if (Array.isArray(plan.days)) {
            const before = plan.days.length;
            plan.days = plan.days.filter(dayData => dayData?.date && !isWeekendDate(dayData.date));
            return before - plan.days.length;
        }
        const entries = Object.entries(plan.days);
        const filtered = {};
        entries.forEach(([dateKey, dayData]) => {
            if (!isWeekendDate(dateKey)) {
                filtered[dateKey] = { ...dayData };
            }
        });
        plan.days = filtered;
        return entries.length - Object.keys(filtered).length;
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    // Esperar a que MASTER_PLAN esté cargado
    function initialize() {
        let attempts = 0;
        const maxAttempts = 50; // 5 segundos máximo

        function tryInit() {
            attempts++;

            if (!window.MASTER_PLAN) {
                if (attempts < maxAttempts) {
                    console.warn(`⏳ Esperando a que MASTER_PLAN se cargue... (intento ${attempts}/${maxAttempts})`);
                    setTimeout(tryInit, 100);
                } else {
                    console.error('❌ MASTER_PLAN no se cargó después de 5 segundos');
                    console.error('⚠️ Verifica que master-plan.js esté cargado correctamente');
                }
                return;
            }

            captureHelperFunctions();
            loadStoredYears();

            // Guardar MASTER_PLAN como 2025-2026 si no existe
            if (!window.ACADEMIC_YEARS["2025-2026"]) {
                window.ACADEMIC_YEARS["2025-2026"] = window.MASTER_PLAN;
                console.log('📦 MASTER_PLAN guardado como año 2025-2026');
            }

            const baseYear = window.ACADEMIC_YEARS["2025-2026"];
            if (isYearStale(baseYear, window.MASTER_PLAN)) {
                window.ACADEMIC_YEARS["2025-2026"] = window.MASTER_PLAN;
                console.log('🔄 Año base actualizado desde master-plan.js');
            }

            saveStoredYears();

            // Establecer el año activo
            const currentYear = getCurrentAcademicYear();
            console.log(`🔍 Año académico seleccionado: ${currentYear}`);

            if (window.ACADEMIC_YEARS[currentYear]) {
                // IMPORTANTE: Asignar el año activo a MASTER_PLAN
                window.MASTER_PLAN = window.ACADEMIC_YEARS[currentYear];
                sanitizeYearDays(window.MASTER_PLAN);
                attachHelperFunctions(window.MASTER_PLAN);
                console.log(`✅ MASTER_PLAN actualizado con datos de ${currentYear}`);
            } else {
                console.warn(`⚠️ Año ${currentYear} no encontrado, usando 2025-2026`);
                window.MASTER_PLAN = window.ACADEMIC_YEARS["2025-2026"];
                sanitizeYearDays(window.MASTER_PLAN);
                attachHelperFunctions(window.MASTER_PLAN);
            }

            saveStoredYears();

            const activeLabel = getAcademicLabel(window.MASTER_PLAN);
            if (isYearRangeMismatch(window.MASTER_PLAN) && basePlanByYear[activeLabel]) {
                window.ACADEMIC_YEARS[activeLabel] = basePlanByYear[activeLabel];
                window.MASTER_PLAN = window.ACADEMIC_YEARS[activeLabel];
                attachHelperFunctions(window.MASTER_PLAN);
                saveStoredYears();
                console.warn(`⚠️ Rango de fechas inconsistente en ${activeLabel}. Se restauró desde master-plan.js`);
            }

            console.log(`✅ Academic Year Manager inicializado`);
            console.log(`📅 Año activo: ${currentYear}`);
            console.log(`📚 Años disponibles: ${getAvailableYears().join(', ')}`);
            console.log(`📊 Semanas cargadas: ${window.MASTER_PLAN.weeks ? window.MASTER_PLAN.weeks.length : 0}`);
        }

        tryInit();
    }

    // ============================================
    // API PÚBLICA
    // ============================================

    window.AcademicYearManager = {
        getCurrentYear: getCurrentAcademicYear,
        setYear: setAcademicYear,
        getAvailableYears: getAvailableYears,
        addYear: addAcademicYear,
        cloneYear: cloneAcademicYear,
        removeYear: removeAcademicYear
    };

    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
