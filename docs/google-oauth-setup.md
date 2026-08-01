# Configuración de Google OAuth en NextAuth (Webapp)

Este documento detalla los pasos para configurar la autenticación con Google en la plataforma Webapp.

---

## 1. Crear Credenciales en Google Cloud Console

1. Ingrese a [Google Cloud Console](https://console.cloud.google.com/).
2. Cree un proyecto nuevo o seleccione uno existente (ej: `KEY Protocol`).
3. Vaya a **APIs & Services** > **OAuth consent screen** (Pantalla de consentimiento de OAuth):
   - Tipo de usuario: **External** (o Internal si es una organización Google Workspace).
   - Complete la información básica (App name, User support email, Developer contact email).
   - Agregue los Scopes: `openid`, `.../auth/userinfo.email`, `.../auth/userinfo.profile`.
   - Guarde los cambios.
4. Vaya a **APIs & Services** > **Credentials**:
   - Haga clic en **+ CREATE CREDENTIALS** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `KEY Protocol Webapp`.

---

## 2. Configurar Orígenes y Redirect URIs

### Desarrollo (Localhost)
- **Authorized JavaScript origins**:
  - `http://localhost:3002` (o el puerto configurado en Next.js)
- **Authorized redirect URIs**:
  - `http://localhost:3002/api/auth/callback/google`

### Producción (Vercel + Dominio Personalizado)
Supongamos que la app está alojada en `https://app.keyprotocol.io`:
- **Authorized JavaScript origins**:
  - `https://app.keyprotocol.io`
- **Authorized redirect URIs**:
  - `https://app.keyprotocol.io/api/auth/callback/google`
  - (Si usa subdominios de preview en Vercel, agregue también `https://<proyecto>.vercel.app/api/auth/callback/google`)

---

## 3. Configurar Variables de Entorno

Copie el Client ID y Client Secret generados en Google Cloud Console y agréguelos a su entorno.

### En `.env.local` (Desarrollo local):
```env
AUTH_GOOGLE_ID="tu-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="GOCSPX-tu-client-secret"
AUTH_SECRET="generar-un-secret-random-con-npx-auth-secret"
```

### En Vercel (Producción):
Vaya a **Project Settings** > **Environment Variables** en Vercel y añada:
- `AUTH_GOOGLE_ID`: ID del cliente de Google de producción.
- `AUTH_GOOGLE_SECRET`: Secret de producción.
- `AUTH_SECRET`: Secreto aleatorio largo (`npx auth secret`).
- `NEXTAUTH_URL`: `https://app.keyprotocol.io` (URL canónica de producción).

---

## 4. Funcionamiento de Roles y Sesión

1. **Google OAuth**: Se utiliza como proveedor de identidad SSO (Single Sign-On).
2. **Federación con SERVIDOR / ORGServer**: Una vez iniciada sesión o de forma paralela, las peticiones internas hacia `/api/*` adjuntan los tokens del servidor ONG (`kp_auth` / `x-auth-token`) obtenidos en el login federado.
