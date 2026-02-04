# 📐 Planificación Transversal 2º CFGS Diseño y Amueblamiento

Sistema de planificación, coordinación y seguimiento de proyectos transversales para **2º CFGS Diseño y Amueblamiento**.

---

## 🔗 Enlaces de Acceso

### Vista Profesorado
**Panel de Coordinación Docente** → [Planificacion-Docente.html](Planificacion-Docente.html)

- Gestión completa de fichas diarias/semanales
- Dashboard de seguimiento de entregas
- Configuración de parámetros pedagógicos
- Exportación/importación de datos
- Seguimiento de RA-CE por módulo

### Vista Alumnado
**Consulta de Planificación** → [Planificacion-Alumnado.html](Planificacion-Alumnado.html)

- Consulta de fichas y DoD (Definition of Done)
- Visualización de entregas y deadlines
- Acceso a recursos y materiales
- Seguimiento de progreso personal

---

## ⭐ Características Principales

### Nivel Avanzado - 2º Curso

Este sistema está diseñado específicamente para el **segundo curso** del Ciclo Formativo de Grado Superior, con mayor nivel de complejidad técnica y requisitos profesionales:

- **Proyectos de Alta Complejidad**: E1, E2 y Proyecto Intermodular (E3)
- **Maquinaria Avanzada**: Integración de CNC y maquinaria fija
- **CAD 3D y Renderizado**: Documentación técnica profesional
- **Gestión de Proyectos**: Presupuestación, Gantt y control de calidad industrial
- **Acabados Premium**: Nivel de calidad profesional exigido

### Diferencias con 1º CFGS

| Aspecto | 1º CFGS | 2º CFGS |
|---------|---------|---------|
| **Complejidad Proyectos** | Básico-Intermedio | Avanzado-Profesional |
| **Tecnología** | Maquinaria portátil/manual | CNC + Maquinaria fija |
| **Documentación** | Planos CAD 2D básicos | CAD 3D + Renders + Dossier técnico |
| **Gestión** | Hoja de proceso simple | Gantt + Presupuestos + Plan QC |
| **Proyecto Final** | Mobiliario básico | **Proyecto Intermodular** transversal |
| **Acabados** | Funcional | Premium/Industrial |

### Funcionalidades del Sistema

#### 1. **Panel de Coordinación Docente** 🧑‍🏫
- **Radar Mensual**: Vista global del curso académico con calendario interactivo
- **Planificación Semanal**: Timeline de hitos y liderazgos por módulos
- **Fichas Diarias**: Detalle pedagógico completo de cada sesión
  - Intención de aprendizaje (purpose, success criteria, common mistakes)
  - Definition of Done (DoD) operacional
  - Módulos activos y coordinación
  - PRL (Prevención de Riesgos Laborales) cuando aplica
- **RA/Evidencias**: Tracking de Resultados de Aprendizaje por módulo
- **Dashboard**: Visualización de progreso y entregas por evaluación
- **Gantt**: Diagrama temporal de fases y proyectos

#### 2. **Sistema de Gates (Control de Calidad)** 🚦
Puntos de decisión pedagógica que impiden avanzar sin cumplir requisitos:

- **F0 - Lanzamiento**: Brief profesional + Viabilidad + Planificación
- **F1 - Investigación**: Alternativas de diseño + Renders 3D + Validación
- **F2 - Documentación**: Planos CAD 3D + BOM + Fichas técnicas
- **F3 - Planificación Industrial**: Hoja de ruta + CNC + Plan QC + PRL
- **F4 - Producción**: Producto terminado + Control dimensional + Fotografía
- **F5 - Entrega**: Dossier técnico + Presentación + Análisis económico

#### 3. **Proyecto Intermodular (E3)** 🎯
Proyecto transversal que integra **TODOS** los módulos del ciclo formativo:
- Coordinación multimodular (DJK, DRP, RRC, FAT, PMB, PUB)
- Producto de nivel profesional
- Documentación técnica completa
- Presentación comercial
- Gestión económica real

---

## 📂 Estructura del Proyecto

```
Planificación Transversal 2.º CFGS/
├── Planificacion-Docente.html    # Vista profesorado
├── Planificacion-Alumnado.html   # Vista alumnado
├── README.md                       # Este archivo
├── css/                            # Hojas de estilo
│   ├── planificacion-base.css
│   ├── planificacion-docente.css
│   ├── planificacion-alumnado.css
│   ├── dashboard.css
│   ├── fichas.css
│   ├── gantt.css
│   └── ... (otros estilos)
├── js/                             # Módulos JavaScript
│   ├── academic-year-manager.js
│   ├── dashboard-renderer.js
│   ├── fichas-renderer.js
│   ├── gantt-renderer.js
│   ├── progress-manager.js
│   ├── ra-tracker.js
│   ├── settings-manager.js
│   └── ... (otros módulos)
├── data/                           # Datos de planificación
│   └── master-plan.js              # Plan maestro 2º CFGS
└── icons/                          # Iconos y recursos
```

---

## 🎓 Módulos Profesionales Integrados

- **DJK** 💻 Digitalización y Sostenibilidad
- **DRP** 🎨 Desarrollo de Producto
- **RRC** 📐 Representación en Carpintería (CAD 3D)
- **FAT** 🪚 Fabricación a Medida (CNC + Manual)
- **PMB** 🧪 Prototipos en Carpintería
- **PUB** 🏭 Procesos en Industrias
- **PIE** 🎯 Proyecto Intermodular (E3)

---

## 🚀 Despliegue

### Opción 1: Servidor Local
```bash
# Abrir directamente los archivos HTML en un navegador
# o usar un servidor local:
python -m http.server 8000
# Luego abrir: http://localhost:8000/Planificacion-Docente.html
```

### Opción 2: GitHub Pages (Recomendado)
1. Crear repositorio en GitHub
2. Subir todos los archivos del proyecto
3. Activar GitHub Pages en configuración del repositorio
4. Acceder mediante la URL generada

### Opción 3: Hosting Personalizado
- Subir vía FTP/SFTP a tu servidor web
- No requiere backend, funciona con archivos estáticos
- Compatible con Netlify, Vercel, etc.

---

## 🔧 Mantenimiento de Datos

### Actualizar Contenido Curricular

El archivo principal de datos es [`data/master-plan.js`](data/master-plan.js), que contiene:

```javascript
window.MASTER_PLAN = {
    config: { ... },              // Configuración general del curso
    pedagogical_context: { ... }, // Objetivos por evaluación (E1, E2, E3)
    modules: { ... },             // Definición de módulos profesionales
    phases: { ... },              // Fases F0-F5 con gates de calidad
    weeks: [ ... ],               // Planificación semanal detallada
    days: [ ... ],                // Fichas diarias específicas
    academic: [ ... ],            // Estructura RA/CE por evaluación
    timeline: [ ... ]             // Timeline simplificado
};
```

### Áreas a Personalizar

#### 1. **Proyectos de Evaluación** (PENDIENTE)
Actualmente marcados como `[DEFINIR]`, actualizar en:
- `pedagogical_context.E1` → Proyecto 1ª Evaluación
- `pedagogical_context.E2` → Proyecto 2ª Evaluación
- `pedagogical_context.E3` → Proyecto Intermodular (ya tiene base)

#### 2. **Planificación Semanal**
Completar el array `weeks` con todas las semanas del curso académico según calendario real.

#### 3. **Fichas Diarias Específicas**
Añadir en el array `days` las jornadas que requieran detalle especial (taller CNC, entregas críticas, revisiones).

#### 4. **Resultados de Aprendizaje**
Actualizar el array `academic` con los RA y CE específicos de cada módulo según las programaciones oficiales.

---

## 💾 Datos Locales

El sistema utiliza **`localStorage`** para:
- Progreso de entregas y tareas
- Configuraciones pedagógicas personalizadas
- Estado de vistas colapsadas
- Preferencias de visualización

**Importante**: Los datos son locales al navegador. Para compartir progreso entre docentes o hacer backup:
1. Ir a Vista Profesorado → Botón `📥 Exportar`
2. Guardar el archivo JSON generado
3. Importar en otro navegador/equipo usando `📤 Importar`

---

## 📝 Notas Importantes

### 🎯 **Proyecto Intermodular (E3)**
Según la [Circular DGFPERE sobre Proyecto Intermodular](#), este proyecto debe:
- Integrar contenidos de **TODOS** los módulos profesionales del ciclo
- Tener una duración mínima establecida en el currículo
- Ser evaluado de forma coordinada por el equipo docente
- Generar un producto/servicio de nivel profesional
- Incluir presentación y defensa pública

### ⚠️ **Evaluación y Calificación**
Este sistema es una **herramienta de planificación y seguimiento**, NO sustituye:
- Rúbricas de evaluación oficiales
- Listas de cotejo por competencias
- Juicio profesional del equipo docente

Los checkboxes y progreso registran **trazabilidad del proceso**, no generan calificaciones directas.

### 🔒 **Privacidad y Datos**
- No se envían datos a ningún servidor externo
- Toda la información permanece en el navegador local
- Compatible con RGPD al no recopilar datos personales identificables

---

## 📚 Recursos Adicionales

- [Programaciones Didácticas 2º CFS](docs/)
- [BOC - Currículo CFGS Diseño y Amueblamiento](docs/)
- [Horarios 2º CFGS](docs/)
- [Circular Proyecto Intermodular](docs/)

---

## 🛠️ Soporte Técnico

Para dudas o problemas técnicos:
1. Revisar consola del navegador (F12) en busca de errores
2. Verificar que `data/master-plan.js` carga correctamente
3. Comprobar que `localStorage` está habilitado en el navegador

---

## 📜 Licencia

Sistema desarrollado para uso educativo en el **IES Ana Luisa Benítez**.

---

**Versión**: 2.0  
**Curso Académico**: 2025-2026  
**Nivel**: 2º CFGS Diseño y Amueblamiento
