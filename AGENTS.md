# AGENTS.md – Automated Agent & Contributor Guide

> This document is written for both human contributors and AI / autonomous coding agents ("agents"). It explains the project domain, architectural constraints, quality gates, and safe‑change heuristics so that future automated changes stay consistent, reversible, and low‑risk.

---
## 1. Project Purpose
Interactive analytics dashboard for the **Merge Conflict** podcast:
- Loads a static CSV of episode metrics at build/runtime (`mergeconflict-metrics-*.csv`) via Vite raw import or user-uploaded CSV.
- Supports runtime CSV upload (≤5 MB) with localStorage persistence for analyzing custom podcast metrics.
- Performs in‑browser parsing & enrichment (topic extraction, retention, performance classification).
- Presents multi‑view UI (Dashboard, Episodes, Topics, Analytics, Blog) using React 18 + TypeScript + Tailwind + Recharts.

No backend. Persistence uses `localStorage` for theme and uploaded CSV data. All data transformations are pure and synchronous.

---
## 2. High-Level Architecture
```
index.html → main.tsx → <ThemeProvider><App/></ThemeProvider>
                                     │
                                     ├── DataControls (CSV upload/reset)
                                     ├── Dashboard (aggregate KPIs + charts)
                                     ├── EpisodeList (search / filter / sort)
                                     ├── TopicAnalysis (keyword clustering)
                                     ├── PerformanceCharts (advanced charts)
                                     ├── EpisodeDetail (deep dive / comparison)
                                     └── BlogPost (build narrative / write-up)

utils.ts
  ├─ parseEpisodesFromCsv(): CSV → EpisodeParseResult (episodes + warnings)
  ├─ loadEpisodes(): default CSV → EpisodesState
  ├─ extractTopics(): Episode[] → Map<Topic, Episode[]>
  ├─ calculateRetention(), getEpisodePerformance()
  ├─ saveCsvToStorage(), loadCsvFromStorage(), clearCsvFromStorage()
  └─ formatting helpers (date, number, tooltip)

types.ts: Domain types (Episode, MetricStats, TopicData, EpisodeParseResult, EpisodesState)
ThemeContext.tsx: stateful light/dark/system + effectiveTheme (html class)
```

### Key Principles
- **Deterministic UI**: All derived data uses `useMemo` to avoid recomputation & drift.
- **Stateless Data Layer**: No remote fetches; data immutability expected post‑parse.
- **Presentational Tailwind**: Styling via utility classes; avoid bespoke CSS unless reusable.
- **Dark Mode First-Class**: Always validate color contrast for both themes.

---
## 3. Data & Domain Rules
| Concept | Rule | Rationale |
|---------|------|-----------|
| Episode ordering | Sorted newest → oldest once after parse | Consistent assumptions across components |
| Missing numeric fields | Converted to 0 | Keeps math safe & reduces guard clauses |
| Retention | dayN / allTime (%) computed only if `allTime>0` | Avoid NaN / Infinity |
| Topics | Higher‑specificity keywords trump generic ones | Better clustering & avoids duplicates |
| Performance labels | Based on ratio to global avgAllTime (≥1.5 excellent, ≥1.1 good, ≥0.9 average) | Simple, explainable heuristic |

Agents MUST preserve these invariants unless also updating every dependent consumer **and** adjusting docs/tests.

---
## 4. Coding Standards
- **Language**: TypeScript (ES modules). Prefer explicit return types for exported functions.
- **Naming**: Components in `PascalCase.tsx`; hooks `useX`; utilities `camelCase`.
- **Pure Utilities**: Functions in `utils.ts` must remain side‑effect free (except the CSV raw import at module load). If adding IO or async, isolate in a new file (e.g., `data/*.ts`).
- **React Hooks**: Derivations using heavy iteration (`reduce`, `sort`, `slice`) belong inside memorized selectors (`useMemo`).
- **Props**: Define prop interfaces *inside* the component file unless shared broadly; prefer narrow, documented shapes.
- **Tailwind**: Group classes roughly: layout → spacing → flex/grid → sizing → border → background → text → effects → state. Agents should **append** new classes instead of reordering existing ones unless necessary.
- **Error Handling**: Input data is trusted (static CSV). Avoid defensive noise; keep guard clauses minimal & targeted.

---
## 5. Theming & Accessibility
- `ThemeProvider` manages `'light' | 'dark' | 'system'` plus computed `effectiveTheme` and toggles root `<html>` class.
- When adding colors, rely on Tailwind semantic palette (`text-gray-*`, `bg-primary-*` if extended) and ensure AA contrast (≥4.5 for body text, ≥3.0 for large text). Use existing gradient patterns where possible.
- Interactive elements must have: focus ring (`focus:outline-none focus:ring ...`) OR clear visual affordance; `aria-label` if icon‑only.

---
## 6. Performance Guidelines
Potential hotspots: sorting large episode arrays, repeated date formatting, topic extraction.
- Heavy transformations should run once per data set (memoize on `episodes`).
- Avoid inline anonymous functions in hot mapped lists if causing re‑renders; consider `useCallback` if props cascade.
- Recharts: Prefer minimal series; remove unused `<CartesianGrid>` or axes in new small multiples.

---
## 7. Safe Change Heuristics (for Agents)
| Change Type | Risk | Validation Steps |
|-------------|------|------------------|
| Copy updates / docs | Low | Spellcheck, no code diff impact |
| New presentational component | Low | Lint, renders under story/test harness |
| Modify utility logic | Medium | Add/adjust unit tests & re-run; verify dependent components still render |
| Adjust performance thresholds | Medium | Update documentation & any labels relying on constants |
| Rework data model (types.ts) | High | Incremental: create new type, adapt call sites, migrate, then remove legacy |
| Introduce async / external fetch | High | Requires architecture section + toggle / fallback for offline |

Agents must prefer **small, atomic PRs**. If a high-risk change is necessary, open a markdown design plan (`/design/CHANGE-NAME.md`) first.

---
## 8. Quality Gates
Currently no automated test suite. Agents SHOULD (if adding logic):
1. Add lightweight unit tests (suggest adding `vitest` or `jest`) for any new parsing / classification function.
2. Run type check: `tsc --noEmit` (already part of `npm run build`).
3. Ensure build passes: `npm run build`.
4. Manual smoke: launch `npm run dev`, navigate all tabs, toggle theme.

Add a section to this file if you introduce formal CI.

---
## 9. Adding / Modifying Components
1. Decide scope (display, container, analytic transform?).
2. If computing derived data, do it *inside* the component with `useMemo` or extract a pure helper and import.
3. Keep prop surface minimal; pass handlers instead of global state.
4. Maintain responsive classes (`sm:`, `md:`) consistent with existing breakpoints.
5. Provide graceful empty states (e.g., "No episodes match filter").

---
## 10. CSV Schema Changes
If the source CSV adds columns:
- Extend `Episode` in `types.ts` (non-breaking by making field optional initially).
- Update `parseEpisodesFromCsv()` parse logic.
- Add formatting / classification only where needed; avoid scope creep in a single change.
- Document new fields here.

**CSV Upload Feature**: Users can now upload custom CSV files (≤5 MB) at runtime via the DataControls component. Uploaded data persists in localStorage and survives page reloads. The parser accepts both "Day 1" and "1 Day" header formats for flexibility.

---
## 11. Security & Privacy
No secrets, no PII. Do **not** introduce credentialed external calls. Any future network requests must include: retry logic, offline fallback, and explicit explanation in this doc.

---
## 12. Logging & Diagnostics
Currently silent. If adding diagnostics:
- Use `console.debug` guarded by a local `DEBUG` flag (e.g., query param or `import.meta.env.DEV`).
- Remove verbose logs before production build if noisy.

---
## 13. Dependency Management
Keep dependencies minimal. Before adding a library:
- Can Tailwind or native APIs solve it? (Often yes.)
- Is tree-shaking supported? (ESM preferred.)
- Add rationale in PR description.

---
## 14. AI Agent Behavioral Rules
- NEVER overwrite unrelated sections of a file (surgical diffs only).
- Preserve existing public function signatures unless intentionally versioned.
- When refactoring, keep a temporary adapter layer if >5 call sites are impacted.
- Always update this AGENTS.md when introducing new cross-cutting patterns (e.g., state management library, routing, testing framework).
- Provide a brief change summary at top of PR for human review.

---
## 15. Future Enhancements (Agent-Friendly)
| Idea | Effort | Notes |
|------|--------|-------|
| Add Vitest + first spec for `loadEpisodes` | S | Establish baseline tests |
| Add storybook / visual regression | M | Helps safe UI iteration |
| CSV hot reload (Vite plugin) | M | Speeds data tweaking |
| Predictive metrics module | L | Requires model selection + explanation |

---
## 16. Quick Checklist (Copy for PRs)
- [ ] Code builds (`npm run build`)
- [ ] TypeScript passes (no new errors)
- [ ] UI manually smoke‑tested (light + dark)
- [ ] Derived data memoized
- [ ] No unnecessary dependency added
- [ ] Docs updated (README / AGENTS.md / components/AGENTS.md)

---
## 17. Contact / Ownership
Primary maintainer: (update with GitHub handle). If unavailable, changes should remain low risk.

---
*End of AGENTS.md (root).*