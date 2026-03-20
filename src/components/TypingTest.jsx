import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LANGUAGES, DURATIONS } from "../constants/snippets.js";
import { injectCSS } from "../utils/styles.js";
import {
  calcAcc,
  calcWPM,
  getKeystrokeStats,
  getTypingBreakdown,
  getUniqueSnippet,
} from "../utils/functions.js";


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
  const [typedChars, setTypedChars] = useState(0);

  const inputRef = useRef(null);
  const timeLeftRef = useRef(duration);
  const timerRef = useRef(null);
  const wpmRef = useRef(null);
  const elapsedRef = useRef(0);
  const correctRef = useRef(0);
  const wpmHistoryRef = useRef([]);
  const inputValueRef = useRef("");

  // Track raw character keystrokes separately from the visible text.
  const totalKeystrokesRef = useRef(0);
  const correctKeystrokesRef = useRef(0);
  const doneRef = useRef(false);

  /* ─── cursor blink ─── */
  useEffect(() => {
    timeLeftRef.current = duration;
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes blinkCursor {
        0%,50%,100% { opacity: 1; }
        25%,75%     { opacity: 0; }
      }
      .cursor-blink { animation: blinkCursor 1.5s step-end infinite; }
    `;
    document.head.appendChild(style);
  }, []);

  /* ─── finish ─── */
  const doFinish = useCallback(
    (finalInput) => {
      if (doneRef.current) return;
      doneRef.current = true;

      clearInterval(timerRef.current);
      clearInterval(wpmRef.current);
      setFinished(true);

      const typed = finalInput ?? inputValueRef.current;
      const breakdown = getTypingBreakdown(typed, snippet);

      // elapsed is how many seconds actually passed (capped at duration)
      const elapsed = Math.max(1, duration - timeLeftRef.current);

      const finalWpm = calcWPM(breakdown.correct, elapsed);
      const finalAcc = calcAcc(
        correctKeystrokesRef.current,
        totalKeystrokesRef.current
      );

      const lastPoint = wpmHistoryRef.current[wpmHistoryRef.current.length - 1];
      const updatedHistory =
        lastPoint?.t === elapsed && lastPoint?.wpm === finalWpm
          ? wpmHistoryRef.current
          : [...wpmHistoryRef.current, { t: elapsed, wpm: finalWpm }];

      wpmHistoryRef.current = updatedHistory;
      setWpmHistory(updatedHistory);

      navigate("/report", {
        state: {
          wpm: finalWpm,
          accuracy: finalAcc,
          duration,
          elapsed,
          lang,
          wpmHistory: updatedHistory,
          chars: breakdown.correct,
          correct: breakdown.correct,
          incorrect: breakdown.incorrect,
          missed: breakdown.missed,
          extra: breakdown.extra,
          errors: breakdown.errors,
        },
      });
    },
    [snippet, duration, lang, navigate]
  );

  /* ─── reset ─── */
  const reset = useCallback((l, d) => {
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);

    doneRef.current = false;
    elapsedRef.current = 0;
    correctRef.current = 0;
    totalKeystrokesRef.current = 0;
    correctKeystrokesRef.current = 0;
    wpmHistoryRef.current = [];
    timeLeftRef.current = d;

    setSnippet(getUniqueSnippet(l));
    setInput("");
    inputValueRef.current = "";
    setStarted(false);
    setTimeLeft(d);
    setFinished(false);
    setWpmHistory([]);
    setErrorSet(new Set());
    setCorrect(0);
    setTypedChars(0);

    setTimeout(() => inputRef.current?.focus(), 60);
  }, []);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  /* ─── timer + live WPM graph ─── */
  useEffect(() => {
    if (!started) return;

    // Seed graph at t=0
    const initialHistory = [{ t: 0, wpm: 0 }];
    wpmHistoryRef.current = initialHistory;
    setWpmHistory(initialHistory);

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      timeLeftRef.current -= 1;

      if (timeLeftRef.current <= 0) {
        timeLeftRef.current = 0;
        setTimeLeft(0);
        clearInterval(timerRef.current);
        clearInterval(wpmRef.current);
        setTimeout(() => doFinish(), 0);
        return;
      }

      setTimeLeft(timeLeftRef.current);
    }, 1000);

    // Push a WPM data point every 2 seconds for the graph
    wpmRef.current = setInterval(() => {
      const elapsed = elapsedRef.current;
      const wpm = calcWPM(correctRef.current, elapsed);

      setWpmHistory((prev) => {
        const lastPoint = prev[prev.length - 1];
        if (lastPoint?.t === elapsed) return prev;

        const nextHistory = [...prev, { t: elapsed, wpm }];
        wpmHistoryRef.current = nextHistory;
        return nextHistory;
      });
    }, 2000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(wpmRef.current);
    };
  }, [started]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ─── indentation helper ─── */
  const getNextLineIndent = (pos) => {
    const nextNewline = snippet.indexOf("\n", pos);
    if (nextNewline === -1) return "";
    let indent = "";
    let i = nextNewline + 1;
    while (i < snippet.length && (snippet[i] === " " || snippet[i] === "\t")) {
      indent += snippet[i++];
    }
    return indent;
  };

  /* ─── input handling ─── */
  const handleKeyDown = (e) => {
    if (!started && e.key !== "Enter") {
      e.preventDefault();
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      processInput(input + "    ");
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (!started) {
        setStarted(true);
        return;
      }
      processInput(input + "\n" + getNextLineIndent(input.length));
    }
  };

  const processInput = (val) => {
    if (!started) return;
    if (doneRef.current || val.length > snippet.length) return;

    const keystrokeStats = getKeystrokeStats(input, val, snippet);
    if (keystrokeStats.totalKeystrokes > 0) {
      totalKeystrokesRef.current += keystrokeStats.totalKeystrokes;
      correctKeystrokesRef.current += keystrokeStats.correctKeystrokes;
    }

    setInput(val);
    inputValueRef.current = val;
    setTypedChars(val.length);

    const errs = new Set();
    const breakdown = getTypingBreakdown(val, snippet);

    for (let i = 0; i < val.length; i++) {
      if (val[i] !== snippet[i]) errs.add(i);
    }

    correctRef.current = breakdown.correct;
    setCorrect(breakdown.correct);
    setErrorSet(errs);

    if (val === snippet) setTimeout(() => doFinish(val), 0);
  };

  /* ─── derived display values ─── */
  const cursorPos = input.length;
  const elapsed = duration - timeLeft;

  // Live WPM: correctChars / 5 / elapsed-minutes  (MonkeyType formula)
  const currentWPM = started ? calcWPM(correctRef.current, elapsed || 1) : 0;

  // Live accuracy: based on total raw keystrokes so far
  const currentAcc =
    totalKeystrokesRef.current > 0
      ? calcAcc(correctKeystrokesRef.current, totalKeystrokesRef.current)
      : 100;

  return (
    <div className="min-h-screen font-[Space_Grotesk] text-black">
      {/* Hidden textarea captures all keyboard input */}
      <textarea
        ref={inputRef}
        value={input}
        onChange={(e) => processInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="fixed opacity-0 w-[1px] h-[1px] top-0 left-0 pointer-events-none"
      />

      <div
        className="max-w-[860px] mx-auto px-6 pt-6 pb-14"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-black">
          <div className="flex items-center gap-2 text-xl font-extrabold">
            <button
              className="border-2 border-black px-3 py-1 text-sm bg-white font-bold
              shadow-[4px_4px_0_black]
              hover:-translate-x-[2px] hover:-translate-y-[2px]
              active:translate-x-[4px] active:translate-y-[4px] rounded active:shadow-none transition-all duration-200 mr-4"
              onClick={() => navigate("/")}
            >
              ← Back
            </button>
            Codeurge
          </div>

          <button
            className="border-2 border-black px-3 py-1 text-sm bg-white font-bold
            shadow-[4px_4px_0_black] rounded
            hover:-translate-x-[2px] hover:-translate-y-[2px]
            active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-200"
            onClick={() => reset(lang, duration)}
          >
            ↺ Reset
          </button>
        </div>

        {/* Controls */}
        <div className="mb-5">
          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Language</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                className={`
                  border-2 border-black rounded px-3 cursor-pointer py-1 text-sm font-bold transition
                  ${lang === l.id
                    ? "bg-yellow-400 translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0_black]"
                    : "bg-white shadow-[3px_3px_0_black] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_black]"
                  }
                  active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
                `}
                onClick={() => { setLang(l.id); reset(l.id, duration); }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-gray-500 uppercase mb-2">Duration</div>
          <div className="flex gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d}
                className={`
                  border-2 border-black rounded px-3 py-1 text-sm font-bold transition
                  ${duration === d
                    ? "bg-yellow-400 translate-x-[3px] translate-y-[3px] shadow-[2px_2px_0_black]"
                    : "bg-white shadow-[3px_3px_0_black] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_black]"
                  }
                  active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
                `}
                onClick={() => { setDuration(d); reset(lang, d); }}
              >
                {d}s
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: "WPM", value: currentWPM },
            { label: "Accuracy", value: `${currentAcc}%` },
            { label: "Time Left", value: `${timeLeft}s` },
          ].map((item, i) => (
            <div
              key={i}
              className="border-2 rounded border-black px-4 py-3
              shadow-[3px_3px_0_black]
              hover:-translate-x-[3px] hover:-translate-y-[3px]
              hover:shadow-[6px_6px_0_black] transition-all duration-150"
            >
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">{item.label}</div>
              <div className="text-3xl font-extrabold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Code display */}
        <div className="relative border-2 rounded border-black shadow-[4px_4px_0_black] p-4 min-h-[180px] whitespace-pre leading-8 overflow-x-auto">
          {!started && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-700">Press Enter to start typing</div>
              </div>
            </div>
          )}
          <div className={started ? "" : "blur-sm"}>
            {snippet.split("").map((ch, i) => {
              const isTyped = i < cursorPos;
              const isErr = errorSet.has(i);
              const isCursor = i === cursorPos;

              return (
                <span key={i} className="relative">
                  {isCursor && (
                    <span className="absolute left-0 top-0 w-[2px] h-full bg-black cursor-blink" />
                  )}
                  <span
                    className={
                      isTyped
                        ? isErr
                          ? "text-red-500 underline decoration-wavy"
                          : "text-black font-semibold"
                        : "text-gray-400"
                    }
                  >
                    {ch}
                  </span>
                </span>
              );
            })}
            {cursorPos === snippet.length && (
              <span className="inline-block w-[2px] h-5 bg-black cursor-blink ml-[1px]" />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs font-semibold text-gray-500 mt-4">
          {!started
            ? "Click and start typing"
            : finished
            ? "Complete!"
            : `${Math.max(0, typedChars - correct)} errors`}
        </div>
      </div>
    </div>
  );
}
