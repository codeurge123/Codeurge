import { POOL } from "../constants/snippets.js";

/* unique-per-session snippet rotation */
const _used = {};
export function getUniqueSnippet(lang) {
  const arr = POOL[lang] || [];
  if (!arr.length) return "";

  if (!_used[lang] || _used[lang].length >= arr.length) {
    _used[lang] = [];
  }

  const avail = arr.map((_, i) => i).filter((i) => !_used[lang].includes(i));
  const pick = avail[Math.floor(Math.random() * avail.length)];
  _used[lang].push(pick);
  return arr[pick];
}

export function calcWPM(chars, secs) {
  return Math.round(chars / 5 / ((secs || 1) / 60));
}
export function calcAcc(correct, total) {
  return total === 0 ? 100 : Math.round((correct / total) * 100);
}
