/* =========================================================
   CALC-01 Calculator
   Concepts used: variables, strings and numbers, functions,
   switch, if/else, parseFloat, event delegation (dataset),
   keyboard events, arrays, localStorage
   ========================================================= */

// ===== 1. Select DOM elements =====
const expressionEl = document.querySelector("#expression");
const resultEl = document.querySelector("#result");
const keypad = document.querySelector("#keypad");
const historyList = document.querySelector("#historyList");
const clearHistoryBtn = document.querySelector("#clearHistory");
const themeBtn = document.querySelector("#themeBtn");

// ===== 2. Data =====
// Symbols shown on screen for each operator
const SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷" };
const MAX_LENGTH = 12; // longest number the user can type

// The calculator "remembers" everything in one object
let state = createFreshState();
let history = loadHistory(); // array of { expression, result }

function createFreshState() {
  return {
    current: "0",     // number on the screen (kept as a string)
    previous: "",     // first number, waiting for the second one
    operator: null,   // "+", "-", "*" or "/"
    overwrite: false, // true = next digit starts a new number
    error: false,     // true after dividing by zero
  };
}

// ===== 3. Input functions =====
function appendDigit(digit) {
  if (state.error) clearAll();

  if (state.overwrite) {
    state.current = digit;
    state.overwrite = false;
  } else if (state.current === "0") {
    state.current = digit; // replace the starting zero
  } else if (state.current.length < MAX_LENGTH) {
    state.current += digit;
  }
}

function appendDecimal() {
  if (state.error) clearAll();

  if (state.overwrite) {
    state.current = "0.";
    state.overwrite = false;
  } else if (!state.current.includes(".")) {
    state.current += ".";
  }
}

function chooseOperator(operator) {
  if (state.error) return;

  // Chain calculations: 2 + 3 + ... calculates 2 + 3 first
  if (state.operator && !state.overwrite) {
    const result = calculate();
    if (result === null) return showError();
    state.current = result;
  }

  state.previous = state.current;
  state.operator = operator;
  state.overwrite = true;
}

function toggleSign() {
  if (state.error || state.current === "0") return;
  state.current = state.current.startsWith("-")
    ? state.current.slice(1)
    : "-" + state.current;
}

function percent() {
  if (state.error) return;
  state.current = String(Number((parseFloat(state.current) / 100).toFixed(10)));
  state.overwrite = true;
}

function deleteLast() {
  if (state.error) return clearAll();
  if (state.overwrite) return;

  state.current = state.current.slice(0, -1);
  if (state.current === "" || state.current === "-") state.current = "0";
}

function clearAll() {
  state = createFreshState();
}

// ===== 4. The math =====
// Returns the result as a string, or null when dividing by zero
function calculate() {
  const a = parseFloat(state.previous);
  const b = parseFloat(state.current);
  let result;

  switch (state.operator) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "*":
      result = a * b;
      break;
    case "/":
      if (b === 0) return null;
      result = a / b;
      break;
  }

  // toFixed fixes problems like 0.1 + 0.2 = 0.30000000000000004
  return String(Number(result.toFixed(10)));
}

function showError() {
  state = createFreshState();
  state.current = "Error";
  state.error = true;
}

function equals() {
  // Do nothing if there is no operator or no second number yet
  if (!state.operator || state.overwrite || state.error) return;

  const expression = `${state.previous} ${SYMBOLS[state.operator]} ${state.current}`;
  const result = calculate();
  if (result === null) return showError();

  addToHistory(expression, result);
  state.current = result;
  state.previous = "";
  state.operator = null;
  state.overwrite = true;
}

// ===== 5. Update the page =====
function updateDisplay() {
  resultEl.textContent = state.current;
  resultEl.classList.toggle("small", state.current.length > 9);

  expressionEl.textContent = state.operator
    ? `${state.previous} ${SYMBOLS[state.operator]}`
    : "";
}

// ===== 6. History (saved in localStorage) =====
function addToHistory(expression, result) {
  history.unshift({ expression, result }); // newest first
  history = history.slice(0, 8);           // keep only 8 items
  localStorage.setItem("calcHistory", JSON.stringify(history));
  renderHistory();
}

function loadHistory() {
  const saved = localStorage.getItem("calcHistory");
  return saved ? JSON.parse(saved) : [];
}

function renderHistory() {
  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = `<li class="empty">No calculations yet.</li>`;
    return;
  }

  history.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button class="tape-item" data-result="${item.result}">
        <span>${item.expression} =</span>
        <strong>${item.result}</strong>
      </button>`;
    historyList.appendChild(li);
  });
}

// ===== 7. Events =====

// One listener for the whole keypad (event delegation)
keypad.addEventListener("click", (event) => {
  const button = event.target.closest(".key");
  if (!button) return;

  const action = button.dataset.action;
  const value = button.dataset.value;

  switch (action) {
    case "digit":    appendDigit(value);     break;
    case "decimal":  appendDecimal();        break;
    case "operator": chooseOperator(value);  break;
    case "equals":   equals();               break;
    case "clear":    clearAll();             break;
    case "delete":   deleteLast();           break;
    case "sign":     toggleSign();           break;
    case "percent":  percent();              break;
  }
  updateDisplay();
});

// Click a history item to reuse its result
historyList.addEventListener("click", (event) => {
  const item = event.target.closest(".tape-item");
  if (!item) return;
  state = createFreshState();
  state.current = item.dataset.result;
  state.overwrite = true;
  updateDisplay();
});

clearHistoryBtn.addEventListener("click", () => {
  history = [];
  localStorage.removeItem("calcHistory");
  renderHistory();
});

// Keyboard support: find the matching button and click it
document.addEventListener("keydown", (event) => {
  const key = event.key;
  let selector = null;

  if (/^[0-9]$/.test(key)) selector = `[data-value="${key}"]`;
  else if ("+-*/".includes(key)) selector = `[data-value="${key}"]`;
  else if (key === "." || key === ",") selector = `[data-action="decimal"]`;
  else if (key === "Enter" || key === "=") selector = `[data-action="equals"]`;
  else if (key === "Backspace") selector = `[data-action="delete"]`;
  else if (key === "Escape") selector = `[data-action="clear"]`;
  else if (key === "%") selector = `[data-action="percent"]`;

  if (!selector) return;

  event.preventDefault(); // stops "/" quick-find and double Enter clicks
  const button = keypad.querySelector(selector);
  button.classList.add("pressed");
  setTimeout(() => button.classList.remove("pressed"), 100);
  button.click();
});

// Theme switch (saved in localStorage)
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  localStorage.setItem("calcTheme", theme);
}

themeBtn.addEventListener("click", () => {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
});

// ===== 8. Start the app =====
const savedTheme = localStorage.getItem("calcTheme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

renderHistory();
updateDisplay();
