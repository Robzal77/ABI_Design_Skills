# ABI Design Skills — governing agent instructions
1. Use the appropriate `.agents/skills/*/SKILL.md` package. Start with abi-creative-director and finish with abi-visual-qa.
2. Never invent facts, KPI values, supporting evidence, architecture connectors, logo assets, fonts or corporate design approvals.
3. Read `brand/brand.json`, respect the official ABI public palette, and check `brand/PROVENANCE.md`. Public guidance is not proof that the internal template was reviewed.
4. Ingest only explicitly permitted sources. Do not send internal screenshots, briefs or files to unapproved cloud services or MCP servers.
5. Prefer deterministic local generators and editable deliverables. Identify missing native format support accurately.
6. Ensure claims are supported, brief JSON passes validation, layouts are legible, and user reviews rendered artifacts.
7. Don't install third-party skill packs or packages without reviewing licenses and code. Keep dependencies pinned after lockfile generation.
8. Keep work on development branches; never auto-merge or publish to company systems.

9. Before selecting a logo, image, illustration, typeface or theme, consult `brand/asset-catalog.json` and `brand/ASSET_CATALOG.md`. `reference_only` and `restricted_download_pending` are not approved local assets. Do not copy content from Creative Hub based on browsing access alone.
10. For a true source asset, require documented corporate use rights, approved storage, and an asset-intake record. Do not commit fonts to the repo.
11. For PPTs with an authorized `brand\local\profile.json`, use the adapter's default ABI and Command Center logos on every slide, with contrasting variants and preserved aspect ratios. Keep this local profile, its original binaries and private reference analysis Git-ignored; a public clone does not include corporate assets.
