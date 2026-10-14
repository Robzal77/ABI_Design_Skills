# Official Creative Hub asset register

This register is a **source and usage catalog**, not a collection of redistributed asset files. See [machine-readable register](asset-catalog.json).

## Inventory
| Asset category | Official source | Captured | Original downloadable files |
|---|---|---|---|
| Corporate logo: gold/black/white, symbol/wordmark | [Logo](https://brandworld.ab-inbev.com/logo) | Usage, spacing, placement rules | Not yet acquired |
| Symbol expressions, curves, patterns | [Logo](https://brandworld.ab-inbev.com/logo) | Composition guidance and special-permission gate | Not yet acquired |
| Avantt typeface, hierarchy, type treatments | [Typography](https://brandworld.ab-inbev.com/typography) | Typeface identity and constraints | No font file acquired |
| Corporate palette, gold gradient, accessible pairs | [Color](https://brandworld.ab-inbev.com/color) | Hex tokens and guidance | Gradient master pending |
| Lifestyle, brewing/craft and sustainability images | [Photography](https://brandworld.ab-inbev.com/photography) | Subject taxonomy and treatment guidance | No photo assets copied |
| Completed brand applications | [Applications](https://brandworld.ab-inbev.com/applications) | Official example reference page | Example files not copied |
| UI kit and other downloadable corporate resources | [Resources](https://brandworld.ab-inbev.com/resources-0) | SharePoint location | Access/download not completed |

## Important discovery — internal UI kit

The Resources page links **Download Brand World UI kit** to:

https://anheuserbuschinbev.sharepoint.com/sites/BrandWorld/Document/Forms/AllItems.aspx

This link requires an authorized company account. This library could include design resources, but the actual folder contents have not been inspected. Do not describe it as a confirmed list of downloadable logos, fonts or templates.

## Applying the source material to all six mediums

- **PPT**: adopt approved masters, fonts and logo art when supplied; preserve native slide editability.
- **Newsletter**: generate responsive email HTML; use authorized image derivatives and fall back to licensed system fonts if email embedding is not permitted.
- **Power BI**: palette and chart color semantics can be automated now; embedding fonts/logo depends on supported platform controls and rights.
- **Graphics**: use vector composition and approved logo source art; don't trace source-page graphics for release.
- **Diagrams**: preserve clarity, contrast and semantic colors, without decorative symbolism that obscures dataflow meaning.
- **Web**: apply tokens, verified font licensing, approved icons/photography and accessibility checks.

## Asset acquisition workflow

1. Company user retrieves authorized files from SharePoint or provides approved PPT/assets.
2. Verify explicit use rights, distribution scope, and any required branding or marketing approval.
3. Record approved file name, internal storage location, version, intended use, checksum and approval reference in an **internal asset registry**.
4. Keep licensed **font binaries out of GitHub**; reference approved local or managed installation instead.
5. Keep this GitHub repo's public-source catalog separate from corporate binary storage.
6. Run artifact QA and brand review before production.

## Source limits

The Creative Hub [Terms & Conditions](https://brandworld.ab-inbev.com/terms-conditions) restrict copying and redistributing site content without authorization. Access to a publicly readable page is not a redistribution license. This is why asset files are not bundled in the development branch.

## Input examples supplied by the user
The conversation includes internal event and hackathon communications; they demonstrate local treatments, not corporate master assets. Those screenshot bytes have **not been added to GitHub**.
