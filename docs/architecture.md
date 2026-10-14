# Architecture v0.1
User brief → Creative Director → Brand/context check → output-specific skill → deterministic generator → structural validation → manual rendered QA → handoff.

## Native artifacts
| Medium | Generator | Current editable output | Explicit limit |
|---|---|---|---|
| Presentation | PptxGenJS | .pptx shapes/text | Visual rendering/approval external |
| Newsletter | MJML | responsive HTML | Outlook/other client visual checks external |
| Power BI | Python | theme JSON | No PBIR write yet |
| Graphics | Python | SVG | PNG needs rasterizer |
| Diagram | Python | Mermaid source | SVG needs Mermaid CLI |
| Web | Python | self-contained HTML | Not an integrated app |

## Skill contract
Every SKILL.md supplies trigger, required brief, source checks, production command, QA, and hard limitations. Project-specific overlays may override layouts, not confirmed corporate logo restrictions or source facts.

## Security
No MCP cloud design provider required for local generator execution. CLI model inference may still leave the machine; use the organization's approved model policies. Do not install downloaded third-party skills unreviewed.

## Next release
- Ingest the approved template and verify typography, master layouts, logo artwork rights.
- Native PBIR reader/patcher with backups, schema checks and Power BI Desktop tests.
- Visual regression via an approved browser and PPT rendering.
- Content-driven charts and data visual inspection.
- Optional React integration in destination project repositories.
