# 🔍 DIAGNÓSTICO: Fichas Vacías

## ✅ Verificaciones Completadas

### 1. Estructura de Datos
- ✅ `master-plan.js` cargado correctamente
- ✅ Evaluaciones configuradas: `["E1", "E2", "FEOE"]`
- ✅ Módulos 2º CFGS definidos: DDR, IYO, ATZ, GNE, PIM
- ✅ Total de semanas: 33 (E1: 13, E2: 8, FEOE: 12)
- ✅ Timeline configurado con FEOE
- ✅ Todas las semanas tienen `daily_rhythm` definido

### 2. Funciones del Sistema
- ✅ `window.MASTER_PLAN.getDay()` existe y funciona
- ✅ `window.MASTER_PLAN.getWeek()` existe
- ✅ `FichasRenderer` cargado correctamente
- ✅ Generación dinámica de fichas diarias implementada

## 🔎 Posibles Causas

### A. Fecha Actual Fuera de Rango
El sistema solo muestra fichas para fechas dentro de las semanas definidas:
- **E1**: 15 Sep 2025 - 12 Dic 2025
- **E2**: 15 Dic 2025 - 20 Feb 2026
- **FEOE**: 23 Feb 2026 - 14 May 2026

**Solución**: Verifica que estés navegando a una fecha dentro de estos rangos.

### B. Día No Lectivo
El sistema filtra automáticamente:
- Sábados y domingos
- Festivos definidos en `config.holidays`
- Días marcados como "---" en `daily_rhythm`

**Solución**: Navega a un día lectivo (lunes a viernes, no festivo).

### C. Error en Consola del Navegador
Puede haber un error de JavaScript que impida la carga.

**Solución**: 
1. Abre el navegador (Chrome/Edge)
2. Abre `Planificacion-Docente.html`
3. Presiona F12 para abrir DevTools
4. Ve a la pestaña "Console"
5. Busca errores en rojo
6. Reporta cualquier error que veas

### D. localStorage Corrupto
Los datos pueden estar corruptos en el almacenamiento local.

**Solución**:
1. Abre DevTools (F12)
2. Ve a "Application" > "Local Storage"
3. Busca entradas relacionadas con el año académico
4. Elimina las entradas sospechosas
5. Recarga la página

## 📋 Pasos para Verificar

### Paso 1: Verificar Fecha Actual
```javascript
// En la consola del navegador:
console.log('Fecha actual del sistema:', new Date().toISOString().split('T')[0]);
```

### Paso 2: Verificar Carga del Master Plan
```javascript
// En la consola del navegador:
console.log('Master Plan cargado:', !!window.MASTER_PLAN);
console.log('Total semanas:', window.MASTER_PLAN?.weeks?.length);
console.log('Evaluaciones:', window.MASTER_PLAN?.config?.evaluations);
```

### Paso 3: Probar Generación de Ficha
```javascript
// En la consola del navegador (prueba con una fecha conocida):
const testDate = '2025-09-15'; // Primer día de E1
const day = window.MASTER_PLAN.getDay(testDate);
console.log('Ficha para', testDate, ':', day);
```

### Paso 4: Verificar FichasRenderer
```javascript
// En la consola del navegador:
console.log('FichasRenderer:', window.fichasRenderer);
console.log('Vista actual:', window.fichasRenderer?.viewMode);
```

## 🛠️ Soluciones Rápidas

### Solución 1: Limpiar Cache
1. Presiona `Ctrl + Shift + Delete`
2. Selecciona "Cached images and files"
3. Haz clic en "Clear data"
4. Recarga la página con `Ctrl + F5`

### Solución 2: Navegar a Fecha Específica
1. Abre la aplicación
2. Usa el calendario para navegar a: **15 de septiembre de 2025**
3. Verifica si aparece la ficha

### Solución 3: Modo Incógnito
1. Abre el navegador en modo incógnito (`Ctrl + Shift + N`)
2. Abre `Planificacion-Docente.html`
3. Verifica si las fichas aparecen

## 📞 Información para Soporte

Si el problema persiste, proporciona:
1. Captura de pantalla de la consola del navegador (F12 > Console)
2. Fecha a la que estás intentando acceder
3. Vista que estás usando (Profesorado/Alumnado)
4. Navegador y versión (Chrome, Edge, Firefox, etc.)
