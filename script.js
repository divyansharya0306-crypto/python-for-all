const PASSWORD = "python123";
const storageKey = "python-vault-pro-custom-programs";
const deletedKey = "python-vault-pro-deleted-programs";
const solvedKey = "python-vault-pro-solved-count";

const state = {
  programs: [],
  currentProgram: null,
  editor: null,
  monacoReady: false,
  activeCategory: "All"
};

const $ = selector => document.querySelector(selector);

const elements = {
  loginView: $("#loginView"),
  vaultView: $("#vaultView"),
  loginForm: $("#loginForm"),
  loginError: $("#loginError"),
  passwordInput: $("#passwordInput"),
  searchInput: $("#searchInput"),
  categoryGrid: $("#categoryGrid"),
  programList: $("#programList"),
  programTotal: $("#programTotal"),
  homeScreen: $("#homeScreen"),
  editorScreen: $("#editorScreen"),
  programTitle: $("#programTitle"),
  programCategory: $("#programCategory"),
  editorNode: $("#editor"),
  fallbackEditor: $("#fallbackEditor"),
  runtimeInput: $("#runtimeInput"),
  outputBox: $("#outputBox"),
  graphBox: $("#graphBox"),
  solvedCount: $("#solvedCount"),
  sidebar: $("#sidebar"),
  addDialog: $("#addDialog"),
  addProgramForm: $("#addProgramForm")
};

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function customPrograms() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function deletedPrograms() {
  try {
    return JSON.parse(localStorage.getItem(deletedKey)) || [];
  } catch {
    return [];
  }
}

function saveCustomPrograms(programs) {
  localStorage.setItem(storageKey, JSON.stringify(programs));
}

function saveDeletedPrograms(programIds) {
  localStorage.setItem(deletedKey, JSON.stringify(programIds));
}

function hydratePrograms() {
  const deleted = new Set(deletedPrograms());
  const saved = customPrograms().map(program => ({
    ...program,
    icon: program.icon || "file-code-2",
    custom: true,
    run(input, code) {
      return runUserPython(code || program.code, input);
    }
  }));
  state.programs = [...builtInPrograms.filter(program => !deleted.has(program.id)), ...saved.filter(program => !deleted.has(program.id))];
}

function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

function setSolvedCount(value = Number(localStorage.getItem(solvedKey) || 0)) {
  localStorage.setItem(solvedKey, String(value));
  elements.solvedCount.textContent = value;
}

function categories() {
  const names = new Set(state.programs.map(program => program.category));
  state.programs.forEach(program => (program.collections || []).forEach(collection => names.add(collection)));
  return ["All", ...names];
}

function renderCategories() {
  elements.categoryGrid.innerHTML = categories().map(category => {
    const count = category === "All" ? state.programs.length : state.programs.filter(program => program.category === category || (program.collections || []).includes(category)).length;
    return `
      <button class="category-card ${category === state.activeCategory ? "active" : ""}" data-category="${category}">
        <span>${category}</span>
        <strong>${count}</strong>
      </button>
    `;
  }).join("");
}

function matchesSearch(program, query) {
  const haystack = `${program.title} ${program.file} ${program.category} ${(program.collections || []).join(" ")}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function renderPrograms() {
  const query = elements.searchInput.value.trim();
  const filtered = state.programs.filter(program => {
    const inCategory = state.activeCategory === "All" || program.category === state.activeCategory || (program.collections || []).includes(state.activeCategory);
    return inCategory && matchesSearch(program, query);
  });

  elements.programTotal.textContent = `${filtered.length} program${filtered.length === 1 ? "" : "s"}`;
  elements.programList.innerHTML = filtered.length ? filtered.map(program => `
    <button class="program-card" data-id="${program.id}">
      <span class="program-icon"><i data-lucide="${program.icon || "file-code-2"}"></i></span>
      <span>
        <strong>${program.title}</strong>
        <small>${program.category} / ${program.file}</small>
      </span>
      <i data-lucide="chevron-right"></i>
    </button>
  `).join("") : `
    <div class="empty-state">
      <i data-lucide="search-x"></i>
      <strong>No programs found</strong>
      <span>Try a shorter search like "pri" or switch category.</span>
    </div>
  `;
  initIcons();
}

function codeValue() {
  if (state.editor) return state.editor.getValue();
  return elements.fallbackEditor.value;
}

function setCodeValue(code) {
  if (state.editor) state.editor.setValue(code);
  elements.fallbackEditor.value = code;
}

function openProgram(id) {
  const program = state.programs.find(item => item.id === id);
  if (!program) return;
  state.currentProgram = program;
  elements.programTitle.textContent = program.file;
  elements.programCategory.textContent = program.category;
  elements.outputBox.textContent = "Press Run to execute this program.";
  elements.outputBox.classList.remove("is-hidden");
  elements.graphBox.classList.add("is-hidden");
  elements.runtimeInput.value = "";
  elements.runtimeInput.placeholder = program.category === "Patterns" ? "Rows, e.g. 5" : program.category === "Strings" ? "Text, e.g. madam" : "Program input, e.g. 13";
  setCodeValue(program.code);
  elements.homeScreen.classList.add("is-hidden");
  elements.editorScreen.classList.remove("is-hidden");
  elements.sidebar.classList.remove("open");
  setTimeout(() => state.editor?.layout(), 80);
}

function goHome() {
  elements.editorScreen.classList.add("is-hidden");
  elements.homeScreen.classList.remove("is-hidden");
  state.currentProgram = null;
}

function copyCode() {
  const code = codeValue();
  navigator.clipboard?.writeText(code);
  toast("Code copied");
}

function downloadCode() {
  const program = state.currentProgram;
  if (!program) return;
  const blob = new Blob([codeValue()], { type: "text/x-python" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = program.file;
  link.click();
  URL.revokeObjectURL(link.href);
}

function splitInputs(input) {
  return String(input || "")
    .split(/[,\n]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function normalizePythonExpression(expression) {
  return expression
    .replace(/\bTrue\b/g, "true")
    .replace(/\bFalse\b/g, "false")
    .replace(/\band\b/g, "&&")
    .replace(/\bor\b/g, "||")
    .replace(/\bnot\b/g, "!")
    .replace(/([^=!<>])=([^=])/g, "$1==$2");
}

function evaluateExpression(expression, variables) {
  const names = Object.keys(variables);
  const values = Object.values(variables);
  const jsExpression = normalizePythonExpression(expression);
  return Function(...names, `"use strict"; return (${jsExpression});`)(...values);
}

function runUserPython(code, input) {
  const lines = code.split(/\r?\n/);
  const inputs = splitInputs(input);
  const variables = {};
  const output = [];
  let inputIndex = 0;
  const blocks = [];

  const active = () => blocks.every(block => block.active);
  const indentOf = line => line.match(/^\s*/)[0].length;

  for (const rawLine of lines) {
    const indent = indentOf(rawLine);
    const line = rawLine.trim();
    if (!line || line.startsWith("#") || line.startsWith("def ")) continue;

    if (line.startsWith("elif ") && line.endsWith(":")) {
      while (blocks.length && blocks[blocks.length - 1].indent > indent) blocks.pop();
      const current = blocks[blocks.length - 1];
      if (current?.type === "if" && current.indent === indent) {
        const condition = line.slice(5, -1);
        const canRun = current.parentActive && !current.branchTaken && Boolean(evaluateExpression(condition, variables));
        current.active = canRun;
        current.branchTaken = current.branchTaken || canRun;
      }
      continue;
    }

    if (line === "else:") {
      while (blocks.length && blocks[blocks.length - 1].indent > indent) blocks.pop();
      const current = blocks[blocks.length - 1];
      if (current?.type === "if" && current.indent === indent) {
        const canRun = current.parentActive && !current.branchTaken;
        current.active = canRun;
        current.branchTaken = true;
      }
      continue;
    }

    while (blocks.length && blocks[blocks.length - 1].indent >= indent) blocks.pop();

    if (line.startsWith("if ") && line.endsWith(":")) {
      const parentActive = active();
      const condition = parentActive && Boolean(evaluateExpression(line.slice(3, -1), variables));
      blocks.push({ type: "if", indent, active: condition, branchTaken: condition, parentActive });
      continue;
    }

    if (!active()) continue;

    const printMatch = line.match(/^print\((.*)\)$/);
    if (printMatch) {
      const parts = printMatch[1].split(",").map(part => part.trim()).filter(Boolean);
      const values = parts.map(part => {
        if ((part.startsWith('"') && part.endsWith('"')) || (part.startsWith("'") && part.endsWith("'"))) return part.slice(1, -1);
        return evaluateExpression(part, variables);
      });
      output.push(values.join(" "));
      continue;
    }

    const inputMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(int|float|str)?\(?input\((.*)\)\)?$/);
    if (inputMatch) {
      const name = inputMatch[1];
      const type = inputMatch[2] || "str";
      const value = inputs[inputIndex++] ?? "0";
      variables[name] = type === "int" ? parseInt(value, 10) : type === "float" ? parseFloat(value) : value;
      continue;
    }

    const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
    if (assignMatch) {
      variables[assignMatch[1]] = evaluateExpression(assignMatch[2], variables);
    }
  }

  if (!output.length) {
    return "Program ran. No print output was produced.";
  }
  return output.join("\n");
}

function deleteCurrentProgram() {
  const program = state.currentProgram;
  if (!program) return;
  const ok = confirm(`Delete ${program.title}?`);
  if (!ok) return;

  if (program.custom) {
    saveCustomPrograms(customPrograms().filter(item => item.id !== program.id));
  } else {
    saveDeletedPrograms([...new Set([...deletedPrograms(), program.id])]);
  }

  hydratePrograms();
  if (!categories().includes(state.activeCategory)) state.activeCategory = "All";
  renderCategories();
  renderPrograms();
  goHome();
  toast("Program deleted");
}

function runCurrentProgram() {
  const program = state.currentProgram;
  if (!program) return;
  const rawInput = elements.runtimeInput.value.trim();
  const originalPrompt = window.prompt;
  window.prompt = (_message, fallback = "") => rawInput || fallback;
  try {
    if (program.visualization && !program.custom) {
      if (program.category === "Computer Vision") renderComputerVision(program.id);
      else renderBuiltInGraph(program.id);
      elements.outputBox.classList.add("is-hidden");
      document.querySelector(".split-pane").classList.add("has-visualization");
    } else {
      elements.graphBox.classList.add("is-hidden");
      elements.outputBox.classList.remove("is-hidden");
      document.querySelector(".split-pane").classList.remove("has-visualization");
      elements.outputBox.textContent = program.run(rawInput || undefined, codeValue());
    }
    setSolvedCount(Number(localStorage.getItem(solvedKey) || 0) + 1);
  } catch (error) {
    elements.outputBox.textContent = `Runtime Error:\n${error.message}`;
  } finally {
    window.prompt = originalPrompt;
  }
}

function renderBuiltInGraph(id) {
  const host = elements.graphBox;
  if (id === "subplot-grid") {
    const panels = Array.from({length:16}, (_,i) => {
      const col=i%4, row=Math.floor(i/4), x=10+col*180, y=28+row*130;
      return `<g transform="translate(${x},${y})"><rect width="164" height="104" rx="7" fill="#151b30" stroke="#38415e"/><text x="82" y="17" text-anchor="middle" fill="#dbe6ff" font-size="11">Chart ${i+1}</text><path d="M22 78 L54 51 L86 64 L132 36" fill="none" stroke="#7dd3fc" stroke-width="2.5"/><line x1="22" y1="24" x2="22" y2="82" stroke="#8995b5"/><line x1="22" y1="82" x2="146" y2="82" stroke="#8995b5"/></g>`;
    }).join("");
    host.innerHTML = `<svg viewBox="0 0 730 555" role="img" aria-label="Sixteen charts in a four by four grid" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:Inter,system-ui,sans-serif;fill:#dbe6ff}</style>${panels}</svg>`;
    host.classList.remove("is-hidden");
    return;
  }
  const W = 640, H = 360, left = 58, right = 22, top = 42, bottom = 58;
  const plotW = W - left - right, plotH = H - top - bottom;
  const svgStart = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${id.replaceAll("-", " ")} chart" xmlns="http://www.w3.org/2000/svg"><style>text{font-family:Inter,system-ui,sans-serif;fill:#dbe6ff}.grid{stroke:#38415e;stroke-width:1}.axis{stroke:#8995b5;stroke-width:1.3}.line{fill:none;stroke:#7dd3fc;stroke-width:3}.point{fill:#f0abfc}.bar{fill:#7dd3fc}.bar2{fill:#f0abfc}.whisker{stroke:#7dd3fc;stroke-width:2}.box{fill:#7dd3fc;fill-opacity:.45;stroke:#7dd3fc;stroke-width:2}</style>`;
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&apos;"}[ch]));
  const yGrid = max => Array.from({length: 5}, (_, i) => {
    const value = max * i / 4, y = top + plotH - plotH * i / 4;
    return `<line class="grid" x1="${left}" y1="${y}" x2="${W-right}" y2="${y}"/><text x="${left-10}" y="${y+4}" text-anchor="end" font-size="11">${Math.round(value)}</text>`;
  }).join("");
  const axes = `<line class="axis" x1="${left}" y1="${top}" x2="${left}" y2="${top+plotH}"/><line class="axis" x1="${left}" y1="${top+plotH}" x2="${W-right}" y2="${top+plotH}"/>`;
  const labels = (items, xAt) => items.map((label,i)=>`<text x="${xAt(i)}" y="${H-26}" text-anchor="middle" font-size="11">${esc(label)}</text>`).join("");
  let title = "", body = "";
  if (["box-plot","clothes-sales-boxplot"].includes(id)) {
    title = id === "box-plot" ? "My Data and Bottom Data" : "Clothes Store Sales";
    const sets = id === "box-plot" ? [[2,6,8,10,12,14,16,18],[3,6,9,12,15,18,21,24]] : [[1500,3500,6500,6700,6000,6800],[5400,5500,6500,7000,6600,7300],[7500,6000,6800,7300,7200,5500]];
    const names = id === "box-plot" ? ["My Data","Bottom Data"] : ["Jeans","T-Shirts","Shirts"];
    const max = id === "box-plot" ? 30 : 8000;
    body = yGrid(max) + axes + sets.map((arr,i)=>{
      const sorted=[...arr].sort((a,b)=>a-b), quantile=p=>{const position=(sorted.length-1)*p,low=Math.floor(position),high=Math.ceil(position);return sorted[low]+(sorted[high]-sorted[low])*(position-low);}, q1=quantile(.25), med=quantile(.5), q3=quantile(.75), cx=left+plotW*(i+.5)/sets.length, bw=Math.min(92,plotW/sets.length*.48);
      const yy=v=>top+plotH-plotH*v/max;
      return `<line class="whisker" x1="${cx}" y1="${yy(sorted[0])}" x2="${cx}" y2="${yy(q1)}"/><line class="whisker" x1="${cx}" y1="${yy(q3)}" x2="${cx}" y2="${yy(sorted.at(-1))}"/><line class="whisker" x1="${cx-bw/3}" y1="${yy(sorted[0])}" x2="${cx+bw/3}" y2="${yy(sorted[0])}"/><line class="whisker" x1="${cx-bw/3}" y1="${yy(sorted.at(-1))}" x2="${cx+bw/3}" y2="${yy(sorted.at(-1))}"/><rect class="box" x="${cx-bw/2}" y="${yy(q3)}" width="${bw}" height="${yy(q1)-yy(q3)}"/><line class="whisker" x1="${cx-bw/2}" y1="${yy(med)}" x2="${cx+bw/2}" y2="${yy(med)}"/><text x="${cx}" y="${H-26}" text-anchor="middle" font-size="12">${names[i]}</text>`;
    }).join("");
  } else if (id === "student-performance-bar-chart") {
    title="Student Performance in 4 Subjects";
    const students=["Divyansh","Ritika","Vihan","Ridhaan","Sparsh"], sets=[[85,99,95,89,90],[90,97,96,93,93],[78,99,95,91,85],[92,98,88,90,98]], colors=["bar","bar2","bar","bar2"], legend=["Maths","Science","English","History"];
    body=yGrid(100)+axes+sets.map((values,s)=>values.map((v,i)=>{const group=plotW/students.length, bw=group*.15, x=left+group*(i+.5)+(s-1.5)*bw; return `<rect class="${colors[s]}" opacity="${s<2?1:.72}" x="${x}" y="${top+plotH-plotH*v/100}" width="${bw}" height="${plotH*v/100}"/>`;}).join("")).join("")+labels(students,i=>left+plotW*(i+.5)/students.length)+legend.map((n,i)=>`<rect x="${left+i*135}" y="${H-8}" width="10" height="10" class="${colors[i]}"/><text x="${left+15+i*135}" y="${H}" font-size="10">${n}</text>`).join("");
  } else if (id === "player-rating-chart" || id === "player-analysis-four-charts") {
    const names=["sachin","virat","ricky","joe"], series=id === "player-rating-chart" ? [[95,92,88,84]] : [[250,300,200,220],[18426,15921,9005,8500],[44.5,50.2,45,42.5],[95,92,88,84]];
    title=id === "player-rating-chart" ? "Player Ratings" : "Player Statistics Overview";
    const maxes=id === "player-rating-chart" ? [100] : [350,20000,60,100];
    body=series.map((values,si)=>{
      const y0=top+si*(plotH/series.length), h=plotH/series.length-8, max=maxes[si], base=y0+h;
      const bars=values.map((v,i)=>{const bw=plotW/values.length*.55,x=left+plotW*(i+.5)/values.length-bw/2,bh=(h-18)*v/max;return `<rect class="${i%2?"bar2":"bar"}" x="${x}" y="${base-bh}" width="${bw}" height="${bh}"/><text x="${x+bw/2}" y="${base+14}" text-anchor="middle" font-size="10">${names[i]}</text>`;}).join("");
      return `<line class="grid" x1="${left}" y1="${base}" x2="${W-right}" y2="${base}"/>${bars}${id === "player-analysis-four-charts"?`<text x="${left}" y="${y0+12}" font-size="11">${["Matches","Runs","Average","Rating"][si]}</text>`:""}`;
    }).join("")+ (id === "player-rating-chart" ? yGrid(100)+axes : "");
  } else if (id === "sales-line-chart") {
    title="Sales Stats";
    const xs=["Jan","Feb","Mar","Apr","May","Jun"], ys=[3500,3100,2700,4500,4000,4800], max=6000;
    const coords=ys.map((v,i)=>[left+plotW*i/(ys.length-1),top+plotH-plotH*v/max]);
    body=yGrid(max)+axes+`<polyline class="line" style="stroke:#f87171;stroke-dasharray:8 5" points="${coords.map(p=>p.join(",")).join(" ")}"/>`+coords.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" class="point"/>`).join("")+labels(xs,i=>coords[i][0]);
  } else if (id === "student-marks-histogram") {
    title="Histogram of Student Marks";
    const values=[45,67,89,34,56,78,90,23,65,88,72,49,58,91,36,60,75,82,40,95], edges=[0,20,40,60,80,100], counts=edges.slice(0,-1).map((lo,i)=>values.filter(v=>v>=lo&&v<edges[i+1]).length), max=8;
    body=yGrid(max)+axes+counts.map((v,i)=>{const bw=plotW/counts.length*.82,x=left+plotW*i/counts.length+plotW/counts.length*.09,bh=plotH*v/max;return `<rect class="bar" x="${x}" y="${top+plotH-bh}" width="${bw}" height="${bh}"/><text x="${x+bw/2}" y="${H-26}" text-anchor="middle" font-size="11">${edges[i]}–${edges[i+1]}</text>`;}).join("");
  } else {
    const marker=id==="marker-line-graph", xs=marker?["arya","kotecha","jain","paliwal"]:["Jan","Feb","March","April","May","June","July"], ys=marker?[12,14,20,11]:[20,150,189,210,240,200,250], max=marker?25:300;
    title=marker?"Line Graph with Markers":"Monthly Data";
    const coords=ys.map((v,i)=>[left+plotW*i/(ys.length-1),top+plotH-plotH*v/max]);
    body=yGrid(max)+axes+`<polyline class="line" ${marker?'style="stroke:#86efac"':''} points="${coords.map(p=>p.join(",")).join(" ")}"/>`+coords.map(([x,y])=>`<circle cx="${x}" cy="${y}" r="5" class="point"/>`).join("")+labels(xs,i=>coords[i][0]);
  }
  const playerTable = id === "player-rating-chart" ? `<table class="chart-data-table"><thead><tr><th>Player</th><th>Team</th><th>Matches</th><th>Runs</th><th>Average</th></tr></thead><tbody><tr><td>Sachin</td><td>India</td><td>250</td><td>18,426</td><td>44.5</td></tr><tr><td>Virat</td><td>India</td><td>300</td><td>15,921</td><td>50.2</td></tr><tr><td>Ricky</td><td>Australia</td><td>200</td><td>9,005</td><td>45.0</td></tr><tr><td>Joe</td><td>England</td><td>220</td><td>8,500</td><td>42.5</td></tr></tbody></table>` : "";
  host.innerHTML=`${svgStart}<text x="${W/2}" y="24" text-anchor="middle" font-size="16" font-weight="700">${title}</text>${body}</svg>${playerTable}`;
  host.classList.remove("is-hidden");
}

function renderComputerVision(id) {
  const host=elements.graphBox, src="images/rj.jpg.jpg";
  if(id==="create-color-image") {
    host.innerHTML='<div class="cv-visual"><h3>Random Color Image (800 × 400)</h3><canvas id="randomImageCanvas" width="800" height="400" aria-label="Generated random color image"></canvas><p>Each pixel is assigned a random blue, green, and red value.</p></div>';
    const canvas=$("#randomImageCanvas"), ctx=canvas.getContext("2d"), image=ctx.createImageData(80,40);
    for(let i=0;i<image.data.length;i+=4){image.data[i]=Math.random()*256;image.data[i+1]=Math.random()*256;image.data[i+2]=Math.random()*256;image.data[i+3]=255;}
    const small=document.createElement("canvas");small.width=80;small.height=40;small.getContext("2d").putImageData(image,0,0);ctx.imageSmoothingEnabled=false;ctx.drawImage(small,0,0,800,400);
  } else if(id==="crop-image") {
    const crops=[["Top part",0,0],["Middle part",-150,-100],["Bottom part",-200,-250]];
    host.innerHTML=`<div class="cv-visual"><h3>Original Image and Cropped Regions</h3><img class="cv-original" src="${src}" alt="Original vintage car image"><div class="crop-grid">${crops.map(([name,x,y])=>`<figure><div class="crop-window"><img src="${src}" alt="${name} crop" style="left:${x}px;top:${y}px"></div><figcaption>${name}</figcaption></figure>`).join("")}</div></div>`;
  } else if(id==="image-window-modes") {
    host.innerHTML=`<div class="cv-visual"><h3>Same Image in Two Window Modes</h3><div class="crop-grid"><figure><img class="cv-window-auto" src="${src}" alt="Auto-sized image window"><figcaption>Auto-sized window</figcaption></figure><figure><img class="cv-window-resizable" src="${src}" alt="Resizable image window"><figcaption>Resizable 500 × 500 window</figcaption></figure></div></div>`;
  } else {
    host.innerHTML=`<div class="cv-visual"><h3>Image Pixel Matrix (B, G, R)</h3><img class="cv-original" id="matrixSourceImage" src="${src}" alt="Image used to generate the pixel matrix"><p id="matrixDetails">Loading image pixel values…</p><pre id="matrixPreview" class="matrix-preview"></pre></div>`;
    const image=$("#matrixSourceImage"); image.addEventListener("load",()=>{const c=document.createElement("canvas"),w=12,h=6;c.width=w;c.height=h;const cx=c.getContext("2d");cx.drawImage(image,0,0,w,h);const px=cx.getImageData(0,0,w,h).data,rows=[];for(let y=0;y<h;y++){const row=[];for(let x=0;x<w;x++){const i=(y*w+x)*4;row.push([px[i+2],px[i+1],px[i]]);}rows.push(row);}$("#matrixDetails").textContent=`Image dimensions: ${image.naturalWidth} × ${image.naturalHeight} pixels. Showing a 6 × 12 BGR sample.`;$("#matrixPreview").textContent=rows.map(row=>row.map(p=>`[${p.join(",")}]`).join(" ")).join("\n");});
  }
  host.classList.remove("is-hidden");
}

function toast(message) {
  const node = document.createElement("div");
  node.className = "toast";
  node.textContent = message;
  document.body.appendChild(node);
  setTimeout(() => node.remove(), 1800);
}

function initMonaco() {
  if (!window.require) {
    elements.editorNode.classList.add("is-hidden");
    elements.fallbackEditor.classList.add("ready");
    return;
  }

  window.require.config({ paths: { vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.49.0/min/vs" } });
  window.require(["vs/editor/editor.main"], () => {
    state.monacoReady = true;
    state.editor = monaco.editor.create(elements.editorNode, {
      value: "# Select a program to begin",
      language: "python",
      theme: "vs-dark",
      fontSize: 14,
      minimap: { enabled: false },
      automaticLayout: true,
      roundedSelection: true,
      scrollBeyondLastLine: false,
      padding: { top: 18, bottom: 18 }
    });
    elements.fallbackEditor.classList.remove("ready");
  }, () => {
    elements.editorNode.classList.add("is-hidden");
    elements.fallbackEditor.classList.add("ready");
  });
}

function addProgram(event) {
  event.preventDefault();
  const title = $("#newName").value.trim();
  const category = $("#newCategory").value.trim();
  const code = $("#newCode").value.trim();
  if (!title || !category || !code) return;
  const program = {
    id: `custom-${slugify(title)}-${Date.now()}`,
    title,
    file: `${title.replace(/[^a-z0-9]+/gi, "_")}.py`,
    category,
    icon: "file-code-2",
    code
  };
  saveCustomPrograms([...customPrograms(), program]);
  hydratePrograms();
  state.activeCategory = category;
  renderCategories();
  renderPrograms();
  elements.addDialog.close();
  elements.addProgramForm.reset();
  toast("Program saved");
}

function bindEvents() {
  elements.loginForm.addEventListener("submit", event => {
    event.preventDefault();
    if (elements.passwordInput.value === PASSWORD) {
      elements.loginView.classList.add("is-hidden");
      elements.vaultView.classList.remove("is-hidden");
      elements.searchInput.focus();
      return;
    }
    elements.loginError.textContent = "Incorrect password. Try python123.";
  });

  elements.searchInput.addEventListener("input", renderPrograms);
  elements.categoryGrid.addEventListener("click", event => {
    const card = event.target.closest("[data-category]");
    if (!card) return;
    state.activeCategory = card.dataset.category;
    renderCategories();
    renderPrograms();
  });
  elements.programList.addEventListener("click", event => {
    const card = event.target.closest("[data-id]");
    if (card) openProgram(card.dataset.id);
  });
  $("#backBtn").addEventListener("click", goHome);
  $("#copyBtn").addEventListener("click", copyCode);
  $("#downloadBtn").addEventListener("click", downloadCode);
  $("#runBtn").addEventListener("click", runCurrentProgram);
  $("#deleteBtn").addEventListener("click", deleteCurrentProgram);
  $("#logoutBtn").addEventListener("click", () => {
    elements.vaultView.classList.add("is-hidden");
    elements.loginView.classList.remove("is-hidden");
    elements.passwordInput.value = "";
    goHome();
  });
  $("#themeToggle").addEventListener("click", () => document.body.classList.toggle("light-mode"));
  $("#mobileMenuBtn").addEventListener("click", () => elements.sidebar.classList.toggle("open"));
  $("#addProgramBtn").addEventListener("click", () => elements.addDialog.showModal());
  $("#closeDialogBtn").addEventListener("click", () => elements.addDialog.close());
  $("#cancelAddBtn").addEventListener("click", () => elements.addDialog.close());
  elements.addProgramForm.addEventListener("submit", addProgram);

  window.addEventListener("keydown", event => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const mod = isMac ? event.metaKey : event.ctrlKey;
    if (event.key === "/" && document.activeElement !== elements.searchInput) {
      event.preventDefault();
      elements.searchInput.focus();
    }
    if (mod && event.key.toLowerCase() === "r" && state.currentProgram) {
      event.preventDefault();
      runCurrentProgram();
    }
    if (mod && event.key.toLowerCase() === "s" && state.currentProgram) {
      event.preventDefault();
      downloadCode();
    }
  });
}

function boot() {
  hydratePrograms();
  renderCategories();
  renderPrograms();
  setSolvedCount();
  bindEvents();
  initIcons();
  initMonaco();
}

boot();
