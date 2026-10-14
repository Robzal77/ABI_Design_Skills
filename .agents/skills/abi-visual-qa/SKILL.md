---
name: abi-visual-qa
description: Review all visual outputs.
---
# abi-visual-qa

## When to use
Review all visual outputs.

## Method
Run python -m unittest discover -s tests -v; inspect generated artifact files; review brand approval flag and the brief. Render final files in their actual target applications.

## Validation and handoff
Automated tests are structural only; do not claim visual validation without rendering.

## Governance
Follow AGENTS.md and brand/PROVENANCE.md. Do not invent claims, assets, approvals or functionality. Save editable source and identify remaining manual checks.
