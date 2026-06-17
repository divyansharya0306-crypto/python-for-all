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
  return ["All", ...new Set(state.programs.map(program => program.category))];
}

function renderCategories() {
  elements.categoryGrid.innerHTML = categories().map(category => {
    const count = category === "All" ? state.programs.length : state.programs.filter(program => program.category === category).length;
    return `
      <button class="category-card ${category === state.activeCategory ? "active" : ""}" data-category="${category}">
        <span>${category}</span>
        <strong>${count}</strong>
      </button>
    `;
  }).join("");
}

function matchesSearch(program, query) {
  const haystack = `${program.title} ${program.file} ${program.category}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function renderPrograms() {
  const query = elements.searchInput.value.trim();
  const filtered = state.programs.filter(program => {
    const inCategory = state.activeCategory === "All" || program.category === state.activeCategory;
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
    elements.outputBox.textContent = program.run(rawInput || undefined, codeValue());
    setSolvedCount(Number(localStorage.getItem(solvedKey) || 0) + 1);
  } catch (error) {
    elements.outputBox.textContent = `Runtime Error:\n${error.message}`;
  } finally {
    window.prompt = originalPrompt;
  }
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
