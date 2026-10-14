# ABI Design Skills

Local-first visual generation skills for **Codex CLI and GitHub Copilot CLI**: editable PPTX, newsletters, Power BI themes, SVG graphics, Mermaid diagrams and HTML web previews.

## Status
**v0.1 development preview.** The design foundation uses AB InBev's public [ABI Creative Hub](https://brandworld.ab-inbev.com/color) with attributed color values. The user's approved internal PPT template is **not yet ingested**. Corporate publication still requires a human brand review and an authorized logo/font/template. Do not claim internal approval solely from public brand guidance.

## Quick start
- Requirements: Python 3.10+, Node.js 20+ and npm. No Docker required.
- Install Node tools: `npm install`
- Run Python tests: `python -m unittest discover -s tests -v`
- Preview one of four stdlib adapters: `python avi.py --format graphics --brief examples/brief.json --out output/graphic.svg`
- Replace format with `diagram` (Mermaid .mmd), `web` (HTML), or `powerbi` (theme JSON).
- Generate editable slides: `npm run pptx -- --brief examples/brief.json --out output/deck.pptx`
- Generate a responsive email newsletter: `npm run newsletter -- --brief examples/brief.json --out output/newsletter.html`
- Preview graphic: open generated SVG in a browser; preview web HTML likewise.

## Skills
Reusable SKILL.md packages live under `.agents/skills/`. Open the repo in either Codex CLI or GitHub Copilot CLI, then request: "Use abi-creative-director to create a newsletter based on examples/brief.json, and run abi-visual-qa".

## Scope and boundaries
- Power BI output is **theme JSON only** at this stage, not PBIR mutations or a native report.
- Mermaid output is editable source; render using separately installed, security-reviewed Mermaid CLI.
- Graphics output is SVG, not an AI image-generation service.
- Web output is an HTML design prototype, not a working React app.
- PPTX shapes and text are editable; visual slide review on an Office-capable machine is still mandatory.
- Newsletter uses MJML conversion, not guaranteed pixel-identical rendering in all email clients.
- All facts must come from the source brief. Sample data are labelled illustrative.
- Outputs require brand, content, accessibility, and security approval before distribution.

## Brand provenance
See `brand/brand.json` and `brand/PROVENANCE.md`. This repository stores *public brand rules*, not unlicensed logo binaries. User-provided references are for review; an approved corporate template should be ingested with clear license/use status before enabling production branding.

## Development
Work on `feat/universal-visual-skills-v1`. Review output and tests, then propose a PR. See `docs/architecture.md`.

## Corporate asset library
Read [Creative Hub asset catalog](brand/ASSET_CATALOG.md) and its machine-readable [17-entry manifest](brand/asset-catalog.json). It indexes logo versions, photography, type, colors, patterns, gradient, and the official SharePoint UI kit resource link. **Reference links are not downloaded artwork.** Use [asset intake checklist](brand/ASSET_INTAKE.md) for authorized corporate files and run `python scripts/audit_asset_catalog.py` for catalog consistency. Do not bundle licensed fonts or protected images merely because they appear online.

## User-provided PowerPoint design reference
The corporate Sustainability / CEA / BrewHub PPT has been inspected for structure and design conventions. See [reference analysis](brand/references/sustainability-cea-brewhub-2026/REFERENCE.md), which catalogues 49 PowerPoint layout definitions, observed fonts, color scheme and reusable patterns. The original deck is **not stored in GitHub**; its images and private content are not redistributed.

### Inspect future reference PPTX decks
Install optional inspection dependency: `python -m pip install -r requirements-inspection.txt`. Then run `python scripts/inspect_pptx.py "reference.pptx" --out output/reference-metadata.json`. The script captures dimensions, theme, layout names, font names and shape statistics, **not** slide contents, speaker notes, or embedded image files. Review the local output before sharing or committing it.
