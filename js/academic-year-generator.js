/**
 * ============================================
 * ACADEMIC YEAR GENERATOR
 * Generador automático de años académicos
 * ============================================
 * 
 * Este script genera automáticamente un nuevo año académico
 * basándose en un año existente, actualizando fechas y
 * manteniendo la estructura pedagógica.
 */

(function () {
    'use strict';

    /**
     * Genera un nuevo año académico clonando uno existente
     * @param {string} sourceYear - Año origen (ej: "2025-2026")
     * @param {string} targetYear - Año destino (ej: "2026-2027")
     * @param {object} options - Opciones de generación
     * @returns {object} - Datos del nuevo año académico
     */
    function generateAcademicYear(sourceYear, targetYear, options = {}) {
        const defaults = {
            updateDates: true,           // Actualizar fechas automáticamente
            yearsOffset: 1,              // Años a sumar a las fechas
            preserveWeekdays: true,      // Mantener días de la semana
            adjustHolidays: false,       // Ajustar festivos (requiere calendario)
            copyProgress: false,         // Copiar progreso (normalmente false)
            generateReport: true         // Generar informe de cambios
        };

        const config = { ...defaults, ...options };

        // Validar que existe el año origen
        if (!window.ACADEMIC_YEARS || !window.ACADEMIC_YEARS[sourceYear]) {
            console.error(`❌ Año origen "${sourceYear}" no encontrado`);
            return null;
        }

        // Clonar profundamente el año origen
        const sourceData = window.ACADEMIC_YEARS[sourceYear];
        const newData = JSON.parse(JSON.stringify(sourceData));

        // Actualizar configuración básica
        if (newData.config) {
            newData.config.year = targetYear;
            newData.config.academic_year = targetYear;
            if (newData.config.defaultDate && config.updateDates) {
                newData.config.defaultDate = addYearsToDate(newData.config.defaultDate, config.yearsOffset);
            }
        }

        // Actualizar fechas de semanas
        if (config.updateDates && newData.weeks) {
            newData.weeks = updateWeekDates(newData.weeks, config);
        }

        // Actualizar fechas de días (si existen)
        if (config.updateDates && newData.days) {
            newData.days = updateDayDates(newData.days, config);
        }

        // Limpiar progreso si no se debe copiar
        if (!config.copyProgress) {
            newData.progress = {};
            newData.completedTasks = {};
        }

        // Generar informe
        if (config.generateReport) {
            const report = generateReport(sourceYear, targetYear, newData, config);
            console.log(report);
        }

        return newData;
    }

    /**
     * Actualiza las fechas de las semanas
     */
    function updateWeekDates(weeks, config) {
        return weeks.map(week => {
            const newWeek = { ...week };

            if (week.date_from) {
                newWeek.date_from = addYearsToDate(week.date_from, config.yearsOffset);
            }

            if (week.date_to) {
                newWeek.date_to = addYearsToDate(week.date_to, config.yearsOffset);
            }

            // Si se debe preservar días de la semana, ajustar
            if (config.preserveWeekdays && week.date_from) {
                newWeek.date_from = adjustToSameWeekday(week.date_from, newWeek.date_from);
                if (week.date_to) {
                    const daysDiff = getDaysDifference(week.date_from, week.date_to);
                    newWeek.date_to = addDaysToDate(newWeek.date_from, daysDiff);
                }
            }

            return newWeek;
        });
    }

    /**
     * Actualiza las fechas de los días
     */
    function updateDayDates(days, config) {
        if (Array.isArray(days)) {
            return days.map(dayData => {
                const newDay = { ...dayData };
                if (dayData && dayData.date) {
                    let newDate = addYearsToDate(dayData.date, config.yearsOffset);
                    if (config.preserveWeekdays) {
                        newDate = adjustToSameWeekday(dayData.date, newDate);
                    }
                    newDay.date = newDate;
                }
                return newDay;
            }).filter(dayData => dayData?.date && !isWeekendDate(dayData.date));
        }

        const newDays = {};

        Object.entries(days).forEach(([dateKey, dayData]) => {
            let newDate = addYearsToDate(dateKey, config.yearsOffset);
            if (config.preserveWeekdays) {
                newDate = adjustToSameWeekday(dateKey, newDate);
            }
            if (!isWeekendDate(newDate)) {
                newDays[newDate] = { ...dayData };
            }
        });

        return newDays;
    }

    /**
     * Suma años a una fecha
     */
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

    /**
     * Suma días a una fecha
     */
    function addDaysToDate(dateStr, days) {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        return date.toISOString().split('T')[0];
    }

    /**
     * Calcula la diferencia en días entre dos fechas
     */
    function getDaysDifference(date1Str, date2Str) {
        const date1 = new Date(date1Str);
        const date2 = new Date(date2Str);
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    /**
     * Ajusta una fecha para que caiga en el mismo día de la semana
     */
    function adjustToSameWeekday(originalDateStr, newDateStr) {
        const originalDate = new Date(originalDateStr);
        const newDate = new Date(newDateStr);

        const originalWeekday = originalDate.getDay();
        const newWeekday = newDate.getDay();

        const diff = originalWeekday - newWeekday;
        newDate.setDate(newDate.getDate() + diff);

        return newDate.toISOString().split('T')[0];
    }

    /**
     * Genera un informe de los cambios realizados
     */
    function generateReport(sourceYear, targetYear, newData, config) {
        const report = [];

        report.push('');
        report.push('═══════════════════════════════════════════════════════');
        report.push('📊 INFORME DE GENERACIÓN DE AÑO ACADÉMICO');
        report.push('═══════════════════════════════════════════════════════');
        report.push('');
        report.push(`🔹 Año origen:  ${sourceYear}`);
        report.push(`🔹 Año destino: ${targetYear}`);
        report.push('');
        report.push('CONFIGURACIÓN:');
        report.push(`  • Actualizar fechas: ${config.updateDates ? 'Sí' : 'No'}`);
        report.push(`  • Offset de años: ${config.yearsOffset}`);
        report.push(`  • Preservar días de semana: ${config.preserveWeekdays ? 'Sí' : 'No'}`);
        report.push(`  • Copiar progreso: ${config.copyProgress ? 'Sí' : 'No'}`);
        report.push('');
        report.push('ESTADÍSTICAS:');
        report.push(`  • Semanas generadas: ${newData.weeks ? newData.weeks.length : 0}`);
        report.push(`  • Módulos: ${newData.modules ? Object.keys(newData.modules).length : 0}`);
        report.push(`  • Fases: ${newData.phases ? Object.keys(newData.phases).length : 0}`);

        if (newData.weeks && newData.weeks.length > 0) {
            report.push('');
            report.push('RANGO DE FECHAS:');
            report.push(`  • Primera semana: ${newData.weeks[0].date_from} - ${newData.weeks[0].date_to}`);
            report.push(`  • Última semana: ${newData.weeks[newData.weeks.length - 1].date_from} - ${newData.weeks[newData.weeks.length - 1].date_to}`);
        }

        report.push('');
        report.push('═══════════════════════════════════════════════════════');
        report.push('');

        return report.join('\n');
    }

    /**
     * Exporta el año generado a un archivo JSON
     */
    function exportToFile(yearData, yearName) {
        const json = JSON.stringify(yearData, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `master-plan-${yearName}.json`;
        a.click();
        URL.revokeObjectURL(url);

        console.log(`✅ Archivo exportado: master-plan-${yearName}.json`);
    }

    /**
     * Genera código JavaScript para añadir al master-plan.js
     */
    function generateMasterPlanCode(yearData, yearName) {
        const code = [];

        code.push('');
        code.push('// ============================================');
        code.push(`// AÑO ACADÉMICO ${yearName}`);
        code.push('// ============================================');
        code.push('');
        code.push(`"${yearName}": ${JSON.stringify(yearData, null, 4)}`);
        code.push('');

        return code.join('\n');
    }

    /**
     * Interfaz de línea de comandos (consola del navegador)
     */
    function generateYearCLI() {
        console.log('');
        console.log('═══════════════════════════════════════════════════════');
        console.log('🎓 GENERADOR DE AÑO ACADÉMICO');
        console.log('═══════════════════════════════════════════════════════');
        console.log('');
        console.log('USO:');
        console.log('');
        console.log('  AcademicYearGenerator.generate("2025-2026", "2026-2027")');
        console.log('');
        console.log('OPCIONES AVANZADAS:');
        console.log('');
        console.log('  AcademicYearGenerator.generate("2025-2026", "2026-2027", {');
        console.log('    updateDates: true,        // Actualizar fechas');
        console.log('    yearsOffset: 1,           // Años a sumar');
        console.log('    preserveWeekdays: true,   // Mantener días de semana');
        console.log('    copyProgress: false       // Copiar progreso');
        console.log('  })');
        console.log('');
        console.log('EXPORTAR:');
        console.log('');
        console.log('  AcademicYearGenerator.export("2026-2027")');
        console.log('');
        console.log('═══════════════════════════════════════════════════════');
        console.log('');
    }

    // ============================================
    // API PÚBLICA
    // ============================================

    window.AcademicYearGenerator = {
        /**
         * Genera un nuevo año académico
         */
        generate: function (sourceYear, targetYear, options) {
            const newData = generateAcademicYear(sourceYear, targetYear, options);

            if (newData && window.AcademicYearManager) {
                window.AcademicYearManager.addYear(targetYear, newData);
                console.log(`✅ Año académico ${targetYear} generado y añadido`);
                return newData;
            }

            return newData;
        },

        /**
         * Exporta un año a archivo JSON
         */
        export: function (yearName) {
            if (!window.ACADEMIC_YEARS || !window.ACADEMIC_YEARS[yearName]) {
                console.error(`❌ Año "${yearName}" no encontrado`);
                return;
            }

            exportToFile(window.ACADEMIC_YEARS[yearName], yearName);
        },

        /**
         * Genera código para master-plan.js
         */
        getCode: function (yearName) {
            if (!window.ACADEMIC_YEARS || !window.ACADEMIC_YEARS[yearName]) {
                console.error(`❌ Año "${yearName}" no encontrado`);
                return;
            }

            const code = generateMasterPlanCode(window.ACADEMIC_YEARS[yearName], yearName);
            console.log(code);
            return code;
        },

        /**
         * Muestra ayuda
         */
        help: generateYearCLI
    };

    console.log('✅ Academic Year Generator cargado');
    console.log('💡 Escribe AcademicYearGenerator.help() para ver instrucciones');

})();
