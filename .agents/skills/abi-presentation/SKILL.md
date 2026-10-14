---
name: abi-presentation
description: Produce editable PowerPoint decks.
---
# abi-presentation

## When to use
Produce editable PowerPoint decks.

## Method
Use npm run pptx -- --brief examples/brief.json --out output/deck.pptx. Keep text editable. Do not claim an internal corporate master has been applied.

## Validation and handoff
Review each slide in PowerPoint and verify text clipping.

## Governance
Follow AGENTS.md and brand/PROVENANCE.md. Do not invent claims, assets, approvals or functionality. Save editable source and identify remaining manual checks.

## Supplied reference integration
For internal ABI visual design requests, consult `brand/references/sustainability-cea-brewhub-2026/design-analysis.json` (13 documented patterns and categorized available layouts). Use it as a **design-reference pattern library**, not a licensed master image pack. Never paste screenshot-heavy slide objects into new decks in place of native editable elements. The reference's theme colors match Creative Hub, but its Arial/Calibri/Montserrat/Aptos usage does **not** supersede official Avantt typography. A separately approved corporate PPT template still needs confirmation and asset intake. Dense roadmap layouts are for drilldown/appendix or must be restructured for readability.

## Reproducible reference deck intake
For any new user-supplied reference presentation, install `requirements-inspection.txt` and run `python scripts/inspect_pptx.py "reference.pptx" --out output/inspection.json`. Do not ingest private slide text or extracted pictures into this GitHub repository automatically. Compare layout names and palette against official ABI Creative Hub. Extract visual pattern insights through human visual review and label them as deck-specific, not mandatory corporate master rules.
