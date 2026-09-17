/**
 * Application Orchestration, Tab Navigation, & Event Bindings
 */
import { KEYMAPS, CATEGORIES, LANGUAGES } from "./data.js";
import {
  initI18n,
  getCurrentLang,
  setLanguage,
  t,
  getCategoryI18n,
  getItemAction,
  getItemDesc,
  subscribeI18n,
} from "./i18n.js";
import { searchKeymaps, highlightText } from "./search.js";

let activeTabId = "cat-1";
let currentSearchQuery = "";

const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const searchKbd = document.getElementById("searchKbd");
const langDropdownBtn = document.getElementById("langDropdownBtn");
const langMenu = document.getElementById("langMenu");
const currentLangFlag = document.getElementById("currentLangFlag");
const currentLangLabel = document.getElementById("currentLangLabel");
const tabbar = document.getElementById("tabbar");
const tabView = document.getElementById("tabView");
const searchView = document.getElementById("searchView");
const searchResultsWrap = document.getElementById("searchResultsWrap");
const searchStats = document.getElementById("searchStats");

function init() {
  initI18n();
  buildLanguageMenu();
  updateStaticLabels();
  renderTabs();
  renderTabView();
  bindEvents();
  subscribeI18n(() => {
    updateStaticLabels();
    renderTabs();
    if (currentSearchQuery) {
      handleSearch(currentSearchQuery);
    } else {
      renderTabView();
    }
  });
}

function updateStaticLabels() {
  const cur = getCurrentLang();
  const langObj = LANGUAGES.find((l) => l.code === cur) || LANGUAGES[0];
  currentLangFlag.textContent = langObj.flag;
  currentLangLabel.textContent = langObj.code.toUpperCase();

  document.getElementById("heroEyebrow").textContent = t("heroEyebrow");
  document.getElementById("heroTitle").innerHTML = t("heroTitleHtml");
  document.getElementById("heroSub").textContent = t("heroSub");
  document.getElementById("leaderDesc").textContent = t("leaderDesc");
  searchInput.placeholder = t("searchPlaceholder");
  document.getElementById("footerText").innerHTML = t("footerHtml");
}

function buildLanguageMenu() {
  langMenu.innerHTML = "";
  LANGUAGES.forEach((lang) => {
    const btn = document.createElement("button");
    btn.className = `lang-item ${lang.code === getCurrentLang() ? "active" : ""}`;
    btn.role = "menuitem";
    btn.innerHTML = `<span class="flag">${lang.flag}</span> <span>${lang.name}</span>`;
    btn.addEventListener("click", () => {
      setLanguage(lang.code);
      closeLangMenu();
    });
    langMenu.appendChild(btn);
  });
}

function toggleLangMenu() {
  const isHidden = langMenu.classList.contains("hidden");
  if (isHidden) {
    buildLanguageMenu();
    langMenu.classList.remove("hidden");
    langDropdownBtn.setAttribute("aria-expanded", "true");
  } else {
    closeLangMenu();
  }
}

function closeLangMenu() {
  langMenu.classList.add("hidden");
  langDropdownBtn.setAttribute("aria-expanded", "false");
}

function renderTabs() {
  tabbar.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const i18nCat = getCategoryI18n(cat.id);
    const btn = document.createElement("button");
    btn.className = `tab-btn ${cat.id === activeTabId ? "active" : ""}`;
    btn.dataset.target = cat.id;
    btn.dataset.color = cat.color;
    btn.innerHTML = `<span class="n">${cat.num}</span> <span>${i18nCat ? i18nCat.title : cat.id}</span>`;
    btn.addEventListener("click", () => {
      activeTabId = cat.id;
      if (currentSearchQuery) {
        clearSearch();
      } else {
        activateTab(cat.id);
      }
    });
    tabbar.appendChild(btn);
  });
}

function renderTabView() {
  tabView.innerHTML = "";
  CATEGORIES.forEach((cat) => {
    const i18nCat = getCategoryI18n(cat.id);
    const items = KEYMAPS.filter((k) => k.cat === cat.id);

    const section = document.createElement("section");
    section.className = `cat ${cat.id === activeTabId ? "active" : ""}`;
    section.id = cat.id;

    let tableHtml = `
      <div class="cat-head">
        <span class="cat-num ${cat.color}">${cat.num}</span>
        <h2 class="cat-title">${i18nCat ? i18nCat.title : ""}</h2>
      </div>
      <p class="cat-desc">${i18nCat ? i18nCat.desc : ""}</p>
      <table>
        <thead>
          <tr>
            <th>${t("colAction")}</th>
            <th>${t("colMode")}</th>
            <th>${t("colKeymap")}</th>
            <th>${t("colDesc")}</th>
          </tr>
        </thead>
        <tbody>
    `;

    items.forEach((item) => {
      tableHtml += `
        <tr>
          <td class="action">${getItemAction(item)}</td>
          <td class="mode-col"><span class="mode ${item.mode.split("/")[0].trim()}">${item.mode}</span></td>
          <td class="key-col">${item.keysHtml}</td>
          <td class="desc-col">${getItemDesc(item)}</td>
        </tr>
      `;
    });

    tableHtml += `</tbody></table>`;

    if (cat.id === "cat-7") {
      tableHtml += `<div class="note">${t("cat7NoteHtml")}</div>`;
    }

    section.innerHTML = tableHtml;
    tabView.appendChild(section);
  });
}

function activateTab(tabId) {
  activeTabId = tabId;
  document.querySelectorAll("section.cat").forEach((s) => {
    s.classList.toggle("active", s.id === tabId);
  });
  document.querySelectorAll(".tab-btn").forEach((b) => {
    b.classList.toggle("active", b.dataset.target === tabId);
  });
}

function handleSearch(query) {
  currentSearchQuery = query;
  if (!query.trim()) {
    clearSearch();
    return;
  }

  searchClear.classList.remove("hidden");
  searchKbd.classList.add("hidden");
  tabView.classList.add("hidden");
  searchView.classList.remove("hidden");

  const results = searchKeymaps(query, KEYMAPS);

  if (!results || results.length === 0) {
    searchStats.textContent = t("searchStats").replace("{count}", "0");
    searchResultsWrap.innerHTML = `
      <div class="search-empty">
        <div class="search-empty-icon">🔍</div>
        <div class="search-empty-title">${t("searchEmptyTitle")}</div>
        <div class="search-empty-desc">${t("searchEmptyDesc")}</div>
      </div>
    `;
    return;
  }

  const statText =
    results.length === 1
      ? t("searchStatsSingular")
      : t("searchStats").replace("{count}", results.length);
  searchStats.textContent = statText;

  let resultsHtml = `
    <table>
      <thead>
        <tr>
          <th>${t("colCategory")}</th>
          <th>${t("colAction")}</th>
          <th>${t("colMode")}</th>
          <th>${t("colKeymap")}</th>
          <th>${t("colDesc")}</th>
        </tr>
      </thead>
      <tbody>
  `;

  results.forEach((item) => {
    const cat = CATEGORIES.find((c) => c.id === item.cat);
    const catI18n = getCategoryI18n(item.cat);
    const highlightedAction = highlightText(getItemAction(item), query);
    const highlightedDesc = highlightText(getItemDesc(item), query);

    resultsHtml += `
      <tr>
        <td style="width: 14%;">
          <span class="cat-badge ${cat ? cat.color : "blue"}">
            ${cat ? cat.num : ""} · ${catI18n ? catI18n.title.split(",")[0].split("&")[0].trim() : ""}
          </span>
        </td>
        <td class="action">${highlightedAction}</td>
        <td class="mode-col"><span class="mode ${item.mode.split("/")[0].trim()}">${item.mode}</span></td>
        <td class="key-col">${item.keysHtml}</td>
        <td class="desc-col">${highlightedDesc}</td>
      </tr>
    `;
  });

  resultsHtml += `</tbody></table>`;
  searchResultsWrap.innerHTML = resultsHtml;
}

function clearSearch() {
  currentSearchQuery = "";
  searchInput.value = "";
  searchClear.classList.add("hidden");
  searchKbd.classList.remove("hidden");
  searchView.classList.add("hidden");
  tabView.classList.remove("hidden");
  activateTab(activeTabId);
}

function bindEvents() {
  searchInput.addEventListener("input", (e) => handleSearch(e.target.value));
  searchClear.addEventListener("click", () => {
    clearSearch();
    searchInput.focus();
  });

  langDropdownBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleLangMenu();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".lang-selector-wrap")) {
      closeLangMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.activeElement === searchInput || currentSearchQuery) {
        clearSearch();
        searchInput.blur();
      }
      closeLangMenu();
      return;
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
      return;
    }

    if (e.key === "/" && document.activeElement !== searchInput) {
      const tagName = document.activeElement.tagName.toLowerCase();
      if (tagName !== "input" && tagName !== "textarea") {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

init();
