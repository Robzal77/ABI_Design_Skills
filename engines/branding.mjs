import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_PROFILE = path.join(ROOT, "brand", "local", "profile.json");
const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

function loadLogo(descriptor, label, directory) {
  if (!descriptor || typeof descriptor.path !== "string" || !descriptor.path.trim() ||
      typeof descriptor.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(descriptor.sha256)) {
    throw new Error(`${label} requires an original PNG path and SHA256`);
  }
  const source = path.resolve(directory, descriptor.path);
  const bytes = fs.readFileSync(source);
  const digest = createHash("sha256").update(bytes).digest("hex");
  if (digest !== descriptor.sha256.toLowerCase()) {
    throw new Error(`${label}: asset checksum differs from the approved intake record`);
  }
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE) ||
      bytes.subarray(12, 16).toString("ascii") !== "IHDR") {
    throw new Error(`${label}: an original PNG asset is required`);
  }
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  if (!width || !height) throw new Error(`${label}: invalid image dimensions`);
  return {
    data: `image/png;base64,${bytes.toString("base64")}`,
    width, height, sha256: digest,
  };
}

export function loadBranding(profilePath = DEFAULT_PROFILE) {
  if (!fs.existsSync(profilePath)) {
    if (path.resolve(profilePath) === DEFAULT_PROFILE) return null;
    throw new Error(`Requested branding profile does not exist: ${profilePath}`);
  }
  const profile = JSON.parse(fs.readFileSync(profilePath, "utf8"));
  if (profile.schemaVersion !== 1 ||
      profile.usageScope !== "internal-presentations" ||
      profile.approval?.status !== "approved-for-internal-presentations" ||
      typeof profile.approval.confirmedBy !== "string" || !profile.approval.confirmedBy.trim() ||
      typeof profile.approval.confirmedOn !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(profile.approval.confirmedOn)) {
    throw new Error("Branding profile requires dated approval for internal presentations");
  }
  const directory = path.dirname(path.resolve(profilePath));
  const logos = {};
  for (const name of ["abi", "commandCenter"]) {
    logos[name] = {};
    for (const variant of ["light", "dark"]) {
      logos[name][variant] = loadLogo(profile.logos?.[name]?.[variant],
        `${name}.${variant}`, directory);
    }
  }
  return { usageScope: profile.usageScope, logos };
}

function containLogo(slide, asset, label, x, y, w, h) {
  const scale = Math.min(w / asset.width, h / asset.height);
  const width = asset.width * scale, height = asset.height * scale;
  slide.addImage({
    data: asset.data,
    x: x + (w - width) / 2, y: y + (h - height) / 2,
    w: width, h: height, altText: label, objectName: label,
  });
}

export function addBranding(slide, branding, layout) {
  if (!branding) return;
  containLogo(slide, branding.logos.abi[layout === "cover" ? "dark" : "light"],
    "AB InBev logo", 0.6, 0.4, 1.5, 0.28);
  containLogo(slide, branding.logos.commandCenter.light,
    "Command Center logo", 10.4, 0.34, 2.25, 0.4);
}

export function designStatus(branding) {
  return branding
    ? "Design status: authorized local ABI and Command Center logos, for internal presentations only; public ABI palette; Arial fallback; approved corporate master not applied."
    : "Design status: public ABI palette; Arial fallback; no corporate logo or approved master applied.";
}

export function footerText(branding) {
  return branding
    ? "INTERNAL DRAFT / AUTHORIZED LOCAL LOGOS / ARIAL FALLBACK / TEMPLATE REVIEW PENDING"
    : "DRAFT / PUBLIC BRAND REFERENCE / ARIAL FALLBACK / TEMPLATE APPROVAL PENDING";
}
