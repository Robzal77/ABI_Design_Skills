---
name: abi-diagrams
description: Create architecture and workflow source.
---
# abi-diagrams

## When to use
Create architecture and workflow source.

## Method
Use python avi.py --format diagram --brief examples/brief.json --out output/flow.mmd. Only include user-verified nodes and connections.

## Validation and handoff
Check graph semantics and render externally using vetted Mermaid CLI.

## Governance
Follow AGENTS.md and brand/PROVENANCE.md. Do not invent claims, assets, approvals or functionality. Save editable source and identify remaining manual checks.
