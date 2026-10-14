import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createHash } from "node:crypto";
import test from "node:test";
import { buildPresentation, validateBrief } from "../engines/pptx.mjs";
import { loadBranding } from "../engines/branding.mjs";

const base = { title: "Local test", message: "All content remains editable." };
const slides = [
  {
    ...base, layout: "cover", subtitle: "A reference-based draft",
    points: ["Demonstrate editability"], steps: ["Detect", "Act", "Verify"],
    support: "Reusable components", metric: { value: "Target", label: "Illustrative only" },
    notes: "Cover speaker notes",
  },
  {
    ...base, layout: "table", headers: ["Component", "Configuration"],
    rows: [["Tracking", "Status and evidence"]], notes: "Table speaker notes",
  },
  {
    ...base, layout: "process",
    steps: ["Assess", "Build", "Review"].map(title => ({ title, body: "Required evidence" })),
  },
  {
    ...base, layout: "columns",
    columns: [{ title: "Delivery", points: ["Build"] }, { title: "Governance", points: ["Review"] }],
    callout: "Human approval remains required.",
  },
];

test("legacy example still produces a single editable slide", async () => {
  const brief = JSON.parse(fs.readFileSync(new URL("../examples/brief.json", import.meta.url)));
  const pptx = buildPresentation(brief, { branding: null });
  assert.equal(pptx._slides.length, 1);
  const buffer = await pptx.write({ outputType: "nodebuffer" });
  assert.ok(buffer.length > 1000);
  assert.equal(buffer.subarray(0, 2).toString(), "PK");
});

test("all layouts generate exactly one slide per definition with notes", async () => {
  const pptx = buildPresentation({ title: "Layout test", slides }, { branding: null });
  assert.equal(pptx._slides.length, 4);
  assert.equal(pptx.theme.bodyFontFace, "Arial");
  const buffer = await pptx.write({ outputType: "nodebuffer" });
  assert.ok(buffer.length > 1000);
});

function withBrandingFixture(callback) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "abi-brand-test-"));
  try {
    const pixel = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAEUlEQVR4nGNkYGD4z8DAwAAABQ0BAeuprCUAAAAASUVORK5CYII=",
      "base64");
    fs.writeFileSync(path.join(directory, "pixel.png"), pixel);
    const descriptor = {
      path: "pixel.png", sha256: createHash("sha256").update(pixel).digest("hex"),
    };
    const profile = {
      schemaVersion: 1, usageScope: "internal-presentations",
      approval: {
        status: "approved-for-internal-presentations",
        confirmedBy: "Synthetic test fixture", confirmedOn: "2026-01-01",
      },
      logos: {
        abi: { light: descriptor, dark: descriptor },
        commandCenter: { light: descriptor, dark: descriptor },
      },
    };
    const file = path.join(directory, "profile.json");
    fs.writeFileSync(file, JSON.stringify(profile));
    return callback({ file, profile, directory });
  } finally {
    fs.rmSync(directory, { recursive: true });
  }
}

test("authorized logos are added to every layout and the legacy slide", () => {
  withBrandingFixture(({ file }) => {
    const branding = loadBranding(file);
    const presentations = [
      buildPresentation({ title: "Brand test", slides }, { branding }),
      buildPresentation({ title: "Legacy", headline: "Editable", points: [] }, { branding }),
    ];
    for (const pptx of presentations) {
      for (const slide of pptx._slides) {
        const images = slide._slideObjects.filter(obj => obj.options?.altText);
        assert.deepEqual(images.map(image => image.options.altText),
          ["AB InBev logo", "Command Center logo"]);
        for (const image of images) {
          assert.equal(image.options.w, image.options.h * 2);
        }
      }
    }
  });
});

test("missing approval, missing images and altered originals fail explicitly", () => {
  withBrandingFixture(({ file, profile, directory }) => {
    profile.approval.status = "pending";
    fs.writeFileSync(file, JSON.stringify(profile));
    assert.throws(() => loadBranding(file), /approval/);
    profile.approval.status = "approved-for-internal-presentations";
    profile.logos.abi.light.sha256 = "0".repeat(64);
    fs.writeFileSync(file, JSON.stringify(profile));
    assert.throws(() => loadBranding(file), /checksum/);
    assert.throws(() => loadBranding(path.join(directory, "missing.json")), /does not exist/);
    fs.unlinkSync(path.join(directory, "pixel.png"));
    assert.throws(() => loadBranding(file), /ENOENT/);
  });
});

test("malformed slide definitions are rejected, not silently truncated", () => {
  const invalid = [
    { ...base, layout: "unknown" },
    { ...slides[1], rows: [["Missing cell"]] },
    { ...slides[1], rows: Array.from({ length: 9 }, () => ["X", "Y"]) },
    { ...slides[2], steps: [] },
    { ...slides[3], columns: [] },
    { ...slides[1], title: "x".repeat(86) },
  ];
  for (const slide of invalid) {
    assert.throws(() => validateBrief({ title: "Invalid", slides: [slide] }));
  }
  assert.throws(() => validateBrief({ title: "Invalid", slides: [] }));
  assert.throws(() => validateBrief({ title: "Invalid", slides: "wrong" }));
});
