# Runtime CSV Upload Plan

## Problem Statement
- Add client-side CSV upload so analysts can swap the default `mergeconflict-metrics-*.csv` dataset with custom metrics during a session.
- Uploaded datasets must survive page reloads and gracefully degrade when the CSV is malformed, without breaking existing dashboard views.

## Goals
- Allow users to import a CSV (≤ 5 MB) that replaces the bundled dataset while the app runs.
- Persist the uploaded dataset in `localStorage` and restore it on future visits until reset.
- Validate incoming CSV structure, skip invalid rows, and communicate the number of rejected rows to the user.
- Keep current React component contracts intact (`Dashboard`, `EpisodeList`, `TopicAnalysis`, `PerformanceCharts`, `EpisodeDetail` all consume `episodes: Episode[]`).

## Non-Goals
- No server-side uploads or multi-user sharing.
- No automated schema migration for unknown columns; extra columns can be ignored.
- No redesign of existing analytics views beyond the new data controls.

## Architecture Updates
- Extract a reusable `parseEpisodesFromCsv(csv: string): EpisodeParseResult` helper in `src/utils.ts` that leverages existing parsing utilities and enforces header/column rules.
- Update `loadEpisodes()` to call the parser on the default raw CSV, ensuring legacy behavior remains when no upload is present.
- Introduce runtime episode state in `App.tsx` via `useState` and restore persisted data using `localStorage` (e.g., key `podstats:episodesCsv`).
- Add metadata structures (e.g., `parseWarnings`, `sourceLabel`) passed through context or props to display dataset status.

## UI / UX Plan
- Create a new `DataControls` card (`src/components/DataControls.tsx`) aligned with Tailwind patterns (`card`, `btn`, responsive spacing) per `src/components/AGENTS.md`.
- Controls include:
  - File input (accept `.csv`, display chosen file name) with helper text about the 5 MB limit.
  - Import button triggering parse + persistence.
  - Reset-to-default button to remove the persisted dataset and reload bundled data.
  - Status area summarizing total episodes loaded, skipped row count, and latest import timestamp.
- Surface errors/warnings inline (e.g., orange banner for skipped rows, red for fatal errors) and ensure dark-mode parity.
- Place the card near the top of the Dashboard view (just below header metrics) so users notice data source context.

## Data Validation & Persistence
- Expected header order: `Slug,Title,Published,Day 1,Day 7,Day 14,Day 30,Day 90,Spotify,All Time`; mismatch throws a validation error.
- Each row: trim values, parse numeric fields via existing `parseNumber`, parse `Published` using `parseDate`; invalid rows (bad date, non-numeric core metrics) are skipped and counted.
- Enforce 5 MB file size limit pre-parse; display feedback if exceeded.
- Store the raw CSV string and metadata in `localStorage`; on app boot, re-parse to obtain fresh `Episode[]`, and prune storage if parsing now fails.

## Implementation Steps
1. **Parser Refactor (`src/utils.ts`)**
   - Extract `parseEpisodesFromCsv` returning `{ episodes: Episode[]; skippedCount: number; warnings: string[] }`.
   - Ensure episodes remain sorted descending by `published`.
   - Adjust `loadEpisodes()` to reuse the helper and expose `skippedCount` (zero for bundled data).
2. **Episode State in `App.tsx`**
   - Initialize `const [episodesState, setEpisodesState] = useState(loadEpisodes())` capturing episodes + metadata.
   - On mount, check `localStorage` for persisted CSV; parse via `parseEpisodesFromCsv`, update state, and handle failure by clearing the key.
   - Reset `selectedEpisode` when its slug no longer exists in the updated dataset.
3. **Data Controls Component**
   - Build `DataControls` with props `episodesCount`, `skippedCount`, `onImport`, `onReset`, `statusMessage`.
   - Use `input type="file"` accept `.csv`, preview file size, enforce 5 MB limit client-side.
   - Emit parsed results back to `App` on successful import.
4. **Integrate Controls**
   - Render `DataControls` at the top of the main content area (before view switcher output) passing callbacks to update state and storage.
   - Display latest dataset source (default vs uploaded filename) near the existing episode count in the header.
5. **Persistence Helpers**
   - Create small utilities in `src/utils.ts` or `src/data/persistence.ts` (if new file warranted) for `saveCsvToStorage`, `loadCsvFromStorage`, `clearCsvFromStorage`.
   - Ensure storage writes happen only after successful parse to avoid corrupt entries.
6. **Error & Warning Messaging**
   - Use consistent Tailwind alert styles (e.g., `bg-yellow-100 dark:bg-yellow-900`) for skipped rows and `bg-red-100` for blocking errors.
   - Provide actionable text (“Skipped 3 rows due to missing Day 7 metric”).
7. **Docs Update**
   - Describe CSV upload feature in `README.md` and annotate data expectations in `AGENTS.md` if workflows change.

## Instrumentation / Logging
- Utilize `console.warn` guarded by `import.meta.env.DEV` when rows are skipped for easier debugging during development.
- Avoid noisy logs in production; rely on UI messaging for user-facing feedback.

## Testing Strategy
- Manual smoke tests: upload the bundled CSV (should mirror default results), upload CSV with intentional invalid rows, empty file, wrong headers, oversized file.
- Verify all views update (counts, charts, detail view) and that `selectedEpisode` resets if absent.
- Confirm persistence by refreshing after upload and after reset.
- Run `npm run build` to ensure type safety; consider adding future Vitest coverage for the parser once the test harness exists.

## Rollout Considerations
- Feature ships as part of the main bundle; no gating required.
- Keep default dataset path untouched to provide immediate fallback if `localStorage` parse fails.
- Communicate in release notes that uploads remain local to the browser and can be reset via the new control.

## Open Follow-Ups
- Evaluate adding Vitest unit tests for `parseEpisodesFromCsv` and storage helpers (requires initial test setup).
- Consider surfacing a badge or toast when a new dataset is active to increase visibility.
- Revisit size limit if users need larger imports; could make 5 MB configurable via env var or constant.
