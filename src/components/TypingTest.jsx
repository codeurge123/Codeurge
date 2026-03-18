import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { NB } from "../constants/theme.js";
import { LANGUAGES, DURATIONS } from "../constants/snippets.js";
import { injectCSS } from "../utils/styles.js";
import { getUniqueSnippet, calcWPM, calcAcc } from "../utils/functions.js";

export function TypingTest() {
  const navigate = useNavigate();
  useEffect(() => {
    injectCSS();
  }, []);

  const [lang, setLang] = useState("javascript");
  const [duration, setDuration] = useState(60);
  const [snippet, setSnippet] = useState(() => getUniqueSnippet("javascript"));
  const [input, setInput] = useState("");
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [finished, setFinished] = useState(false);
  const [wpmHistory, setWpmHistory] = useState([]);
  const [errorSet, setErrorSet] = useState(new Set());
  const [correct, setCorrect] = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const wpmRef = useRef(null);
  const elapsedRef = useRef(0);
  const correctRef = useRef(0);
  const doneRef = useRef(false);
  const stateRef = useRef({
    input: "",
    snippet: "",
    duration: 60,
    wpmHistory: [],
  });

  useEffect(() => {
    stateRef.current = { input, snippet, duration, wpmHistory };
  }, [input, snippet, duration, wpmHistory]);

  const doFinish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);
    setFinished(true);
    const reportData = {
      wpm: calcWPM(correct, elapsedRef.current || 1),
      accuracy: calcAcc(correct, input.length),
      duration,
      lang,
      wpmHistory,
      totalTyped: input.length,
      correct,
    };
    navigate("/report", { state: reportData });
  }, [lang, navigate, correct, input.length, duration, wpmHistory]);

  const finishRef = useRef(doFinish);
  useEffect(() => {
    finishRef.current = doFinish;
  }, [doFinish]);

  const reset = useCallback((l, d) => {
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);
    doneRef.current = false;
    elapsedRef.current = 0;
    correctRef.current = 0;
    setSnippet(getUniqueSnippet(l));
    setInput("");
    setStarted(false);
    setTimeLeft(d);
    setFinished(false);
    setWpmHistory([]);
    setErrorSet(new Set());
    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    if (!started) return;
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setTimeout(() => finishRef.current(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    wpmRef.current = setInterval(() => {
      setWpmHistory((prev) => [
        ...prev,
        {
          t: elapsedRef.current,
          wpm: calcWPM(correctRef.current, elapsedRef.current),
        },
      ]);
    }, 2000);
    return () => {
      clearInterval(timerRef.current);
      clearInterval(wpmRef.current);
    };
  }, [started]);

  const getNextLineIndent = (pos) => {
    const nextNewline = snippet.indexOf("\n", pos);
    if (nextNewline === -1 || nextNewline === snippet.length - 1) return "";
    let indent = "";
    let i = nextNewline + 1;
    while (i < snippet.length && (snippet[i] === " " || snippet[i] === "\t")) {
      indent += snippet[i];
      i += 1;
    }
    return indent;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      processInput(input + "    ");
    }
    if (e.key === "Enter") {
      e.preventDefault();
      processInput(input + "\n" + getNextLineIndent(input.length));
    }
  };

  const processInput = (val) => {
    if (doneRef.current || val.length > snippet.length) return;
    if (!started && val.length > 0) setStarted(true);
    setInput(val);
    const errs = new Set();
    let correctCount = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === snippet[i]) correctCount++;
      else errs.add(i);
    }
    correctRef.current = correctCount;
    setCorrect(correctCount);
    setErrorSet(errs);
    if (val === snippet) setTimeout(() => doFinish(), 0);
  };

  const timerPct = (timeLeft / duration) * 100;
  const timerColor =
    timerPct > 50 ? NB.green : timerPct > 25 ? NB.yellow : NB.red;
  const cursorPos = input.length;
  const currentWPM = started ? calcWPM(correct, duration - timeLeft || 1) : 0;
  const currentAcc = input.length > 0 ? calcAcc(correct, input.length) : 100;
  const accColor =
    currentAcc > 90 ? NB.green : currentAcc > 75 ? "#E6A000" : NB.red;

  return (
    <div
      className="nb-grid"
      style={{
        minHeight: "100vh",
        fontFamily: "'Space Grotesk',sans-serif",
        color: NB.black,
      }}
    >
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => processInput(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          position: "fixed",
          opacity: 0,
          width: 1,
          height: 1,
          top: 0,
          left: 0,
          pointerEvents: "none",
        }}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />

      <div
        style={{ maxWidth: 860, margin: "0 auto", padding: "24px 24px 60px" }}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: `2px solid ${NB.black}`,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              fontSize: 20,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              className="nb-btn nb-btn-white nb-btn-sm"
              onClick={() => navigate("/")}
            >
              ← Back
            </button>
            Codeurge
          </div>
          <button
            className="nb-btn nb-btn-white nb-btn-sm"
            onClick={() => reset(lang, duration)}
          >
            ↺ Reset
          </button>
        </div>

        {/* Controls */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 12,
              color: NB.grayText,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Language
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 16,
            }}
          >
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                className={`nb-btn nb-btn-sm ${
                  lang === l.id ? "nb-btn-active" : "nb-btn-white"
                }`}
                onClick={() => {
                  setLang(l.id);
                  reset(l.id, duration);
                }}
              >
                {l.label}
              </button>
            ))}
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 12,
              color: NB.grayText,
              letterSpacing: 1,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            Duration
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {DURATIONS.map((d) => (
              <button
                key={d}
                className={`nb-btn nb-btn-sm ${
                  duration === d ? "nb-btn-active" : "nb-btn-white"
                }`}
                onClick={() => {
                  setDuration(d);
                  reset(lang, d);
                }}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Live stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div className="nb-stat-box">
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: NB.grayText,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              WPM
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: NB.black,
                lineHeight: 1,
              }}
            >
              {currentWPM}
            </div>
          </div>
          <div className="nb-stat-box">
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: NB.grayText,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              Accuracy
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: accColor,
                lineHeight: 1,
              }}
            >
              {currentAcc}%
            </div>
          </div>
          <div
            className="nb-stat-box"
            style={{ background: timerPct < 25 ? "#FFF0EE" : NB.white }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: NB.grayText,
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 4,
              }}
            >
              Time Left
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 800,
                color: timerColor,
                lineHeight: 1,
              }}
            >
              {timeLeft}s
            </div>
            <div
              style={{
                marginTop: 8,
                height: 6,
                background: NB.gray,
                borderRadius: 2,
                border: `1px solid ${NB.black}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${timerPct}%`,
                  background: timerColor,
                  transition: "width 1s linear",
                }}
              />
            </div>
          </div>
        </div>

        {/* Code display */}
        <div className="nb-input-wrap" style={{ marginBottom: 12 }}>
          {/* Progress bar */}
          <div
            style={{
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: NB.grayText,
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {lang} · {input.length}/{snippet.length} chars
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                background: NB.gray,
                borderRadius: 2,
                border: `1px solid ${NB.black}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(input.length / snippet.length) * 100}%`,
                  background: NB.yellow,
                  transition: "width 0.15s",
                }}
              />
            </div>
          </div>

          {/* Characters */}
          <div
            style={{
              fontSize: 14,
              lineHeight: 2.2,
              whiteSpace: "pre",
              overflowX: "auto",
              minHeight: 180,
              userSelect: "none",
              textAlign: "left",
            }}
          >
            {snippet.split("").map((ch, i) => {
              const isTyped = i < cursorPos;
              const isCursor = i === cursorPos;
              const isErr = errorSet.has(i);
              return (
                <span
                  key={i}
                  style={{
                    color: isCursor
                      ? NB.white
                      : isTyped
                      ? isErr
                        ? NB.red
                        : NB.black
                      : NB.grayMid,
                    background: isCursor
                      ? NB.black
                      : isErr
                      ? "#FFEEEE"
                      : "transparent",
                    borderRadius: isCursor ? 2 : 0,
                    outline: isCursor ? `2px solid ${NB.black}` : "none",
                    fontWeight: isTyped && !isErr ? 600 : 400,
                    textDecoration: isErr ? "underline wavy #FF3B30" : "none",
                  }}
                >
                  {ch}
                </span>
              );
            })}
            {cursorPos >= snippet.length && (
              <span
                style={{
                  borderLeft: `2px solid ${NB.black}`,
                  animation: "blink 1s step-end infinite",
                }}
              >
                {" "}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            fontSize: 12,
            fontWeight: 600,
            color: NB.grayText,
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {!started
            ? "Click here and start typing to begin"
            : finished
            ? "Complete! Generating report…"
            : `⚡ ${errorSet.size} error${
                errorSet.size === 1 ? "" : "s"
              } · position ${cursorPos}`}
        </div>
      </div>
    </div>
  );
}
