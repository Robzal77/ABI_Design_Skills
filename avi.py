#!/usr/bin/env python3
"""Local deterministic preview generators, not AI inference or corporate publication."""
import argparse
import html
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent
KINDS = {"graphics": ".svg", "diagram": ".mmd", "powerbi": ".json", "web": ".html"}

def read_brief(path):
    d = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(d, dict) or not all(isinstance(d.get(k), str) and d[k].strip() for k in ("title", "headline", "audience", "purpose")):
        raise ValueError("Brief needs non-empty title, headline, audience and purpose")
    if not isinstance(d.get("points", []), list) or not all(isinstance(p, str) for p in d.get("points", [])):
        raise ValueError("points must be an array of strings")
    return d

def palette():
    d = json.loads((ROOT / "brand/brand.json").read_text(encoding="utf-8"))
    return d["colors"]

def esc(v):
    return html.escape(str(v), quote=True)

def svg(d, c):
    headline = esc(d["headline"])
    pts = d.get("points", [])[:4]
    rows = "".join(f'<text x="84" y="{270+i*74}" font-size="26" fill="{c["black"]}">{i+1:02d}  {esc(p[:75])}</text>' for i,p in enumerate(pts))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675" role="img" aria-label="{esc(d["title"])}">
<rect width="1200" height="675" fill="{c["white"]}"/><rect x="0" width="1200" height="24" fill="{c["gold"]}"/>
<text x="84" y="90" font-family="Arial, sans-serif" font-size="19" font-weight="bold" fill="{c["black"]}">{esc(d.get("eyebrow","DESIGN PREVIEW")[:55])}</text>
<text x="84" y="177" font-family="Arial, sans-serif" font-size="46" font-weight="bold" fill="{c["black"]}">{headline[:65]}</text>
{rows}<path d="M84 610 H1116" stroke="{c["gold"]}" stroke-width="8"/>
<text x="84" y="645" font-size="15" font-family="Arial, sans-serif" fill="{c["black"]}">Reference-based preview — corporate approval required</text></svg>'''

def diagram(d):
    steps = d.get("steps") or ["Brief", "Design", "Review"]
    nodes = ["flowchart LR"]
    for i, step in enumerate(steps[:12]):
        clean = str(step).replace('"', "'").replace("\n", " ")[:90]
        nodes.append(f'  S{i}["{clean}"]')
        if i: nodes.append(f"  S{i-1} --> S{i}")
    return "\n".join(nodes) + "\n"

def web(d,c):
    items = "".join(f"<li>{esc(p)}</li>" for p in d.get("points", [])[:8])
    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(d["title"])}</title><style>:root{{--gold:{c["gold"]};--black:{c["black"]}}}*{{box-sizing:border-box}}body{{margin:0;font:17px/1.5 Arial,sans-serif;background:#fff;color:#000}}header{{background:var(--black);color:#fff;padding:20px max(24px,6vw)}}main{{max-width:1050px;margin:65px auto;padding:0 25px}}h1{{font-size:clamp(32px,5vw,60px);line-height:1.08;max-width:19ch}}.rule{{width:120px;height:9px;background:var(--gold)}}li{{margin:15px 0}}footer{{padding:25px;background:#efefef}}</style></head><body><header>ABI DESIGN SKILLS · DESIGN PREVIEW</header><main><div class="rule"></div><p>{esc(d["purpose"])}</p><h1>{esc(d["headline"])}</h1><p>For: {esc(d["audience"])}</p><ul>{items}</ul></main><footer>Reference-based prototype — corporate approval required.</footer></body></html>'''

def powerbi(d,c):
    return json.dumps({"name":"ABI Public Reference - Review Required","dataColors":[c[x] for x in ["gold","black","darkGold","blue","red","green"]],"background":"#FFFFFF","foreground":"#000000","tableAccent":c["gold"]}, indent=2) + "\n"

def main():
    a=argparse.ArgumentParser(description="Generate non-published local visual previews")
    a.add_argument("--format", required=True, choices=sorted(KINDS))
    a.add_argument("--brief",required=True)
    a.add_argument("--out",required=True)
    args=a.parse_args()
    d=read_brief(args.brief); c=palette()
    result={"graphics":svg,"diagram":lambda d,c:diagram(d),"powerbi":powerbi,"web":web}[args.format](d,c)
    out=Path(args.out)
    if out.suffix.lower()!=KINDS[args.format]: raise ValueError("Expected extension "+KINDS[args.format])
    out.parent.mkdir(parents=True,exist_ok=True)
    out.write_text(result,encoding="utf-8")
    print(f"Created {out} | REVIEW REQUIRED | not internally template-approved")

if __name__=="__main__":
    main()
