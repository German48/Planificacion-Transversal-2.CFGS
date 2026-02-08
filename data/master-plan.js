/**
 * ============================================
 * MASTER PLAN - Datos Separados de la UI
 * Sistema de Planificación Transversal 2º CFGM
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
        course_id: "2cfgm",
        course: "2º CFGM Carpintería y Mueble",
        year: "2025-2026",
        academic_year: "2025-2026",
        defaultDate: "2025-09-15",
        repoBaseUrl: "https://moodle.example.com/mod/folder/",
        evaluations: ["E1", "E2", "E3"],
        defaultView: "daily", // daily, radar, timeline, academic
        // Fechas del curso
        e1_period: { start: "2025-09-15", end: "2025-12-12" },
        e2_period: { start: "2025-12-15", end: "2026-02-20" },
        e3_period: { start: "2026-02-23", end: "2026-05-29" },
        dual_period: { start: "2026-06-01", end: "2026-06-23" },

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
            title: "Proyecto Inicial",
            sense: {
                objective: "Definición técnica y bases de fabricación del proyecto ejecutivo.",
                product: "Brief técnico + Documentación gráfica + Listas de materiales.",
                profile: "Técnico especialista en oficina técnica y planificación."
            },
            intent: {
                ras: "Análisis de requisitos, diseño técnico y optimización de recursos.",
                competencies: "Capacidad de análisis técnico y previsión de procesos productivos.",
                risks: "Inconsistencia en la documentación técnica inicial y planificación."
            }
        },
        E2: {
            title: "Proyecto Intermedio",
            sense: {
                objective: "Ejecución técnica avanzada integrada (Maquinaria convencional + Automatizada) y control de calidad.",
                product: "Componentes fabricados + Programas de control numérico vinculados.",
                profile: "Técnico cualificado en fabricación mecánica y programación técnica."
            },
            intent: {
                ras: "Mecanizado de precisión, programación de sistemas y validación de piezas.",
                competencies: "Destreza técnica avanzada y autonomía en sistemas de fabricación industrial.",
                risks: "Errores de configuración en sistemas automatizados o procesos de mecanizado."
            }
        },
        E3: {
            title: "Proyecto Final",
            sense: {
                objective: "Montaje integral, acabados técnicos, documentación final y defensa del proyecto.",
                product: "Proyecto terminado según especificaciones + Memoria técnica final.",
                profile: "Técnico cualificado con visión global del proceso productivo e instalador."
            },
            intent: {
                ras: "Gestión integral de la producción, control de calidad y criterios de sostenibilidad.",
                competencies: "Comunicación, responsabilidad y calidad final.",
                risks: "Desviaciones en el plan de montaje final y control de tiempos de entrega."
            }
        }
    },

    // ============================================
    // MÓDULOS CON ICONOS Y COLORES - 2º CFGM
    // ============================================
    modules: {
        DCU: {
            name: "Documentación Técnica",
            short: "DCU",
            icon: "📐",
            color: "#3498db",
            pattern: "grid-blue",
            role: "Oficina Técnica"
        },
        MCR: {
            name: "Mecanizado de Madera y Derivados",
            short: "MCR",
            icon: "🪚",
            color: "#2ecc71",
            pattern: "dots-green",
            role: "Operario Taller"
        },
        MCP: {
            name: "Mecanizado por CNC",
            short: "MCP",
            icon: "⚙️",
            color: "#e74c3c",
            pattern: "stripes-red",
            role: "Operador CNC"
        },
        MJC: {
            name: "Montaje de Muebles y Carpintería",
            short: "MJC",
            icon: "🔨",
            color: "#9b59b6",
            pattern: "solid-purple",
            role: "Montador"
        },
        AAD: {
            name: "Acabados en Carpintería y Mueble",
            short: "AAD",
            icon: "🎨",
            color: "#e67e22",
            pattern: "dots-orange",
            role: "Acabador"
        },
        SOJ: {
            name: "Sostenibilidad Aplicada",
            short: "SOJ",
            icon: "🌱",
            color: "#16a085",
            pattern: "waves-green",
            role: "Gestor Ambiental"
        },
        IPW: {
            name: "Itinerario Personal Empleabilidad II",
            short: "IPW",
            icon: "💼",
            color: "#7f8c8d",
            pattern: "diagonal-gray",
            role: "Gestor de Carrera"
        },
        PVW: {
            name: "Proyecto Intermodular",
            short: "PVW",
            icon: "🚀",
            color: "#9b59b6",
            pattern: "stars-purple",
            role: "Gestor de Proyecto"
        },
        A1O: {
            name: "Módulo Optativo",
            short: "A1O",
            icon: "💡",
            color: "#f1c40f",
            pattern: "lines-yellow",
            role: "Especialista"
        },
        ALL: {
            name: "Todos los Módulos",
            short: "ALL",
            icon: "🤝",
            color: "#95a5a6",
            pattern: "solid",
            role: "Sincronización Reto"
        }
    },

    // ============================================
    // FASES DEL PROYECTO (F0-F5) - NIVEL AVANZADO
    // ============================================
    phases: {
        F0: {
            name: "Lanzamiento",
            icon: "🚀",
            color: "#e91e63", // Pink
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
            color: "#3498db", // Blue
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
            color: "#9b59b6", // Purple
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
            color: "#f1c40f", // Yellow
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
            color: "#e67e22", // Orange
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
            color: "#e74c3c", // Red
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
        // E1: ESTANTERÍA MURAL - DEFINICIÓN E INDUSTRIALIZACIÓN
        // Septiembre - Diciembre 2025 (6 semanas)
        // =============================================

        {
            week_id: "E1-S01",
            date_from: "2025-09-15",
            date_to: "2025-09-26",
            eval: "E1",
            project: "Proyecto Inicial",
            phase_common: "F0",
            week_goal: "Encargo y Toma de Datos: Análisis del brief profesional y levantamiento de medidas reales.",
            gate: {
                title: "Hito F0: Proyecto Iniciado",
                description: "Brief firmado y toma de datos completada.",
                conditions: ["Brief analizado", "Toma de datos in situ", "Repo configurado"]
            },
            min_deliverable: {
                title: "Brief + Toma de Datos",
                evidence_required: ["Brief firmado", "Plano estado actual", "Fotos situación"]
            },
            daily_rhythm: {
                monday: { focus: "Lanzamiento", task: "Presentación del reto y equipos", evidence: "Acta constitución" },
                tuesday: { focus: "Brief", task: "Análisis pormenorizado del encargo", evidence: "Brief analizado" },
                wednesday: { focus: "Toma datos", task: "Medición real en ubicación apartamentos", evidence: "Croquis medidas" },
                thursday: { focus: "Repositorio", task: "Configuración de espacio Git/Carpeta", evidence: "Repo OK" },
                friday: { focus: "Hito F0", task: "Validación de toma de datos", evidence: "Checklist F0" }
            },
            modules_focus: {
                DCU: { ra: ["RA1"], focus: "Gestión documental", deliverable: "Estructura repo", enables: "Planos" },
                MCR: { ra: ["RA1"], focus: "Estudio material", deliverable: "Ficha material", enables: "Despiece" }
            },
            coordination: { agreements: ["Uso de mm como unidad estándar"], adjustments: "" },
            risks: ["Medidas imprecisas", "Pérdida de datos iniciales"]
        },
        {
            week_id: "E1-S02",
            date_from: "2025-09-29",
            date_to: "2025-10-10",
            eval: "E1",
            project: "Proyecto Inicial",
            phase_common: "F1",
            week_goal: "Alternativas de Diseño: Generación de propuestas y selección de la solución óptima.",
            gate: {
                title: "Hito F1: Diseño Seleccionado",
                description: "Propuesta final validada técnicamente.",
                conditions: ["2 Alternativas desarrolladas", "Justificación técnica", "Selección final"]
            },
            min_deliverable: {
                title: "Propuesta de Diseño",
                evidence_required: ["Alternativas", "Matriz decisión", "Boceto final"]
            },
            daily_rhythm: {
                monday: { focus: "Bocetaje", task: "Ideación técnica de la estantería", evidence: "Bocetos v1" },
                tuesday: { focus: "Alternativa A", task: "Desarrollo concepto minimalista", evidence: "Boceto A" },
                wednesday: { focus: "Alternativa B", task: "Desarrollo concepto modular", evidence: "Boceto B" },
                thursday: { focus: "Selección", task: "Matriz de decisión técnica", evidence: "Matriz Excel" },
                friday: { focus: "Hito F1", task: "Validación de propuesta con cliente", evidence: "Propuesta firmada" }
            },
            modules_focus: {
                DCU: { ra: ["RA2"], focus: "Análisis soluciones", deliverable: "Matriz decisión", enables: "Planos" },
                MCR: { ra: ["RA1"], focus: "Viabilidad", deliverable: "Check fabricación", enables: "Proceso" }
            },
            coordination: { agreements: ["Diseño debe ser mecanizable en CNC"], adjustments: "" },
            risks: ["Altos costes materiales", "Dificultad ensamblaje"]
        },
        {
            week_id: "E1-S03",
            date_from: "2025-10-13",
            date_to: "2025-10-24",
            eval: "E1",
            project: "Proyecto Inicial",
            phase_common: "F2",
            week_goal: "Planos y Despiece: Generación de la documentación técnica para fabricación.",
            gate: {
                title: "Hito F2: Proyecto Ejecutivo",
                description: "Documentación técnica lista para taller.",
                conditions: ["Plano conjunto acotado", "Lista de despiece", "Optimización tableros"]
            },
            min_deliverable: {
                title: "Dossier Técnico",
                evidence_required: ["Planos PDF", "Lista materiales", "Plan corte"]
            },
            daily_rhythm: {
                monday: { focus: "CAD", task: "Delineación de plano de conjunto", evidence: "Plano v1" },
                tuesday: { focus: "Acotado", task: "Acotación funcional y estética", evidence: "Plano acotado" },
                wednesday: { focus: "Despiece", task: "Listado de componentes y herrajes", evidence: "BOM Excel" },
                thursday: { focus: "Optimización", task: "Software de corte para tableros", evidence: "Plan optimización" },
                friday: { focus: "Hito F2", task: "Validación dossier técnico", evidence: "Dossier OK" }
            },
            modules_focus: {
                DCU: { ra: ["RA4"], focus: "Documentación", deliverable: "Juego planos", enables: "Fabricación" },
                MCR: { ra: ["RA2"], focus: "Materiales", deliverable: "Optimización", enables: "Corte" }
            },
            coordination: { agreements: ["Nomenclatura: P1-Costado, P2-Estante..."], adjustments: "" },
            risks: ["Error en despiece", "Optimización ineficiente"]
        },
        {
            week_id: "E1-S04",
            date_from: "2025-10-27",
            date_to: "2025-11-07",
            eval: "E1",
            project: "Proyecto Inicial",
            phase_common: "F3",
            week_goal: "Marcado y Preparación: Traslado de medidas a material y preparación de máquinas.",
            gate: null,
            min_deliverable: {
                title: "Piezas Marcadas",
                evidence_required: ["Registro marcado", "Checklist seguridad"]
            },
            daily_rhythm: {
                monday: { focus: "Marcado", task: "Traslado de medidas a tableros/madera", evidence: "Marcado físico" },
                tuesday: { focus: "PRL", task: "Revisión de EPIs y protecciones", evidence: "Check PRL" },
                wednesday: { focus: "Herramienta", task: "Preparación de útiles de corte", evidence: "Útiles listos" },
                thursday: { focus: "Material", task: "Corte de piezas brutas", evidence: "Piezas brutas" },
                friday: { focus: "Calidad", task: "Verificación de medidas cortadas", evidence: "Check dimensional" }
            },
            modules_focus: {
                MCR: { ra: ["RA4"], focus: "Preparación", deliverable: "Piezas brutas", enables: "Mecanizado" },
                SOJ: { ra: ["RA1"], focus: "Residuos", deliverable: "Plan reciclaje", enables: "Sostenibilidad" }
            },
            coordination: { agreements: ["Uso obligatorio de gafas en corte"], adjustments: "" },
            risks: ["Error de corte", "Accidente leve"]
        },
        {
            week_id: "E1-S05",
            date_from: "2025-11-10",
            date_to: "2025-11-21",
            eval: "E1",
            project: "Proyecto Inicial",
            phase_common: "F4",
            week_goal: "Mecanizado Convencional: Cepillado, regruesado y perfilado de componentes.",
            gate: null,
            min_deliverable: {
                title: "Mecanizado Base",
                evidence_required: ["Piezas perfiladas", "Informe producción"]
            },
            daily_rhythm: {
                monday: { focus: "Cepillado", task: "Cepillado de caras y cantos", evidence: "Caras/cantos OK" },
                tuesday: { focus: "Regruesado", task: "Paso a grueso definitivo piezas", evidence: "Gruesos listos" },
                wednesday: { focus: "Escuadrado", task: "Escuadrado de tableros estantería", evidence: "Piezas escuadradas" },
                thursday: { focus: "Perfilado", task: "Perfilado de cantos visto", evidence: "Cantos terminados" },
                friday: { focus: "Revisión", task: "Control de calidad de superficies", evidence: "Informe QC v1" }
            },
            modules_focus: {
                MCR: { ra: ["RA4"], focus: "Ejecución", deliverable: "Piezas base", enables: "CNC" },
                IPW: { ra: ["RA1"], focus: "Roles", deliverable: "Reparto tareas", enables: "Gestión" }
            },
            coordination: { agreements: ["Velocidad de avance controlada"], adjustments: "" },
            risks: ["Superficies astilladas", "Piezas fuera de medida"]
        },
        {
            week_id: "E1-S06",
            date_from: "2025-11-24",
            date_to: "2025-12-12",
            eval: "E1",
            project: "Proyecto Inicial",
            phase_common: "F5",
            week_goal: "Cierre Fase 1: Recopilación de evidencias y dossier técnico de industrialización.",
            gate: {
                title: "Hito F5: Cierre Definición",
                description: "Dossier E1 completo y defendido internamente.",
                conditions: ["Dossier finalizado", "Memoria proceso E1", "Evaluación pares"]
            },
            min_deliverable: {
                title: "Dossier E1",
                evidence_required: ["Dossier PDF", "Video proceso", "Portfolio"]
            },
            daily_rhythm: {
                monday: { focus: "Memoria", task: "Redacción de memoria de proceso", evidence: "Borrador memoria" },
                tuesday: { focus: "Fotos", task: "Registro fotográfico final piezas", evidence: "Album proceso" },
                wednesday: { focus: "Dossier", task: "Maquetación del dossier técnico", evidence: "Dossier E1 PDF" },
                thursday: { focus: "Defensa", task: "Presentación de resultados equipo", evidence: "Presentación OK" },
                friday: { focus: "Cierre E1", task: "**ENTREGA OFICIAL E1**", evidence: "Repositorio cerrado" }
            },
            modules_focus: {
                DCU: { ra: ["RA6"], focus: "Archivo", deliverable: "Dossier final", enables: "Evaluación E1" },
                ALL: { focus: "Coordinación", deliverable: "Entrega total", enables: "E2" }
            },
            coordination: { agreements: ["Dossier < 5MB para Moodle"], adjustments: "" },
            risks: ["Falta de evidencias gráficas", "Retraso en entrega"]
        },
        {
            week_id: "E2-S01",
            date_from: "2025-12-15",
            date_to: "2025-12-19",
            eval: "E2",
            project: "Proyecto Intermedio",
            phase_common: "F4",
            week_goal: "Programación CNC: Creación de estrategias CAM y simulación de mecanizados.",
            gate: {
                title: "Hito E2-S1: CAM Validado",
                description: "Programas CNC listos para carga.",
                conditions: ["Archivo CAM sin avisos", "Simulación sin colisiones", "Postprocesado OK"]
            },
            min_deliverable: {
                title: "Paquete CAM",
                evidence_required: ["Archivo .cam / .hop / .bpp", "Captura simulación", "Hoja herramientas CNC"]
            },
            daily_rhythm: {
                monday: { focus: "Análisis", task: "Revisión 3D para mecanizado CNC", evidence: "Checklist viabilidad" },
                tuesday: { focus: "CAM 1", task: "Estrategias de fresado de estantes", evidence: "Programa estantes" },
                wednesday: { focus: "CAM 2", task: "Estrategias de taladrado y cajeado", evidence: "Programa taladros" },
                thursday: { focus: "Simulación", task: "Verificación de trayectorias en software", evidence: "Simulación validada" },
                friday: { focus: "Cierre CAM", task: "Generación de código G y hojas de carga", evidence: "Pack programas" }
            },
            modules_focus: {
                MCP: { ra: ["RA1"], focus: "Programación", deliverable: "Código G", enables: "Mecanizado" },
                DCU: { ra: ["RA3"], focus: "Rutas", deliverable: "Hoja de ruta industrial", enables: "Producción" }
            },
            coordination: { agreements: ["Uso de ventosas de 125x75mm"], adjustments: "" },
            risks: ["Colisión de herramienta", "Postprocesador incorrecto"]
        },
        {
            week_id: "E2-S02",
            date_from: "2026-01-08",
            date_to: "2026-01-16",
            eval: "E2",
            project: "Proyecto Intermedio",
            phase_common: "F4",
            week_goal: "Puesta a Punto CNC: Carga de herramientas, orígenes de pieza y pruebas en vacío.",
            gate: {
                title: "Hito E2-S2: Máquina Lista",
                description: "CNC configurado para producción en lote.",
                conditions: ["Herramientas medidas", "Orígenes seteados", "Prueba vacío OK"]
            },
            min_deliverable: {
                title: "Registro Calibración",
                evidence_required: ["Ficha herramientas", "Foto orígenes", "Checklist seguridad CNC"]
            },
            daily_rhythm: {
                monday: { focus: "Herramientas", task: "Carga y medición de fresas en almacén", evidence: "Registro herramientas" },
                tuesday: { focus: "Orígenes", task: "Definición de puntos cero en mesa", evidence: "Foto máquina" },
                wednesday: { focus: "Pruebas", task: "Mecanizado en martir / Prueba en vacío", evidence: "Video prueba" },
                thursday: { focus: "Sujeción", task: "Configuración de ventosas y vacío", evidence: "Plano mártir" },
                friday: { focus: "Hito E2-S2", task: "Validación de set-up con docente", evidence: "Check-off docente" }
            },
            modules_focus: {
                MCP: { ra: ["RA2"], focus: "Preparación", deliverable: "Set-up máquina", enables: "Producción" },
                MCR: { ra: ["RA3"], focus: "Seguridad", deliverable: "Registro PRL", enables: "Operación" }
            },
            coordination: { agreements: ["Limpieza estricta de filtros de vacío"], adjustments: "" },
            risks: ["Rotura de fresa por mal avance", "Pérdida de vacío"]
        },
        {
            week_id: "E2-S03",
            date_from: "2026-01-19",
            date_to: "2026-01-30",
            eval: "E2",
            project: "Proyecto Intermedio",
            phase_common: "F4",
            week_goal: "Mecanizado CNC de Piezas: Producción de lotes de estantería y control dimensional.",
            gate: {
                title: "Hito E2-S3: Lote CNC Terminado",
                description: "Todas las piezas críticas mecanizadas.",
                conditions: ["Lote completo", "Control calidad OK", "Sin defectos superficie"]
            },
            min_deliverable: {
                title: "Informe Producción CNC",
                evidence_required: ["Piezas terminadas", "Registro calidad", "Fotos detalle mecanizado"]
            },
            daily_rhythm: {
                monday: { focus: "Arranque", task: "Mecanizado de primera pieza controlada", evidence: "Pieza 0 OK" },
                tuesday: { focus: "Producción", task: "Mecanizado en serie de estantes", evidence: "Lote A" },
                wednesday: { focus: "Producción", task: "Mecanizado en serie de costados", evidence: "Lote B" },
                thursday: { focus: "Calidad", task: "Medición dimensional de piezas", evidence: "Registro medidas" },
                friday: { focus: "Cierre CNC", task: "Limpieza y mantenimiento 1er nivel", evidence: "Ficha mantenimiento" }
            },
            modules_focus: {
                MCP: { ra: ["RA3"], focus: "Mecanizado", deliverable: "Lote piezas", enables: "Montaje" },
                SOJ: { ra: ["RA2"], focus: "Residuos", deliverable: "Gestión viruta", enables: "Sostenibilidad" }
            },
            coordination: { agreements: ["Marcar piezas con lápiz NO graso"], adjustments: "" },
            risks: ["Variación dimensional", "Bordes quemados"]
        },
        {
            week_id: "E2-S04",
            date_from: "2026-02-02",
            date_to: "2026-02-13",
            eval: "E2",
            project: "Proyecto Intermedio",
            phase_common: "F4",
            week_goal: "Mecanizado de Uniones y Ajustes: Espigas, mortajas y ajustes manuales de precisión.",
            gate: null,
            min_deliverable: {
                title: "Conjunto Ajustado",
                evidence_required: ["Piezas encajadas", "Fotos uniones"]
            },
            daily_rhythm: {
                monday: { focus: "Uniones", task: "Mecanizado de espigas en convencional", evidence: "Espigas listas" },
                tuesday: { focus: "Ajuste", task: "Ajuste manual de uniones críticas", evidence: "Ajuste perfecto" },
                wednesday: { focus: "Herrajes", task: "Cajeado para herrajes ocultos", evidence: "Herrajes embutidos" },
                thursday: { focus: "Pre-montaje", task: "Ensamblaje en seco (Dry-fit)", evidence: "Estructura en pie" },
                friday: { focus: "Validación", task: "Control de escuadría y plomo", evidence: "Check escuadra" }
            },
            modules_focus: {
                MCR: { ra: ["RA4"], focus: "Uniones", deliverable: "Estructura ajustada", enables: "Encolado" },
                IPW: { ra: ["RA2"], focus: "Trabajo equipo", deliverable: "Informe roles", enables: "Gestión" }
            },
            coordination: { agreements: ["Tolerancia máxima de ajuste: 0.2mm"], adjustments: "" },
            risks: ["Holgura excesiva", "Rotura de fibras en canteado"]
        },
        {
            week_id: "E2-S05",
            date_from: "2026-02-16",
            date_to: "2026-02-20",
            eval: "E2",
            project: "Proyecto Intermedio",
            phase_common: "F5",
            week_goal: "Cierre Fase 2: Control de calidad final de industrialización y preparación para acabados.",
            gate: {
                title: "Hito E2-Final: APTO Industrial",
                description: "Piezas listas para encolado y acabado.",
                conditions: ["Lijado base terminado", "Dossier E2 completo", "Validación docente"]
            },
            min_deliverable: {
                title: "Dossier E2",
                evidence_required: ["Memoria técnica industrial", "Programas CNC", "Informe calidad"]
            },
            daily_rhythm: {
                monday: { focus: "Lijado", task: "Saneado de superficies y cantos", evidence: "Piezas lijadas" },
                tuesday: { focus: "Documentación", task: "Recopilación de fichas de proceso", evidence: "Borrador dossier" },
                wednesday: { focus: "Evidencias", task: "Reportaje fotográfico industrial", evidence: "Portfolio E2" },
                thursday: { focus: "Hito E2", task: "**ENTREGA DOSSIER E2**", evidence: "Dossier PDF" },
                friday: { focus: "Cierre E2", task: "Feedback y evaluación de fase", evidence: "Nota E2" }
            },
            modules_focus: {
                DCU: { ra: ["RA4"], focus: "Documentación", deliverable: "Dossier técnico", enables: "Evaluación" },
                ALL: { focus: "Orden y Limpieza", deliverable: "Taller OK", enables: "E3" }
            },
            coordination: { agreements: ["Limpieza general de máquinas antes de E3"], adjustments: "" },
            risks: ["Documentación incompleta", "Piezas marcadas por golpes"]
        },
        {
            week_id: "E3-S01",
            date_from: "2026-02-23",
            date_to: "2026-02-27",
            eval: "E3",
            project: "Proyecto Final",
            phase_common: "F4",
            week_goal: "Montaje y Encolado: Ensamblaje definitivo de la estantería con fijaciones estructurales.",
            gate: {
                title: "Hito E3-S1: Mueble Montado",
                description: "Estructura sólida y sin restos de adhesivo.",
                conditions: ["Encolado terminado", "Escuadría verificada", "Limpieza de colas"]
            },
            min_deliverable: {
                title: "Mueble Ensamblado",
                evidence_required: ["Fotos proceso encolado", "Registro de escuadría"]
            },
            daily_rhythm: {
                monday: { focus: "Preparación", task: "Organización de sargentos y útiles", evidence: "Bancada lista" },
                tuesday: { focus: "Encolado 1", task: "Encolado de subconjuntos", evidence: "Subconjuntos listos" },
                wednesday: { focus: "Encolado 2", task: "Montaje general del cuerpo", evidence: "Mueble en sargentos" },
                thursday: { focus: "Limpieza", task: "Retirada de colas en húmedo", evidence: "Interiores limpios" },
                friday: { focus: "Control", task: "Verificación final de medidas", evidence: "Check escuadra OK" }
            },
            modules_focus: {
                MJC: { ra: ["RA1"], focus: "Montaje", deliverable: "Estructura sólida", enables: "Acabado" },
                SOJ: { ra: ["RA3"], focus: "Seguridad", deliverable: "Check EPIs", enables: "Operación" }
            },
            coordination: { agreements: ["Tiempo de prensado: mín. 4 horas"], adjustments: "" },
            risks: ["Manchas de cola invisibles (aparecen al barnizar)", "Falta de escuadría"]
        },
        {
            week_id: "E3-S02",
            date_from: "2026-03-02",
            date_to: "2026-03-13",
            eval: "E3",
            project: "Proyecto Final",
            phase_common: "F4",
            week_goal: "Preparación de Superficies: Lijado de fondo, matizado y reparación de defectos.",
            gate: null,
            min_deliverable: {
                title: "Superficie Calidad",
                evidence_required: ["Mueble lijado fine", "Checklist tacto"]
            },
            daily_rhythm: {
                monday: { focus: "Lijado 1", task: "Lijado de grano 80 y 120", evidence: "Superficie nivelada" },
                tuesday: { focus: "Reparación", task: "Masillado de pequeñas fisuras", evidence: "Defectos ocultos" },
                wednesday: { focus: "Lijado 2", task: "Lijado fino de grano 180 y 240", evidence: "Tacto sedoso" },
                thursday: { focus: "Cantos", task: "Matizado de aristas y rincones", evidence: "Aristas muertas" },
                friday: { focus: "Limpieza", task: "Soplado y desengrasado", evidence: "Mueble libre de polvo" }
            },
            modules_focus: {
                AAD: { ra: ["RA1"], focus: "Preparación", deliverable: "Soporte listo", enables: "Barnizado" },
                SOJ: { ra: ["RA2"], focus: "Aspiración", deliverable: "Filtros limpios", enables: "PMA" }
            },
            coordination: { agreements: ["No usar aire comprimido cerca de cabina de barniz"], adjustments: "" },
            risks: ["Rayas de lija transversales", "Canto quemado por lijadora"]
        },
        {
            week_id: "E3-S03",
            date_from: "2026-03-16",
            date_to: "2026-03-27",
            eval: "E3",
            project: "Proyecto Final",
            phase_common: "F4",
            week_goal: "Barnizado y Secado: Aplicación de imprimación y acabado final profesional.",
            gate: {
                title: "Hito E3-S3: Acabado OK",
                description: "Producto con terminación profesional.",
                conditions: ["Sin chorretones", "Brillo uniforme", "Sin motas polvo"]
            },
            min_deliverable: {
                title: "Producto Terminado",
                evidence_required: ["Fotos acabado final", "Registro cabina"]
            },
            daily_rhythm: {
                monday: { focus: "Setup", task: "Preparación de mezcla y pistola", evidence: "Mezcla OK" },
                tuesday: { focus: "Fondo", task: "Aplicación de primera mano fondo", evidence: "Mueble fondeado" },
                wednesday: { focus: "Lijado", task: "Lijado suave entre manos", evidence: "Matizado OK" },
                thursday: { focus: "Acabado", task: "Aplicación de mano de terminación", evidence: "Brillo final" },
                friday: { focus: "Secado", task: "Control de secado y atmósfera", evidence: "Informe secado" }
            },
            modules_focus: {
                AAD: { ra: ["RA3"], focus: "Barnizado", deliverable: "Acabado final", enables: "Instalación" },
                SOJ: { ra: ["RA4"], focus: "Residuos químicos", deliverable: "Gestión envases", enables: "PRL" }
            },
            coordination: { agreements: ["Uso de mascarilla de carbón activo obligatoria"], adjustments: "" },
            risks: ["Piel de naranja", "Contaminación por siliconas"]
        },
        {
            week_id: "E3-S04",
            date_from: "2026-04-06",
            date_to: "2026-04-17",
            eval: "E3",
            project: "Proyecto Final",
            phase_common: "F4",
            week_goal: "Fijación Mural y Test de Carga: Instalación en pared y prueba de resistencia.",
            gate: {
                title: "Hito E3-S4: Instalación Segura",
                description: "Estantería colgada con seguridad normativa.",
                conditions: ["Anclajes verificados", "Nivelación perfecta", "Carga test OK"]
            },
            min_deliverable: {
                title: "Informe Instalación",
                evidence_required: ["Fotos anclaje mural", "Video test carga (50kg)"]
            },
            daily_rhythm: {
                monday: { focus: "Marcado", task: "Replanteo de taladros en pared", evidence: "Puntos marcados" },
                tuesday: { focus: "Taladrado", task: "Ejecución de taladros en diversos soportes", evidence: "Agujeros OK" },
                wednesday: { focus: "Cuelgue", task: "Montaje de herrajes ocultos murales", evidence: "Mueble colgado" },
                thursday: { focus: "Ajuste", task: "Regulación de altura y plomo", evidence: "Nivelado" },
                friday: { focus: "Test", task: "Prueba de carga dinámica y estática", evidence: "Certificado carga" }
            },
            modules_focus: {
                MJC: { ra: ["RA5"], focus: "Instalación", deliverable: "Mueble instalado", enables: "Cierre" },
                DCU: { ra: ["RA5"], focus: "Instrucciones", deliverable: "Guía de montaje", enables: "Entrega" }
            },
            coordination: { agreements: ["Limpieza de polvo de ladrillo inmediata"], adjustments: "" },
            risks: ["Rotura de tubería empotrada", "Fijación inestable"]
        },
        {
            week_id: "E3-S05",
            date_from: "2026-04-20",
            date_to: "2026-04-24",
            eval: "E3",
            project: "Proyecto Final",
            phase_common: "F5",
            week_goal: "Presupuesto y Memoria Final: Cierre económico y documental del proyecto.",
            gate: null,
            min_deliverable: {
                title: "Dossier Económico",
                evidence_required: ["Presupuesto real", "Hoja de costes"]
            },
            daily_rhythm: {
                monday: { focus: "Materiales", task: "Cómputo final de consumibles", evidence: "Lista materiales" },
                tuesday: { focus: "Horas", task: "Registro de horas hombre reales", evidence: "Hoja tiempos" },
                wednesday: { focus: "Cálculo", task: "Cálculo de margen y beneficio", evidence: "Balance económico" },
                thursday: { focus: "Presupuesto", task: "Factura proforma para cliente", evidence: "Factura PDF" },
                friday: { focus: "Validación", task: "Validación cierre económico", evidence: "Cierre firmado" }
            },
            modules_focus: {
                DCU: { ra: ["RA5"], focus: "Presupuestos", deliverable: "Factura final", enables: "Memoria" },
                IPW: { ra: ["RA3"], focus: "Gestión", deliverable: "Informe impacto", enables: "Portfolio" }
            },
            coordination: { agreements: ["Incluir 15% de gastos generales"], adjustments: "" },
            risks: ["Desviación presupuestaria > 20%", "Olvido de costes indirectos"]
        },
        {
            week_id: "E3-S06",
            date_from: "2026-04-27",
            date_to: "2026-05-14",
            eval: "E3",
            project: "Proyecto Final",
            phase_common: "F5",
            week_goal: "Proyecto Intermodular: Integración de portfolio y preparación de defensa.",
            gate: {
                title: "Hito E3-S6: Portfolio Listo",
                description: "Toda la documentación terminada para defensa.",
                conditions: ["Portfolio profesional", "Dossier técnico final", "Presentación lista"]
            },
            min_deliverable: {
                title: "Portfolio Proyecto",
                evidence_required: ["Web/PDF Portfolio", "Presentación multimedia"]
            },
            daily_rhythm: {
                monday: { focus: "Recopilación", task: "Selección de mejores fotos y videos", evidence: "Assets listos" },
                tuesday: { focus: "Diseño", task: "Maquetación de portfolio profesional", evidence: "Borrador portfolio" },
                wednesday: { focus: "Textos", task: "Redacción de descripciones técnicas", evidence: "Contenidos OK" },
                thursday: { focus: "Slides", task: "Creación de presentación para defensa", evidence: "Presentación v1" },
                friday: { focus: "Ensayo", task: "Primer ensayo de exposición", evidence: "Grabación audio" }
            },
            modules_focus: {
                PVW: { ra: ["RA1"], focus: "Integración", deliverable: "Portfolio final", enables: "Defensa" },
                AAD: { ra: ["RA5"], focus: "Estética", deliverable: "Fotos detalle", enables: "Marketing" }
            },
            coordination: { agreements: ["Formato 16:9 para la presentación"], adjustments: "" },
            risks: ["Portfolio con errores ortográficos", "Presentación muy larga"]
        },
        {
            week_id: "E3-S07",
            date_from: "2026-05-15",
            date_to: "2026-05-29",
            eval: "E3",
            project: "Proyecto Final",
            phase_common: "F5",
            week_goal: "**DEFENSA FINAL**: Presentación oral del proyecto ante el equipo docente.",
            gate: {
                title: "HITO FINAL: Título en Proceso",
                description: "Defensa superada y proyecto cerrado.",
                conditions: ["Exposición realizada", "Preguntas respondidas", "Apto tribunal"]
            },
            min_deliverable: {
                title: "Defensa Proyecto",
                evidence_required: ["Acta de defensa", "Autoevaluación final"]
            },
            daily_rhythm: {
                monday: { focus: "Ensayos", task: "Ensayos generales con cronómetro", evidence: "Timing ajustado" },
                tuesday: { focus: "Repaso", task: "Repaso de puntos críticos técnicos", evidence: "Cheat-sheet" },
                wednesday: { focus: "DEFENSA", task: "**DEFENSA ANTE TRIBUNAL**", evidence: "Acta firmada" },
                thursday: { focus: "Entrega", task: "Cierre de repositorio y archivos", evidence: "Repo cerrado" },
                friday: { focus: "Graduación", task: "Valoración del curso y despedida", evidence: "Encuesta satisfy" }
            },
            modules_focus: {
                ALL: { focus: "Defensa Total", deliverable: "Presentación final", enables: "Aprobado" }
            },
            coordination: { agreements: ["10 min exposición + 5 min preguntas"], adjustments: "" },
            risks: ["Bloqueo en la defensa", "Fallo técnico presentación"]
        },
        {
            week_id: "DUAL-S01",
            date_from: "2026-06-01",
            date_to: "2026-06-23",
            eval: "DUAL",
            project: "Formación en Empresa (DUAL)",
            phase_common: "Empresa",
            week_goal: "Integración en Entorno Real: Aplicación de competencias en talleres externos.",
            gate: null,
            min_deliverable: {
                title: "Memoria DUAL",
                evidence_required: ["Registro actividades", "Informe tutor empresa"]
            },
            daily_rhythm: {
                monday: { focus: "Empresa", task: "Jornada laboral real", evidence: "Diario clase" },
                tuesday: { focus: "Empresa", task: "Jornada laboral real", evidence: "Diario clase" },
                wednesday: { focus: "Empresa", task: "Jornada laboral real", evidence: "Diario clase" },
                thursday: { focus: "Empresa", task: "Jornada laboral real", evidence: "Diario clase" },
                friday: { focus: "Centro", task: "Seguimiento tutor centro", evidence: "Reunión semanal" }
            },
            modules_focus: {
                ALL: { focus: "Práctica Real", deliverable: "Experiencia profesional", enables: "Inserción laboral" }
            }
        },

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
            project: "Proyecto Inicial",
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
            title: "Proyecto Inicial",
            project: "Proyecto Inicial",
            flow: [
                { f: "F1/F2", l: "DCU", c: "var(--col-dcu)" },
                { f: "F3", l: "MCR", c: "var(--col-mcr)" }
            ],
            modules: [
                {
                    id: "dcu", name: "DCU — Doc. Técnica", focus: "Requisitos y diseño.",
                    ras: [
                        { t: "RA1: Recopilación información", ce: "Búsqueda y análisis del encargo." },
                        { t: "RA2: Evaluación soluciones", ce: "Justificación de la estantería mural." },
                        { t: "RA3: Selección procesos", ce: "Ruta de fabricación inicial." },
                        { t: "RA4: Documentación gráfica", ce: "Croquis y bocetos definitivos." }
                    ],
                    ev: { proc: "Dossier de alternativas y planos base" }
                },
                {
                    id: "mcr", name: "MCR — Mecanizado Convencional", focus: "Optimización.",
                    ras: [
                        { t: "RA1: Selección materiales", ce: "Optimización y plan de corte." },
                        { t: "RA2: Prepara fabricación", ce: "Marcado y piezas base taller." }
                    ],
                    ev: { proc: "Lista de despiece y optimización verificada" }
                }
            ]
        },
        {
            id: "e2",
            title: "Proyecto Intermedio",
            project: "Proyecto Intermedio",
            flow: [
                { f: "F2", l: "DCU", c: "var(--col-dcu)" },
                { f: "F4", l: "MCP", c: "var(--col-mcp)" },
                { f: "F4", l: "MCR", c: "var(--col-mcr)" }
            ],
            modules: [
                {
                    id: "mcr", name: "MCR — Mecanizado Convencional", focus: "Taller convencional.",
                    ras: [
                        { t: "RA3: Puesta a punto", ce: "Uso seguro de maquinaria fija." },
                        { t: "RA4: Mecanizado piezas", ce: "Mecanizado y prensado de componentes." }
                    ],
                    ev: { proc: "Subconjuntos mecanizados terminados" }
                },
                {
                    id: "mcp", name: "MCP — CNC", focus: "Producción digital.",
                    ras: [
                        { t: "RA1: Programas CNC", ce: "Programación de piezas estantería." },
                        { t: "RA2: Prepara máquinas", ce: "Carga de herramientas y orígenes." },
                        { t: "RA3: Control procesos", ce: "Mecanizado de piezas críticas en CNC." }
                    ],
                    ev: { proc: "Piezas CNC verificadas dimensionalmente" }
                },
                {
                    id: "dcu", name: "DCU — Doc. Técnica", focus: "CAD Industrial.",
                    ras: [
                        { t: "RA3: Selección procesos", ce: "Hojas de ruta industriales." },
                        { t: "RA4: Documentación gráfica", ce: "Planos detallados de fabricación." }
                    ],
                    ev: { proc: "Planos industriales de fabricación" }
                }
            ]
        },
        {
            id: "e3",
            title: "Proyecto Final",
            project: "Proyecto Final",
            flow: [
                { f: "F5", l: "PVW", c: "var(--col-pvw)" },
                { f: "F5", l: "IPW", c: "var(--col-ipw)" }
            ],
            modules: [
                {
                    id: "dcu", name: "DCU — Doc. Técnica", focus: "Costes y Cierre.",
                    ras: [
                        { t: "RA5: Presupuestos", ce: "Valoración económica completa." },
                        { t: "RA6: Documentación final", ce: "Dossier ejecutivo del proyecto." }
                    ],
                    ev: { proc: "Presupuesto real y dossier final integral" }
                },
                {
                    id: "mcr", name: "MCR — Mecanizado Convencional", focus: "Mantenimiento.",
                    ras: [
                        { t: "RA5: Mantenimiento", ce: "Limpieza y puesta a punto final." },
                        { t: "RA6: PRL Ambiental", ce: "Gestión de residuos y seguridad taller." }
                    ],
                    ev: { proc: "Checklist de mantenimiento y registro ambiental" }
                },
                {
                    id: "mcp", name: "MCP — CNC", focus: "Cierre CNC.",
                    ras: [
                        { t: "RA4: Mantenimiento CNC", ce: "Mantenimiento preventivo 1er nivel." },
                        { t: "RA5: PRL CNC", ce: "Seguridad operativa en control numérico." }
                    ],
                    ev: { proc: "Ficha de mantenimiento CNC realizada" }
                },
                {
                    id: "mjc", name: "MJC — Montaje", focus: "Ensamble.",
                    ras: [
                        { t: "RA1-RA5: Montaje", ce: "Montaje, herrajes y fijación mural." }
                    ],
                    ev: { proc: "Mueble montado con fijación de seguridad" }
                },
                {
                    id: "aad", name: "AAD — Acabados", focus: "Barnizado.",
                    ras: [
                        { t: "RA1-RA5: Acabados", ce: " Barnizado, secado y gestión de residuos." }
                    ],
                    ev: { proc: "Producto final con acabado profesional" }
                },
                {
                    id: "pvw", name: "PVW — Proyecto Intermodular", focus: "Integración.",
                    ras: [
                        { t: "Defensa Proyecto", ce: "Presentación oral ante el equipo docente." }
                    ],
                    ev: { proc: "Exposición oral del proyecto final" }
                }
            ]
        }
    ],

    timeline: [
        {
            eval: "E1", title: "Proyecto Inicial", weeks: [
                { num: 1, id: "E1-S01", dates: "15-26 Sep", goal: "Encargo y Toma de Datos", leader: "DCU", leaderColor: "var(--col-dcu)", dod: ["Brief firmado", "Toma de datos", "Repo OK"] },
                { num: 2, id: "E1-S02", dates: "26 Sep-03 Oct", goal: "Alternativas y Selección", leader: "DCU", leaderColor: "var(--col-dcu)", dod: ["2 Alternativas", "Justificación", "Croquis base"] },
                { num: 3, id: "E1-S03", dates: "10-24 Oct", goal: "Planos y Despiece", leader: "DCU", leaderColor: "var(--col-dcu)", dod: ["Plano conjunto", "Lista materiales", "Optimización"] },
                { num: 4, id: "E1-S04", dates: "24 Oct-07 Nov", goal: "Marcado y Preparación", leader: "MCR", leaderColor: "var(--col-mcr)", dod: ["Piezas marcadas", "Selección madera", "Check PRL"] },
                { num: 5, id: "E1-S05", dates: "10-21 Nov", goal: "Mecanizado Convencional", leader: "MCR", leaderColor: "var(--col-mcr)", dod: ["Piezas brutas", "Regruesado", "Primeras piezas"] },
                { num: 6, id: "E1-S06", dates: "24 Nov-12 Dic", goal: "Dossier Técnico E1", leader: "DCU", leaderColor: "var(--col-dcu)", dod: ["Planos finales E1", "Memoria proceso"] }
            ]
        },
        {
            eval: "E2", title: "Proyecto Intermedio", weeks: [
                { num: 1, id: "E2-S01", dates: "15-19 Dic", goal: "Programación CNC", leader: "MCP", leaderColor: "var(--col-mcp)", dod: ["Archivo CAM", "Simulación", "Estrategia"] },
                { num: 2, id: "E2-S02", dates: "08-16 Ene", goal: "Puesta a punto CNC", leader: "MCP", leaderColor: "var(--col-mcp)", dod: ["Herramientas cargadas", "Origen pieza", "Prueba vacío"] },
                { num: 3, id: "E2-S03", dates: "19-30 Ene", goal: "Mecanizado CNC Piezas", leader: "MCP", leaderColor: "var(--col-mcp)", dod: ["Mecanizado lotes", "Control calidad", "Verificación"] },
                { num: 4, id: "E2-S04", dates: "02-13 Feb", goal: "Mecanizado Uniones", leader: "MCR", leaderColor: "var(--col-mcr)", dod: ["Espigas/Mortajas", "Ajuste conjunto", "Piezas listas"] },
                { num: 5, id: "E2-S05", dates: "16-20 Feb", goal: "Hito Calidad E2", leader: "MCR", leaderColor: "var(--col-mcr)", dod: ["Pre-montaje", "Check dimensional", "Estado piezas"] }
            ]
        },
        {
            eval: "E3", title: "Proyecto Final", weeks: [
                { num: 1, id: "E3-S01", dates: "23-27 Feb", goal: "Montaje y Encolado", leader: "MJC", leaderColor: "var(--col-mjc)", dod: ["Mueble montado", "Fijaciones herrajes"] },
                { num: 2, id: "E3-S02", dates: "02-13 Mar", goal: "Preparación Acabado", leader: "AAD", leaderColor: "var(--col-aad)", dod: ["Soporte verificado", "Lijado calidad"] },
                { num: 3, id: "E3-S03", dates: "16-27 Mar", goal: "Barnizado y Secado", leader: "AAD", leaderColor: "var(--col-aad)", dod: ["Acabado aplicado", "Control residuos"] },
                { num: 4, id: "E3-S04", dates: "06-17 Abr", goal: "Fijación Mural y Test", leader: "MJC", leaderColor: "var(--col-mjc)", dod: ["Test de carga", "Instalación final"] },
                { num: 5, id: "E3-S05", dates: "20-24 Abr", goal: "Presupuesto y Memoria", leader: "DCU", leaderColor: "var(--col-dcu)", dod: ["Presupuesto real", "Dossier cerrado"] },
                { num: 6, id: "E3-S06", dates: "27 Abr-14 May", goal: "Proyecto Intermodular", leader: "PVW", leaderColor: "var(--col-pvw)", dod: ["Preparación defensa", "Portfolio final"] },
                { num: 7, id: "E3-S07", dates: "15-29 May", goal: "Defensa Final", leader: "ALL", leaderColor: "var(--col-all)", dod: ["Defensa oral", "Aprobación final"] }
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
