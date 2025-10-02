# components/AGENTS.md – Component Design & Implementation Guide

Focused guidance for building and evolving UI components in this project. Complements the root `AGENTS.md`.

---
## 1. Component Philosophy
Components should be:
- **Focused**: One layout or data visualization responsibility.
- **Predictable**: Pure render from props + minimal internal UI state.
- **Composable**: Small building blocks (cards, stat groups) rather than monoliths.
- **Performant**: Avoid redundant transforms inside render.

---
## 2. Naming & File Structure
- Each component lives in a single `PascalCase.tsx` file under `src/components/`.
- Cohesive sub‑utilities that are ONLY used by one component can live at the bottom of the same file (not exported) to avoid directory explosion.
- If a component grows > ~250 lines or handles multiple visual modes, extract subcomponents: `Component.Part.tsx` (only when reused) or internal inline functions.

---
## 3. Props & Types
Pattern:
```ts
interface ExampleCardProps {
  episodes: Episode[];          // Required domain data
  onSelect?: (ep: Episode) => void; // Optional handler
  highlightId?: string;         // Optional state from parent
}
```
Guidelines:
- Keep prop names semantic (`onEpisodeClick` vs `onClick` when context matters).
- Prefer primitive & domain types, avoid passing entire application objects when only a subset is needed.
- Optional props must have safe fallbacks.
- Never mutate prop objects.

---
## 4. Data Derivation & Memoization
Use `useMemo` for any derived value that:
- Iterates an array (`map/sort/reduce/filter`) of episodes.
- Allocates new large objects.
- Drives conditional rendering for a large subtree.

Example:
```tsx
const topEpisodes = useMemo(
  () => [...episodes].sort((a,b) => b.allTime - a.allTime).slice(0, 10),
  [episodes]
);
```
Do NOT memoize trivial constant expressions; avoid premature optimization.

---
## 5. State Management
- Prefer **lifting state up** to `App` when multiple sibling components need the same context (e.g., selected episode).
- Local `useState` only for transient UI concerns (expanded panels, hover index, input field text before commit).
- Use context only for truly cross‑cutting concerns (currently just Theme).

---
## 6. Event Handlers
- Wrap heavy handlers with `useCallback` **only** if they are passed to child components that depend on referential stability (or appear in dependency arrays).
- Keep handlers small; delegate complexity to pure helpers.

---
## 7. Styling (Tailwind CSS)
Guidelines:
1. Utility ordering (loose): layout → spacing → display → flex/grid → sizing → border → background → typography → effects → dark: variants → state.
2. Use consistent semantic color usage already present (e.g., `text-gray-500`, gradients like `bg-gradient-to-br from-emerald-500 to-emerald-600`).
3. Prefer `dark:` variants side‑by‑side with base class for parity.
4. Extract repeating multi‑class patterns *only if* used ≥3 times (create a shared CSS layer or small component wrapper).

Accessibility styling:
- Minimum touch target for interactive items: `h-8` with horizontal padding.
- Provide `hover:` + `focus:` states; visible focus ring for keyboard nav.

---
## 8. Layout Patterns
- Wrap multi‑metric collections in a responsive grid using `grid grid-cols-1 md:grid-cols-X`.
- Scrollable horizontal nav/toolbars use `overflow-x-auto` with whitespace preservation.
- Use `min-w-0` inside flex items to enable proper text truncation with `truncate`.

---
## 9. Recharts Usage
When adding charts:
- Always embed inside `<ResponsiveContainer width="100%" height={H}>`.
- Centralize numeric formatting through `formatNumber` / `formatDate` helpers.
- Light/Dark aware tooltip styling via `getTooltipStyle(isDark)` (pass theme state if needed).
- Aim to limit simultaneous active lines/bars to what's cognitively digestible (≤4 series recommended).

---
## 10. Performance Considerations
Common pitfalls:
- Re-sorting arrays inline every render (wrap in `useMemo`).
- Creating new handler lambdas inside large mapped lists; acceptable unless causing actual perf issues—measure first.
- Giant prop drilling: consider local transform near usage to reduce parent churn.

Use the React DevTools Profiler *before* attempting micro-optimizations.

---
## 11. Accessibility Checklist
For each new component:
- [ ] Interactive elements are `<button>` / `<a>` (not generic `<div>`).
- [ ] Icon‑only controls include `aria-label` or visually hidden text.
- [ ] Text contrast meets WCAG AA in light & dark themes.
- [ ] Dynamic lists maintain keyboard focus order.
- [ ] Charts include accessible labels / titles (where meaningful) or gracefully ignore from tab order if purely decorative.

---
## 12. Empty / Loading / Error States
Current data is static; still:
- Provide fallback text: e.g., "No episodes match the current filters".
- Use subdued colors (`text-gray-500`) for empty states.
- If introducing async loading in future, show skeletons with animated subtle shimmer (`animate-pulse`)—avoid spinners for wide cards.

---
## 13. Theming Integration
- Avoid hardcoded hex colors; rely on Tailwind tokens.
- If computing dynamic colors (e.g., thresholds), prefer existing palette scale numbers to maintain dark mode parity.

---
## 14. Adding a New Component (Checklist)
1. Define the contract: What props? What derived data? Any heavy transforms?
2. Draft component in isolation (can temporarily render in `App` for manual review).
3. Add memoization for heavy derived values.
4. Apply responsive + dark mode classes.
5. Validate accessibility (keyboard + contrast + semantics).
6. Link it into navigation or parent view intentionally (do NOT auto-insert into unrelated views).
7. Update docs (`README.md` features section if user-facing).  
8. Run `npm run build` to ensure no type or build errors.

---
## 15. Anti‑Patterns (Avoid)
| Anti‑Pattern | Why |
|--------------|-----|
| Storing derived arrays in state | Causes stale copies, unnecessary sync logic |
| Duplicating helper logic inline | Drift & inconsistency; prefer `utils.ts` |
| Large conditional trees in JSX | Hurts readability; extract small pure components |
| Arbitrary color hex codes | Breaks theme & design consistency |
| Overusing `useEffect` for pure derivations | Use `useMemo` or compute inline |

---
## 16. Refactoring Strategy
When a component becomes unwieldy:
1. Identify distinct visual regions or responsibilities.
2. Extract *pure* subcomponents that receive only the data they render.
3. Keep state at the highest necessary common ancestor.
4. Maintain existing prop names until all consumers migrated.
5. Update this guide if establishing a new recurring pattern (e.g., card wrapper component).

---
## 17. Suggested Future Enhancements
| Idea | Value | Effort |
|------|-------|--------|
| Reusable `StatCard` component | Reduces repetition | S |
| Lightweight chart wrapper (theme-aware) | Centralizes tooltip & grid config | M |
| ARIA annotations for charts | Better screen reader experience | M |
| Collapsible sections for mobile | Improves small-screen UX | M |

---
## 18. Component Template (Copy & Adapt)
```tsx
import { useMemo } from 'react';
import { Episode } from '../types';
import { formatNumber } from '../utils';

interface SampleWidgetProps {
  episodes: Episode[];
  onEpisodeClick?: (ep: Episode) => void;
}

export function SampleWidget({ episodes, onEpisodeClick }: SampleWidgetProps) {
  const top5 = useMemo(() => {
    return [...episodes].sort((a,b) => b.allTime - a.allTime).slice(0,5);
  }, [episodes]);

  if (!episodes.length) {
    return <div className="text-sm text-gray-500 dark:text-gray-400">No data available.</div>;
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Top 5 Episodes</h3>
      <ul className="space-y-2">
        {top5.map(ep => (
          <li key={ep.slug}>
            <button
              onClick={() => onEpisodeClick?.(ep)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900 text-left transition-colors"
              aria-label={`View details for ${ep.title}`}
            >
              <span className="truncate font-medium text-gray-700 dark:text-gray-200">{ep.title}</span>
              <span className="text-sm text-primary-600 dark:text-primary-400 font-semibold">{formatNumber(ep.allTime)}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---
## 19. Update Policy
When introducing a new reusable visual pattern, add a brief section here (1–3 sentences + rationale). Keep this lean: prune obsolete guidance when patterns are removed.

---
*End of components/AGENTS.md.*