# Brand asset intake and approval checklist

When the approved internal PPT or authorized Creative Hub resource package is provided:

- [ ] Identify corporate ownership and permitted usage in this private GitHub vs approved company storage
- [ ] Record exact filenames, extensions, dimensions, color profiles and original source URLs
- [ ] Verify logo variants, clear space and permissions for symbol expressions
- [ ] Inspect presentation master layouts and slide dimensions
- [ ] Identify font names and check relevant licences; **do not commit font binaries**
- [ ] Extract named corporate tokens where unambiguous; reconcile conflicting versions
- [ ] Review photo and illustration licensing, credit or acknowledgement requirements
- [ ] Map assets to output types: presentation/newsletter/Power BI/graphic/diagram/web
- [ ] Record immutable checksums, approved internal asset location, review owner and dated approval
- [ ] Test generated design outputs and leave `productionApproved=false` until authorized

Assets can remain in corporate SharePoint and be resolved by approved workstation paths. A personal private GitHub repository is not automatically the right storage destination for licensed corporate binaries.

## Internal-only PowerPoint profile

Store authorized original PNG assets and the dated intake record under ignored
`brand\local\`. The default PPTX profile is `brand\local\profile.json`:

```json
{
  "schemaVersion": 1,
  "usageScope": "internal-presentations",
  "approval": {
    "status": "approved-for-internal-presentations",
    "confirmedBy": "Actual authorized reviewer or user confirmation",
    "confirmedOn": "YYYY-MM-DD"
  },
  "logos": {
    "abi": {
      "light": {"path": "assets\\abi-light.png", "sha256": "actual file SHA256"},
      "dark": {"path": "assets\\abi-dark.png", "sha256": "actual file SHA256"}
    },
    "commandCenter": {
      "light": {"path": "assets\\cc-light.png", "sha256": "actual file SHA256"},
      "dark": {"path": "assets\\cc-dark.png", "sha256": "actual file SHA256"}
    }
  }
}
```

Paths resolve relative to the profile; absolute approved-storage paths also work.
Record the private source file, package image member if extracted from a supplied
deck, immutable checksum and the exact scope of approval in the local intake
record. This is an asset-use record, not approval of the whole presentation.
Do not promote this profile or its binary files into the public repository.

Run `python scripts/audit_asset_catalog.py` to validate the source register.

### Reference PPTX inspected
The supplied `Reference ppt for ux.pptx` has been inspected and recorded as **design-reference metadata only** at `brand/references/sustainability-cea-brewhub-2026/`. Its actual deck and images have not been committed. The corporate sanctioned master template is not confirmed solely by this reference. Use `scripts/inspect_pptx.py` for future source-file inspections and add approved reference files only after rights review.
