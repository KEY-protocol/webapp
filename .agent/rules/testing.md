---
trigger: always_on
---

# Reglas de Testing y Calidad de Código - Webapp

## Cobertura Obligatoria
- Si se desarrolla una nueva funcionalidad o se refactoriza código existente, **siempre implementar los tests correspondientes buscando alcanzar una cobertura del 100%** para dicho componente, hook o servicio.

## Frameworks y Herramientas
- **Tests Unitarios y de Integración**: Jest + React Testing Library (`@testing-library/react`, `@testing-library/jest-dom`).
- **Tests End-to-End (E2E)**: Playwright (`@playwright/test`).

## Estructura y Ubicación de Tests
- Los unit tests deben ubicarse junto al archivo a probar o dentro de carpetas `__tests__` cercanas (ej. `my-component.test.tsx`).
- Los tests E2E residen en el directorio raíz `e2e/`.

## Ejecución y Validación
- Antes de considerar completada una tarea que incluya código nuevo:
  - Correr `pnpm test` para asegurar que los tests unitarios pasan.
  - Correr `pnpm test:coverage` para verificar el porcentaje de cobertura.
  - Ejecutar `pnpm test:e2e` para flujos críticos o de integración completa.
