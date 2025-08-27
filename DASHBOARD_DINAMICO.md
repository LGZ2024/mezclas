# Dashboard Dinámico - Sistema de Gráficas

## 📊 **Descripción General**

El sistema de dashboard dinámico permite visualizar diferentes tipos de datos de combustible según el botón seleccionado. **Solo funciona con salidas y entradas de combustible**. Cada botón carga datos específicos desde diferentes endpoints de la API y actualiza las gráficas y estadísticas correspondientes.

## 🔧 **Funcionamiento**

### **Tipos de Datos Soportados**

1. **Salidas de Combustible** (`salidas`)
   - **API**: `/api/salidas`
   - **Descripción**: Muestra el consumo de combustible por salidas
   - **Campos**: `combustible`, `almacen`, `centro_coste`, `cantidad`, `temporada`

2. **Entradas de Combustible** (`entradas`)
   - **API**: `/api/entrada`
   - **Descripción**: Muestra las entradas de combustible al inventario
   - **Campos**: `combustible`, `almacen`, `centro_coste`, `cantidad`, `temporada`

### **Características Principales**

- **Detección de Página**: Si ya estás en la página del dashboard, solo actualiza los datos sin recargar
- **Navegación Inteligente**: Si no estás en la página, navega automáticamente
- **Títulos Dinámicos**: Los títulos se actualizan según el tipo de datos seleccionado
- **Datos Flexibles**: Detecta automáticamente los campos disponibles en los datos

## 🎯 **Cómo Funciona**

### **1. Selección de Botón**
```javascript
// Al hacer clic en un botón
btnSalidaCombus.addEventListener('click', () => navegarAlDashboard('salidas'))
btnEntradaCombus.addEventListener('click', () => navegarAlDashboard('entradas'))
```

### **2. Detección de Página**
```javascript
if (window.location.pathname === '/protected/ReporteGraficas') {
  // Ya estamos en la página → Solo actualizar datos
  inicializarDashboard()
} else {
  // No estamos en la página → Navegar primero
  window.location.href = '/protected/ReporteGraficas'
}
```

### **3. Almacenamiento de Datos**
```javascript
// Guardar en sessionStorage para usar en la página del dashboard
sessionStorage.setItem('tipoDatosDashboard', tipoDatos)
sessionStorage.setItem('urlAPIDashboard', url)
```

### **4. Carga de Datos**
```javascript
// Recuperar datos guardados
const tipoDatos = sessionStorage.getItem('tipoDatosDashboard') || 'salidas'
const url = sessionStorage.getItem('urlAPIDashboard') || '/api/salidas'
```

## 📈 **Gráficas Disponibles**

1. **Gráfica de Combustible** (Doughnut)
   - Muestra distribución por tipo de combustible
   - Porcentajes y cantidades

2. **Gráfica de Almacén** (Bar)
   - Top 8 almacenes con mayor actividad
   - Cantidades en litros

3. **Gráfica de Centro de Coste** (Horizontal Bar)
   - Top 10 centros de coste
   - Ordenados por cantidad

4. **Gráfica de Temporada** (Pie)
   - Distribución por temporada/estación
   - Porcentajes y cantidades

## 📊 **Estadísticas Mostradas**

- **Total de Registros**: Número total de salidas/entradas
- **Total de Combustible**: Suma total en litros
- **Promedio por Registro**: Promedio de litros por registro
- **Almacenes Activos**: Número de almacenes únicos

## 🔄 **Flujo de Uso**

1. **Usuario hace clic en botón** (Salidas o Entradas)
2. **Sistema detecta** si ya está en la página del dashboard
3. **Si está en la página**: Actualiza datos inmediatamente
4. **Si no está en la página**: Navega y luego actualiza
5. **Se cargan los datos** desde la API correspondiente
6. **Se actualizan** títulos, estadísticas y gráficas
7. **Se muestran** los resultados al usuario

## 🎨 **Características Visuales**

- **Colores Consistentes**: Paleta de colores predefinida
- **Responsive**: Se adapta a diferentes tamaños de pantalla
- **Tooltips Informativos**: Muestran cantidades y porcentajes
- **Leyendas Claras**: Identificación fácil de elementos
- **Formato de Números**: Números formateados con separadores de miles

## 🚀 **Beneficios**

- **Experiencia Fluida**: No hay recargas innecesarias
- **Datos Actualizados**: Información en tiempo real
- **Interfaz Intuitiva**: Fácil cambio entre tipos de datos
- **Rendimiento Optimizado**: Solo carga datos necesarios
- **Mantenimiento Simple**: Código limpio y organizado
