---
trigger: always_on
---

# Reglas de Flujo de Trabajo (Workflow) para Agentes - Webapp

## Gestor de Paquetes
- Usar siempre **`pnpm`** para la instalación de dependencias, ejecución de scripts o tareas de build (`pnpm dev`, `pnpm build`, `pnpm test`, etc.). Evitar `npm` o `yarn`.

## Verificación de Código antes de Entregar
- Ejecutar verificación de tipos TypeScript: `pnpm type-check`.
- Ejecutar linter: `pnpm lint`.
- Validar tests: `pnpm test`.

## Commits y Hooks
- El proyecto utiliza `commitlint` y `lint-staged`. Los mensajes de commit deben seguir la convención Conventional Commits (ej. `feat: ...`, `fix: ...`, `docs: ...`).
