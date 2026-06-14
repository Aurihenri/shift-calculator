const form = document.querySelector("#shiftForm");
const shiftDate = document.querySelector("#shiftDate");
const startTime = document.querySelector("#startTime");
const endTime = document.querySelector("#endTime");
const breakMinutes = document.querySelector("#breakMinutes");
const hourlyPay = document.querySelector("#hourlyPay");
const shiftPosition = document.querySelector("#shiftPosition");
const previewHours = document.querySelector("#previewHours");
const previewPay = document.querySelector("#previewPay");
const previewBreakdown = document.querySelector("#previewBreakdown");
const totalHours = document.querySelector("#totalHours");
const totalPay = document.querySelector("#totalPay");
const shiftCount = document.querySelector("#shiftCount");
const formNote = document.querySelector("#formNote");
const shiftList = document.querySelector("#shiftList");
const emptyState = document.querySelector("#emptyState");
const clearButton = document.querySelector("#clearButton");
const menuTabs = document.querySelectorAll(".tab-item");
const tabPanels = document.querySelectorAll(".tab-panel");
const themeButtons = document.querySelectorAll(".theme-btn");
const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");
let systemChangeListener = null;
const langEn = document.querySelector("#langEn");
const langEt = document.querySelector("#langEt");
const calGrid = document.querySelector("#calGrid");
const calWeekdays = document.querySelector("#calWeekdays");
const calMonthYear = document.querySelector("#calMonthYear");
const calPrev = document.querySelector("#calPrev");
const calNext = document.querySelector("#calNext");
const calDayDetail = document.querySelector("#calDayDetail");
const dayShiftList = document.querySelector("#dayShiftList");
const dayShiftEmpty = document.querySelector("#dayShiftEmpty");
const dayShiftSummary = document.querySelector("#dayShiftSummary");
const exportButton = document.querySelector("#exportButton");
const hamburgerBtn = document.querySelector("#hamburgerBtn");
const sidebar = document.querySelector(".sidebar");
const sidebarBackdrop = document.querySelector("#sidebarBackdrop");

const storageKey = "work-time-calculator-shifts";
const scheduleKey = "work-time-calculator-schedule";
const themeStorageKey = "work-time-calculator-theme";
const langStorageKey = "work-time-calculator-lang";

let lang = loadLang();
let shifts = loadShifts();
let schedule = loadSchedule();
let editingId = null;
let selectedDate = null;
let calView = { month: new Date().getMonth(), year: new Date().getFullYear() };

const translations = {
  en: {
    appName: "Shift Calculator",
    tagline: "Track your hours and pay.",
    totalHours: "Total hours",
    totalPay: "Total pay",
    shifts: "Shifts",
    addShift: "Add shift",
    addShiftDesc: "Enter your start, end, break, and hourly rate.",
    date: "Date",
    startTime: "Start time",
    endTime: "End time",
    breakMinutes: "Break minutes",
    hourlyPay: "Hourly pay",
    position: "Position",
    thisShift: "This shift",
    pay: "Pay",
    addShiftBtn: "Add shift",
    formNoteDefault: "Overnight shifts are calculated automatically.",
    shiftLog: "Shift log",
    shiftLogDesc: "Your entries are saved in this browser.",
    clear: "Clear",
    exportCSV: "Export CSV",
    noShifts: "No shifts yet",
    noShiftsDesc: "Add your first shift to see hours and pay here.",
    settings: "Settings",
    settingsDesc: "Choose how the app looks and behaves.",
    appearance: "Appearance",
    appearanceDesc: "Choose dark, white, or follow your system.",
    language: "Language",
    languageDesc: "Choose your preferred language.",
    calculatorTab: "Calculator",
    logTab: "Shift log",
    scheduleTab: "Work schedule",
    scheduleDesc: "Mark your working days on the calendar.",
    todayLabel: "Today",
    workingDayLabel: "Working day",
    hasShiftsLabel: "Has shifts",
    dayShifts: "Shifts on this day",
    noDayShifts: "No shifts on this day.",
    updateBtn: "Update shift",
    editAria: "Edit shift from ",
    updatedMessage: "Shift updated.",
    statsTab: "Statistics",
    statsDesc: "Breakdown of your shifts and earnings.",
    statAvgHours: "Avg hours",
    statAvgPay: "Avg pay",
    statBusiestDay: "Busiest day",
    statCommonStart: "Common start",
    statOvernight: "Overnight",
    statRegVsPrem: "Regular vs premium",
    aboutTab: "About",
    aboutDesc: "About this app.",
    creator: "Creator",
    appVersion: "Version 1.0 Beta",
    settingsTab: "Settings",
    noDate: "No date",
    errorMessage: "Check your times and break length. Paid time must be above zero.",
    successMessage: "Shift added. Your totals are updated.",
    clearedMessage: "Shift log cleared.",
    minBreak: "min break",
    deleteAria: "Delete shift from ",
    themeLabelDark: "Dark",
    themeLabelSystem: "System",
    themeLabelWhite: "White",
    h: "h",
    m: "m",
    savedShifts: "Saved shifts",
    to: "to",
    reg: "reg",
    x1_5: "\u00d71.5",
  },
  et: {
    appName: "Tööaja kalkulaator",
    tagline: "Jälgi oma töötunde ja tasu.",
    totalHours: "Tunnid kokku",
    totalPay: "Tasu kokku",
    shifts: "Vahetused",
    addShift: "Lisa vahetus",
    addShiftDesc: "Sisesta algus-, lõpuaeg, paus ja tunnitasu.",
    date: "Kuupäev",
    startTime: "Algusaeg",
    endTime: "Lõpuaeg",
    breakMinutes: "Paus (min)",
    hourlyPay: "Tunnitasu",
    position: "Ametikoht",
    thisShift: "See vahetus",
    pay: "Tasu",
    addShiftBtn: "Lisa vahetus",
    formNoteDefault: "Öised vahetused arvutatakse automaatselt.",
    shiftLog: "Vahetuste logi",
    shiftLogDesc: "Sinu sissekanded salvestatakse sellesse brauserisse.",
    clear: "Tühjenda",
    exportCSV: "Expordi CSV",
    noShifts: "Vahetusi pole",
    noShiftsDesc: "Lisa oma esimene vahetus, et näha siin tunde ja tasu.",
    settings: "Seaded",
    settingsDesc: "Vali, kuidas rakendus välja näeb ja käitub.",
    appearance: "Välimus",
    appearanceDesc: "Vali tume, valge või järgi süsteemi.",
    language: "Keel",
    languageDesc: "Vali oma eelistatud keel.",
    calculatorTab: "Kalkulaator",
    logTab: "Vahetuste logi",
    scheduleTab: "Töö graafik",
    scheduleDesc: "Märgi oma tööpäevad kalendrisse.",
    todayLabel: "Täna",
    workingDayLabel: "Tööpäev",
    hasShiftsLabel: "On vahetusi",
    dayShifts: "Selle kuupäeva vahetused",
    noDayShifts: "Sellel kuupäeval pole vahetusi.",
    updateBtn: "Uuenda vahetust",
    editAria: "Muuda vahetust ",
    updatedMessage: "Vahetus uuendatud.",
    statsTab: "Statistika",
    statsDesc: "Vahetuste ja teenistuse kokkuvõte.",
    statAvgHours: "Keskm tunnid",
    statAvgPay: "Keskm tasu",
    statBusiestDay: "Tihedaim päev",
    statCommonStart: "Tavaline algus",
    statOvernight: "Öine",
    statRegVsPrem: "Tava vs premium",
    aboutTab: "Teave",
    aboutDesc: "Teave rakenduse kohta.",
    creator: "Looja",
    appVersion: "Versioon 1.0 Beeta",
    settingsTab: "Seaded",
    noDate: "Kuupäev puudub",
    errorMessage: "Kontrolli kellaaegu ja pausi pikkust. Tööaeg peab olema üle nulli.",
    successMessage: "Vahetus lisatud. Kogusummad on uuendatud.",
    clearedMessage: "Vahetuste logi tühjendatud.",
    minBreak: "min paus",
    deleteAria: "Kustuta vahetus ",
    themeLabelDark: "Tume",
    themeLabelSystem: "Süsteem",
    themeLabelWhite: "Valge",
    h: "t",
    m: "min",
    savedShifts: "Salvestatud vahetused",
    to: "\u2013",
    reg: "tav",
    x1_5: "\u00d71.5",
  }
};

function t(key) {
  return translations[lang]?.[key] ?? translations.en[key] ?? key;
}

function loadLang() {
  return localStorage.getItem(langStorageKey) === "en" ? "en" : "et";
}

function saveLang(l) {
  localStorage.setItem(langStorageKey, l);
}

function applyLang(l) {
  lang = l;
  document.documentElement.lang = l === "et" ? "et" : "en";
  document.title = t("appName");
  langEn.classList.toggle("active", l === "en");
  langEt.classList.toggle("active", l === "et");
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
  applyTheme(loadTheme());
  render();
  renderCalendar();
  renderStats();
  saveLang(l);
}

function loadShifts() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function saveShifts() {
  localStorage.setItem(storageKey, JSON.stringify(shifts));
}

function loadSchedule() {
  try {
    return JSON.parse(localStorage.getItem(scheduleKey)) || {};
  } catch {
    return {};
  }
}

function saveSchedule() {
  localStorage.setItem(scheduleKey, JSON.stringify(schedule));
}

function loadTheme() {
  const stored = localStorage.getItem(themeStorageKey);
  return stored === "white" || stored === "system" ? stored : "dark";
}

function getEffectiveTheme(theme) {
  return theme === "system"
    ? (systemMedia.matches ? "dark" : "white")
    : theme;
}

function saveTheme(theme) {
  localStorage.setItem(themeStorageKey, theme);
}

function applyTheme(theme) {
  const effective = getEffectiveTheme(theme);
  document.documentElement.dataset.theme = effective;

  themeButtons.forEach((btn) => {
    const isActive = btn.dataset.theme === theme;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-checked", String(isActive));
    btn.textContent = t("themeLabel" + btn.dataset.theme.charAt(0).toUpperCase() + btn.dataset.theme.slice(1));
  });

  if (systemChangeListener) {
    systemMedia.removeEventListener("change", systemChangeListener);
    systemChangeListener = null;
  }

  if (theme === "system") {
    systemChangeListener = () => applyTheme("system");
    systemMedia.addEventListener("change", systemChangeListener);
  }
}

function setActiveTab(name) {
  const current = document.querySelector(".tab-panel.active");
  const next = document.querySelector(`[data-panel="${name}"]`);

  if (!next || current === next) return;

  cancelEdit();

  menuTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.tab === name);
  });

  if (!current) {
    next.classList.add("active");
    return;
  }

  current.classList.remove("active");
  current.classList.add("leaving");

  requestAnimationFrame(() => {
    next.classList.add("active");
  });

  current.addEventListener("animationend", () => {
    current.classList.remove("leaving");
  }, { once: true });

  closeSidebar();
}

function toMinutes(timeValue) {
  if (!timeValue) {
    return null;
  }

  const [hours, minutes] = timeValue.split(":").map(Number);
  return hours * 60 + minutes;
}

function calculateShift(startValue, endValue, breakValue, rateValue) {
  const start = toMinutes(startValue);
  const rawEnd = toMinutes(endValue);
  const unpaidBreak = Number(breakValue || 0);
  const rate = Number(rateValue || 0);

  if (start === null || rawEnd === null || Number.isNaN(unpaidBreak) || Number.isNaN(rate)) {
    return null;
  }

  let end = rawEnd;
  if (end <= start) {
    end += 24 * 60;
  }

  const grossMinutes = end - start;
  const workedMinutes = Math.max(0, grossMinutes - unpaidBreak);

  let regularMinutes, premiumMinutes;
  if (rawEnd <= start) {
    const midnight = 24 * 60;
    const grossRegular = midnight - start;
    const fraction = grossRegular / grossMinutes;
    regularMinutes = Math.round(workedMinutes * fraction);
    premiumMinutes = workedMinutes - regularMinutes;
  } else {
    regularMinutes = workedMinutes;
    premiumMinutes = 0;
  }

  const premiumRate = rate * 1.5;
  const regularPay = (regularMinutes / 60) * rate;
  const premiumPay = (premiumMinutes / 60) * premiumRate;

  return {
    workedMinutes,
    regularMinutes,
    premiumMinutes,
    hours: workedMinutes / 60,
    regularPay,
    premiumPay,
    pay: regularPay + premiumPay,
  };
}

function formatHours(minutes) {
  const rounded = Math.round(minutes);
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;
  return `${hours}${t("h")} ${String(mins).padStart(2, "0")}${t("m")}`;
}

function formatMoney(amount) {
  return new Intl.NumberFormat(lang === "et" ? "et-EE" : "en-US", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(dateValue) {
  if (!dateValue) {
    return t("noDate");
  }

  return new Intl.DateTimeFormat(lang === "et" ? "et-EE" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${dateValue}T12:00:00`));
}

function updatePreview() {
  const result = calculateShift(startTime.value, endTime.value, breakMinutes.value, hourlyPay.value);

  if (!result) {
    previewHours.textContent = `0${t("h")} 00${t("m")}`;
    previewPay.textContent = formatMoney(0);
    previewBreakdown.textContent = "";
    return;
  }

  previewHours.textContent = formatHours(result.workedMinutes);
  previewPay.textContent = formatMoney(result.pay);
  previewBreakdown.textContent = result.premiumMinutes > 0
    ? `${t("reg")} ${formatHours(result.regularMinutes)} + ${t("x1_5")} ${formatHours(result.premiumMinutes)}`
    : "";
}

function showNote(message, isError = false) {
  formNote.textContent = message;
  formNote.classList.toggle("error", isError);
}

function renderTotals() {
  const minutes = shifts.reduce((sum, shift) => sum + shift.workedMinutes, 0);
  const pay = shifts.reduce((sum, shift) => sum + shift.pay, 0);

  totalHours.textContent = formatHours(minutes);
  totalPay.textContent = formatMoney(pay);
  shiftCount.textContent = shifts.length;

  [totalHours, totalPay, shiftCount].forEach((el) => {
    el.classList.remove("pulse");
    requestAnimationFrame(() => el.classList.add("pulse"));
  });
}

function renderShifts() {
  emptyState.classList.toggle("hidden", shifts.length > 0);
  shiftList.innerHTML = "";

  shifts.forEach((shift, index) => {
    const item = document.createElement("article");
    item.className = "shift-item" + (index === 0 ? " new-shift" : "");

    const main = document.createElement("div");
    main.className = "shift-main";
    main.innerHTML = `
      <strong>${formatDate(shift.date)}</strong>
      <span class="shift-meta">${shift.position ? shift.position + " · " : ""}${shift.start} ${t("to")} ${shift.end} – ${shift.breakMinutes} ${t("minBreak")}</span>
    `;

    const hasPremium = shift.premiumMinutes > 0;
    const pay = document.createElement("div");
    pay.className = "shift-pay";
    pay.innerHTML = `
      <span>${formatHours(shift.workedMinutes)}</span>
      <strong>${formatMoney(shift.pay)}</strong>
      ${hasPremium ? `<span class="breakdown">${t("reg")} ${formatHours(shift.regularMinutes)} + ${t("x1_5")} ${formatHours(shift.premiumMinutes)}</span>` : ""}
    `;

    const remove = document.createElement("button");
    remove.className = "delete-button";
    remove.type = "button";
    remove.textContent = "x";
    remove.setAttribute("aria-label", `${t("deleteAria")}${formatDate(shift.date)}`);
    remove.addEventListener("click", () => {
      shifts = shifts.filter((entry) => entry.id !== shift.id);
      saveShifts();
      render();
      renderCalendar();
    });

    const edit = document.createElement("button");
    edit.className = "edit-button";
    edit.type = "button";
    edit.innerHTML = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" width="14" height="14"><path d="M11.5 1.5l3 3L5 14H2v-3l9.5-9.5z"/></svg>`;
    edit.setAttribute("aria-label", `${t("editAria")}${formatDate(shift.date)}`);
    edit.addEventListener("click", () => startEdit(shift.id));

    item.append(main, pay, edit, remove);
    shiftList.append(item);
  });
}

function render() {
  renderTotals();
  renderShifts();
  updatePreview();
}

function setToday() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  shiftDate.value = `${year}-${month}-${day}`;
}

function locale() {
  return lang === "et" ? "et-EE" : "en-US";
}

function renderCalendar() {
  const { month, year } = calView;
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
  const daysInMonth = lastDay.getDate();
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  calMonthYear.textContent = firstDay.toLocaleDateString(locale(), { month: "long", year: "numeric" });

  const dayNames = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date(2026, 0, 4 + i);
    dayNames.push(d.toLocaleDateString(locale(), { weekday: "short" }));
  }
  calWeekdays.innerHTML = dayNames.map((name) => `<span class="cal-weekday">${name}</span>`).join("");

  const cells = [];
  for (let i = 0; i < startPad; i++) {
    cells.push('<button class="cal-day empty" type="button" tabindex="-1"></button>');
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isToday = dateStr === todayStr;
    const isWorking = !!schedule[dateStr];
    const hasShifts = shifts.some((s) => s.date === dateStr);
    const isSelected = dateStr === selectedDate;
    const classes = ["cal-day", isToday ? "today" : "", isWorking ? "working" : "", hasShifts ? "has-shifts" : "", isSelected ? "selected" : ""].filter(Boolean).join(" ");
    cells.push(`<button class="${classes}" type="button" data-date="${dateStr}">${day}</button>`);
  }
  calGrid.innerHTML = cells.join("");
  renderDayDetail();
}

function toggleDay(dateStr) {
  if (schedule[dateStr]) {
    delete schedule[dateStr];
  } else {
    schedule[dateStr] = true;
  }
  saveSchedule();
  renderCalendar();
}

function renderDayDetail() {
  if (!selectedDate) {
    calDayDetail.hidden = true;
    return;
  }
  const dayShifts = shifts.filter((s) => s.date === selectedDate);
  if (dayShifts.length === 0) {
    calDayDetail.hidden = true;
    return;
  }
  calDayDetail.hidden = false;
  const totalMin = dayShifts.reduce((sum, s) => sum + s.workedMinutes, 0);
  const totalPay = dayShifts.reduce((sum, s) => sum + s.pay, 0);
  dayShiftSummary.textContent = `${formatHours(totalMin)} · ${formatMoney(totalPay)}`;
  dayShiftEmpty.hidden = dayShifts.length > 0;
  dayShiftList.innerHTML = dayShifts.map((s) => `
    <div class="day-shift-item">
      <div>
        <strong>${formatHours(s.workedMinutes)}</strong>
        <span class="ds-time">${s.start} ${t("to")} ${s.end}</span>
      </div>
      <span class="ds-pay">${formatMoney(s.pay)}</span>
    </div>
  `).join("");
}

function startEdit(id) {
  if (editingId === id) {
    cancelEdit();
    return;
  }
  selectedDate = null;
  const shift = shifts.find((s) => s.id === id);
  if (!shift) return;
  editingId = id;
  shiftDate.value = shift.date;
  startTime.value = shift.start;
  endTime.value = shift.end;
  breakMinutes.value = shift.breakMinutes;
  hourlyPay.value = shift.hourlyPay;
  shiftPosition.value = shift.position || "";
  form.querySelector('[type="submit"]').textContent = t("updateBtn");
  updatePreview();
  form.querySelector('[type="submit"]').scrollIntoView({ behavior: "smooth" });
}

function cancelEdit() {
  if (!editingId) return;
  editingId = null;
  form.reset();
  setToday();
  updatePreview();
  form.querySelector('[type="submit"]').textContent = t("addShiftBtn");
}

function exportCSV() {
  if (shifts.length === 0) {
    showNote(t("noShifts"), true);
    return;
  }
  const headers = [t("date"), t("startTime"), t("endTime"), t("breakMinutes"), t("hourlyPay"), t("position"), t("totalHours"), t("pay")];
  const rows = shifts.map((s) => [
    s.date,
    s.start, s.end,
    s.breakMinutes,
    s.hourlyPay.toFixed(2),
    s.position || "",
    (s.workedMinutes / 60).toFixed(2),
    s.pay.toFixed(2),
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `shifts-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderStats() {
  const grid = document.querySelector("#statsGrid");
  const empty = document.querySelector("#statsEmpty");
  if (!grid) return;
  if (shifts.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  const totalMin = shifts.reduce((s, sh) => s + sh.workedMinutes, 0);
  const totalPay = shifts.reduce((s, sh) => s + sh.pay, 0);
  const count = shifts.length;
  const avgMin = Math.round(totalMin / count);
  const avgPay = totalPay / count;
  const overnightCount = shifts.filter((s) => s.premiumMinutes > 0).length;

  const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayFreq = [0, 0, 0, 0, 0, 0, 0];
  const startFreq = {};
  shifts.forEach((s) => {
    if (s.date) {
      const d = new Date(s.date + "T12:00:00");
      dayFreq[d.getDay()]++;
    }
    startFreq[s.start] = (startFreq[s.start] || 0) + 1;
  });
  const busiestDayIdx = dayFreq.indexOf(Math.max(...dayFreq));
  const busiestDay = new Date(2026, 0, 4 + busiestDayIdx).toLocaleDateString(locale(), { weekday: "long" });

  const commonStart = Object.entries(startFreq).sort((a, b) => b[1] - a[1])[0]?.[0] || "–";

  const regMin = shifts.reduce((s, sh) => s + (sh.regularMinutes || 0), 0);
  const premMin = shifts.reduce((s, sh) => s + (sh.premiumMinutes || 0), 0);

  grid.innerHTML = `
    <div class="stat-card">
      <span data-i18n="statAvgHours">${t("statAvgHours")}</span>
      <strong>${formatHours(avgMin)}</strong>
    </div>
    <div class="stat-card">
      <span data-i18n="statAvgPay">${t("statAvgPay")}</span>
      <strong>${formatMoney(avgPay)}</strong>
    </div>
    <div class="stat-card">
      <span data-i18n="statBusiestDay">${t("statBusiestDay")}</span>
      <strong>${busiestDay}</strong>
      <span class="stat-sub">${dayFreq[busiestDayIdx]} ${t("shifts").toLowerCase()}</span>
    </div>
    <div class="stat-card">
      <span data-i18n="statCommonStart">${t("statCommonStart")}</span>
      <strong>${commonStart}</strong>
    </div>
    <div class="stat-card">
      <span data-i18n="statOvernight">${t("statOvernight")}</span>
      <strong>${overnightCount}</strong>
      <span class="stat-sub">${overnightCount === 1 ? t("shiftLog").toLowerCase() : t("shifts").toLowerCase()}</span>
    </div>
    <div class="stat-card full">
      <span data-i18n="statRegVsPrem">${t("statRegVsPrem")}</span>
      <strong>${t("reg")} ${formatHours(regMin)} ${premMin > 0 ? `+ ${t("x1_5")} ${formatHours(premMin)}` : ""}</strong>
    </div>
  `;
}

form.addEventListener("input", updatePreview);

menuTabs.forEach((tab) => {
  tab.addEventListener("click", () => setActiveTab(tab.dataset.tab));
});

function openSidebar() {
  sidebar.classList.add("open");
  sidebarBackdrop.classList.add("visible");
  document.body.style.overflow = "hidden";
}

function closeSidebar() {
  sidebar.classList.remove("open");
  sidebarBackdrop.classList.remove("visible");
  document.body.style.overflow = "";
}

hamburgerBtn.addEventListener("click", () => {
  if (sidebar.classList.contains("open")) {
    closeSidebar();
  } else {
    openSidebar();
  }
});

sidebarBackdrop.addEventListener("click", closeSidebar);

if (window.innerWidth >= 769) {
  sidebar.classList.add("open");
}

themeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const theme = btn.dataset.theme;
    applyTheme(theme);
    saveTheme(theme);
  });
});

langEn.addEventListener("click", () => applyLang("en"));
langEt.addEventListener("click", () => applyLang("et"));

calGrid.addEventListener("click", (event) => {
  const btn = event.target.closest(".cal-day:not(.empty)");
  if (!btn) return;
  selectedDate = btn.dataset.date;
  toggleDay(selectedDate);
});

calPrev.addEventListener("click", () => {
  calView.month--;
  if (calView.month < 0) { calView.month = 11; calView.year--; }
  renderCalendar();
});

calNext.addEventListener("click", () => {
  calView.month++;
  if (calView.month > 11) { calView.month = 0; calView.year++; }
  renderCalendar();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const result = calculateShift(startTime.value, endTime.value, breakMinutes.value, hourlyPay.value);

  if (!result || result.workedMinutes <= 0) {
    showNote(t("errorMessage"), true);
    return;
  }

  const shiftData = {
    date: shiftDate.value,
    start: startTime.value,
    end: endTime.value,
    breakMinutes: Number(breakMinutes.value || 0),
    hourlyPay: Number(hourlyPay.value || 0),
    position: shiftPosition.value.trim() || "",
    workedMinutes: result.workedMinutes,
    regularMinutes: result.regularMinutes,
    premiumMinutes: result.premiumMinutes,
    pay: result.pay,
  };

  if (editingId) {
    const idx = shifts.findIndex((s) => s.id === editingId);
    if (idx !== -1) {
      shifts[idx] = { ...shifts[idx], ...shiftData };
    }
    editingId = null;
    form.querySelector('[type="submit"]').textContent = t("addShiftBtn");
    showNote(t("updatedMessage"));
  } else {
    shiftData.id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    shifts.unshift(shiftData);
    showNote(t("successMessage"));
  }

  saveShifts();
  render();
  renderCalendar();
  form.reset();
  setToday();
  updatePreview();
});

clearButton.addEventListener("click", () => {
  cancelEdit();
  shifts = [];
  saveShifts();
  render();
  showNote(t("clearedMessage"));
});

exportButton.addEventListener("click", exportCSV);

setToday();
applyTheme(loadTheme());
applyLang(loadLang());
