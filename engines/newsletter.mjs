import fs from "node:fs";import path from "node:path";import mjml2html from "mjml";
const flag=(n,d)=>{let i=process.argv.indexOf(n);return i>=0?process.argv[i+1]:d};
const d=JSON.parse(fs.readFileSync(flag("--brief","examples/brief.json"),"utf8"));
if(!d.title||!d.headline||!Array.isArray(d.points))throw Error("Invalid brief");
const h=x=>String(x).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const rows=d.points.slice(0,8).map(x=>'<mj-text font-size="17px" line-height="26px">• '+h(x)+'</mj-text>').join("");
const src='<mjml><mj-head><mj-attributes><mj-all font-family="Arial, sans-serif"/></mj-attributes></mj-head><mj-body background-color="#EFEFEF"><mj-section background-color="#000000"><mj-column><mj-text color="#E5B611" font-size="16px" font-weight="bold">ABI DESIGN SKILLS · REFERENCE PREVIEW</mj-text></mj-column></mj-section><mj-section background-color="#FFFFFF"><mj-column><mj-text font-size="31px" font-weight="bold">'+h(d.headline)+'</mj-text><mj-text font-size="16px">'+h(d.purpose)+'</mj-text>'+rows+'</mj-column></mj-section><mj-section><mj-column><mj-text font-size="12px">Brand template approval and email client review required before publication.</mj-text></mj-column></mj-section></mj-body></mjml>';
const result=mjml2html(src,{validationLevel:"strict"});if(result.errors.length)throw Error(JSON.stringify(result.errors));
const out=flag("--out","output/newsletter.html");fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,result.html);console.log("Created "+out+" — email-client QA required");
