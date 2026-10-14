#!/usr/bin/env python3
"""Audit public reference catalog. This does not validate external file licenses."""
import json
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
def main():
    file = ROOT / "brand" / "asset-catalog.json"
    data = json.loads(file.read_text(encoding="utf8"))
    assert data["catalogStatus"] == "reference_registry_not_asset_download"
    ids = set()
    allowed = {"ppt", "newsletter", "powerbi", "graphics", "diagrams", "web"}
    for item in data["items"]:
        for k in ("id", "category", "title", "assetStatus", "rights", "formats"):
            if not item.get(k): raise ValueError(f"{item.get('id', 'unknown')}: missing {k}")
        if item["id"] in ids: raise ValueError("Duplicate asset ID: " + item["id"])
        ids.add(item["id"])
        if not set(item["formats"]) <= allowed: raise ValueError(f"Unknown formats for {item['id']}")
        u = item.get("sourceUrl")
        if u is not None and not u.startswith("https://brandworld.ab-inbev.com/"):
            raise ValueError(f"Unrecognized source: {u}")
    print(f"Asset source catalog validated: {len(ids)} entries; no asset binary presence implied.")
if __name__ == "__main__":
    main()
