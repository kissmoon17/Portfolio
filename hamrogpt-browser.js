(() => {
  const BOT = "HamroGPT";

  const GREETINGS = new Set(["hi", "hello", "hey", "yo", "sup"]);
  const NAME_QUERIES = new Set([
    "whats your name",
    "who are you",
    "what is your name",
    "your name",
  ]);
  const GOAT_QUERIES = new Set([
    "who is the goat",
    "who is the greatest of all time",
    "who is the best",
    "who is the greatest",
    "who da goat",
  ]);
  const FAREWELLS = new Set(["bye", "goodbye", "see you", "byee", "cya"]);
  const ADD = new Set(["+", "add", "plus"]);
  const SUB = new Set(["-", "subtract", "minus", "sub"]);
  const BMI = new Set(["calculate bmi", "bmi"]);
  const QUIT = new Set(["quit", "exit", "q"]);

  function normalize(text) {
    return String(text)
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .join(" ");
  }

  const card = document.getElementById("hamrogptCard");
  const modal = document.getElementById("hamrogptModal");
  const logEl = document.getElementById("hamrogptLog");
  const form = document.getElementById("hamrogptForm");
  const input = document.getElementById("hamrogptInput");
  const promptLabel = document.getElementById("hamrogptPromptLabel");
  const closeEls = modal ? modal.querySelectorAll("[data-modal-close]") : [];

  if (!card || !modal || !logEl || !form || !input || !promptLabel) return;

  let state = { kind: "idle", data: {} };
  let lastFocus = null;

  function setPrompt(text) {
    promptLabel.textContent = text;
  }

  function resetFlow() {
    state = { kind: "idle", data: {} };
    setPrompt("You:");
    input.placeholder = "Type a message and press Enter…";
  }

  function appendLine(who, text) {
    const row = document.createElement("div");
    row.className = "terminal-line";
    const tag = document.createElement("span");
    tag.className = who === "user" ? "terminal-user" : "terminal-bot";
    tag.textContent = who === "user" ? "You:" : `${BOT}:`;
    const msg = document.createElement("span");
    msg.className = "terminal-msg";
    msg.textContent = text;
    row.append(tag, msg);
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function openModal() {
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("modal-open");
    logEl.innerHTML = "";
    resetFlow();
    appendLine(
      "bot",
      `Hello, I am ${BOT}. How can I assist you today? (Type 'help' for commands, 'quit' to close.)`
    );
    input.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    resetFlow();
    if (lastFocus && typeof lastFocus.focus === "function") {
      lastFocus.focus();
    }
  }

  function handleIdle(text) {
    if (!text) return;
    if (QUIT.has(text)) {
      appendLine("bot", "Sheesh! Have a great day, goat!");
      closeModal();
      return;
    }
    if (text === "help" || text === "?" || text === "commands") {
      appendLine(
        "bot",
        "Try: hi, who are you, who is the goat, add / subtract, bmi, bye, quit"
      );
      return;
    }
    if (GREETINGS.has(text)) {
      appendLine("bot", "Hello gang! How can I help the goat today?");
      return;
    }
    if (NAME_QUERIES.has(text)) {
      appendLine("bot", `I am ${BOT}, your friendly neighborhood GPT!`);
      return;
    }
    if (GOAT_QUERIES.has(text)) {
      appendLine(
        "bot",
        "The greatest of all time is definitely you, my GANG! You are the GOAT!"
      );
      return;
    }
    if (FAREWELLS.has(text)) {
      appendLine("bot", "Sheesh! Have a great day goat!");
      return;
    }
    if (ADD.has(text)) {
      appendLine("bot", "Sure! Please provide two numbers to add, gang.");
      state = { kind: "add1", data: {} };
      setPrompt("First number:");
      input.placeholder = "e.g. 12.5";
      return;
    }
    if (SUB.has(text)) {
      appendLine("bot", "Sure gangy — give me two numbers to subtract.");
      state = { kind: "sub1", data: {} };
      setPrompt("First number:");
      input.placeholder = "e.g. 10";
      return;
    }
    if (BMI.has(text)) {
      appendLine(
        "bot",
        "Enter your height in meters and weight in kg (age is optional context)."
      );
      state = { kind: "bmi_age", data: {} };
      setPrompt("Age (or leave blank):");
      input.placeholder = "Optional — press Enter to skip";
      return;
    }
    appendLine(
      "bot",
      "I don't understand that yet — I'm still in baby phase. Try 'help' or rephrase?"
    );
  }

  function parseFloatStrict(s) {
    const n = Number.parseFloat(s);
    return Number.isFinite(n) ? n : NaN;
  }

  function parseIntStrict(s) {
    const n = Number.parseInt(s, 10);
    return Number.isFinite(n) ? n : NaN;
  }

  function handleFlow(text) {
    const k = state.kind;
    if (k === "add1") {
      const n1 = parseFloatStrict(text);
      if (Number.isNaN(n1)) {
        appendLine("bot", "Oops! Gotta enter valid numbers, gangy.");
        resetFlow();
        return;
      }
      state = { kind: "add2", data: { n1 } };
      setPrompt("Second number:");
      input.placeholder = "e.g. 3";
      return;
    }
    if (k === "add2") {
      const n2 = parseFloatStrict(text);
      if (Number.isNaN(n2)) {
        appendLine("bot", "Oops! Gotta enter valid numbers, gangy.");
        resetFlow();
        return;
      }
      appendLine("bot", `The sum is ${state.data.n1 + n2}.`);
      resetFlow();
      return;
    }
    if (k === "sub1") {
      const n1 = parseFloatStrict(text);
      if (Number.isNaN(n1)) {
        appendLine("bot", "Oops! Gotta enter valid numbers, gangy.");
        resetFlow();
        return;
      }
      state = { kind: "sub2", data: { n1 } };
      setPrompt("Second number:");
      input.placeholder = "e.g. 4";
      return;
    }
    if (k === "sub2") {
      const n2 = parseFloatStrict(text);
      if (Number.isNaN(n2)) {
        appendLine("bot", "Oops! Gotta enter valid numbers, gangy.");
        resetFlow();
        return;
      }
      appendLine("bot", `The difference is ${state.data.n1 - n2}.`);
      resetFlow();
      return;
    }
    if (k === "bmi_age") {
      const raw = text.trim();
      if (!raw) {
        state = { kind: "bmi_height", data: { age: null } };
      } else {
        const age = parseIntStrict(raw);
        if (Number.isNaN(age)) {
          appendLine("bot", "Oops! Gotta enter valid numbers, gangy.");
          resetFlow();
          return;
        }
        state = { kind: "bmi_height", data: { age } };
      }
      setPrompt("Height (meters):");
      input.placeholder = "e.g. 1.75";
      return;
    }
    if (k === "bmi_height") {
      const height = parseFloatStrict(text);
      if (Number.isNaN(height) || height <= 0) {
        appendLine("bot", "Oops! Gotta enter valid numbers, gangy.");
        resetFlow();
        return;
      }
      state = { kind: "bmi_weight", data: { ...state.data, height } };
      setPrompt("Weight (kg):");
      input.placeholder = "e.g. 70";
      return;
    }
    if (k === "bmi_weight") {
      const weight = parseFloatStrict(text);
      if (Number.isNaN(weight) || weight <= 0) {
        appendLine("bot", "Oops! Gotta enter valid numbers, gangy.");
        resetFlow();
        return;
      }
      const { height, age } = state.data;
      const bmi = weight / height ** 2;
      if (age != null) {
        appendLine("bot", `At age ${age}, your BMI is ${bmi.toFixed(2)}.`);
      } else {
        appendLine("bot", `Your BMI is ${bmi.toFixed(2)}.`);
      }
      resetFlow();
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = input.value;
    const text = normalize(raw);
    if (state.kind === "idle") {
      if (!text) return;
      appendLine("user", raw.trim() || text);
    } else {
      appendLine("user", raw.trim() === "" ? "(skipped)" : raw.trim());
    }
    input.value = "";
    if (state.kind === "idle") {
      handleIdle(text);
      return;
    }
    const q = normalize(raw);
    if (QUIT.has(q)) {
      appendLine("bot", "Sheesh! Have a great day, goat!");
      closeModal();
      return;
    }
    if (state.kind === "bmi_age" && raw.trim() === "") {
      handleFlow("");
    } else if (!text && state.kind !== "bmi_age") {
      appendLine("bot", "I need a value there, gang.");
    } else {
      handleFlow(state.kind === "bmi_age" ? raw : text);
    }
  });

  card.addEventListener("click", openModal);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openModal();
    }
  });

  closeEls.forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (!modal.hidden && e.key === "Escape") {
      e.preventDefault();
      closeModal();
    }
  });
})();
