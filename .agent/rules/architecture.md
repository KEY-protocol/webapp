---
trigger: always_on
---

# Reglas de Arquitectura - Webapp (`key-protocol`)

## Stack Tecnológico Principal
- **Framework Web**: Next.js 16 (App Router con estructura `app/[locale]/...`).
- **Librería UI**: React 19.
- **Estilos**: TailwindCSS v4 + CSS Modules/Globals (`globals.css`).
- **Lenguaje**: TypeScript 5 (Modo estricto habilitado).
- **Internacionalización (i18n)**: `next-intl` para textos multilenguaje.
- **Autenticación**: `next-auth` (v5).
- **Gestor de Paquetes**: `pnpm` (`pnpm@10`).

## Naturaleza del Proyecto
- El proyecto integra arquitecturas e interacciones tanto **Web2** (APIs REST/JSON, autenticación, bases de datos) como **Web3** (Wallet connections, Smart Contracts, DIDs, credenciales verificables).

## Estructura de Directorios en `app/`
- `app/[locale]/`: Páginas, layouts y rutas internacionalizadas.
- `app/components/`: Componentes UI reutilizables y modulares.
- `app/services/`: Capas de integración de datos, llamadas HTTP/Fetch/Axios y conectores Web3.
- `app/hooks/`: Hooks personalizados de React.
- `app/context/`: Proveedores de contexto global (ej. Auth, Theme, Web3State).
- `app/lib/` & `app/utils/`: Utilidades puras, constantes y helpers generales.
- `app/types/`: Definiciones de interfaces y tipos TypeScript centrales.