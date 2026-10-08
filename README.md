# 🌐 KEY Protocol — WebApp

Aplicación web moderna construida con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** y **TypeScript**. Sirve como el panel de administración unificado del protocolo, ofreciendo interfaces diferenciadas por roles para la gestión global de infraestructura y la administración institucional de ONGs.

---

## 🏛️ Arquitectura y Roles

El panel web implementa una arquitectura basada en roles puros (**`ADMIN`** y **`USER`**) con navegación y permisos desacoplados:

```
                               ┌────────────────────────────────────────────────────────┐
                               │                    WebApp (:3002)                      │
                               └──────────────┬──────────────────────────┬──────────────┘
                                              │                          │
                                    Rol ADMIN │                          │ Rol USER
                                              ▼                          ▼
                          ┌───────────────────────────┐    ┌───────────────────────────┐
                          │   Panel Global / Red      │    │    Panel Institucional    │
                          │   (Servidor Central)      │    │       (Servidor ONG)      │
                          ├───────────────────────────┤    ├───────────────────────────┤
                          │ • /organizations          │    │ • /home & /dashboard      │
                          │ • /admin-forms            │    │ • /technicians            │
                          │ • /admin-audit            │    │ • /training (cursos/clase)│
                          │ • Diagnóstico Conexiones  │    │ • /audit-evidence         │
                          │                           │    │ • /reports                │
                          │                           │    │ • /mobile-form-preview    │
                          └───────────────────────────┘    └───────────────────────────┘
```

### Tabla de Roles

| Rol | Alcance | Rutas Principales | Responsabilidades |
|---|---|---|---|
| **`ADMIN`** | Servidor Central (Global) | `/organizations`<br>`/admin-forms`<br>`/admin-audit` | Alta y configuración de ONGs, credenciales de infraestructura (RPC, IPFS, TEE), pruebas de conexión en tiempo real, auditoría global y formularios base. |
| **`USER`** | Servidor Institucional (ONG) | `/home`<br>`/technicians`<br>`/training`<br>`/audit-evidence`<br>`/reports`<br>`/mobile-form-preview` | Pre-registro y aprobación de técnicos de campo, seguimiento de cursos y clases, auditoría de evidencias territoriales, emisión de certificados y generación de reportes. |

> 📌 **Aclaración Semántica:**
> - **Identidad (`Identity`):** Aplica únicamente a la identidad del Técnico enrolado por primera vez en campo.
> - **Evidencias (`Evidences`):** Aplica a todas las capturas, fotos, encuestas y asistencias recolectadas en territorio.

---

## 🚀 Inicio Rápido

### Requisitos Previos
- **Node.js** >= 20
- **pnpm** >= 10

### Instalación de Dependencias
```bash
pnpm install
```

### Configuración del Entorno (`.env.local`)
Copia el archivo de ejemplo:
```bash
cp .example-env .env.local
```

Configura las variables esenciales:
```env
# URL de la WebApp
NEXTAUTH_URL=http://localhost:3002
AUTH_SECRET=clave_secreta_para_next_auth_jwt

# URLs de los Servicios de Backend
NEXT_PUBLIC_CENTRAL_API_URL=http://localhost:3000/api/v1
NEXT_PUBLIC_ORG_API_URL=http://localhost:3001/api
```

### Ejecutar en Desarrollo
```bash
pnpm dev
```
> La aplicación estará disponible en: **`http://localhost:3002`**

---

## 🛠️ Scripts Disponibles

| Script | Comando | Descripción |
|---|---|---|
| **Desarrollo** | `pnpm dev` | Inicia Next.js en modo desarrollo en el puerto 3002 (`next dev -p 3002`) |
| **Compilación** | `pnpm build` | Compila la aplicación para producción |
| **Producción** | `pnpm start` | Inicia el servidor compilado de producción |
| **Linter** | `pnpm lint` / `pnpm lint:fix` | Análisis estático de código con ESLint |
| **Type Check** | `pnpm type-check` | Verificación estricta de tipos de TypeScript sin emitir archivos |
| **Tests Unitarios** | `pnpm test` | Ejecuta la suite de pruebas unitarias con Jest |
| **Tests E2E** | `pnpm test:e2e` | Ejecuta las pruebas end-to-end con Playwright |
| **UI de Playwright** | `pnpm test:e2e:ui` | Interfaz interactiva de Playwright para depuración E2E |

---

## 🌐 Internacionalización (i18n)

La WebApp utiliza `next-intl` con soporte multilingüe completo para:
- 🇪🇸 **Español (`es`)** — Idioma por defecto
- 🇺🇸 **Inglés (`en`)**
- 🇧🇷 **Portugués (`pt`)**

Los archivos de traducción se encuentran centralizados en `messages/{locale}.json`.

---

## 📁 Estructura del Proyecto

```
webapp/
├── app/
│   ├── [locale]/                  # Rutas dinámicas localizadas (es, en, pt)
│   │   ├── (public)/              # Rutas públicas (Login, etc.)
│   │   ├── admin-audit/           # Auditoría global (Solo ADMIN)
│   │   ├── admin-forms/           # Formularios base globales (Solo ADMIN)
│   │   ├── organizations/         # Gestión de ONGs y test de conectividad (Solo ADMIN)
│   │   ├── home/                  # Dashboard institucional (USER)
│   │   ├── dashboard/             # Métricas y estadísticas institucionales
│   │   ├── technicians/           # Gestión y aprobación de técnicos
│   │   ├── training/              # Gestión de cursos y clases
│   │   ├── audit-evidence/        # Visualizador y auditoría de evidencias de campo
│   │   ├── reports/               # Generador de reportes institucionales
│   │   └── mobile-form-preview/   # Simulador de formularios dinámicos
│   ├── api/                       # API routes y endpoints internos de Next.js
│   ├── components/                # Componentes reutilizables (UI, Tablas, Modales, Mapas)
│   ├── context/                   # Contextos de React (AuthContext, OrganizationContext)
│   ├── services/                  # Clientes HTTP para API Central y API ONG
│   └── styles/                    # Configuración de estilos y Tailwind CSS
├── e2e/                           # Suites de pruebas E2E con Playwright
├── messages/                      # Diccionarios de internacionalización (es.json, en.json, pt.json)
└── public/                        # Recursos estáticos (imágenes, logos, iconos)
```
