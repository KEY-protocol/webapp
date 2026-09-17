---
trigger: always_on
---

# Reglas de Estilo, UI/UX y Convenciones de Código - Webapp

## Tipografías
- **Títulos y Subtítulos**: Usar exclusivamente la fuente **Montserrat**.
- **Texto General, Cuerpo y Componentes UI**: Usar la fuente **Poppins**.

## Paleta de Colores y Estilos CSS
- **Prohibido colores hardcodeados** (ej. `#3b82f6`, `rgb(...)`, o clases ad-hoc que no respeten la paleta).
- Utilizar exclusivamente las variables y tokens de color definidos en `globals.css` / Tailwind CSS theme config.
- Para íconos, utilizar únicamente la librería **Lucide React** (`lucide-react`).

## TypeScript y Buenas Prácticas
- TypeScript en modo estricto: Evitar el uso de `any`. Definir tipos e interfaces claras en `app/types/` o junto a sus respectivos componentes.
- Respetar ESLint y formateo automático definido en la raíz del proyecto.
