# Corporate PowerPoint reference — Sustainability / CEA / BrewHub

**Reference status:** User-provided, inspected locally on 2026-10-15. A working presentation, **not yet confirmed** as the sanctioned company slide-template master. The actual 34-MB source deck has **not** been uploaded to GitHub. The [structured design metadata](./design-analysis.json) intentionally excludes business slide text, employee information and embedded media.

## Structural findings
- 24 slides: 21 visible and 3 hidden (slides 21–23).
- 49 layout definitions from one slide master, at 13.33 × 7.5 inches (16:9).
- The theme accent colors **match** Creative Hub gold shades: #F5E003, #E5B611, #D1A33C.
- Theme major/minor Latin font is **Arial**. Slide-level runs also include Calibri, Montserrat and Aptos. Do not infer these are ABI's official typography: the Creative Hub identifies **Avantt**.
- Existing presentation includes native shapes, tables, text, lines, screenshots and other pictures. Some complex charts/diagrams are image-based.

## Patterns extracted for reuse
| Slide | Composition | Adaptation |
|---|---|---|
| 1 | Dark/photo split hero | Title / executive cover / newsletter hero |
| 2 | Numbered agenda | Deck navigation |
| 3, 9, 13 | Minimal section divider | Chapter transitions |
| 4 | Scoreboard and key insights | Power BI/KPI + recommended actions |
| 5 | Issue metrics and categories | Operational health summary |
| 6 | Completed / WIP / YTS | Action/status matrix |
| 7, 17 | Product screenshot and explanation | Demo evidence |
| 8 | Owner/action/status grid | Program governance |
| 10 | Detailed workstream roadmap | Technical appendix only without redesign |
| 12, 16 | KPI/usage snapshot grids | BI dashboard reporting |
| 15 | Current and next-sprints matrix | Team delivery summary |
| 18 | Photo-led closing statement | Campaign/poster/impact slide |
| 19 | Project objective and exceptions | One-page brief, simplify if dense |

## Important design lessons
- **Keep:** black-and-gold hierarchy, concise sections, deliberate graphic emphasis, relevant photography, clear headline contrast, visible statuses.
- **Improve:** several operational slides have extremely dense small text (particularly the roadmap and chart screenshots); do not imitate low-readability designs without redesign. A 49-layout template is a palette of options, not 49 mandatory visual patterns.
- **Do not infer:** exact corporate image rights, symbol artwork files, final brand approval, Avantt availability, mandated spacing tokens, or that all slide content meets accessibility standards.
- **Do not publish:** internal employee names/operational project content or unlicensed artwork from the original deck.

## Agent use
1. Load `brand/brand.json` and `brand/asset-catalog.json` first.
2. Route brief by audience and target medium; select a *pattern* from `patterns` in `design-analysis.json`, not a fixed screenshot.
3. Generate an editable native asset using the specialist engine.
4. Render to check contrast, font embedding/fallback, overflow and alignment.
5. Do not call this reference the official PowerPoint template until corporate confirmation.

## Source integrity
SHA-256 of user-provided deck is recorded in the structured metadata, permitting future local reconciliation without storing its bytes in GitHub.
