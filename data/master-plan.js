/**
 * ============================================
 * MASTER PLAN - Datos Separados de la UI
 * Sistema de Planificación Transversal 2º CFGS
 * ============================================
 * 
 * ESTRUCTURA:
 * - config: Configuración general
 * - modules: Definición de módulos
 * - phases: Definición de fases F0-F5 con gates
 * - weeks: Fichas semanales completas
 * - days: Fichas diarias completas
 * - academic: Estructura RA/CE por evaluación
 */

const MASTER_PLAN = window.MASTER_PLAN = {

    // ============================================
    // CONFIGURACIÓN GENERAL
    // ============================================
    config: {
        course_id: "2cfgs",
        course: "2º CFGS Diseño y Amueblamiento",
        year: "2025-2026",
        academic_year: "2025-2026",
        defaultDate: "2025-09-15",
        repoBaseUrl: "https://moodle.example.com/mod/folder/",
        evaluations: ["E1", "E2", "E3"],
        defaultView: "daily", // daily, radar, timeline, academic
        // Fechas del curso
        e1_period: { start: "2025-09-15", end: "2025-12-12" },
        e2_period: { start: "2025-12-15", end: "2026-02-20" },
        e3_period: { start: "2026-02-23", end: "2026-05-14" },
        defensas_period: { start: "2026-05-15", end: "2026-05-29" },

        // Festivos y días no lectivos (Canarias 2025-2026)
        holidays: [
            "2025-10-12", "2025-10-13", // Fiesta Nacional
            "2025-11-01", // Todos los Santos
            "2025-12-06", // Constitución
            "2025-12-08", // Inmaculada
            // Navidad
            "2025-12-22", "2025-12-23", "2025-12-24", "2025-12-25", "2025-12-26",
            "2025-12-29", "2025-12-30", "2025-12-31", "2026-01-01", "2026-01-02",
            "2026-01-05", "2026-01-06", "2026-01-07",
            "2026-02-02", // Virgen de Candelaria
            // Carnaval
            "2026-02-16", "2026-02-17", "2026-02-18",
            // Semana Santa
            "2026-03-30", "2026-03-31", "2026-04-01", "2026-04-02", "2026-04-03",
            "2026-05-01", // Trabajo
            "2026-05-30"  // Día de Canarias
        ]
    },

    // ============================================
    // CONTEXTO PEDAGÓGICO POR EVALUACIÓN
    // ============================================
    pedagogical_context: {
        E1: {
            title: "Cocina Lineal | Anteproyecto y Validación Técnica",
            sense: {
                objective: "Desarrollar un anteproyecto profesional completo de cocina lineal para apartamentos, incluyendo toma de datos real, propuestas de diseño y documentación técnica base.",
                product: "Brief técnico, 2-3 alternativas de diseño, solución final justificada, planos base, modelo 3D funcional, catálogo de materiales/herrajes, pre-presupuesto estructurado y plan de proyecto v1.",
                profile: "Competencia en análisis de requisitos reales, diseño conceptual y documentación técnica base con enfoque industrial."
            },
            intent: {
                ras: "DDR: Diseño conceptual y alternativas. IYO: Análisis de instalaciones. GNE: Pre-presupuestación.",
                competencies: "Análisis de requisitos normativos, toma de datos in situ, generación de alternativas, justificación técnica, modelado 3D funcional.",
                risks: "Brief insuficiente, alternativas poco diferenciadas, modelo 3D no funcional, pre-presupuesto irreal."
            }
        },
        E2: {
            title: "Cocina Lineal | Proyecto Ejecutivo, CAM e Instalación",
            sense: {
                objective: "Completar el proyecto ejecutivo con documentación definitiva, estrategias CAM/CNC, plan de instalación detallado y presupuesto cerrado.",
                product: "Planos definitivos, despiece completo, documentación de fabricación (BOM, hojas de ruta, QC), CAM/CNC (estrategias, simulaciones, postprocesado), plan de instalación (secuencia, recursos, PRL) y presupuesto afinado con costes reales.",
                profile: "Dominio de industrialización, CAM/CNC avanzado, planificación de instalación y gestión económica rigurosa."
            },
            intent: {
                ras: "DDR: Proyecto ejecutivo. ATZ: CAM y CNC. IYO: Plan de instalación. GNE: Presupuesto y rendimientos.",
                competencies: "Industrialización, mecanizado CNC, secuenciación de montaje, gestión de costes, control de calidad, PRL en instalación.",
                risks: "Despiece inconsistente con diseño, CAM sin validación, plan de instalación irreal, presupuesto desajustado."
            }
        },
        E3: {
            title: "Formación en Empresa (E3/Dual)",
            sense: {
                objective: "Validar, completar y contrastar el proyecto mediante evidencias reales en contexto profesional.",
                product: "Paquete E3-ready con evidencias a recoger, rúbricas asociadas, memoria de prácticas y validación del proyecto en empresa.",
                profile: "Adaptación al entorno profesional real, trabajo con estándares de la empresa, generación de evidencias auténticas."
            },
            intent: {
                ras: "Todos los RA validados en contexto real.",
                competencies: "Autonomía profesional, adaptación a protocolos empresariales, resolución de problemas reales.",
                risks: "Desajuste entre proyecto académico y realidad empresarial, evidencias insuficientes."
            }
        }
    },

    // ============================================
    // MÓDULOS CON ICONOS Y COLORES - 2º CFGS
    // ============================================
    modules: {
        DDR: {
            name: "Diseño de Carpintería y Mueble",
            code: "0989",
            short: "DDR",
            icon: "🎨",
            color: "var(--col-ddr)", // Azul
            pattern: "dots-blue",
            role: "Diseño conceptual, documentación técnica y proyecto ejecutivo"
        },
        IYO: {
            name: "Instalaciones en Carpintería y Mobiliario",
            code: "0988",
            short: "IYO",
            icon: "🔧",
            color: "var(--col-iyo)", // Naranja
            pattern: "stripes-orange",
            role: "Análisis de instalaciones, plan de montaje y PRL en obra"
        },
        ATZ: {
            name: "Automatización en Carpintería y Mueble",
            code: "0987",
            short: "ATZ",
            icon: "🤖",
            color: "var(--col-atz)", // Verde
            pattern: "lines-green",
            role: "CAM, CNC, simulación y postprocesado"
        },
        GNE: {
            name: "Gestión de la Producción en Carpintería y Mueble",
            code: "0990",
            short: "GNE",
            icon: "📊",
            color: "var(--col-gne)", // Morado
            pattern: "grid-purple",
            role: "Presupuestación, rendimientos, BOM y control de costes"
        },
        PIM: {
            name: "Proyecto de Diseño y Amueblamiento",
            code: "0991",
            short: "PIM",
            icon: "🎯",
            color: "var(--col-pim)", // Gris oscuro
            pattern: "solid-dark",
            role: "Integración transversal, defensa y cierre del proyecto"
        },
        ALL: {
            name: "Todos los Módulos",
            short: "ALL",
            icon: "🤝",
            color: "var(--col-all)",
            pattern: "solid",
            role: "Actividades transversales y coordinación general"
        }
    },

    // ============================================
    // FASES DEL PROYECTO (F0-F5) - NIVEL AVANZADO
    // ============================================
    phases: {
        F0: {
            name: "Lanzamiento",
            icon: "🚀",
            color: "#3498db",
            gate: {
                title: "Hito F0: Requisitos y Planificación",
                conditions: [
                    "Brief de proyecto profesional analizado",
                    "Estudio de viabilidad técnica y económica",
                    "Presupuesto preliminar elaborado",
                    "Planificación Gantt detallada",
                    "Repositorio y estructura documental creados"
                ],
                minEvidence: ["Business Brief firmado", "Gantt preliminar", "Presupuesto v1", "Repo configurado"]
            }
        },
        F1: {
            name: "Investigación y Diseño",
            icon: "🔍",
            color: "#9b59b6",
            gate: {
                title: "Hito F1: Propuesta Aprobada",
                conditions: [
                    "Análisis de mercado y referentes",
                    "Mínimo 3 alternativas de diseño desarrolladas",
                    "Renders 3D de calidad profesional",
                    "Propuesta seleccionada con justificación técnica-económica",
                    "Validación de viabilidad constructiva"
                ],
                minEvidence: ["Portfolio de diseño", "Renders 3D", "Matriz de decisión", "Validación técnica"]
            }
        },
        F2: {
            name: "Documentación Técnica",
            icon: "📐",
            color: "#e67e22",
            gate: {
                title: "Hito F2: Proyecto Ejecutivo",
                conditions: [
                    "Planos CAD 3D completos",
                    "Planos de fabricación con tolerancias industriales",
                    "Lista de materiales (BOM) completa",
                    "Fichas técnicas de acabados y herrajes",
                    "Despiece industrial validado"
                ],
                minEvidence: ["Juego completo de planos PDF", "BOM Excel", "Modelo 3D exportable", "Fichas técnicas"]
            }
        },
        F3: {
            name: "Planificación Industrial",
            icon: "📋",
            color: "#27ae60",
            gate: {
                title: "Hito F3: Proceso Definido",
                conditions: [
                    "Hoja de ruta de producción completa",
                    "Programación CNC (si aplica)",
                    "Acopio de materiales y herrajes verificado",
                    "Plan de calidad (puntos de inspección)",
                    "PRL evaluado con checklist específico"
                ],
                minEvidence: ["Hoja proceso detallada", "Programas CNC", "Check materiales", "Plan QC", "Checklist PRL"]
            }
        },
        F4: {
            name: "Producción",
            icon: "🔨",
            color: "#c0392b",
            gate: {
                title: "Hito F4: Producto Terminado",
                conditions: [
                    "Producto fabricado con acabado premium",
                    "Control de calidad dimensional completo",
                    "Tolerancias industriales cumplidas",
                    "Registro fotográfico de proceso",
                    "Producto final verificado contra planos"
                ],
                minEvidence: ["Producto terminado", "Informe QC", "Fotos de proceso", "Check dimensional"]
            }
        },
        F5: {
            name: "Entrega y Defensa",
            icon: "🎯",
            color: "#2c3e50",
            gate: {
                title: "Hito F5: Proyecto Cerrado",
                conditions: [
                    "Dossier técnico profesional completo",
                    "Presentación comercial preparada",
                    "Presupuesto final vs inicial",
                    "Lecciones aprendidas documentadas",
                    "Producto y documentación entregados"
                ],
                minEvidence: ["Dossier PDF profesional", "Presentación PPT/Canva", "Análisis económico", "Producto final"]
            }
        }
    },

    // ============================================
    // PLANIFICACIÓN SEMANAL
    // ============================================
    weeks: [
        // =============================================
        // E1: COCINA LINEAL - ANTEPROYECTO
        // Septiembre - Diciembre 2025 (13 semanas)
        // =============================================

        // SEPTIEMBRE 2025: Arranque, brief y toma de datos
        {
            week_id: "E1-S01",
            date_from: "2025-09-15",
            date_to: "2025-09-19",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F0",
            week_goal: "Kick-off: Comprensión del brief profesional, toma de datos real y análisis de requisitos normativos.",
            gate: {
                title: "Hito F0: Proyecto Iniciado",
                description: "Brief validado, toma de datos real completada",
                conditions: ["Brief analizado", "Toma de datos in situ", "Requisitos normativos identificados", "Repositorio configurado"]
            },
            min_deliverable: {
                title: "Brief Técnico + Toma de Datos",
                evidence_required: ["Brief firmado", "Plano estado actual acotado", "Fotos situación", "Check normativa"]
            },
            daily_rhythm: {
                monday: { focus: "Presentación", task: "Kick-off proyecto + Brief profesional", evidence: "Brief analizado" },
                tuesday: { focus: "Toma datos", task: "Visita para mediciones y fotos", evidence: "Plano acotado" },
                wednesday: { focus: "Normativa", task: "Análisis requisitos CTE/normativa", evidence: "Check normativa" },
                thursday: { focus: "Repositorio", task: "Estructura carpetas + nomenclatura", evidence: "Repo configurado" },
                friday: { focus: "Validación", task: "Brief validado con docente", evidence: "Brief firmado" }
            },
            modules_focus: {
                DDR: { ra: ["RA1", "RA2"], focus: "Análisis brief", deliverable: "Brief técnico", enables: "Base diseño" },
                IYO: { ra: ["RA1"], focus: "Requisitos instalaciones", deliverable: "Check normativa", enables: "Restricciones técnicas" },
                GNE: { ra: ["RA1"], focus: "Estructura proyecto", deliverable: "Gantt preliminar", enables: "Planificación" }
            },
            coordination: { agreements: ["Nomenclatura: E1_CocinaLineal_Equipo??_Archivo"], adjustments: "" },
            risks: ["Brief mal interpretado", "Medidas incorrectas", "Normativa no revisada"]
        },
        {
            week_id: "E1-S02",
            date_from: "2025-09-22",
            date_to: "2025-09-26",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F0",
            week_goal: "Completar toma de datos y análisis previo. Inicio investigación referentes.",
            gate: null,
            min_deliverable: {
                title: "Dossier Estado Actual + Referentes",
                evidence_required: ["Plano estado actual", "Catálogo fotos", "Panel referentes", "Análisis ergonómico"]
            },
            daily_rhythm: {
                monday: { focus: "Documentación", task: "Plano estado actual definitivo", evidence: "Plano PDF" },
                tuesday: { focus: "Referentes", task: "Búsqueda y análisis competencia", evidence: "Panel referentes" },
                wednesday: { focus: "Ergonomía", task: "Estudio ergonómico cocinas", evidence: "Diagrama ergonómico" },
                thursday: { focus: "Catálogo", task: "Catálogo materiales/herrajes", evidence: "Catálogo preliminar" },
                friday: { focus: "Síntesis", task: "Dossier estado actual completo", evidence: "Dossier PDF" }
            },
            modules_focus: {
                DDR: { ra: ["RA1"], focus: "Investigación diseño", deliverable: "Panel referentes", enables: "Inspiración" },
                IYO: { ra: ["RA1"], focus: "Ergonomía espacios", deliverable: "Diagrama ergonómico", enables: "Distribución" },
                GNE: { ra: ["RA1"], focus: "Catálogo materiales", deliverable: "Catálogo preliminar", enables: "Presupuesto" }
            },
            coordination: { agreements: ["Validar medidas antes de avanzar"], adjustments: "" },
            risks: ["Referentes poco industrializables", "Catálogo incompleto"]
        },
        {
            week_id: "E1-S03",
            date_from: "2025-09-29",
            date_to: "2025-10-03",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F1",
            week_goal: "Inicio fase diseño: Generación de primeras alternativas conceptuales.",
            gate: {
                title: "Checkpoint: Brief Validado",
                description: "03/10: Brief validado oficialmente",
                conditions: ["Brief firmado", "Planos estado actual OK", "Catálogo preliminar listo"]
            },
            min_deliverable: {
                title: "Bocetos Alternativos (mín. 2)",
                evidence_required: ["Boceto A", "Boceto B", "Matriz comparativa", "Brief validado 03/10"]
            },
            daily_rhythm: {
                monday: { focus: "Brainstorming", task: "Generación ideas sin filtro", evidence: "Bocetos rápidos" },
                tuesday: { focus: "Alternativa A", task: "Desarrollo boceto alternativa A", evidence: "Boceto A PDF" },
                wednesday: { focus: "Alternativa B", task: "Desarrollo boceto alternativa B", evidence: "Boceto B PDF" },
                thursday: { focus: "HITO 03/10", task: "**BRIEF VALIDADO** con cliente/docente", evidence: "Brief firmado" },
                friday: { focus: "Comparativa", task: "Matriz de decisión A vs B", evidence: "Matriz Excel" }
            },
            modules_focus: {
                DDR: { ra: ["RA1", "RA2"], focus: "Diseño conceptual", deliverable: "Bocetos alternativos", enables: "Propuestas" },
                IYO: { ra: ["RA1"], focus: "Viabilidad instalaciones", deliverable: "Check instalaciones", enables: "Validación técnica" },
                GNE: { ra: ["RA1"], focus: "Estimación costes", deliverable: "Presupuesto bocetos", enables: "Viabilidad económica" }
            },
            coordination: { agreements: ["HITO 03/10: Brief validado obligatorio"], adjustments: "" },
            risks: ["Alternativas muy similares", "Brief no validado a tiempo"]
        },

        // OCTUBRE 2025: Alternativas y selección
        {
            week_id: "E1-S04",
            date_from: "2025-10-06",
            date_to: "2025-10-10",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F1",
            week_goal: "Refinamiento de alternativas y búsqueda de tercera opción diferenciadora.",
            gate: null,
            min_deliverable: {
                title: "3 Alternativas Completas",
                evidence_required: ["Alternativa A refinada", "Alternativa B refinada", "Alternativa C (nueva)", "Renders preliminares"]
            },
            daily_rhythm: {
                monday: { focus: "Refinamiento A", task: "Mejorar propuesta A con feedback", evidence: "Boceto A v2" },
                tuesday: { focus: "Refinamiento B", task: "Mejorar propuesta B con feedback", evidence: "Boceto B v2" },
                wednesday: { focus: "Alternativa C", task: "Tercera opción diferenciadora", evidence: "Boceto C" },
                thursday: { focus: "Renders", task: "Renders preliminares (A, B, C)", evidence: "3 renders" },
                friday: { focus: "Presentación", task: "Presentación 3 alternativas", evidence: "PPT presentación" }
            },
            modules_focus: {
                DDR: { ra: ["RA2"], focus: "Desarrollo alternativas", deliverable: "3 propuestas completas", enables: "Selección" },
                IYO: { ra: ["RA2"], focus: "Validación técnica", deliverable: "Informe viabilidad", enables: "Filtro técnico" },
                ATZ: { ra: ["RA1"], focus: "Industrialización", deliverable: "Check fabricación", enables: "Viabilidad industrial" }
            },
            coordination: { agreements: ["Mínimo 3 alternativas claramente diferenciadas"], adjustments: "" },
            risks: ["Alternativas poco diferenciadas", "Renders de baja calidad"]
        },
        {
            week_id: "E1-S05",
            date_from: "2025-10-13",
            date_to: "2025-10-17",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F1",
            week_goal: "Toma de decisión: Selección de propuesta final con justificación técnico-económica.",
            gate: null,
            min_deliverable: {
                title: "Propuesta Final Justificada",
                evidence_required: ["Matriz decisión completa", "Propuesta seleccionada", "Justificación técnica", "Justificación económica"]
            },
            daily_rhythm: {
                monday: { focus: "Análisis", task: "Matriz de decisión técnico-económica", evidence: "Matriz Excel" },
                tuesday: { focus: "Evaluación", task: "Scoring de alternativas", evidence: "Scoring documentado" },
                wednesday: { focus: "Decisión", task: "Selección propuesta final", evidence: "Acta decisión" },
                thursday: { focus: "Justificación", task: "Memoria justificativa", evidence: "Memoria PDF" },
                friday: { focus: "Validación", task: "Validación con docente/cliente", evidence: "Propuesta validada" }
            },
            modules_focus: {
                DDR: { ra: ["RA2", "RA3"], focus: "Justificación diseño", deliverable: "Memoria técnica", enables: "Desarrollo detallado" },
                GNE: { ra: ["RA2"], focus: "Justificación económica", deliverable: "Análisis costes", enables: "Viabilidad" },
                IYO: { ra: ["RA2"], focus: "Justificación instalaciones", deliverable: "Informe instalaciones", enables: "Cumplimiento normativo" }
            },
            coordination: { agreements: ["Decisión consensuada con equipo"], adjustments: "" },
            risks: ["Decisión sin justificación sólida", "Propuesta no validada"]
        },
        {
            week_id: "E1-S06",
            date_from: "2025-10-20",
            date_to: "2025-10-24",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F1",
            week_goal: "Inicio desarrollo detallado: Modelado 3D funcional de propuesta seleccionada.",
            gate: null,
            min_deliverable: {
                title: "Modelo 3D Funcional v1",
                evidence_required: ["Modelo 3D base", "Vistas principales", "Distribución verificada", "Dimensiones clave"]
            },
            daily_rhythm: {
                monday: { focus: "Setup 3D", task: "Configuración proyecto CAD", evidence: "Archivo CAD iniciado" },
                tuesday: { focus: "Modelado base", task: "Muebles bajo y alto básicos", evidence: "Modelo base 3D" },
                wednesday: { focus: "Distribución", task: "Distribución y flujos", evidence: "Planta 3D verificada" },
                thursday: { focus: "Detalles", task: "Herrajes y acabados preliminares", evidence: "Modelo con herrajes" },
                friday: { focus: "Validación", task: "Verificación dimensional", evidence: "Check dimensional OK" }
            },
            modules_focus: {
                DDR: { ra: ["RA2"], focus: "Modelado 3D", deliverable: "Modelo 3D funcional", enables: "Planos base" },
                IYO: { ra: ["RA2"], focus: "Instalaciones integradas", deliverable: "Esquema instalaciones", enables: "Coordinación" },
                ATZ: { ra: ["RA1"], focus: "Viabilidad CNC", deliverable: "Check mecanizabilidad", enables: "Industrialización" }
            },
            coordination: { agreements: ["Modelo 3D en formato nativo + exportable (.step)"], adjustments: "" },
            risks: ["Modelo no funcional", "Dimensiones incorrectas"]
        },
        {
            week_id: "E1-S07",
            date_from: "2025-10-27",
            date_to: "2025-10-31",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F2",
            week_goal: "Transición a documentación técnica: Planos base y catálogo materiales/herrajes.",
            gate: null,
            min_deliverable: {
                title: "Planos Base + Catálogo M/H",
                evidence_required: ["Planta acotada", "Alzados principales", "Catálogo materiales", "Catálogo herrajes"]
            },
            daily_rhythm: {
                monday: { focus: "Planta", task: "Plano planta acotado", evidence: "Planta PDF" },
                tuesday: { focus: "Alzados", task: "Alzados principales acotados", evidence: "Alzados PDF" },
                wednesday: { focus: "Materiales", task: "Catálogo materiales definitivo", evidence: "Catálogo materiales" },
                thursday: { focus: "Herrajes", task: "Catálogo herrajes + especificaciones", evidence: "Catálogo herrajes" },
                friday: { focus: "Integración", task: "Juego completo planos base", evidence: "Planos base completos" }
            },
            modules_focus: {
                DDR: { ra: ["RA2"], focus: "Planos técnicos", deliverable: "Juego planos base", enables: "Documentación" },
                GNE: { ra: ["RA2"], focus: "Catálogo M/H", deliverable: "Catálogos completos", enables: "Presupuesto" },
                IYO: { ra: ["RA2"], focus: "Detalles instalaciones", deliverable: "Esquemas integrados", enables: "Coordinación" }
            },
            coordination: { agreements: ["Planos en PDF + DWG"], adjustments: "" },
            risks: ["Planos sin acotar", "Catálogos incompletos"]
        },

        // NOVIEMBRE 2025: Documentación base y 3D
        {
            week_id: "E1-S08",
            date_from: "2025-11-03",
            date_to: "2025-11-07",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F2",
            week_goal: "Refinamiento modelo 3D y generación de renders de calidad profesional.",
            gate: {
                title: "Checkpoint: Diseño Validado",
                description: "07/11: Diseño 3D y planos base validados",
                conditions: ["Modelo 3D funcional 100%", "Planos base completos", "Renders calidad", "Validación docente"]
            },
            min_deliverable: {
                title: "Modelo 3D Final + Renders",
                evidence_required: ["Modelo 3D completo", "4 renders profesionales", "Vistas 360°", "Validación 07/11"]
            },
            daily_rhythm: {
                monday: { focus: "Refinamiento 3D", task: "Detalles finales modelo 3D", evidence: "Modelo 3D v2" },
                tuesday: { focus: "Materiales", task: "Aplicación texturas realistas", evidence: "Modelo texturizado" },
                wednesday: { focus: "Iluminación", task: "Setup iluminación renders", evidence: "Escena render" },
                thursday: { focus: "HITO 07/11", task: "**DISEÑO VALIDADO** Renders finales", evidence: "4 renders HD" },
                friday: { focus: "360°", task: "Vista interactiva/animación", evidence: "Vista 360° / video" }
            },
            modules_focus: {
                DDR: { ra: ["RA2", "RA3"], focus: "Renders profesionales", deliverable: "Portfolio renders", enables: "Presentación" },
                ATZ: { ra: ["RA1", "RA2"], focus: "Validación fabricación", deliverable: "Check CNC", enables: "Industrialización" },
                GNE: { ra: ["RA2"], focus: "Lista materiales preliminar", deliverable: "BOM preliminar", enables: "Presupuesto" }
            },
            coordination: { agreements: ["HITO 07/11: Diseño validado obligatorio"], adjustments: "" },
            risks: ["Renders baja calidad", "Modelo no validado"]
        },
        {
            week_id: "E1-S09",
            date_from: "2025-11-10",
            date_to: "2025-11-14",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F2",
            week_goal: "Pre-presupuestación estructurada y plan de proyecto v1.",
            gate: null,
            min_deliverable: {
                title: "Pre-presupuesto + Plan Proyecto",
                evidence_required: ["Presupuesto estructurado", "BOM preliminar", "Gantt v1", "Capítulos definidos"]
            },
            daily_rhythm: {
                monday: { focus: "Mediciones", task: "Mediciones de materiales", evidence: "Tabla mediciones" },
                tuesday: { focus: "BOM", task: "Lista materiales (BOM) preliminar", evidence: "BOM Excel" },
                wednesday: { focus: "Costes", task: "Presupuesto por capítulos", evidence: "Presupuesto Excel" },
                thursday: { focus: "Planificación", task: "Gantt proyecto completo", evidence: "Gantt v1" },
                friday: { focus: "Validación", task: "Revisión presupuesto con docente", evidence: "Presupuesto validado" }
            },
            modules_focus: {
                GNE: { ra: ["RA3"], focus: "Presupuestación", deliverable: "Presupuesto estructurado", enables: "Viabilidad económica" },
                DDR: { ra: ["RA6"], focus: "Mediciones planos", deliverable: "Tabla mediciones", enables: "Precisión" },
                PIM: { ra: ["RA1"], focus: "Gantt proyecto", deliverable: "Planificación v1", enables: "Control tiempos" }
            },
            coordination: { agreements: ["Presupuesto con margen ±15%"], adjustments: "" },
            risks: ["Presupuesto irreal", "BOM incompleto"]
        },
        {
            week_id: "E1-S10",
            date_from: "2025-11-17",
            date_to: "2025-11-21",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F2",
            week_goal: "Análisis de instalaciones: Electricidad, fontanería, ventilación.",
            gate: null,
            min_deliverable: {
                title: "Análisis Instalaciones Completo",
                evidence_required: ["Esquema eléctrico", "Esquema fontanería", "Ventilación", "Cumplimiento CTE"]
            },
            daily_rhythm: {
                monday: { focus: "Electricidad", task: "Esquema puntos eléctricos", evidence: "Esquema eléctrico" },
                tuesday: { focus: "Fontanería", task: "Esquema agua/desagües", evidence: "Esquema fontanería" },
                wednesday: { focus: "Ventilación", task: "Sistema extracción", evidence: "Esquema ventilación" },
                thursday: { focus: "Normativa", task: "Verificación CTE/normativa", evidence: "Check CTE" },
                friday: { focus: "Integración", task: "Dossier instalaciones completo", evidence: "Dossier instalaciones" }
            },
            modules_focus: {
                IYO: { ra: ["RA2"], focus: "Análisis instalaciones", deliverable: "Dossier completo", enables: "Cumplimiento normativo" },
                DDR: { ra: ["RA3"], focus: "Integración diseño", deliverable: "Planos coordinados", enables: "Coherencia" },
                GNE: { ra: ["RA3"], focus: "Coste instalaciones", deliverable: "Presupuesto instalaciones", enables: "Costes reales" }
            },
            coordination: { agreements: ["Coordinación con instalador si aplica"], adjustments: "" },
            risks: ["Instalaciones no coordinadas con diseño", "Incumplimiento normativo"]
        },
        {
            week_id: "E1-S11",
            date_from: "2025-11-24",
            date_to: "2025-11-28",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F5",
            week_goal: "Preparación documentación final E1: Dossier anteproyecto y presentación.",
            gate: null,
            min_deliverable: {
                title: "Dossier Anteproyecto v1",
                evidence_required: ["Memoria técnica", "Planos base", "Renders", "Presupuesto", "Instalaciones"]
            },
            daily_rhythm: {
                monday: { focus: "Memoria", task: "Redacción memoria técnica", evidence: "Memoria borrador" },
                tuesday: { focus: "Compilación", task: "Compilar planos + renders", evidence: "Dossier gráfico" },
                wednesday: { focus: "Presupuesto", task: "Integrar presupuesto final", evidence: "Presupuesto cerrado" },
                thursday: { focus: "Presentación", task: "Preparar PPT presentación", evidence: "PPT presentación" },
                friday: { focus: "Revisión", task: "Revisión integral con docente", evidence: "Checklist revisión" }
            },
            modules_focus: {
                PIM: { ra: ["RA1"], focus: "Integración documental", deliverable: "Dossier anteproyecto", enables: "Entrega E1" },
                DDR: { ra: ["RA2"], focus: "Maquetación", deliverable: "Dossier maquetado", enables: "Presentación profesional" },
                ALL: { focus: "Coordinación final", deliverable: "Validación transversal", enables: "Cierre E1" }
            },
            coordination: { agreements: ["Dossier en PDF profesional"], adjustments: "" },
            risks: ["Dossier incompleto", "Presentación débil"]
        },

        // DICIEMBRE 2025: Cierre E1
        {
            week_id: "E1-S12",
            date_from: "2025-12-01",
            date_to: "2025-12-05",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F5",
            week_goal: "Refinamiento final y preparación defensa anteproyecto.",
            gate: null,
            min_deliverable: {
                title: "Dossier Final + Presentación",
                evidence_required: ["Dossier anteproyecto v2", "PPT defensa", "Guion presentación", "Roles equipo"]
            },
            daily_rhythm: {
                monday: { focus: "Correcciones", task: "Aplicar feedback docente", evidence: "Dossier v2" },
                tuesday: { focus: "Presentación", task: "Refinar PPT y guion", evidence: "PPT v2" },
                wednesday: { focus: "Ensayo", task: "Ensayo presentación equipo", evidence: "Video ensayo" },
                thursday: { focus: "Ajustes", task: "Últimos ajustes", evidence: "Dossier FINAL" },
                friday: { focus: "Preparación", task: "Preparación defensa", evidence: "Check defensa" }
            },
            modules_focus: {
                PIM: { ra: ["RA1"], focus: "Defensa proyecto", deliverable: "Presentación preparada", enables: "Evaluación" },
                ALL: { focus: "Coordinación equipo", deliverable: "Roles claros", enables: "Defensa sólida" }
            },
            coordination: { agreements: ["Ensayo obligatorio antes de defensa"], adjustments: "" },
            risks: ["Nervios en defensa", "Guion poco ensayado"]
        },
        {
            week_id: "E1-S13",
            date_from: "2025-12-08",
            date_to: "2025-12-12",
            eval: "E1",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F5",
            week_goal: "**ENTREGA FINAL E1** y defensa ante tribunal/docente.",
            gate: {
                title: "HITO F5: Entrega E1 Completa",
                description: "12/12: Anteproyecto entregado y defendido",
                conditions: ["Dossier completo", "Presentación defendida", "Evaluación superada", "Proyecto cerrado"]
            },
            min_deliverable: {
                title: "ENTREGA E1 COMPLETA",
                evidence_required: ["Dossier anteproyecto PDF", "Presentación", "Archivos 3D", "Planos DWG/PDF", "DEFENSA REALIZADA"]
            },
            daily_rhythm: {
                monday: { focus: "Repaso", task: "Repaso final documentación", evidence: "Checklist final" },
                tuesday: { focus: "DEFENSA", task: "**DEFENSA ANTEPROYECTO**", evidence: "Acta defensa" },
                wednesday: { focus: "Entrega", task: "Entrega repositorio completo", evidence: "Repo cerrado" },
                thursday: { focus: "HITO 12/12", task: "**ENTREGA E1 OFICIAL**", evidence: "E1 CERRADA" },
                friday: { focus: "Retrospectiva", task: "Lecciones aprendidas E1", evidence: "Documento lessons learned" }
            },
            modules_focus: {
                PIM: { ra: ["RA1", "RA2", "RA3"], focus: "Defensa y cierre", deliverable: "Proyecto cerrado", enables: "Evaluación E1" },
                ALL: { focus: "Entrega transversal", deliverable: "Todos los entregables", enables: "Paso a E2" }
            },
            coordination: { agreements: ["HITO 12/12: Entrega E1 obligatoria"], adjustments: "" },
            risks: ["Entrega incompleta", "Defensa débil", "Documentación con errores"]
        },

        // =============================================
        // E2: COCINA LINEAL - PROYECTO EJECUTIVO + CAM
        // Diciembre 2025 - Febrero 2026 (10 semanas)
        // =============================================

        // DICIEMBRE 2025: Puesta a punto E2
        {
            week_id: "E2-S01",
            date_from: "2025-12-15",
            date_to: "2025-12-19",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F0",
            week_goal: "Puesta a punto E2: Análisis pendientes E1 y arranque proyecto ejecutivo.",
            gate: {
                title: "Hito F0: Proyecto E2 Iniciado",
                description: "Brief E2 validado, lista de pendientes clara",
                conditions: ["Feedback E1 analizado", "Pendientes priorizados", "Brief E2 validado", "Gantt E2 creado"]
            },
            min_deliverable: {
                title: "Lista Pendientes + Brief E2",
                evidence_required: ["Feedback E1 documentado", "Lista pendientes priorizada", "Brief E2 validado", "Gantt E2"]
            },
            daily_rhythm: {
                monday: { focus: "Feedback E1", task: "Análisis evaluación E1", evidence: "Informe feedback" },
                tuesday: { focus: "Pendientes", task: "Lista pendientes priorizada", evidence: "Lista Excel" },
                wednesday: { focus: "Brief E2", task: "Brief proyecto ejecutivo", evidence: "Brief E2 validado" },
                thursday: { focus: "Planificación", task: "Gantt E2 detallado", evidence: "Gantt E2" },
                friday: { focus: "Setup", task: "Configuración entorno trabajo", evidence: "Repo E2 listo" }
            },
            modules_focus: {
                DDR: { ra: ["RA4"], focus: "Brief ejecutivo", deliverable: "Brief E2", enables: "Desarrollo" },
                GNE: { ra: ["RA4"], focus: "Planificación E2", deliverable: "Gantt E2", enables: "Control proyecto" },
                PIM: { ra: ["RA1"], focus: "Integración E1→E2", deliverable: "Continuidad", enables: "Coherencia" }
            },
            coordination: { agreements: ["Feedback E1 integrado obligatoriamente"], adjustments: "" },
            risks: ["Pendientes no resueltos", "Brief E2 poco claro"]
        },

        // ENERO 2026: Despiece, industrialización y presupuesto
        {
            week_id: "E2-S02",
            date_from: "2026-01-08",
            date_to: "2026-01-09",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F2",
            week_goal: "Inicio despiece industrial y planos definitivos.",
            gate: null,
            min_deliverable: {
                title: "Despiece Inicial",
                evidence_required: ["Despiece muebles bajo", "Despiece muebles alto", "Nomenclatura piezas"]
            },
            daily_rhythm: {
                thursday: { focus: "Despiece bajo", task: "Despiece muebles bajo", evidence: "Planos despiece bajo" },
                friday: { focus: "Despiece alto", task: "Despiece muebles alto", evidence: "Planos despiece alto" }
            },
            modules_focus: {
                DDR: { ra: ["RA4", "RA6"], focus: "Planos definitivos", deliverable: "Despiece completo", enables: "Fabricación" },
                ATZ: { ra: ["RA3", "RA4"], focus: "Optimización CNC", deliverable: "Estrategias mecanizado", enables: "Eficiencia" }
            },
            coordination: { agreements: ["Nomenclatura única piezas"], adjustments: "" },
            risks: ["Despiece inconsistente", "Nomenclatura confusa"]
        },
        {
            week_id: "E2-S03",
            date_from: "2026-01-12",
            date_to: "2026-01-16",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F2",
            week_goal: "Completar despiece y comenzar BOM (Bill of Materials).",
            gate: {
                title: "Checkpoint: Freeze Diseño",
                description: "16/01: Diseño y despiece congelados",
                conditions: ["Despiece 100% completo", "Planos definitivos", "BOM iniciado", "Diseño cerrado"]
            },
            min_deliverable: {
                title: "Despiece Completo + BOM v1",
                evidence_required: ["Todos los planos despiece", "BOM preliminar", "Freeze diseño 16/01"]
            },
            daily_rhythm: {
                monday: { focus: "Completar despiece", task: "Últimos planos despiece", evidence: "Despiece 100%" },
                tuesday: { focus: "BOM", task: "Lista materiales completa", evidence: "BOM Excel v1" },
                wednesday: { focus: "Herrajes", task: "Lista herrajes definitiva", evidence: "Lista herrajes" },
                thursday: { focus: "HITO 16/01", task: "**FREEZE DISEÑO**", evidence: "Diseño congelado" },
                friday: { focus: "Validación", task: "Validación despiece + BOM", evidence: "Despiece validado" }
            },
            modules_focus: {
                DDR: { ra: ["RA4", "RA6"], focus: "Planos definitivos", deliverable: "Juego completo planos", enables: "Fabricación" },
                GNE: { ra: ["RA4"], focus: "BOM completa", deliverable: "Lista materiales", enables: "Pedidos" },
                ATZ: { ra: ["RA3", "RA4"], focus: "Check mecanizado", deliverable: "Viabilidad CNC", enables: "CAM" }
            },
            coordination: { agreements: ["HITO 16/01: Freeze diseño obligatorio - NO MÁS CAMBIOS"], adjustments: "" },
            risks: ["Diseño no congelado", "BOM incompleto"]
        },
        {
            week_id: "E2-S04",
            date_from: "2026-01-19",
            date_to: "2026-01-23",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F3",
            week_goal: "Documentación de fabricación: Hojas de ruta y control de calidad.",
            gate: null,
            min_deliverable: {
                title: "Hojas de Ruta + QC",
                evidence_required: ["Hoja ruta producción", "Plan control calidad", "Checklist PRL"]
            },
            daily_rhythm: {
                monday: { focus: "Hoja ruta", task: "Hoja ruta producción", evidence: "Proceso PDF" },
                tuesday: { focus: "Secuencia", task: "Secuencia operaciones", evidence: "Diagrama flujo" },
                wednesday: { focus: "Control calidad", task: "Plan QC (puntos inspección)", evidence: "Plan QC" },
                thursday: { focus: "PRL", task: "Análisis riesgos fabricación", evidence: "Checklist PRL" },
                friday: { focus: "Integración", task: "Dossier fabricación v1", evidence: "Dossier fabricación" }
            },
            modules_focus: {
                GNE: { ra: ["RA4", "RA5"], focus: "Hoja proceso", deliverable: "Documentación producción", enables: "Fabricación" },
                ATZ: { ra: ["RA3", "RA4"], focus: "Secuencia mecanizado", deliverable: "Orden operaciones", enables: "Eficiencia" },
                IYO: { ra: ["RA6"], focus: "PRL fabricación", deliverable: "Análisis riesgos", enables: "Seguridad" }
            },
            coordination: { agreements: ["Hoja ruta validada con taller"], adjustments: "" },
            risks: ["Proceso no optimizado", "PRL insuficiente"]
        },
        {
            week_id: "E2-S05",
            date_from: "2026-01-26",
            date_to: "2026-01-30",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F3",
            week_goal: "Presupuesto afinado con costes reales y rendimientos.",
            gate: null,
            min_deliverable: {
                title: "Presupuesto Cerrado",
                evidence_required: ["Presupuesto por capítulos", "Rendimientos calculados", "Costes reales", "Margen definido"]
            },
            daily_rhythm: {
                monday: { focus: "Mediciones", task: "Mediciones definitivas", evidence: "Tabla mediciones" },
                tuesday: { focus: "Costes", task: "Costes reales materiales/herrajes", evidence: "Tabla costes" },
                wednesday: { focus: "Rendimientos", task: "Cálculo rendimientos mano obra", evidence: "Tabla rendimientos" },
                thursday: { focus: "Presupuesto", task: "Presupuesto final por capítulos", evidence: "Presupuesto Excel" },
                friday: { focus: "Validación", task: "Validación presupuesto", evidence: "Presupuesto cerrado" }
            },
            modules_focus: {
                GNE: { ra: ["RA4", "RA5", "RA6"], focus: "Presupuestación final", deliverable: "Presupuesto cerrado", enables: "Viabilidad" },
                DDR: { ra: ["RA4", "RA6"], focus: "Mediciones planos", deliverable: "Mediciones precisas", enables: "Exactitud" },
                ATZ: { ra: ["RA3", "RA4"], focus: "Tiempos mecanizado", deliverable: "Rendimientos CNC", enables: "Costes reales" }
            },
            coordination: { agreements: ["Presupuesto con margen máximo ±5%"], adjustments: "" },
            risks: ["Costes irreales", "Rendimientos incorrectos"]
        },

        // FEBRERO 2026: CAM, plan de instalación y dossier
        {
            week_id: "E2-S06",
            date_from: "2026-02-02",
            date_to: "2026-02-06",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F3",
            week_goal: "Inicio CAM/CNC: Estrategias de mecanizado y simulaciones.",
            gate: {
                title: "Checkpoint: CAM y Proceso",
                description: "06/02: CAM validado y proceso definido",
                conditions: ["Estrategias CAM completas", "Simulaciones OK", "Programa CNC validado", "Postprocesado listo"]
            },
            min_deliverable: {
                title: "CAM Completo + Simulaciones",
                evidence_required: ["Estrategias mecanizado", "Simulaciones CNC", "Programa postprocesado", "HITO 06/02"]
            },
            daily_rhythm: {
                monday: { focus: "Estrategias", task: "Estrategias mecanizado CAM", evidence: "Estrategias documentadas" },
                tuesday: { focus: "Programación", task: "Programación CNC piezas clave", evidence: "Programa CNC" },
                wednesday: { focus: "Simulación", task: "Simulaciones y verificación", evidence: "Videos simulación" },
                thursday: { focus: "HITO 06/02", task: "**CAM VALIDADO** Postprocesado", evidence: "Código G listo" },
                friday: { focus: "Set-up", task: "Set-up herramientas y verificación", evidence: "Lista set-up" }
            },
            modules_focus: {
                ATZ: { ra: ["RA3", "RA4"], focus: "CAM/CNC completo", deliverable: "Programas CNC", enables: "Fabricación eficiente" },
                GNE: { ra: ["RA4", "RA5"], focus: "Tiempos mecanizado", deliverable: "Rendimientos CAM", enables: "Planificación" },
                DDR: { ra: ["RA4"], focus: "Coordinación diseño-CAM", deliverable: "Coherencia", enables: "Calidad" }
            },
            coordination: { agreements: ["HITO 06/02: CAM validado obligatorio"], adjustments: "" },
            risks: ["Simulación con colisiones", "Postprocesado incorrecto"]
        },
        {
            week_id: "E2-S07",
            date_from: "2026-02-09",
            date_to: "2026-02-13",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F3",
            week_goal: "Plan de instalación: Secuencia montaje, recursos y PRL en obra.",
            gate: null,
            min_deliverable: {
                title: "Plan de Instalación Completo",
                evidence_required: ["Secuencia montaje", "Recursos necesarios", "PRL instalación", "Timing instalación"]
            },
            daily_rhythm: {
                monday: { focus: "Secuencia", task: "Secuencia montaje paso a paso", evidence: "Plan montaje" },
                tuesday: { focus: "Recursos", task: "Recursos humanos + materiales", evidence: "Lista recursos" },
                wednesday: { focus: "PRL obra", task: "PRL específica instalación", evidence: "Plan PRL instalación" },
                thursday: { focus: "Timing", task: "Planificación temporal instalación", evidence: "Gantt instalación" },
                friday: { focus: "Validación", task: "Validación plan instalación", evidence: "Plan validado" }
            },
            modules_focus: {
                IYO: { ra: ["RA3", "RA4", "RA5"], focus: "Plan instalación", deliverable: "Dossier instalación", enables: "Montaje profesional" },
                GNE: { ra: ["RA4"], focus: "Recursos instalación", deliverable: "Planificación recursos", enables: "Eficiencia" },
                DDR: { ra: ["RA4", "RA6"], focus: "Planos montaje", deliverable: "Planos instalación", enables: "Guía montaje" }
            },
            coordination: { agreements: ["Plan validado con instalador si aplica"], adjustments: "" },
            risks: ["Secuencia irreal", "PRL insuficiente"]
        },
        {
            week_id: "E2-S08",
            date_from: "2026-02-16",
            date_to: "2026-02-20",
            eval: "E2",
            project: "Cocina Lineal - Proyecto Ejecutivo",
            phase_common: "F5",
            week_goal: "**ENTREGA FINAL E2**: Proyecto ejecutivo completo y paquete E3-ready.",
            gate: {
                title: "HITO F5: Entrega E2 Completa",
                description: "20/02: Proyecto ejecutivo entregado",
                conditions: ["Dossier ejecutivo completo", "CAM validado", "Plan instalación", "Paquete E3-ready", "Proyecto cerrado"]
            },
            min_deliverable: {
                title: "ENTREGA E2 COMPLETA + E3-READY",
                evidence_required: ["Proyecto ejecutivo PDF", "Planos definitivos", "BOM final", "CAM/CNC", "Plan instalación", "Paquete E3", "ENTREGA 20/02"]
            },
            daily_rhythm: {
                monday: { focus: "Compilación", task: "Compilar dossier ejecutivo", evidence: "Dossier borrador" },
                tuesday: { focus: "E3-ready", task: "Preparar paquete E3", evidence: "Paquete E3" },
                wednesday: { focus: "Revisión", task: "Revisión integral documentación", evidence: "Checklist OK" },
                thursday: { focus: "HITO 20/02", task: "**ENTREGA E2 OFICIAL**", evidence: "E2 CERRADA" },
                friday: { focus: "Transición", task: "Preparación transición E3", evidence: "Brief E3" }
            },
            modules_focus: {
                PIM: { ra: ["RA4", "RA5"], focus: "Integración final", deliverable: "Proyecto ejecutivo completo", enables: "Paso a E3" },
                ALL: { focus: "Cierre transversal", deliverable: "Todos los entregables", enables: "Formación empresa" }
            },
            coordination: { agreements: ["HITO 20/02: Entrega E2 obligatoria - Cierre centro educativo"], adjustments: "" },
            risks: ["Documentación incompleta", "Paquete E3 insuficiente"]
        },

        // SEMANAS E2-S09 y E2-S10: Reserva/ajuste si calendario requiere extensión
        {
            week_id: "E2-S09",
            date_from: "2026-02-23",
            date_to: "2026-02-27",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "F0",
            week_goal: "Inicio E3: Integración en empresa y validación proyecto.",
            gate: null,
            min_deliverable: {
                title: "Integración Empresa",
                evidence_required: ["Brief empresa recibido", "Plan E3 definido", "Tutor asignado"]
            },
            daily_rhythm: {
                monday: { focus: "Acogida", task: "Acogida y presentación empresa", evidence: "Acta acogida" },
                tuesday: { focus: "Brief", task: "Brief proyecto en empresa", evidence: "Brief empresa" },
                wednesday: { focus: "Planificación", task: "Plan E3 individualizado", evidence: "Plan E3" },
                thursday: { focus: "Integración", task: "Integración procesos empresa", evidence: "Informe integración" },
                friday: { focus: "Revisión", task: "Revisión semanal con tutor", evidence: "Acta revisión" }
            },
            modules_focus: {
                ALL: { focus: "Adaptación empresa", deliverable: "Integración profesional", enables: "Desarrollo E3" }
            },
            coordination: { agreements: ["Coordinación tutor centro-empresa"], adjustments: "" },
            risks: ["Desajuste proyecto académico-empresa"]
        },
        {
            week_id: "E3-S02",
            date_from: "2026-03-02",
            date_to: "2026-03-06",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Aplicación de conocimientos de diseño y documentación técnica.",
            gate: null,
            min_deliverable: {
                title: "Actividades Semana 2",
                evidence_required: ["Tareas realizadas", "Informe semanal", "Registro horario"]
            },
            daily_rhythm: {
                monday: { focus: "Diseño", task: "Aplicación técnicas diseño", evidence: "Trabajo realizado" },
                tuesday: { focus: "Documentación", task: "Elaboración planos/documentos", evidence: "Documentos" },
                wednesday: { focus: "CAD", task: "Trabajo con software CAD", evidence: "Archivos CAD" },
                thursday: { focus: "Coordinación", task: "Reuniones equipo empresa", evidence: "Actas" },
                friday: { focus: "Revisión", task: "Revisión semanal tutor empresa", evidence: "Informe semanal" }
            },
            modules_focus: {
                DDR: { focus: "Diseño en empresa", deliverable: "Proyectos reales", enables: "Experiencia profesional" }
            },
            coordination: { agreements: ["Seguimiento semanal obligatorio"], adjustments: "" },
            risks: ["Falta de autonomía", "Dificultades técnicas"]
        },
        {
            week_id: "E3-S03",
            date_from: "2026-03-09",
            date_to: "2026-03-13",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Trabajo con maquinaria y procesos de fabricación.",
            gate: null,
            min_deliverable: {
                title: "Actividades Semana 3",
                evidence_required: ["Registro fabricación", "Informe semanal", "Evidencias fotográficas"]
            },
            daily_rhythm: {
                monday: { focus: "Fabricación", task: "Procesos de mecanizado", evidence: "Piezas fabricadas" },
                tuesday: { focus: "CNC", task: "Programación/operación CNC", evidence: "Programas CNC" },
                wednesday: { focus: "Control", task: "Control de calidad", evidence: "Registros QC" },
                thursday: { focus: "Optimización", task: "Mejora de procesos", evidence: "Propuestas mejora" },
                friday: { focus: "Revisión", task: "Revisión semanal", evidence: "Informe semanal" }
            },
            modules_focus: {
                ATZ: { focus: "CNC en empresa", deliverable: "Experiencia real", enables: "Competencia profesional" }
            },
            coordination: { agreements: ["Cumplimiento normas PRL"], adjustments: "" },
            risks: ["Errores en maquinaria", "Incumplimiento PRL"]
        },
        {
            week_id: "E3-S04",
            date_from: "2026-03-16",
            date_to: "2026-03-20",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Gestión de proyectos y presupuestación.",
            gate: null,
            min_deliverable: {
                title: "Actividades Semana 4",
                evidence_required: ["Presupuestos elaborados", "Informe semanal", "Planificaciones"]
            },
            daily_rhythm: {
                monday: { focus: "Presupuestos", task: "Elaboración presupuestos", evidence: "Presupuestos" },
                tuesday: { focus: "Mediciones", task: "Mediciones y cálculos", evidence: "Hojas medición" },
                wednesday: { focus: "Planificación", task: "Planificación proyectos", evidence: "Gantt/cronogramas" },
                thursday: { focus: "Gestión", task: "Gestión de recursos", evidence: "Listas recursos" },
                friday: { focus: "Revisión", task: "Revisión semanal", evidence: "Informe semanal" }
            },
            modules_focus: {
                GNE: { focus: "Gestión en empresa", deliverable: "Experiencia gestión", enables: "Competencia empresarial" }
            },
            coordination: { agreements: ["Validación presupuestos con tutor"], adjustments: "" },
            risks: ["Presupuestos irreales", "Planificación deficiente"]
        },
        {
            week_id: "E3-S05",
            date_from: "2026-03-23",
            date_to: "2026-03-27",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Instalación y montaje en obra.",
            gate: null,
            min_deliverable: {
                title: "Actividades Semana 5",
                evidence_required: ["Registro instalaciones", "Informe semanal", "Fotos obra"]
            },
            daily_rhythm: {
                monday: { focus: "Replanteo", task: "Replanteo en obra", evidence: "Planos replanteo" },
                tuesday: { focus: "Montaje", task: "Montaje elementos", evidence: "Registro montaje" },
                wednesday: { focus: "Ajustes", task: "Ajustes y nivelación", evidence: "Checklist ajustes" },
                thursday: { focus: "Acabados", task: "Acabados finales", evidence: "Fotos acabados" },
                friday: { focus: "Revisión", task: "Revisión semanal", evidence: "Informe semanal" }
            },
            modules_focus: {
                IYO: { focus: "Instalación real", deliverable: "Experiencia montaje", enables: "Competencia instalación" }
            },
            coordination: { agreements: ["Coordinación con otros oficios"], adjustments: "" },
            risks: ["Problemas en obra", "Descoordinación oficios"]
        },
        {
            week_id: "E3-S06",
            date_from: "2026-03-30",
            date_to: "2026-04-03",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Proyecto integrado: Diseño + Fabricación + Instalación.",
            gate: {
                title: "Checkpoint E3: Proyecto Integrado",
                description: "03/04: Evaluación intermedia E3",
                conditions: ["Autonomía demostrada", "Competencias aplicadas", "Actitud profesional", "Integración en equipo"]
            },
            min_deliverable: {
                title: "Evaluación Intermedia E3",
                evidence_required: ["Informe tutor empresa", "Autoevaluación", "Evidencias proyecto integrado", "CHECKPOINT 03/04"]
            },
            daily_rhythm: {
                monday: { focus: "Proyecto", task: "Inicio proyecto integrado", evidence: "Brief proyecto" },
                tuesday: { focus: "Desarrollo", task: "Desarrollo proyecto", evidence: "Avances" },
                wednesday: { focus: "Ejecución", task: "Ejecución proyecto", evidence: "Trabajo realizado" },
                thursday: { focus: "CHECKPOINT", task: "**EVALUACIÓN INTERMEDIA**", evidence: "Informe evaluación" },
                friday: { focus: "Feedback", task: "Feedback y plan mejora", evidence: "Plan mejora" }
            },
            modules_focus: {
                PIM: { focus: "Integración competencias", deliverable: "Proyecto completo", enables: "Evaluación intermedia" }
            },
            coordination: { agreements: ["CHECKPOINT 03/04: Evaluación intermedia obligatoria"], adjustments: "" },
            risks: ["Evaluación negativa", "Falta de integración"]
        },
        {
            week_id: "E3-S07",
            date_from: "2026-04-06",
            date_to: "2026-04-10",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Aplicación de mejoras post-evaluación intermedia.",
            gate: null,
            min_deliverable: {
                title: "Actividades Semana 7",
                evidence_required: ["Mejoras implementadas", "Informe semanal", "Evidencias progreso"]
            },
            daily_rhythm: {
                monday: { focus: "Mejoras", task: "Implementación plan mejora", evidence: "Acciones realizadas" },
                tuesday: { focus: "Refuerzo", task: "Refuerzo áreas débiles", evidence: "Trabajo refuerzo" },
                wednesday: { focus: "Desarrollo", task: "Desarrollo competencias", evidence: "Evidencias" },
                thursday: { focus: "Autonomía", task: "Trabajo autónomo", evidence: "Tareas autónomas" },
                friday: { focus: "Revisión", task: "Revisión semanal", evidence: "Informe semanal" }
            },
            modules_focus: {
                ALL: { focus: "Mejora continua", deliverable: "Progreso competencial", enables: "Desarrollo profesional" }
            },
            coordination: { agreements: ["Seguimiento plan mejora"], adjustments: "" },
            risks: ["No implementar mejoras", "Estancamiento"]
        },
        {
            week_id: "E3-S08",
            date_from: "2026-04-13",
            date_to: "2026-04-17",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Especialización en área específica de la empresa.",
            gate: null,
            min_deliverable: {
                title: "Actividades Semana 8",
                evidence_required: ["Trabajo especializado", "Informe semanal", "Evidencias especialización"]
            },
            daily_rhythm: {
                monday: { focus: "Especialización", task: "Trabajo área específica", evidence: "Tareas especializadas" },
                tuesday: { focus: "Profundización", task: "Profundización técnica", evidence: "Trabajo técnico" },
                wednesday: { focus: "Innovación", task: "Propuestas innovación", evidence: "Propuestas" },
                thursday: { focus: "Aplicación", task: "Aplicación conocimientos", evidence: "Resultados" },
                friday: { focus: "Revisión", task: "Revisión semanal", evidence: "Informe semanal" }
            },
            modules_focus: {
                ALL: { focus: "Especialización", deliverable: "Competencia avanzada", enables: "Valor añadido" }
            },
            coordination: { agreements: ["Definir área especialización"], adjustments: "" },
            risks: ["Especialización no alineada", "Falta profundidad"]
        },
        {
            week_id: "E3-S09",
            date_from: "2026-04-20",
            date_to: "2026-04-24",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Contribución significativa a proyectos de la empresa.",
            gate: null,
            min_deliverable: {
                title: "Actividades Semana 9",
                evidence_required: ["Contribuciones documentadas", "Informe semanal", "Evidencias impacto"]
            },
            daily_rhythm: {
                monday: { focus: "Contribución", task: "Aportación proyectos empresa", evidence: "Trabajo realizado" },
                tuesday: { focus: "Responsabilidad", task: "Tareas con responsabilidad", evidence: "Resultados" },
                wednesday: { focus: "Liderazgo", task: "Iniciativa y liderazgo", evidence: "Acciones liderazgo" },
                thursday: { focus: "Impacto", task: "Generación valor empresa", evidence: "Impacto documentado" },
                friday: { focus: "Revisión", task: "Revisión semanal", evidence: "Informe semanal" }
            },
            modules_focus: {
                ALL: { focus: "Contribución profesional", deliverable: "Valor empresa", enables: "Reconocimiento profesional" }
            },
            coordination: { agreements: ["Validar contribuciones con tutor"], adjustments: "" },
            risks: ["Contribución insuficiente", "Falta iniciativa"]
        },
        {
            week_id: "E3-S10",
            date_from: "2026-04-27",
            date_to: "2026-05-01",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Preparación memoria de prácticas y recopilación evidencias.",
            gate: null,
            min_deliverable: {
                title: "Memoria E3 v1",
                evidence_required: ["Borrador memoria", "Evidencias recopiladas", "Informe semanal"]
            },
            daily_rhythm: {
                monday: { focus: "Recopilación", task: "Recopilación evidencias", evidence: "Carpeta evidencias" },
                tuesday: { focus: "Estructura", task: "Estructura memoria", evidence: "Índice memoria" },
                wednesday: { focus: "Redacción", task: "Redacción borrador", evidence: "Borrador memoria" },
                thursday: { focus: "Revisión", task: "Revisión borrador", evidence: "Memoria v1" },
                friday: { focus: "Feedback", task: "Feedback tutor centro", evidence: "Comentarios" }
            },
            modules_focus: {
                PIM: { focus: "Documentación E3", deliverable: "Memoria v1", enables: "Evaluación final" }
            },
            coordination: { agreements: ["Revisión memoria con tutor centro"], adjustments: "" },
            risks: ["Memoria incompleta", "Evidencias insuficientes"]
        },
        {
            week_id: "E3-S11",
            date_from: "2026-05-04",
            date_to: "2026-05-08",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "Finalización memoria y preparación defensa.",
            gate: null,
            min_deliverable: {
                title: "Memoria E3 Final",
                evidence_required: ["Memoria completa", "Presentación defensa", "Informe tutor empresa final"]
            },
            daily_rhythm: {
                monday: { focus: "Correcciones", task: "Correcciones memoria", evidence: "Memoria v2" },
                tuesday: { focus: "Finalización", task: "Memoria final", evidence: "Memoria definitiva" },
                wednesday: { focus: "Presentación", task: "Preparar presentación", evidence: "Slides defensa" },
                thursday: { focus: "Ensayo", task: "Ensayo defensa", evidence: "Guion defensa" },
                friday: { focus: "Cierre", task: "Cierre empresa + Informe tutor", evidence: "Informe tutor empresa" }
            },
            modules_focus: {
                PIM: { focus: "Cierre E3", deliverable: "Memoria + Presentación", enables: "Defensa" }
            },
            coordination: { agreements: ["Memoria entregada antes 08/05"], adjustments: "" },
            risks: ["Memoria no finalizada", "Presentación débil"]
        },
        {
            week_id: "E3-S12",
            date_from: "2026-05-11",
            date_to: "2026-05-14",
            eval: "E3",
            project: "Formación en Empresa",
            phase_common: "Empresa",
            week_goal: "**CIERRE E3**: Últimos ajustes y transición a defensas.",
            gate: {
                title: "HITO E3: Cierre Formación Empresa",
                description: "14/05: E3 completada",
                conditions: ["Memoria entregada", "Informe tutor empresa", "Evidencias completas", "Presentación lista"]
            },
            min_deliverable: {
                title: "E3 COMPLETA",
                evidence_required: ["Memoria final PDF", "Informe tutor empresa", "Carpeta evidencias", "Presentación", "CIERRE 14/05"]
            },
            daily_rhythm: {
                monday: { focus: "Ajustes", task: "Últimos ajustes memoria", evidence: "Memoria final" },
                tuesday: { focus: "Validación", task: "Validación documentación", evidence: "Checklist OK" },
                wednesday: { focus: "HITO 14/05", task: "**ENTREGA PIM**", evidence: "E3 CERRADA" },
                thursday: { focus: "Transición", task: "Preparación defensas finales", evidence: "Plan defensas" },
                friday: { focus: "Festivo", task: "Festivo", evidence: "-" }
            },
            modules_focus: {
                ALL: { focus: "Cierre E3", deliverable: "Formación completada", enables: "Defensas finales" }
            },
            coordination: { agreements: ["HITO 14/05: Entrega E3 obligatoria"], adjustments: "" },
            risks: ["Documentación incompleta", "No apto E3"]
        }
    ],

    // ============================================
    // PLANIFICACIÓN DIARIA (DÍAS ESPECÍFICOS)
    // ============================================
    days: [
        // Ejemplo de día específico muy detallado
        {
            date: "2025-09-15",
            is_lective: true,
            eval: "E1",
            week_id: "E1-S01",
            project: "Cocina Lineal - Anteproyecto",
            phase_common: "F0",
            day_type: "aula",
            leader_module: "DDR",
            modules_active: ["DDR", "PIM", "GNE"],
            duration: "6 sesiones",
            location: "Aula",

            learning_intent: {
                purpose: "Arrancar el proyecto E1 con comprensión clara del brief profesional y análisis de viabilidad técnica.",
                success_criteria: [
                    "Brief profesional analizado al 100%",
                    "Identificados requisitos técnicos clave",
                    "Primeras dudas resueltas con docente"
                ],
                common_mistakes: [
                    "No leer el brief completo antes de empezar",
                    "No identificar restricciones técnicas",
                    "No preguntar dudas críticas"
                ],
                teacher_prompt: {
                    question: "¿Habéis identificado las restricciones técnicas y económicas del proyecto?",
                    check: "Verificar análisis de viabilidad en documento de trabajo"
                }
            },

            min_deliverable: {
                title: "Brief Analizado + Viabilidad Inicial",
                checklist: [
                    "Brief leído y anotado",
                    "Lista de requisitos técnicos",
                    "Informe de viabilidad inicial"
                ],
                format: "PDF",
                naming: "E1_S01_Equipo??_Brief_Viabilidad",
                delivery_url: "REPO/E1/Equipos/Equipo_??/F0/",
                evidence_required: ["Brief anotado", "Lista requisitos", "Informe viabilidad"]
            },

            dod: [
                "Brief 100% comprendido por todo el equipo",
                "Viabilidad técnica evaluada",
                "Documentación subida al repositorio"
            ],
            gate_rule: "Sin brief analizado, no se puede avanzar a diseño",

            dependencies: {
                today_depends_on: ["Entrega del brief por parte del docente"],
                tomorrow_blocked_if: ["Sin análisis de viabilidad → diseño sin base técnica"]
            },

            modules_detail: {
                DDR: {
                    micro_goal: "Analizar brief profesional",
                    tasks: [
                        "Lectura completa del brief",
                        "Identificar requisitos técnicos",
                        "Evaluar viabilidad inicial"
                    ],
                    deliverable: "Informe viabilidad",
                    evidence: ["DDR_brief_analizado.pdf"],
                    ra_ce: "RA1: Análisis de necesidades"
                },
                PIM: {
                    micro_goal: "Iniciar planificación",
                    tasks: [
                        "Identificar fases del proyecto",
                        "Estimar tiempos preliminares",
                        "Crear esquema Gantt"
                    ],
                    deliverable: "Esquema Gantt",
                    evidence: ["PIM_gantt_v0.pdf"],
                    ra_ce: "RA1: Planificación de proyectos"
                },
                GNE: {
                    micro_goal: "Configurar infraestructura digital",
                    tasks: [
                        "Crear repositorio del proyecto",
                        "Definir nomenclatura de archivos",
                        "Configurar carpetas por fases"
                    ],
                    deliverable: "Repositorio configurado",
                    evidence: ["Captura repo"],
                    ra_ce: "RA[DEFINIR]: Gestión documental"
                }
            },

            safety: {
                applies: false,
                risk_main: "Bajo (aula)",
                epi_required: [],
                prl_checks: []
            },

            differentiation: {
                base: {
                    description: "Brief analizado + viabilidad básica",
                    evidence: "PDF de análisis"
                },
                support: {
                    trigger: "Si el equipo tiene dificultad con análisis técnico",
                    action: "Docente proporciona checklist de viabilidad"
                },
                extension: {
                    trigger: "Si el equipo termina rápido",
                    action: "Empezar bocetos preliminares para F1"
                }
            },

            teacher_log: {
                incidents: [],
                agreements: [],
                adaptations: [],
                changes: []
            }
        }

        // NOTA: Los días sin entrada específica se generan automáticamente
        // desde el array 'weeks' usando la función getDay()
    ],

    // ============================================
    // ESTRUCTURA ACADÉMICA (RA/CE por evaluación)
    // ============================================
    academic: [
        {
            id: "e1",
            title: "1.ª Evaluación - Cocina Lineal (Anteproyecto)",
            project: "Cocina Lineal - Fase de Anteproyecto y Diseño Conceptual",
            flow: [
                { f: "F0/F1", l: "DDR", c: "var(--col-ddr)" },
                { f: "F2", l: "DDR+IYO", c: "var(--col-ddr)" },
                { f: "F3", l: "ATZ+GNE", c: "var(--col-atz)" },
                { f: "F4", l: "ATZ", c: "var(--col-atz)" },
                { f: "F5", l: "PIM", c: "var(--col-pim)" }
            ],
            modules: [
                {
                    id: "ddr",
                    name: "DDR — Diseño de Carpintería y Mueble",
                    focus: "Diseño conceptual, documentación técnica y proyecto ejecutivo de cocina lineal.",
                    ras: [
                        {
                            t: "RA1: Selecciona información para la realización de proyectos",
                            ce: "a) Toma de medidas y especificaciones. b) Croquis y mediciones. c) Dimensionado de elementos. d) Plantillas 1:1. e) Soportes de fijación. f) Tendencias de mercado. g) Revisión económica."
                        },
                        {
                            t: "RA2: Elabora documentación técnica para la instalación",
                            ce: "a) Planos de alzados y plantas. b) Planos CAD y normativa. c) Vistas 3D. d) Instalaciones complementarias. e) Texturas y colores. f) Selección de materiales."
                        }
                    ],
                    ev: {
                        proc: "Anteproyecto de cocina (planos, memoria, presupuesto) + Presentación oral + Rúbrica de diseño"
                    }
                },
                {
                    id: "iyo",
                    name: "IYO — Instalaciones en Carpintería y Mobiliario",
                    focus: "Análisis de instalaciones, plan de montaje y PRL en obra.",
                    ras: [
                        {
                            t: "RA1: Clasifica sistemas de montaje de instalaciones",
                            ce: "a) Tipología instalaciones. b) Puntos de control. c) Secuencias instalación. d) Relación fases-elementos. e) Planes de control."
                        },
                        {
                            t: "RA2: Organiza el montaje de instalaciones",
                            ce: "a) Comprobación local. b) Materiales disponibles. c) Disponibilidad equipos. d) RRHH. f) Condiciones higiénicas. g) Instrucciones montaje."
                        }
                    ],
                    ev: {
                        proc: "Plan de montaje de cocina + Análisis de riesgos PRL + Checklist de replanteo"
                    }
                },
                {
                    id: "atz",
                    name: "ATZ — Automatización en Carpintería y Mueble",
                    focus: "CAM, CNC, simulación y postprocesado para fabricación de cocina.",
                    ras: [
                        {
                            t: "RA1: Organiza líneas para la fabricación de elementos",
                            ce: "a) Identificación de maquinaria. b) Tecnologías de automatización. c) Características de instalación. d) PLC y robots. e) Sistemas flexibles. f) Valoración de sistemas."
                        },
                        {
                            t: "RA2: Realiza programas de control numérico",
                            ce: "a) Tipos de maquinaria CNC. b) Lenguajes de programación. c) Etapas de programas. d) Optimización de material. e) Programación manual/paramétrica."
                        }
                    ],
                    ev: {
                        proc: "Programas CNC básicos + Simulación de trayectorias + Optimización lineal"
                    }
                },
                {
                    id: "gne",
                    name: "GNE — Gestión de la Producción",
                    focus: "Presupuestación, rendimientos, BOM y control de costes del proyecto.",
                    ras: [
                        {
                            t: "RA1: Gestiona aprovisionamientos en industrias",
                            ce: "a) Plan de abastecimiento. b) Stock óptimo. c) Stock de seguridad. d) Control aprovisionamiento. e) Ritmo de aprovisionamiento. f) Localización stocks. g) Referencias y precios."
                        },
                        {
                            t: "RA2: Supervisa la recepción de aprovisionamientos",
                            ce: "a) Comprobación recepción. b) Método almacenaje. c) Optimización espacio. d) Etiquetado y localización. e) Punto reposición."
                        }
                    ],
                    ev: {
                        proc: "Plan de aprovisionamiento + Control de stocks + Presupuesto de materiales"
                    }
                },
                {
                    id: "pim",
                    name: "PIM — Proyecto de Diseño y Amueblamiento",
                    focus: "Integración transversal, coordinación y cierre del anteproyecto.",
                    ras: [
                        {
                            t: "RA1: Coordina las fases del proyecto de carpintería",
                            ce: "CE1.a) Planificación temporal. CE1.b) Coordinación entre módulos. CE1.c) Gestión de cambios. CE1.d) Control de hitos."
                        },
                        {
                            t: "RA2: Elabora la memoria del proyecto",
                            ce: "CE2.a) Memoria descriptiva. CE2.b) Memoria técnica. CE2.c) Anexos y documentación. CE2.d) Presentación profesional."
                        },
                        {
                            t: "RA3: Defiende el proyecto ante un tribunal",
                            ce: "CE3.a) Presentación oral estructurada. CE3.b) Uso de recursos audiovisuales. CE3.c) Argumentación técnica. CE3.d) Respuesta a preguntas."
                        }
                    ],
                    ev: {
                        proc: "Memoria completa del anteproyecto + Presentación profesional + Defensa oral"
                    }
                }
            ]
        },
        {
            id: "e2",
            title: "2.ª Evaluación - Cocina Lineal (Proyecto Ejecutivo)",
            project: "Cocina Lineal - Fase de Proyecto Ejecutivo y Fabricación",
            flow: [
                { f: "F0/F1", l: "DDR", c: "var(--col-ddr)" },
                { f: "F2", l: "GNE", c: "var(--col-gne)" },
                { f: "F3", l: "ATZ", c: "var(--col-atz)" },
                { f: "F4", l: "IYO", c: "var(--col-iyo)" },
                { f: "F5", l: "PIM", c: "var(--col-pim)" }
            ],
            modules: [
                {
                    id: "ddr",
                    name: "DDR — Diseño de Carpintería y Mueble",
                    focus: "Proyecto ejecutivo completo con planos de fabricación y montaje.",
                    ras: [
                        {
                            t: "RA3: Define procesos de instalación de productos",
                            ce: "a) Criterios de resistencia/estética. b) Selección componentes. c) Dimensionado ergonómico. d) Diagrama de proceso. e) Sistema instalación. f) Adaptación diseños."
                        },
                        {
                            t: "RA4: Elabora documentación técnica para el amueblamiento",
                            ce: "a) Criterios diseño instalación. b) Bocetos y croquis. c) Propuestas amueblamiento. d) Soluciones decisión. e) Optimización proceso. f) Adaptación a recursos."
                        },
                        {
                            t: "RA5: Define procesos de instalación de mobiliario",
                            ce: "a) Criterios de resistencia y funcionalidad. b) Selección de componentes de unión. c) Dimensionado ergonómico. d) Diagrama de proceso de montaje."
                        },
                        {
                            t: "RA6: Elabora memorias y presupuestos de instalación",
                            ce: "a) Documentación técnica. b) Cálculo de costes. c) Elaboración presupuestos. d) Justificación de modificaciones."
                        }
                    ],
                    ev: {
                        proc: "Proyecto ejecutivo completo + Planos de fabricación + Diagramas de proceso"
                    }
                },
                {
                    id: "iyo",
                    name: "IYO — Instalaciones en Carpintería y Mobiliario",
                    focus: "Ejecución del montaje, coordinación en obra y control de calidad.",
                    ras: [
                        {
                            t: "RA1: Clasifica sistemas de montaje de instalaciones",
                            ce: "a) Tipología instalaciones. b) Puntos de control. c) Secuencias instalación. d) Relación fases-elementos. e) Planes de control."
                        },
                        {
                            t: "RA2: Organiza el montaje de instalaciones",
                            ce: "a) Comprobación local. b) Materiales disponibles. c) Disponibilidad equipos. d) RRHH. f) Condiciones higiénicas. g) Instrucciones montaje."
                        },
                        {
                            t: "RA3: Supervisa el montaje de elementos de carpintería",
                            ce: "a) Elementos de sustentación. b) Replanteo. c) Mecanizado/ajuste. d) Holguras. e) Fijación elementos. f) Movimiento puertas/cajones."
                        },
                        {
                            t: "RA4: Supervisa el montaje de instalaciones de amueblamiento",
                            ce: "a) Desembalado y protección. b) Distribución elementos. c) Comprobación dimensiones. d) Ensamblado módulos. g) Elementos móviles."
                        },
                        {
                            t: "RA5: Aplica procedimientos de calidad y verificación",
                            ce: "a) Ajustes y remates. d) Reparación superficies. e) Instrucciones mantenimiento. f) Limpieza final. g) Gestión residuos i) Garantías."
                        },
                        {
                            t: "RA6: Aplica PRL y protección ambiental",
                            ce: "a) Identificación riesgos. c) Normas seguridad y protección ambiental."
                        }
                    ],
                    ev: {
                        proc: "Informe de montaje + Checklist de calidad + Protocolo PRL y Residuos"
                    }
                },
                {
                    id: "atz",
                    name: "ATZ — Automatización en Carpintería y Mueble",
                    focus: "Fabricación CNC completa y optimización de procesos.",
                    ras: [
                        {
                            t: "RA3: Elabora programas CAM para fabricación",
                            ce: "a) Secuenciación operaciones CAM. b) Geometría auxiliar. c) Importación CAD. d) Superficies y mecanizados. e) Postprocesador. f) Archivo mecanizado."
                        },
                        {
                            t: "RA4: Gestiona procesos de fabricación automatizada",
                            ce: "a) Sistemas sujeción. b) Seguridad trayectorias. c) Simulación CNC. d) Prueba vacío. e) Primer mecanizado. f) Alimentación. g) Muestreos calidad."
                        },
                        {
                            t: "RA6: Aplica PRL y protección ambiental en automatización",
                            ce: "a) Identificación riesgos. b) Normas seguridad. c) Protección ambiental en fabricación automatizada."
                        }
                    ],
                    ev: {
                        proc: "Programas CAM complejos + Mecanizado real + Control calidad piezas"
                    }
                },
                {
                    id: "gne",
                    name: "GNE — Gestión de la Producción",
                    focus: "Control de producción, seguimiento de costes y cierre económico.",
                    ras: [
                        {
                            t: "RA3: Gestiona sistemas de información y documentación",
                            ce: "a) Documentación origen. b) Normativa legal/fiscal. c) Bases de datos. d) Info producto-proveedor. f) Desviaciones inventario."
                        },
                        {
                            t: "RA4: Determina recursos para la fabricación",
                            ce: "a) Plan recursos y MP. b) Localización stocks. c) Medios técnicos. d) Documentos trabajo (hojas ruta). f) Producción/tiempo. g) Distribución tareas."
                        },
                        {
                            t: "RA5: Supervisa operaciones de fabricación",
                            ce: "a) Control de procesos. b) Seguimiento de producción. c) Ajustes y desviaciones."
                        },
                        {
                            t: "RA6: Aplica PRL y protección ambiental en gestión",
                            ce: "a) Normativa PRL. b) Gestión de residuos. c) Sostenibilidad en procesos."
                        }
                    ],
                    ev: {
                        proc: "Hojas de ruta + Plan de recursos + Documentación de fabricación"
                    }
                },
                {
                    id: "pim",
                    name: "PIM — Proyecto de Diseño y Amueblamiento",
                    focus: "Cierre del proyecto, documentación final y defensa.",
                    ras: [
                        {
                            t: "RA4: Finaliza la documentación del proyecto",
                            ce: "CE4.a) Dossier técnico completo. CE4.b) As-built (planos finales). CE4.c) Memoria de ejecución. CE4.d) Certificados y garantías."
                        },
                        {
                            t: "RA5: Presenta el proyecto finalizado",
                            ce: "CE5.a) Presentación ejecutiva. CE5.b) Demostración del producto. CE5.c) Defensa técnica. CE5.d) Propuestas de mejora."
                        }
                    ],
                    ev: {
                        proc: "Dossier técnico completo + Presentación final + Defensa del proyecto + Autoevaluación"
                    }
                }
            ]
        },
        {
            id: "e3",
            title: "E3 - Formación en Empresa",
            project: "Formación en Centros de Trabajo",
            flow: [
                { f: "Empresa", l: "E3", c: "var(--col-pim)" }
            ],
            modules: [
                {
                    id: "e3",
                    name: "E3 — Formación en Empresa",
                    focus: "Aplicación práctica de competencias en entorno profesional real.",
                    ras: [
                        {
                            t: "RA1: Identifica la estructura y organización de la empresa",
                            ce: "CE1.a) Organigrama. CE1.b) Departamentos. CE1.c) Procesos productivos. CE1.d) Cultura empresarial."
                        },
                        {
                            t: "RA2: Aplica hábitos éticos y laborales en el desarrollo de su actividad profesional",
                            ce: "CE2.a) Puntualidad. CE2.b) Responsabilidad. CE2.c) Trabajo en equipo. CE2.d) Iniciativa y autonomía."
                        },
                        {
                            t: "RA3: Realiza operaciones de diseño, fabricación e instalación de carpintería",
                            ce: "CE3.a) Interpretación de proyectos. CE3.b) Uso de maquinaria profesional. CE3.c) Control de calidad. CE3.d) Resolución de problemas."
                        },
                        {
                            t: "RA4: Cumple criterios de seguridad e higiene en el trabajo",
                            ce: "CE4.a) Uso de EPIs. CE4.b) Aplicación de normativa PRL. CE4.c) Prevención de riesgos. CE4.d) Actuación en emergencias."
                        }
                    ],
                    ev: {
                        proc: "Memoria de prácticas + Informe del tutor de empresa + Autoevaluación + Defensa oral"
                    }
                }
            ]
        }
    ],

    // ============================================
    // TIMELINE SIMPLIFICADO
    // ============================================
    timeline: [
        {
            eval: "E1",
            title: "Proyecto E1: Cocina Lineal (Anteproyecto)",
            weeks: [
                { num: 1, id: "E1-S01", dates: "15-19 Sep", goal: "F0: Lanzamiento y Requisitos", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Brief", "Toma datos", "Repo"] },
                { num: 2, id: "E1-S02", dates: "22-26 Sep", goal: "F0: Análisis previo", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Estado actual", "Referentes"] },
                { num: 3, id: "E1-S03", dates: "29 Sep-03 Oct", goal: "F1: Alternativas A-B", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Bocetos", "Brief validado"] },
                { num: 4, id: "E1-S04", dates: "06-10 Oct", goal: "F1: Alternativa C y Renders", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["3 propuestas", "Renders pre"] },
                { num: 5, id: "E1-S05", dates: "13-17 Oct", goal: "F1: Decisión Final", leader: "GNE", leaderColor: "var(--col-gne)", dod: ["Matriz decisión", "Justificación"] },
                { num: 6, id: "E1-S06", dates: "20-24 Oct", goal: "F1: Modelo 3D Funcional", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["3D v1", "Distribución"] },
                { num: 7, id: "E1-S07", dates: "27-31 Oct", goal: "F2: Planos Base", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Planta/Alzados", "Catálogos"] },
                { num: 8, id: "E1-S08", dates: "03-07 Nov", goal: "F2: Renders Finales", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Diseño validado", "4 renders HD"] },
                { num: 9, id: "E1-S09", dates: "10-14 Nov", goal: "F2: Pre-presupuesto", leader: "GNE", leaderColor: "var(--col-gne)", dod: ["Presupuesto v1", "Gantt v1"] },
                { num: 10, id: "E1-S10", dates: "17-21 Nov", goal: "F2: Instalaciones", leader: "IYO", leaderColor: "var(--col-iyo)", dod: ["Dossier instalaciones"] },
                { num: 11, id: "E1-S11", dates: "24-28 Nov", goal: "F5: Dossier E1 v1", leader: "PIM", leaderColor: "var(--col-pim)", dod: ["Borrador dossier"] },
                { num: 12, id: "E1-S12", dates: "01-05 Dic", goal: "F5: Ensayo Defensa", leader: "PIM", leaderColor: "var(--col-pim)", dod: ["Dossier FINAL", "Ensayo OK"] },
                { num: 13, id: "E1-S13", dates: "08-12 Dic", goal: "F5: ENTREGA E1", leader: "ALL", leaderColor: "var(--col-all)", dod: ["PROYECTO CERRADO", "DEfensa"] }
            ]
        },
        {
            eval: "E2",
            title: "Proyecto E2: Cocina Lineal (Ejecutivo y CAM)",
            weeks: [
                { num: 1, id: "E2-S01", dates: "15-19 Dic", goal: "F0: Puesta a punto", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Feedback E1", "Brief E2"] },
                { num: 2, id: "E2-S02", dates: "08-09 Ene", goal: "F2: Inicio Despiece", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Despiece bajo/alto"] },
                { num: 3, id: "E2-S03", dates: "12-16 Ene", goal: "F2: Freeze Diseño", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Diseño congelado", "Despiece 100%"] },
                { num: 4, id: "E2-S04", dates: "19-23 Ene", goal: "F3: Hojas de Ruta", leader: "GNE", leaderColor: "var(--col-gne)", dod: ["Proceso industrial", "QC"] },
                { num: 5, id: "E2-S05", dates: "26-30 Ene", goal: "F3: Presupuesto Cerrado", leader: "GNE", leaderColor: "var(--col-gne)", dod: ["Presupuesto final", "Profit"] },
                { num: 6, id: "E2-S06", dates: "02-06 Feb", goal: "F3: CAM/CNC Validados", leader: "ATZ", leaderColor: "var(--col-atz)", dod: ["Simulaciones OK", "Código G"] },
                { num: 7, id: "E2-S07", dates: "09-13 Feb", goal: "F3: Plan Instalación", leader: "IYO", leaderColor: "var(--col-iyo)", dod: ["Logística", "Timing obra"] },
                { num: 8, id: "E2-S08", dates: "16-20 Feb", goal: "F5: ENTREGA E2", leader: "PIM", leaderColor: "var(--col-pim)", dod: ["Dossier Ejecutivo", "Pack E3"] }
            ]
        },
        {
            eval: "E3",
            title: "E3: Formación en Empresa",
            weeks: [
                { num: 1, id: "E3-S01", dates: "23-27 Feb", goal: "Integración", leader: "ALL", leaderColor: "var(--col-all)", dod: ["Acogida", "Plan FCT"] },
                { num: 2, id: "E3-S02", dates: "02-06 Mar", goal: "Diseño real", leader: "DDR", leaderColor: "var(--col-ddr)", dod: ["Tareas empresa"] },
                { num: 3, id: "E3-S03", dates: "09-13 Mar", goal: "Taller/CNC", leader: "ATZ", leaderColor: "var(--col-atz)", dod: ["Fabricación"] },
                { num: 4, id: "E3-S04", dates: "16-20 Mar", goal: "Gestión", leader: "GNE", leaderColor: "var(--col-gne)", dod: ["Presupuestación"] },
                { num: 5, id: "E3-S05", dates: "23-27 Mar", goal: "Montaje", leader: "IYO", leaderColor: "var(--col-iyo)", dod: ["Instalación"] },
                { num: 6, id: "E3-S06", dates: "30 Mar-03 Abr", goal: "Evaluación Intermedia", leader: "PIM", leaderColor: "var(--col-pim)", dod: ["Checkpoint tutor"] },
                { num: 7, id: "E3-S07", dates: "06-10 Abr", goal: "Mejoras", leader: "ALL", leaderColor: "var(--col-all)", dod: ["Evidencias"] },
                { num: 8, id: "E3-S08", dates: "13-17 Abr", goal: "Especialización", leader: "ALL", leaderColor: "var(--col-all)", dod: ["Tareas avanzadas"] },
                { num: 9, id: "E3-S09", dates: "20-24 Abr", goal: "Contribución", leader: "ALL", leaderColor: "var(--col-all)", dod: ["Impacto empresa"] },
                { num: 10, id: "E3-S10", dates: "27 Abr-01 May", goal: "Memoria v1", leader: "PIM", leaderColor: "var(--col-pim)", dod: ["Borrador memoria"] },
                { num: 11, id: "E3-S11", dates: "04-08 May", goal: "Cierre Memoria", leader: "PIM", leaderColor: "var(--col-pim)", dod: ["Memoria final"] },
                { num: 12, id: "E3-S12", dates: "11-14 May", goal: "ENTREGA PIM", leader: "ALL", leaderColor: "var(--col-all)", dod: ["FCT completada"] }
            ]
        }
    ]
};
window.MASTER_PLAN = MASTER_PLAN;

// ============================================
// FUNCIONES HELPER
// ============================================

// Función para obtener datos de un día específico
window.MASTER_PLAN.getDay = function (dateStr) {
    const dObj = new Date(dateStr + 'T00:00:00');
    const dayIndex = dObj.getDay();
    if (dayIndex === 0 || dayIndex === 6) return null;

    // 1. Buscar en el array de días específicos
    const week = this.weeks.find(w => dateStr >= w.date_from && dateStr <= w.date_to);

    let timelineWeek = null;
    if (week) {
        timelineWeek = this.timeline.flatMap(e => e.weeks).find(tw => tw.id === week.week_id);
    }
    const officialLeader = timelineWeek ? timelineWeek.leader : null;

    let day = this.days.find(d => d.date === dateStr);
    if (day) {
        if (officialLeader) day.leader_module = officialLeader;
        return day;
    }

    // 2. Si no hay ficha manual, sintetizar del weekly plan
    if (!week) return null;

    const configHolidays = this.config.holidays || [];
    const customHolidays = window.SettingsManager?.settings?.pedagogical?.holidays || [];

    if (configHolidays.includes(dateStr) || customHolidays.includes(dateStr)) return null;

    const daysWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const dayKey = daysWeek[dObj.getDay()];

    const rhythm = week.daily_rhythm ? week.daily_rhythm[dayKey] : null;

    if (!rhythm || rhythm.focus === "---" || rhythm.focus.toLowerCase().includes("festivo")) return null;

    const leader = officialLeader || "DDR";

    return {
        date: dateStr,
        is_lective: true,
        eval: week.eval,
        week_id: week.week_id,
        project: week.project,
        phase_common: week.phase_common,
        day_type: rhythm.focus.toLowerCase().includes("taller") ? "taller" :
            (rhythm.focus.toLowerCase().includes("entrega") ? "entrega" : "aula"),
        leader_module: leader,
        modules_active: Object.keys(week.modules_focus || {}),
        learning_intent: {
            purpose: `${rhythm.focus}: ${rhythm.task}. Objetivo semanal: ${week.week_goal}`,
            success_criteria: [
                `Completar: ${rhythm.task}`,
                `Evidencia: ${rhythm.evidence}`,
                `Alineado con Gate ${week.phase_common}`
            ],
            common_mistakes: [
                "No documentar la evidencia",
                "Falta de coherencia con objetivo semanal",
                "Roles no definidos"
            ],
            teacher_prompt: {
                question: `¿Habéis logrado: ${rhythm.task}?`,
                check: `Verificar: ${rhythm.evidence}`
            }
        },
        min_deliverable: {
            title: `Entregable: ${rhythm.focus}`,
            checklist: [rhythm.task, "Subir a repositorio", "Actualizar índice"],
            format: "Digital/Físico",
            naming: `${week.week_id}_${dayKey}_Evidencia`,
            delivery_url: "Repositorio del Equipo",
            evidence_required: [rhythm.evidence]
        },
        dod: week.gate ? week.gate.conditions : ["Realizar tarea del calendario"],
        modules_detail: this.getModulesDetail(week, rhythm),
        safety: {
            applies: rhythm.focus.toLowerCase().includes("taller"),
            risk_main: rhythm.focus.toLowerCase().includes("taller") ? "Medio-Alto (Maquinaria CNC/fija)" : "Bajo (Aula)",
            epi_required: rhythm.focus.toLowerCase().includes("taller") ? ["Gafas", "Protección auditiva", "Calzado seguridad"] : [],
            prl_checks: rhythm.focus.toLowerCase().includes("taller") ? ["Zona despejada", "Máquinas verificadas"] : []
        },
        differentiation: {
            base: { description: rhythm.task, evidence: rhythm.evidence },
            support: { trigger: "Bloqueo técnico", action: "Docente asiste paso a paso" },
            extension: { trigger: "Ritmo alto", action: "Mejorar calidad o añadir detalle" }
        },
        teacher_log: { incidents: [], agreements: [], adaptations: [], changes: [] }
    };
};

window.MASTER_PLAN.getModulesDetail = function (week, rhythm) {
    const detail = {};
    Object.entries(week.modules_focus || {}).forEach(([modId, focus]) => {
        detail[modId] = {
            micro_goal: focus.focus,
            tasks: [rhythm.task],
            deliverable: focus.deliverable,
            evidence: [rhythm.evidence],
            ra_ce: focus.ra ? (Array.isArray(focus.ra) ? focus.ra.join(', ') : focus.ra) : (focus.enables || "Habilitar siguiente fase")
        };
    });
    return detail;
};

window.MASTER_PLAN.getWeek = function (weekId) {
    if (!weekId || !Array.isArray(this.weeks)) return null;
    return this.weeks.find(w => w.week_id === weekId) || null;
};

window.MASTER_PLAN.getModule = function (moduleCode) {
    if (!moduleCode || !this.modules) return null;
    const module = this.modules[moduleCode];
    if (!module) return null;
    return { ...module, code: module.code || moduleCode };
};

window.MASTER_PLAN.getPhase = function (phaseId) {
    if (!phaseId || !this.phases) return null;
    return this.phases[phaseId] || null;
};
