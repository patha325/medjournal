import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const SKILL_DIR=process.env.SKILL_DIR;
const TMP_DIR=process.env.TMP_DIR;
const FINAL_PPTX=process.env.FINAL_PPTX;
const RUNTIME_PYTHON=process.env.RUNTIME_PYTHON;
const workspaceDir=process.cwd();
if(!path.isAbsolute(SKILL_DIR||"")||!path.isAbsolute(TMP_DIR||"")||!path.isAbsolute(FINAL_PPTX||"")) throw new Error("Absolute runtime paths required");
const utils=await import(pathToFileURL(path.join(SKILL_DIR,"container_tools/artifact_tool_utils.mjs")).href);
const { finalizePresentation }=utils;
await fs.mkdir(TMP_DIR,{recursive:true});
await fs.mkdir(path.dirname(FINAL_PPTX),{recursive:true});

const p=Presentation.create({slideSize:{width:1280,height:720}});
const C={navy:"#073E47",teal:"#0C6973",aqua:"#DDF2F1",mint:"#B9E0DD",ink:"#102529",muted:"#5B6E72",line:"#C9D8D7",paper:"#FFFFFF",fog:"#EFF5F4",orange:"#C45B20",red:"#A73535",gold:"#E8B865"};
const font="DejaVu Sans";
function box(slide,x,y,w,h,fill=C.paper,r=14,line=C.line){return slide.shapes.add({geometry:r?"roundRect":"rect",position:{left:x,top:y,width:w,height:h},fill,line:{fill:line,width:1}})}
function text(slide,s,x,y,w,h,size=24,color=C.ink,bold=false,align="left"){
  const q=slide.shapes.add({geometry:"textbox",position:{left:x,top:y,width:w,height:h},fill:"none",line:{fill:"none",width:0}});q.text=s;q.text.style={typeface:font,fontSize:size,color,bold,alignment:align,verticalAlignment:"middle",autoFit:"shrinkText",marginLeft:0,marginRight:0,marginTop:0,marginBottom:0};return q;
}
function base(title,subtitle){const s=p.slides.add();s.background.fill=C.fog;text(s,title,58,34,1120,54,32,C.ink,true);if(subtitle)text(s,subtitle,58,90,1120,34,16,C.muted,false);text(s,"MEDJOURNAL POC",1090,675,130,18,10,C.teal,true,"right");return s}
function pill(slide,label,x,y,w,fill=C.aqua,color=C.teal){const q=box(slide,x,y,w,28,fill,14,fill);q.text=label;q.text.style={typeface:font,fontSize:11,bold:true,color,alignment:"center",verticalAlignment:"middle",autoFit:"shrinkText",marginLeft:5,marginRight:5,marginTop:0,marginBottom:0};return q}
function note(slide,urls){slide.speakerNotes.textFrame.setText(urls.join("\n"));}

// 1 — cover
{
 const s=p.slides.add();s.background.fill=C.navy;
 box(s,0,0,1280,720,C.navy,0,C.navy);box(s,750,-100,650,650,C.teal,325,C.teal);box(s,930,110,380,380,C.mint,190,C.mint);
 text(s,"Vårdflöde",70,130,640,76,54,"#FFFFFF",true);text(s,"A safer path to a Swedish clinical record",70,210,650,92,30,C.mint,true);
 text(s,"Interactive POC, modular architecture and a standards-based clinical data model",70,330,610,80,20,"#D7EAEB");
 pill(s,"EXECUTIVE PRESENTATION",70,74,190,C.gold,C.navy);text(s,"22 September 2026",70,625,340,28,14,"#C6DADB");
 text(s,"+",1000,170,190,190,120,C.navy,true,"center");
 note(s,["POC repository: https://github.com/patha325/medjournal"]);
}

// 2 — current context
{
 const s=base("Sweden has already changed direction","The public record now supports modularity, stronger clinical involvement and control over data.");
 const events=[
  ["12 Nov 2024","VGR activated Millennium","Deployment began in part of the region."],
  ["15 Nov 2024","VGR paused deployment","VGR stated that patient safety could not be guaranteed."],
  ["17 Feb 2026","VGR chose a new direction","Regional leadership ended the common core-system approach."],
  ["2026","Skåne stopped its programme","Reviews found the current generation insufficient for usability and patient safety."]
 ];
 s.shapes.add({geometry:"line",position:{left:120,top:258,width:1030,height:0},fill:"none",line:{fill:C.teal,width:5}});
 events.forEach((e,i)=>{const x=70+i*300;box(s,x+34,235,44,44,C.teal,22,C.teal);text(s,String(i+1),x+34,235,44,44,18,"#FFFFFF",true,"center");text(s,e[0],x,170,115,34,15,C.orange,true,"center");text(s,e[1],x,310,230,55,18,C.ink,true);text(s,e[2],x,370,230,100,14,C.muted);});
 box(s,70,535,1140,92,C.navy,12,C.navy);text(s,"The lesson is broader than one supplier",94,548,390,35,20,"#FFFFFF",true);text(s,"Clinical workflow, safety validation, rollout design and governance must succeed together.",510,546,650,48,19,C.mint,true);
 note(s,["VGR decision and timeline: https://www.vgregion.se/politik/aktuella-beslut-fran-regionfullmaktige-och-regionstyrelsen/beslut-i-regionstyrelsen/regionstyrelsen-2-december-2025/","VGR current direction: https://www.vgregion.se/halsa-och-vard/halso--och-sjukvardens-utveckling/vardinformationsmiljo/","Region Skåne status: https://vardgivare.skane.se/kompetens-utveckling/projekt-och-utvecklingsarbete/sdv"]);
}

// 3 — balanced comparison
{
 const s=base("A fair comparison separates platform capability from implementation outcome","Oracle Millennium supports FHIR. The Swedish programmes still failed to meet local usability and safety expectations.");
 const heads=["Dimension","Oracle Health Millennium","Vårdflöde POC"];
 [55,300,755].forEach((x,i)=>{box(s,x,150,[225,435,470][i],48,i===0?C.teal:C.navy,8,i===0?C.teal:C.navy);text(s,heads[i],x+14,155,[197,407,442][i],35,15,"#FFFFFF",true)});
 const rows=[
  ["Interoperability","FHIR R4 APIs and SMART applications are documented.","Swedish profiles and terminology form the primary contract."],
  ["Product shape","Large integrated EHR platform.","Replaceable modules around a small canonical core."],
  ["Swedish outcome","VGR stopped the rollout. Skåne ended its programme.","Unvalidated POC. No production outcome yet."],
  ["Clinical workflow","Swedish reviews identified usability gaps in the configured solution.","Workflow prototypes tested before service implementation."],
  ["Change control","Supplier platform plus regional configuration.","Versioned APIs, contract tests and reversible releases."],
  ["Supplier dependence","Extensions available through platform APIs.","Open exports and rehearsed component replacement."]
 ];
 rows.forEach((r,i)=>{const y=205+i*68;const fill=i%2?"#F7FAFA":"#FFFFFF";box(s,55,y,225,62,fill,4,C.line);box(s,300,y,435,62,fill,4,C.line);box(s,755,y,470,62,fill,4,C.line);text(s,r[0],69,y+8,195,45,14,C.teal,true);text(s,r[1],314,y+7,407,48,13,C.ink);text(s,r[2],769,y+7,442,48,13,C.ink)});
 text(s,"The POC presents design advantages, not proof of superiority. A clinical pilot must produce the evidence.",58,631,1120,26,13,C.orange,true);
 note(s,["Oracle Health Millennium FHIR APIs: https://docs.oracle.com/en/industries/health/millennium-platform-apis/mfrap/r4_overview.html","Oracle interoperability overview: https://www.oracle.com/health/interoperability/","VGR modular direction: https://www.vgregion.se/halsa-och-vard/halso--och-sjukvardens-utveckling/vardinformationsmiljo/","Region Skåne status: https://www.skane.se/halsa-och-vard/skanes-digitala-vardsystem/"]);
}

// 4 — clinical workspace
{
 const s=base("The clinical workspace keeps the care task in view","Structured capture, narrative detail and safety context share one screen.");
 box(s,55,140,1170,500,C.paper,16,C.line);box(s,55,140,1170,52,C.navy,16,C.navy);text(s,"Vårdflöde",76,149,150,30,19,"#FFFFFF",true);box(s,888,151,245,29,"#FFFFFF22",8,"#FFFFFF22");text(s,"Sök patient…",902,154,180,23,12,"#D7EAEB");
 box(s,76,212,1128,70,"#F5F9F8",10,C.line);box(s,94,227,40,40,C.aqua,10,C.aqua);text(s,"AS",94,227,40,40,14,C.teal,true,"center");text(s,"Anna Sjöberg",150,224,280,28,18,C.ink,true);text(s,"Syntetisk patient · vårdrelation aktiv",150,251,390,22,12,C.muted);pill(s,"PENICILLINALLERGI",970,230,170,"#FBE9DE",C.orange);
 box(s,76,300,735,310,C.paper,10,C.line);text(s,"Ny journalanteckning · SOAP",96,316,400,30,18,C.ink,true);
 const fields=[["S — Subjektivt","Feber och torrhosta sedan tre dagar."],["O — Objektivt","Temp 38,1 °C. Sat 98 % på luft."],["A — Bedömning","Misstänkt viral luftvägsinfektion"],["P — Plan","Egenvård och åter vid försämring"]];
 fields.forEach((f,i)=>{const y=360+i*53;text(s,f[0],96,y,145,22,11,C.teal,true);box(s,238,y-2,545,38,"#F8FBFB",6,C.line);text(s,f[1],250,y+3,520,26,12,C.ink)});
 box(s,585,571,198,30,C.teal,7,C.teal);text(s,"Granska och signera",598,574,172,24,12,"#FFFFFF",true,"center");
 box(s,830,300,374,145,"#FFF7F0",10,"#E7B68F");text(s,"Läkemedelssäkerhet",850,318,300,27,16,C.orange,true);text(s,"Allergin följer ordinationsflödet och kräver aktiv bedömning.",850,354,324,55,13,C.ink);
 box(s,830,462,374,148,C.paper,10,C.line);text(s,"Åtkomst och ansvar",850,480,300,27,16,C.teal,true);text(s,"Syfte: direkt vård\nAlla läsningar och ändringar loggas\nSignerad historik kan rekonstrueras",850,515,330,76,13,C.ink);
 note(s,["Interactive POC: https://vardflode-journal-poc.patha325.chatgpt.site"]);
}

// 5 — advantages
{
 const s=base("Six design choices directly address the Swedish failure modes","Each choice must still be tested with clinicians, patients and operational teams.");
 const items=[
  ["01","Workflow first","Prototype real care scenarios before technical build. Measure task time, errors and cognitive load."],
  ["02","Modular core","Replace components without replacing the complete information environment."],
  ["03","Swedish semantics","Use national profiles and terminology instead of pushing local meaning into free text."],
  ["04","Traceable records","Keep signed history, provenance and access events independently verifiable."],
  ["05","Reversible rollout","Release by workflow and unit with exit criteria, fallback and rapid rollback."],
  ["06","Data control","Keep a canonical model, open exports and tested supplier-exit procedures."]
 ];
 items.forEach((it,i)=>{const col=i%2,row=Math.floor(i/2),x=58+col*590,y=145+row*166;box(s,x,y,560,140,C.paper,14,C.line);box(s,x+18,y+18,52,52,C.teal,26,C.teal);text(s,it[0],x+18,y+18,52,52,16,"#FFFFFF",true,"center");text(s,it[1],x+88,y+18,430,29,19,C.ink,true);text(s,it[2],x+88,y+52,430,68,14,C.muted)});
 note(s,["VGR recommended national standards and staff participation: https://www.vgregion.se/politik/aktuella-beslut-fran-regionfullmaktige-och-regionstyrelsen/beslut-i-regionstyrelsen/regionstyrelsen-2-december-2025/","E-hälsomyndigheten national infrastructure: https://www.ehalsomyndigheten.se/verksamhet/ndi/om-nationell-digital-infrastruktur/"]);
}

// 6 — architecture
{
 const s=base("The architecture limits blast radius and supplier dependence","A policy gateway protects a small clinical core. Integration and analytics remain separate.");
 const cols=[{x:55,w:260,t:"CHANNELS",nodes:[["Clinician workspace","SSO, MFA, accessible web"],["Patient channel","1177, portal and proxy"],["Embedded apps","SMART on FHIR"]]},{x:360,w:500,t:"CLINICAL PLATFORM",nodes:[["FHIR API and policy gateway","Swedish profiles, validation and purpose"],["Journal and workflow services","Documentation, orders, results and signing"],["Terminology and decision support","Versioned rules and explainable alerts"]]},{x:895,w:330,t:"TRUST AND ECOSYSTEM",nodes:[["Clinical store","Encrypted records and immutable versions"],["Audit ledger","Separate append-only security domain"],["National adapters","NDI, 1177, medicines and regional services"]]}];
 cols.forEach((c,ci)=>{box(s,c.x,150,c.w,438,ci===1?"#E4F3F2":"#FFFFFF",12,C.line);text(s,c.t,c.x+18,166,c.w-36,26,12,C.teal,true);c.nodes.forEach((n,i)=>{const y=213+i*108;box(s,c.x+18,y,c.w-36,83,i===0&&ci===1?C.navy:C.paper,9,i===0&&ci===1?C.navy:C.line);text(s,n[0],c.x+32,y+11,c.w-64,24,15,i===0&&ci===1?"#FFFFFF":C.ink,true);text(s,n[1],c.x+32,y+39,c.w-64,35,11,i===0&&ci===1?C.mint:C.muted)})});
 text(s,"▶",330,342,28,40,22,C.teal,true,"center");text(s,"▶",862,342,28,40,22,C.teal,true,"center");
 pill(s,"EVENT BUS",523,608,165,C.gold,C.navy);text(s,"Approved events feed pseudonymised secondary use",710,608,450,28,13,C.muted);
 note(s,["Architecture documentation: https://github.com/patha325/medjournal/blob/main/docs/architecture.md","HL7 Sweden base profiles: https://hl7.se/fhir/ig/base/"]);
}

// 7 — data model
{
 const s=base("The data model preserves clinical truth and correction history","Stable records reference immutable versions. Audit events remain outside the editable clinical store.");
 const nodes=[
  ["Patient",75,160,210,100,C.navy],["Encounter",365,160,210,100,C.teal],["ClinicalEntry",655,160,230,100,C.teal],["EntryVersion",975,160,230,100,C.navy],
  ["Practitioner",75,400,210,100,C.paper],["CareUnit",365,400,210,100,C.paper],["ConsentBlock",655,400,230,100,C.paper],["AuditEvent",975,400,230,100,"#FFF2E9"]
 ];
 const line=(x,y,w,h)=>s.shapes.add({geometry:"line",position:{left:x,top:y,width:w,height:h},fill:"none",line:{fill:C.line,width:3}});
 line(285,210,80,0);line(575,210,80,0);line(885,210,90,0);line(180,260,0,140);line(470,260,0,140);line(770,260,0,140);line(1090,260,0,140);
 nodes.forEach(n=>{box(s,n[1],n[2],n[3],n[4],n[5],10,n[5]===C.paper?C.line:n[5]);const light=n[5]===C.navy||n[5]===C.teal;text(s,n[0],n[1]+15,n[2]+12,n[3]-30,28,17,light?"#FFFFFF":C.ink,true);text(s,n[0]==="EntryVersion"?"payload · signature · hash · supersedes":n[0]==="AuditEvent"?"actor · purpose · action · decision":"UUID identity · status · provenance",n[1]+15,n[2]+48,n[3]-30,35,11,light?C.mint:C.muted)});
 pill(s,"1 : N",300,195,50,C.aqua,C.teal);pill(s,"1 : N",590,195,50,C.aqua,C.teal);pill(s,"1 : N",902,195,50,C.aqua,C.teal);
 box(s,70,566,1140,60,C.paper,10,C.line);text(s,"FHIR boundary",90,579,150,30,15,C.teal,true);text(s,"Patient · Encounter · Composition · Observation · Condition · AllergyIntolerance · MedicationRequest · Consent · Provenance · AuditEvent",250,578,920,32,13,C.ink);
 note(s,["Data-model documentation: https://github.com/patha325/medjournal/blob/main/docs/data-model.md","HL7 Sweden base Patient profile: https://hl7.se/fhir/ig/base/1.0.0/StructureDefinition-SEBasePatient.html"]);
}

// 8 — implementation
{
 const s=base("A clinical pilot should advance through evidence gates","No phase proceeds because a calendar says so.");
 const phases=[
  ["1","Discover","Select two care workflows. Establish baseline time, error patterns and safety hazards.","Gate: shared workflow and hazard model"],
  ["2","Prototype","Run realistic simulations with clinicians and patients. Measure usability and accessibility.","Gate: agreed safety and usability thresholds"],
  ["3","Integrate","Connect identity, terminology and one source system through versioned contracts.","Gate: security and recovery verification"],
  ["4","Shadow","Operate with synthetic and replayed data. Compare outputs without directing care.","Gate: reconciled clinical results"],
  ["5","Pilot","One willing unit, narrow scope, on-site support and immediate rollback.","Gate: independent go, hold or stop decision"]
 ];
 phases.forEach((p0,i)=>{const x=45+i*247;box(s,x,154,225,430,i===4?"#E0F1EF":C.paper,14,i===4?C.teal:C.line);box(s,x+18,174,46,46,C.teal,23,C.teal);text(s,p0[0],x+18,174,46,46,17,"#FFFFFF",true,"center");text(s,p0[1],x+18,238,185,31,20,C.ink,true);text(s,p0[2],x+18,288,185,150,14,C.muted);box(s,x+18,468,189,83,"#F5F9F8",8,C.line);text(s,p0[3],x+30,478,165,61,12,C.teal,true)});
 text(s,"Clinical safety, information security and operational readiness have independent stop authority.",68,610,1125,30,15,C.orange,true,"center");
 note(s,["Socialstyrelsen journal guidance: https://www.socialstyrelsen.se/publikationer/journalforing-och-behandling-av-personuppgifter-inom-halso--och-sjukvarden-2017-3-2/","IMY access-control guidance: https://www.imy.se/verksamhet/dataskydd/dataskydd-pa-olika-omraden/vard/informationssakerhet--for-vardgivare/kontroll-av-atkomst-till-uppgifter---for-vardgivare/"]);
}

// 9 — close
{
 const s=p.slides.add();s.background.fill=C.navy;text(s,"The next decision is small and testable",70,72,1000,58,38,"#FFFFFF",true);text(s,"Fund a 12-week discovery and prototype for two clinical workflows.",70,145,940,55,23,C.mint,true);
 const items=[["Scope","One primary-care workflow and one medication workflow"],["Evidence","Task time, safety hazards, accessibility and integration contracts"],["Team","Clinicians, patients, safety, engineering and operations"],["Output","Tested prototype, hazard log, target architecture and pilot decision"]];
 items.forEach((it,i)=>{const y=245+i*78;text(s,it[0].toUpperCase(),72,y,150,28,12,C.gold,true);text(s,it[1],230,y-2,850,35,18,"#FFFFFF",i===3)});
 box(s,70,585,1140,60,C.teal,12,C.teal);text(s,"Success means evidence for a safe pilot. A decision to stop is also a valid result.",92,596,1095,38,18,"#FFFFFF",true,"center");
 text(s,"github.com/patha325/medjournal",70,665,500,22,12,"#C6DADB");
 note(s,["Repository: https://github.com/patha325/medjournal","POC: https://vardflode-journal-poc.patha325.chatgpt.site"]);
}

const stagingDir=path.join(workspaceDir,".codex-finalizer");await fs.mkdir(stagingDir,{recursive:true});
const candidatePath=path.join(stagingDir,"candidate.pptx");await (await PresentationFile.exportPptx(p)).save(candidatePath);
const result=await finalizePresentation({explicitTotalSlideCount:9,requiredNativeTableOwnerSlides:[],requiredNativeChartOwnerSlides:[],workspaceDir,candidatePath,finalPath:FINAL_PPTX,pythonExecutable:RUNTIME_PYTHON,integrityValidatorPath:path.join(SKILL_DIR,"container_tools/inspect_presentation_package_integrity.py"),layoutValidatorPath:path.join(SKILL_DIR,"container_tools/inspect_presentation_layout_geometry.py"),layoutArgs:["--expected-slide-size-emu","12192000,6858000","--validate-heading-fit"],fontPolicy:{basis:"design",families:[font]},verifyArtifactToolImport:true,receiptPath:path.join(stagingDir,`${path.basename(FINAL_PPTX)}.validation.json`)});
console.log(JSON.stringify(result));
