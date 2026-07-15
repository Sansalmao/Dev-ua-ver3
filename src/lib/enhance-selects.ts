const CHEVRON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>`;

function closeAll(except?: HTMLElement) {
  document.querySelectorAll<HTMLElement>(".ua-select.is-open").forEach((w) => {
    if (w === except) return;
    w.classList.remove("is-open");
    const t = w.querySelector<HTMLElement>(".ua-select__trigger");
    t?.setAttribute("aria-expanded", "false");
  });
}

function enhanceSelect(select: HTMLSelectElement) {
  if (select.dataset.uaEnhanced) return;
  select.dataset.uaEnhanced = "1";

  // ── Estructura ────────────────────────────────────────────────────────────
  const wrap = document.createElement("div");
  wrap.className = "ua-select";
  select.parentNode?.insertBefore(wrap, select);
  wrap.appendChild(select);
  select.classList.add("ua-select__native");
  select.setAttribute("tabindex", "-1");
  select.setAttribute("aria-hidden", "true");

  const trigger = document.createElement("button");
  trigger.type = "button";
  trigger.className = "ua-select__trigger filter-select";
  trigger.setAttribute("aria-haspopup", "listbox");
  trigger.setAttribute("aria-expanded", "false");
  if (select.id) trigger.setAttribute("aria-label", select.getAttribute("aria-label") || select.id);

  const valueSpan = document.createElement("span");
  valueSpan.className = "ua-select__value";
  const chevron = document.createElement("span");
  chevron.className = "ua-select__chevron";
  chevron.innerHTML = CHEVRON;
  trigger.appendChild(valueSpan);
  trigger.appendChild(chevron);
  wrap.appendChild(trigger);

  const panel = document.createElement("ul");
  panel.className = "ua-select__panel";
  panel.setAttribute("role", "listbox");
  wrap.appendChild(panel);

  const optionEls: HTMLLIElement[] = [];
  Array.from(select.options).forEach((opt) => {
    const li = document.createElement("li");
    li.className = "ua-select__option";
    li.setAttribute("role", "option");
    li.dataset.value = opt.value;
    li.textContent = opt.textContent;
    li.tabIndex = -1;
    li.addEventListener("click", () => choose(opt.value));
    panel.appendChild(li);
    optionEls.push(li);
  });

  // ── Estado / sincronización ────────────────────────────────────────────────
  function syncLabel() {
    const cur = select.options[select.selectedIndex];
    valueSpan.textContent = cur ? cur.textContent : "";
    optionEls.forEach((li) => {
      const sel = li.dataset.value === select.value;
      li.classList.toggle("is-selected", sel);
      li.setAttribute("aria-selected", String(sel));
    });
  }

  function positionPanel() {
    // position: fixed anclado al trigger → nunca lo recorta un contenedor con
    // overflow:hidden/auto (el dashboard tiene varios).
    const r = trigger.getBoundingClientRect();
    panel.style.top = `${r.bottom + 4}px`;
    panel.style.left = `${r.left}px`;
    panel.style.minWidth = `${r.width}px`;
  }

  function open() {
    closeAll(wrap);
    wrap.classList.add("is-open");
    trigger.setAttribute("aria-expanded", "true");
    positionPanel();
    const active = optionEls.find((li) => li.dataset.value === select.value) ?? optionEls[0];
    active?.focus();
  }

  function close(focusTrigger = false) {
    wrap.classList.remove("is-open");
    trigger.setAttribute("aria-expanded", "false");
    if (focusTrigger) trigger.focus();
  }

  function choose(value: string) {
    if (select.value !== value) {
      select.value = value;
      select.dispatchEvent(new Event("change", { bubbles: true }));
    }
    syncLabel();
    close(true);
  }

  function focusByOffset(from: HTMLElement, delta: number) {
    const idx = optionEls.indexOf(from as HTMLLIElement);
    const next = optionEls[Math.min(optionEls.length - 1, Math.max(0, idx + delta))];
    next?.focus();
  }

  // ── Eventos ────────────────────────────────────────────────────────────────
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    wrap.classList.contains("is-open") ? close() : open();
  });

  trigger.addEventListener("keydown", (e) => {
    if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      open();
    }
  });

  panel.addEventListener("keydown", (e) => {
    const el = e.target as HTMLElement;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusByOffset(el, 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusByOffset(el, -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      choose(el.dataset.value ?? "");
    } else if (e.key === "Escape") {
      e.preventDefault();
      close(true);
    } else if (e.key === "Tab") {
      close();
    }
  });

  // Si algún código externo cambia el value y dispara change, reflejarlo.
  select.addEventListener("change", syncLabel);

  syncLabel();
}

function init() {
  document
    .querySelectorAll<HTMLSelectElement>("select.filter-select")
    .forEach(enhanceSelect);

  document.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest(".ua-select")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
  // Cerrar al hacer scroll (incluye contenedores internos → capture:true) o al
  // redimensionar, porque el panel es position:fixed y quedaría "flotando".
  window.addEventListener("scroll", () => closeAll(), true);
  window.addEventListener("resize", () => closeAll());
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
