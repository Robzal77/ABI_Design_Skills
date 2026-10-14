import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pptxgen from "pptxgenjs";
import { addBranding, designStatus, footerText, loadBranding } from "./branding.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WIDTH = 13.333;
const LAYOUTS = new Set(["cover", "table", "process", "columns"]);

function text(value, label, max = Infinity) {
  if (typeof value !== "string" || !value.trim() || value.length > max) {
    throw new Error(`${label} must be non-empty text of at most ${max} characters`);
  }
}

function strings(values, label, min, max, length) {
  if (!Array.isArray(values) || values.length < min || values.length > max) {
    throw new Error(`${label} must contain ${min}-${max} items`);
  }
  values.forEach((value, i) => text(value, `${label}[${i}]`, length));
}

export function validateBrief(brief) {
  if (!brief || typeof brief !== "object" || Array.isArray(brief)) {
    throw new Error("Brief must be an object");
  }
  text(brief.title, "title");
  if (brief.slides === undefined) {
    text(brief.headline, "headline");
    strings(brief.points, "points", 0, Infinity, Infinity);
    return brief;
  }
  if (!Array.isArray(brief.slides) || brief.slides.length < 1 || brief.slides.length > 40) {
    throw new Error("slides must contain 1-40 slides");
  }
  brief.slides.forEach((slide, index) => {
    const label = `slides[${index}]`;
    if (!slide || typeof slide !== "object" || !LAYOUTS.has(slide.layout)) {
      throw new Error(`${label}.layout must be cover, table, process or columns`);
    }
    text(slide.title, `${label}.title`, 85);
    text(slide.message, `${label}.message`, 180);
    if (slide.notes !== undefined) text(slide.notes, `${label}.notes`);
    if (slide.callout !== undefined) text(slide.callout, `${label}.callout`, 230);
    if (slide.eyebrow !== undefined) text(slide.eyebrow, `${label}.eyebrow`, 55);
    if (slide.layout === "cover") {
      text(slide.subtitle, `${label}.subtitle`, 140);
      strings(slide.points, `${label}.points`, 1, 4, 170);
      strings(slide.steps, `${label}.steps`, 3, 4, 40);
      text(slide.support, `${label}.support`, 150);
      if (!slide.metric || typeof slide.metric !== "object") {
        throw new Error(`${label}.metric must contain value and label`);
      }
      text(slide.metric.value, `${label}.metric.value`, 25);
      text(slide.metric.label, `${label}.metric.label`, 65);
    }
    if (slide.layout === "table") {
      strings(slide.headers, `${label}.headers`, 2, 2, 65);
      if (!Array.isArray(slide.rows) || slide.rows.length < 1 || slide.rows.length > 8) {
        throw new Error(`${label}.rows must contain 1-8 rows`);
      }
      slide.rows.forEach((row, i) => {
        strings(row, `${label}.rows[${i}]`, 2, 2, 145);
      });
    }
    if (slide.layout === "process") {
      if (!Array.isArray(slide.steps) || slide.steps.length < 3 || slide.steps.length > 6) {
        throw new Error(`${label}.steps must contain 3-6 steps`);
      }
      slide.steps.forEach((step, i) => {
        text(step.title, `${label}.steps[${i}].title`, 45);
        text(step.body, `${label}.steps[${i}].body`, 170);
        if (step.gate !== undefined) text(step.gate, `${label}.steps[${i}].gate`, 55);
      });
    }
    if (slide.layout === "columns") {
      if (!Array.isArray(slide.columns) || slide.columns.length !== 2) {
        throw new Error(`${label}.columns must contain two columns`);
      }
      slide.columns.forEach((column, i) => {
        text(column.title, `${label}.columns[${i}].title`, 65);
        strings(column.points, `${label}.columns[${i}].points`, 1, 5, 180);
      });
    }
  });
  return brief;
}

function addText(slide, value, x, y, w, h, options = {}) {
  slide.addText(value, {
    x, y, w, h, fontFace: "Arial", fontSize: 18, color: "000000",
    margin: 0, breakLine: false, wrap: true, valign: "mid", ...options,
  });
}

function rect(pptx, slide, x, y, w, h, color, rounded = false) {
  slide.addShape(rounded ? pptx.ShapeType.roundRect : pptx.ShapeType.rect, {
    x, y, w, h, line: { color, transparency: 100 }, fill: { color },
  });
}

function frame(pptx, slide, data, index, count, colors, deckTitle, branding) {
  slide.background = { color: colors.white };
  rect(pptx, slide, 0, 0, WIDTH, 0.12, colors.gold);
  if (data.layout !== "cover") {
    addText(slide, deckTitle, branding ? 2.75 : 0.6, branding ? 0.48 : 0.37,
      branding ? 7.1 : 11.5, 0.2,
      { fontSize: branding ? 9 : 10, charSpacing: branding ? 0 : 1.2 });
    addText(slide, data.title, 0.6, 0.86, 12.1, 0.8,
      { fontSize: 30, bold: true });
    addText(slide, data.message, 0.6, 1.79, 12.1, 0.66,
      { fontSize: 18, valign: "top" });
  }
  rect(pptx, slide, 0.6, 6.96, 12.1, 0.012, colors.darkGrey);
  addText(slide, footerText(branding), 0.6, 7.13, 11.4, 0.15, { fontSize: 8 });
  addText(slide, `${index + 1} / ${count}`, 12.03, 7.1, 0.68, 0.2,
    { fontSize: 10, align: "right" });
}

function callout(pptx, slide, value, colors) {
  if (!value) return;
  rect(pptx, slide, 0.6, 6.06, 12.1, 0.67, colors.lightGrey);
  rect(pptx, slide, 0.6, 6.06, 0.06, 0.67, colors.gold);
  addText(slide, value, 0.8, 6.13, 11.67, 0.5, { fontSize: 15 });
}

function cover(pptx, slide, data, colors, branding) {
  rect(pptx, slide, 0, 0, 7.0, 6.95, colors.black);
  if (!branding) rect(pptx, slide, 0.6, 0.4, 0.7, 0.08, colors.gold);
  addText(slide, data.eyebrow || "DESIGN PREVIEW", 0.6, branding ? 0.88 : 0.78, 5.7, 0.52,
    { fontSize: 22, color: colors.gold, bold: true });
  addText(slide, data.title, 0.6, 1.48, 5.85, 1.5,
    { fontSize: 36, bold: true, color: colors.white });
  addText(slide, data.subtitle, 0.6, 3.22, 5.85, 0.76,
    { fontSize: 19, color: colors.white });
  data.points.forEach((point, i) => {
    addText(slide, point, 0.63, 4.22 + i * 0.62, 5.76, 0.55,
      { fontSize: 16, color: colors.white });
  });
  addText(slide, "BUSINESS PROCESS", 7.5, 1.0, 5.1, 0.35,
    { fontSize: 15, bold: true });
  const w = 4.92 / data.steps.length;
  data.steps.forEach((step, i) => {
    rect(pptx, slide, 7.5 + i * w, 1.67, w - 0.1, 0.88, colors.lightGrey);
    addText(slide, step, 7.57 + i * w, 1.78, w - 0.24, 0.65,
      { fontSize: 16, bold: true, align: "center" });
    if (i < data.steps.length - 1) {
      slide.addShape(pptx.ShapeType.chevron, {
        x: 7.5 + (i + 1) * w - 0.13, y: 2.02, w: 0.16, h: 0.18,
        line: { color: colors.black }, fill: { color: colors.black },
      });
    }
  });
  rect(pptx, slide, 7.5, 2.92, 4.82, 1.24, colors.gold);
  addText(slide, data.message, 7.72, 3.08, 4.39, 0.27,
    { fontSize: 17, bold: true });
  addText(slide, data.support, 7.72, 3.5, 4.39, 0.6, { fontSize: 16 });
  addText(slide, data.metric.value, 7.5, 4.68, 5.1, 0.88,
    { fontSize: 46, bold: true });
  addText(slide, data.metric.label, 7.53, 5.65, 5.0, 0.6,
    { fontSize: 17 });
}

function table(pptx, slide, data, colors) {
  const x = 0.6, y = 2.7, leftW = 3.5, rightW = 8.6;
  const rowH = Math.min(0.56, 2.77 / data.rows.length);
  rect(pptx, slide, x, y, 12.1, 0.48, colors.black);
  addText(slide, data.headers[0], x + 0.16, y + 0.07, leftW - 0.3, 0.33,
    { color: colors.white, fontSize: 16, bold: true });
  addText(slide, data.headers[1], x + leftW + 0.16, y + 0.07, rightW - 0.3, 0.33,
    { color: colors.white, fontSize: 16, bold: true });
  data.rows.forEach((row, i) => {
    const rowY = y + 0.48 + i * rowH;
    rect(pptx, slide, x, rowY, 12.1, rowH,
      i % 2 ? colors.white : colors.lightGrey);
    const size = data.rows.length > 6 ? 15 : 16;
    addText(slide, row[0], x + 0.16, rowY + 0.035, leftW - 0.3, rowH - 0.07,
      { fontSize: size, bold: true });
    addText(slide, row[1], x + leftW + 0.16, rowY + 0.035, rightW - 0.3, rowH - 0.07,
      { fontSize: size });
  });
}

function processLayout(pptx, slide, data, colors, branding) {
  data.steps.forEach((step, i) => {
    const x = 0.6 + (i % 3) * 4.13;
    const y = 2.68 + Math.floor(i / 3) * 1.59;
    rect(pptx, slide, x, y, 3.84, 1.39, colors.lightGrey, Boolean(branding));
    addText(slide, String(i + 1).padStart(2, "0"), x + 0.18, y + 0.14, 0.38, 0.35,
      { fontSize: 19, bold: true });
    addText(slide, step.title, x + 0.75, y + 0.14, 2.9, 0.36,
      { fontSize: 19, bold: true });
    addText(slide, step.body, x + 0.18, y + 0.54, 3.54, step.gate ? 0.57 : 0.7,
      { fontSize: 16, valign: "top" });
    if (step.gate) {
      rect(pptx, slide, x, y + 1.12, 3.84, 0.27, colors.gold);
      addText(slide, step.gate, x + 0.1, y + 1.14, 3.64, 0.22,
        { fontSize: 12, bold: true });
    }
  });
}

function columns(pptx, slide, data, colors, branding) {
  data.columns.forEach((column, i) => {
    const x = 0.6 + i * 6.2;
    rect(pptx, slide, x, 2.71, 5.9, 3.12, colors.lightGrey, Boolean(branding));
    rect(pptx, slide, x, 2.71, 5.9, 0.48, i ? colors.gold : colors.black);
    addText(slide, column.title, x + 0.18, 2.8, 5.54, 0.29,
      { fontSize: 17, bold: true, color: i ? colors.black : colors.white });
    const h = 2.48 / column.points.length;
    const fontSize = column.points.length > 4 ? 16 : 17;
    column.points.forEach((point, j) => {
      addText(slide, `${j + 1}.`, x + 0.18, 3.28 + j * h, 0.35, h - 0.04,
        { fontSize, bold: true, valign: "top" });
      addText(slide, point, x + 0.65, 3.28 + j * h, 5.14, h - 0.04,
        { fontSize, valign: "top" });
    });
  });
}

function legacy(pptx, brief, branding) {
  const s = pptx.addSlide();
  s.background = { color: "FFFFFF" };
  rect(pptx, s, 0, 0, WIDTH, 0.18, "E5B611");
  addText(s, brief.title.slice(0, 90), 0.75, branding ? 0.95 : 0.62, 11.8,
    branding ? 0.35 : 0.56,
    { fontSize: 17, bold: true });
  addText(s, brief.headline.slice(0, 110), 0.75, 1.37, 11.8, 1.48,
    { fontSize: 33, bold: true });
  brief.points.slice(0, 4).forEach((point, i) => {
    s.addShape(pptx.ShapeType.ellipse, {
      x: 0.76, y: 3.05 + i * 0.72, w: 0.33, h: 0.33,
      line: { color: "E5B611" }, fill: { color: "E5B611" },
    });
    addText(s, point.slice(0, 110), 1.3, 3 + i * 0.72, 10.7, 0.58,
      { fontSize: 19 });
  });
  addText(s, footerText(branding), 0.75, 7.0, 11.5, 0.24, { fontSize: 9 });
  addBranding(s, branding, "legacy");
  s.addNotes([brief.headline, designStatus(branding),
    "Human content, brand and visual review required before distribution."].join("\n\n"));
}

export function buildPresentation(brief, { branding = loadBranding() } = {}) {
  validateBrief(brief);
  const palette = JSON.parse(fs.readFileSync(path.join(ROOT, "brand", "brand.json"), "utf8"));
  const colors = Object.fromEntries(Object.entries(palette.colors)
    .map(([name, value]) => [name, value.replace("#", "")]));
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "ABI Design Skills";
  pptx.title = brief.title;
  pptx.subject = "Reference-based editable preview, internal template approval pending";
  pptx.lang = "en-IN";
  pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial", lang: "en-IN" };
  if (!brief.slides) {
    legacy(pptx, brief, branding);
    return pptx;
  }
  const renderers = { cover, table, process: processLayout, columns };
  brief.slides.forEach((data, index) => {
    const slide = pptx.addSlide();
    frame(pptx, slide, data, index, brief.slides.length, colors, brief.title, branding);
    renderers[data.layout](pptx, slide, data, colors, branding);
    if (data.layout !== "cover") callout(pptx, slide, data.callout, colors);
    addBranding(slide, branding, data.layout);
    slide.addNotes([
      data.notes || data.message,
      designStatus(branding),
      "Human content, brand and visual review required before distribution.",
    ].join("\n\n"));
  });
  return pptx;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  function flag(name, fallback) {
    const index = process.argv.indexOf(name);
    if (index < 0) return fallback;
    if (!process.argv[index + 1] || process.argv[index + 1].startsWith("--")) {
      throw new Error(`Missing value for ${name}`);
    }
    return process.argv[index + 1];
  }
  const brief = JSON.parse(fs.readFileSync(flag("--brief", "examples/brief.json"), "utf8"));
  const out = flag("--out", "output/deck.pptx");
  if (path.extname(out).toLowerCase() !== ".pptx") throw new Error("--out must end in .pptx");
  const branding = loadBranding(flag("--brand-profile", undefined));
  if (!branding) {
    console.warn("No approved local branding profile configured; corporate logos will not be added.");
  }
  const pptx = buildPresentation(brief, { branding });
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await pptx.writeFile({ fileName: out });
  console.log(`Created ${out} (${brief.slides?.length || 1} slides) - rendered visual and template review required`);
}
