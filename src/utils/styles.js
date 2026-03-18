/* ═══════════════════════════════════════════════════════
   INJECT GLOBAL CSS
══════════════════════════════════════════════════════ */
import { NB } from '../constants/theme.js';

export const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: ${NB.offwhite}; font-family: 'Space Grotesk', sans-serif; }

  /* Perspective grid background */
  .nb-grid {
    background-color: ${NB.offwhite};
    background-image:
      linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px);
    background-size: 48px 48px;
  }

  @keyframes fadeUp {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes wiggle {
    0%,100% { transform: rotate(0deg); }
    25%     { transform: rotate(-3deg); }
    75%     { transform: rotate(3deg); }
  }
  @keyframes pop {
    0%   { transform: scale(1); }
    50%  { transform: scale(1.08); }
    100% { transform: scale(1); }
  }

  .nb-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 14px;
    border: 2px solid ${NB.black};
    border-radius: 4px;
    cursor: pointer;
    transition: transform 0.1s, box-shadow 0.1s;
    box-shadow: 4px 4px 0 ${NB.black};
    text-transform: none;
    letter-spacing: 0;
    line-height: 1;
  }
  .nb-btn:hover { transform: translate(-1px,-1px); box-shadow: 5px 5px 0 ${NB.black}; }
  .nb-btn:active { transform: translate(3px,3px); box-shadow: 1px 1px 0 ${NB.black}; }

  .nb-btn-yellow { background:${NB.yellow}; color:${NB.black}; }
  .nb-btn-white  { background:${NB.white}; color:${NB.black}; }
  .nb-btn-black  { background:${NB.black}; color:${NB.white}; }
  .nb-btn-outline{ background:transparent; color:${NB.black}; }

  .nb-btn-sm { padding: 6px 14px; font-size: 12px; box-shadow: 3px 3px 0 ${NB.black}; }
  .nb-btn-sm:hover { box-shadow: 4px 4px 0 ${NB.black}; }
  .nb-btn-sm:active { transform: translate(2px,2px); box-shadow: 1px 1px 0 ${NB.black}; }

  .nb-btn-lg { padding: 14px 32px; font-size: 17px; box-shadow: 6px 6px 0 ${NB.black}; }
  .nb-btn-lg:hover { box-shadow: 8px 8px 0 ${NB.black}; }

  .nb-btn-active {
    background: ${NB.yellow} !important;
    color: ${NB.black} !important;
    transform: translate(2px,2px) !important;
    box-shadow: 2px 2px 0 ${NB.black} !important;
  }

  .nb-card {
    background: ${NB.white};
    border: 2px solid ${NB.black};
    border-radius: 4px;
    box-shadow: 6px 6px 0 ${NB.black};
  }
  .nb-card-yellow {
    background: ${NB.yellow};
    border: 2px solid ${NB.black};
    border-radius: 4px;
    box-shadow: 6px 6px 0 ${NB.black};
  }

  .nb-tag {
    display: inline-flex;
    align-items: center;
    padding: 4px 12px;
    border: 2px solid ${NB.black};
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
    background: ${NB.white};
    box-shadow: 2px 2px 0 ${NB.black};
  }

  .nb-input-wrap {
    background: ${NB.white};
    border: 2px solid ${NB.black};
    border-radius: 4px;
    box-shadow: 4px 4px 0 ${NB.black};
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    padding: 20px 24px;
    cursor: text;
    position: relative;
  }

  .nb-stat-box {
    background: ${NB.white};
    border: 2px solid ${NB.black};
    border-radius: 4px;
    box-shadow: 4px 4px 0 ${NB.black};
    padding: 16px 18px;
    text-align: center;
  }

  .bounce-in {
    animation: fadeUp 0.5s cubic-bezier(.22,.68,0,1.2) both;
  }
`;

export function injectCSS() {
  if (document.getElementById("nb-css")) return;
  const el = document.createElement("style");
  el.id = "nb-css";
  el.textContent = CSS;
  document.head.appendChild(el);
}