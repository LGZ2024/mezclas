# 🌾 Sistema de Fertilizaciones - PWA Avanzada

> **Sistema completo para gestión de fertilizaciones con diseño mejorado y arquitectura enterprise-ready**

## 📋 Table of Contents

- [🎯 Características Principales](#-características-principales)
- [🏗️ Arquitectura](#️-arquitectura)
- [🚀 Instalación](#-instalación)
- [⚙️ Configuración](#️-configuración)
- [🎨 Diseño y Temas](#-diseño-y-temas)
- [📱 PWA Features](#-pwa-features)
- [🔧 Desarrollo](#-desarrollo)
- [🚀 Despliegue](#-despliegue)
- [✅ Checklists](#-checklists)
- [🐛 Troubleshooting](#-troubleshooting)

## 🎯 Características Principales

### 🌟 Core Features
- ✅ **Gestión de Empresas, Ranchos y Sectores**
- ✅ **Sistema de Rancho DSA** (Identificación avanzada)
- ✅ **Control de Tanques y Activos de Mezcla**
- ✅ **Catálogos completos con CRUD**
- ✅ **Autenticación JWT + RBAC**
- ✅ **DataTables con paginación y búsqueda**

### 🎨 UI/UX Features
- ✅ **Bootstrap 5 + Design System personalizado**
- ✅ **Dark Mode automático y manual**
- ✅ **Responsive Design (Mobile-first)**
- ✅ **Accesibilidad WCAG 2.1 AA**
- ✅ **Animaciones y transiciones suaves**
- ✅ **Componentes consistentes**

### 📱 PWA Features
- ✅ **Service Worker con caché inteligente**
- ✅ **Offline First con Background Sync**
- ✅ **Push Notifications**
- ✅ **Instalable en dispositivos**
- ✅ **Splash Screens para iOS**
- ✅ **Precache estratégico**

## 🏗️ Arquitectura

```
src/
├── config/          # Configuración (DB, ENV, CORS, etc.)
├── models/          # Modelos Sequelize y asociaciones
├── controllers/     # Controladores ligeros
├── services/        # Lógica de negocio (futuro)
├── routes/          # Endpoints API
├── middlewares/     # Auth, validación, errores
├── validators/      # Esquemas de validación
├── utils/           # Helpers y utilidades
├── views/           # EJS templates
│   ├── layouts/     # Layouts base
│   ├── partials/    # Componentes reutilizables
│   └── pages/       # Páginas específicas
├── pwa/             # Service Worker y manifest
└── public/          # Assets estáticos
    ├── css/         # Estilos compilados
    ├── js/          # JavaScript frontend
    ├── scss/        # Source SCSS
    └── images/      # Imágenes e iconos
```

## 🚀 Instalación

### Prerrequisitos
- Node.js >= 21.6.2 <= 24.0.1
- MySQL/MariaDB
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd fertilizaciones
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

4. **Configurar base de datos**
```bash
npm run verify:db
```

5. **Crear tablas**
```bash
npm run create:rancho-dsa  # Para la nueva tabla rancho_dsa
```

6. **Construir assets**
```bash
npm run build:prod
```

7. **Iniciar servidor**
```bash
npm run dev  # Desarrollo
npm run start:prod  # Producción
```

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Servidor
NODE_ENV=development
PORT=3000
HOST=localhost

# Base de Datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=fertilizaciones

# JWT
JWT_SECRET=tu_jwt_secreto
JWT_EXPIRES_IN=24h
REFRESH_TOKEN_SECRET=tu_refresh_secret

# PWA
PWA_NAME=Fertilizaciones
PWA_SHORT_NAME=Fert
PWA_THEME_COLOR=#0d6efd

# Email (opcional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email
EMAIL_PASS=tu_password
```

## 🎨 Diseño y Temas

### Design System

El sistema utiliza un **Design System consistente** basado en:

- **Paleta de colores**: Azul primario (#0d6efd) con variantes
- **Tipografía**: Roboto con escala fluida
- **Espaciado**: Sistema de 8px base
- **Sombras**: 3 niveles de profundidad
- **Bordes**: Radio consistente de 6px

### Dark Mode

Soporte completo para **Dark Mode**:

- **Automático**: Detecta preferencia del sistema
- **Manual**: Toggle en la interfaz
- **Persistente**: Guarda preferencia en localStorage
- **Accesible**: Cumple con WCAG contraste

### Customización

Para personalizar el tema:

1. Editar `public/scss/_variables.scss`
2. Modificar colores, tipografía, espaciado
3. Ejecutar `npm run build:dev`

## 📱 PWA Features

### Service Worker

Estrategias de caché implementadas:

- **Cache First**: Assets estáticos (CSS, JS, imágenes)
- **Stale-While-Revalidate**: API públicas
- **Network First**: Datos críticos y autenticados
- **Offline Fallback**: Páginas offline personalizadas

### Background Sync

- **Cola de acciones**: POST/PUT offline
- **Sincronización automática**: Al recuperar conexión
- **Notificaciones**: Estado de sincronización

### Push Notifications

- **Soporte completo**: Vibration, actions, badges
- **Segmentación**: Por rol y tipo de notificación
- **Offline queue**: Almacena notificaciones pendientes

## 🔧 Desarrollo

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Servidor con hot reload
npm run build:dev        # SCSS con source maps
npm run verify           # Verificación completa

# Producción
npm run build:prod       # Build optimizado
npm run start:prod       # Servidor producción
npm run deploy:plesk     # Despliegue Plesk

# Utilidades
npm run lint             # ESLint
npm run test             # Tests unitarios
npm run logs:rotate      # Rotación de logs
npm run security         # Auditoría de seguridad
```

### Estructura de Componentes

#### Controllers (Ligeros)
```javascript
export class CorporativoController {
  static renderSectores = asyncHandler(async (req, res) => {
    const ranchosDsa = await RanchoDsa.findAll({ where: { status: 1 } })
    res.render('pages/catalogo/sectores', { ranchosDsa })
  })
}
```

#### Services (Lógica de negocio)
```javascript
// Futuro: Mover lógica aquí
export class SectoresService {
  static async createSector(data) {
    // Validación, reglas de negocio, transacciones
  }
}
```

#### Validación
```javascript
import Joi from 'joi'

export const sectorSchema = Joi.object({
  nombre_rancho_dsa: Joi.string().required(),
  numero_rancho_dsa: Joi.number().integer().min(1).required()
})
```

## 🚀 Despliegue

### Docker

```dockerfile
FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build:prod
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### Plesk

```bash
npm run deploy:plesk
```

### Environment Variables para Producción

```env
NODE_ENV=production
PORT=3000
PLESK_MODE=true
```

## ✅ Checklists

### 🚀 Lighthouse Checklist

- [ ] **Performance** >= 90
  - [ ] Critical CSS inline
  - [ ] Images optimized (WebP/AVIF)
  - [ ] Service Worker precache
  - [ ] Code splitting implementado
  - [ ] Lazy loading para imágenes

- [ ] **Accessibility** >= 95
  - [ ] Contrast ratio >= 4.5:1
  - [ ] ARIA labels correctos
  - [ ] Focus visible en todos elementos
  - [ ] Navegación por teclado completa
  - [ ] Screen reader friendly

- [ ] **Best Practices** >= 90
  - [ ] HTTPS implementado
  - [ ] CSP headers configurados
  - [ ] No console errors
  - [ ] Modern JavaScript features
  - [ ] Security headers

- [ ] **SEO** >= 80
  - [ ] Meta descriptions únicas
  - [ ] Structured data
  - [ ] Semantic HTML5
  - [ ] Open tags correctos
  - [ ] Mobile friendly

### 🔒 Security Checklist

- [ ] **Autenticación**
  - [ ] JWT con expiración corta
  - [ ] Refresh tokens implementados
  - [ ] Rate limiting en login
  - [ ] Password hashing bcrypt
  - [ ] Account lockout después de intentos

- [ ] **Headers de Seguridad**
  - [ ] Helmet.js configurado
  - [ ] CSP estricto
  - [ ] HSTS implementado
  - [ ] X-Frame-Options DENY
  - [ ] X-Content-Type-Options nosniff

- [ ] **API Security**
  - [ ] CORS configurado correctamente
  - [ ] Input sanitization
  - [ ] SQL injection prevention
  - [ ] XSS protection
  - [ ] CSRF tokens

### 📱 PWA Checklist

- [ ] **Manifest Completo**
  - [ ] name y short_name definidos
  - [ ] Icons múltiples tamaños
  - [ ] theme_color y background_color
  - [ ] start_url y scope correctos
  - [ ] display: standalone

- [ ] **Service Worker**
  - [ ] Precache de shell crítico
  - [ ] Runtime caching por tipo
  - [ ] Offline fallback pages
  - [ ] Background sync implementado
  - [ ] Cache versioning y cleanup

- [ ] **Instalación**
  - [ ] Beforeinstallprompt manejado
  - [ ] Botón de instalación visible
  - [ ] Iconos para iOS y Android
  - [ ] Splash screens configurados
  - [ ] Status bar personalizado

## 🐛 Troubleshooting

### Problemas Comunes

#### **Service Worker no se actualiza**
```bash
# Limpiar cachés del navegador
# En Chrome: DevTools > Application > Storage > Clear storage
# O ejecutar en consola:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

#### **Error de conexión a BD**
```bash
npm run verify:db
# Verificar credenciales en .env
# Asegurar que MySQL/MariaDB está corriendo
```

#### **Error de permisos (CORS)**
```javascript
// En server.mjs
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}))
```

#### **Build falla**
```bash
# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build:prod
```

### Logs y Debugging

```bash
# Ver logs de la aplicación
npm run logs

# Logs con nivel específico
DEBUG=app:* npm run dev

# Verificar PWA en Chrome
# DevTools > Application > Manifest
# DevTools > Application > Service Workers
```

### Performance Issues

```bash
# Analizar bundle
npm run analyze

# Verificar tamaño de assets
du -sh public/css/*
du -sh public/js/*

# Lighthouse audit
npm run lighthouse
```

## 📞 Soporte

- **Documentación**: Revisar archivos en `/docs`
- **Issues**: Crear issue en GitHub con template completo
- **Features**: Solicitar via issue con label "enhancement"

---

**🎉 Hecho con ❤️ manteniendo tu diseño favorito pero elevándolo a estándares enterprise-ready**
