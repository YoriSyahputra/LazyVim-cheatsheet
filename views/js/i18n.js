/**
 * Internationalization & Persistence Module
 */
import { I18N, LANGUAGES } from "./data.js";

const STORAGE_KEY = "lazyvim_cheatsheet_lang";
let currentLang = "en";
const listeners = [];

export function initI18n() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && LANGUAGES.some((l) => l.code === saved)) {
    currentLang = saved;
  } else {
    const navLang = navigator.language;
    if (navLang.startsWith("zh")) {
      currentLang =
        navLang.includes("TW") || navLang.includes("HK") ? "zh-HK" : "zh-CN";
    } else {
      const match = LANGUAGES.find((l) => navLang.startsWith(l.code));
      if (match) currentLang = match.code;
    }
  }
  return currentLang;
}

export function getCurrentLang() {
  return currentLang;
}

export function setLanguage(langCode) {
  if (!LANGUAGES.some((l) => l.code === langCode)) return;
  currentLang = langCode;
  localStorage.setItem(STORAGE_KEY, langCode);
  document.documentElement.lang = langCode;
  notify();
}

export function t(key) {
  const dict = I18N[currentLang] || I18N.en;
  return dict[key] !== undefined ? dict[key] : I18N.en[key] || key;
}

export function getCategoryI18n(catId) {
  const dict = I18N[currentLang] || I18N.en;
  return (
    (dict.categories && dict.categories[catId]) || I18N.en.categories[catId]
  );
}

export function getItemAction(item) {
  return item.action[currentLang] || item.action.en || item.action.id || "";
}

export function getItemDesc(item) {
  return item.desc[currentLang] || item.desc.en || item.desc.id || "";
}

export function subscribeI18n(fn) {
  listeners.push(fn);
}

function notify() {
  listeners.forEach((fn) => fn(currentLang));
}
