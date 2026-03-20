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

export function calcWPM(correctChars, seconds) {
  if (seconds <= 0) return 0;

  const words = correctChars / 5;
  const minutes = seconds / 60;

  return Math.max(0, Math.round(words / minutes));
}

export function calcAcc(correctChars, totalTyped) {
  if (totalTyped <= 0) return 100;

  const acc = (correctChars / totalTyped) * 100;
  return Math.min(100, Math.max(0, Math.round(acc)));
}

export function getTypingBreakdown(typed, snippet) {
  const safeTyped = typed ?? "";
  const safeSnippet = snippet ?? "";
  const comparableLength = Math.min(safeTyped.length, safeSnippet.length);

  let correct = 0;
  let incorrect = 0;

  for (let i = 0; i < comparableLength; i++) {
    if (safeTyped[i] === safeSnippet[i]) correct++;
    else incorrect++;
  }

  const extra = Math.max(0, safeTyped.length - safeSnippet.length);
  const missed = Math.max(0, safeSnippet.length - safeTyped.length);

  return {
    correct,
    incorrect,
    extra,
    missed,
    typedChars: safeTyped.length,
    errors: incorrect + extra,
  };
}

export function getKeystrokeStats(baseInput, nextInput, snippet) {
  const previous = baseInput ?? "";
  const next = nextInput ?? "";
  const safeSnippet = snippet ?? "";

  let prefix = 0;
  const sharedStart = Math.min(previous.length, next.length);
  while (prefix < sharedStart && previous[prefix] === next[prefix]) {
    prefix++;
  }

  let previousSuffix = previous.length;
  let nextSuffix = next.length;
  while (
    previousSuffix > prefix &&
    nextSuffix > prefix &&
    previous[previousSuffix - 1] === next[nextSuffix - 1]
  ) {
    previousSuffix--;
    nextSuffix--;
  }

  let correctKeystrokes = 0;
  for (let i = prefix; i < nextSuffix; i++) {
    if (next[i] === safeSnippet[i]) correctKeystrokes++;
  }

  return {
    totalKeystrokes: Math.max(0, nextSuffix - prefix),
    correctKeystrokes,
  };
}
