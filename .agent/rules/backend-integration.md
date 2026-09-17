---
trigger: always_on
---

# Reglas de Integración con Backend (Web2 & Web3)

## Prohibición de Mocks y Datos Hardcodeados
- **No utilizar datos hardcodeados en producción ni en lógica visual final.**
- Antes de implementar en el frontend, **siempre verificar si el endpoint / contrato en el backend ya está implementado**:
  - Si el backend **YA está implementado**: Desarrollar la integración directa consumiendo el endpoint/servicio real.
  - Si el backend **NO está implementado aún**: Dejar el código preparado con comentarios explícitos `// TODO: Pendiente integración backend: [Descripción del endpoint o contrato necesario]`.

## Capa de Servicios
- Toda interacción HTTP o Web3 debe realizarse dentro de la carpeta `app/services/`.
- No realizar llamados directos `fetch` o `axios` desestructurados dentro de componentes UI sin abstraer en un servicio o custom hook.
