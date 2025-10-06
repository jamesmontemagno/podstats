---
mode: agent
description: Create a reusable PodStats component
---
You are tasked with implementing a new reusable React component for the PodStats dashboard.

Before writing code:
- Re-read `AGENTS.md` and `src/components/AGENTS.md` to align with architectural and styling rules.
- Audit existing components to avoid duplicating patterns; prefer extracting shared pieces when overlap exists.
- Define the component's purpose, inputs, and outputs. List required props, optional props with defaults, and expected side effects (ideally none).

When implementing:
- Keep the component pure and memoize heavy derivations with `useMemo`/`useCallback` only when justified.
- Structure Tailwind classes following the established order and ensure accessibility (keyboard focus, aria labels for icon-only controls, empty state messaging).
- Document non-obvious logic with succinct comments and add TypeScript interfaces near the component definition.

After coding:
- Suggest where the new component should live in the UI and how to integrate it without breaking existing flows.
- Recommend manual verifications (light/dark themes, responsive breakpoints) and any follow-up tasks such as extraction into shared utilities or tests.
