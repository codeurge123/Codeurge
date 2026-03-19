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
  const timeLeftRef = useRef(duration);
  const timerRef = useRef(null);
  const wpmRef = useRef(null);
  const elapsedRef = useRef(0);
  const correctRef = useRef(0);
  const doneRef = useRef(false);

  /* ================= CURSOR BLINK ================= */
  useEffect(() => {
    timeLeftRef.current = duration;
    setTimeLeft(duration);
  }, [duration]);
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes blinkCursor {
        0%,50%,100% { opacity: 1; }
        25%,75% { opacity: 0; }
      }
      .cursor-blink {
        animation: blinkCursor 1.5s step-end infinite;
      }
    `;
    document.head.appendChild(style);
  }, []);

  /* ================= FINISH ================= */
  const doFinish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);
    setFinished(true);

    const totalTyped = input.length;
    const correctChars = correctRef.current;
    const elapsed = elapsedRef.current || 1;

    const finalWpm = calcWPM(correctChars, elapsed);

    const updatedHistory = [
      ...wpmHistory,
      { t: elapsed, wpm: finalWpm },
    ];

    setWpmHistory(updatedHistory);

    const reportData = {
      wpm: finalWpm,
      accuracy: calcAcc(correctChars, totalTyped),
      duration,
      lang,
      wpmHistory: updatedHistory,
      totalTyped,
      correct: correctChars,
    };

    navigate("/report", { state: reportData });
  }, [lang, navigate, input.length, duration, wpmHistory]);

  /* ================= RESET ================= */
  const reset = useCallback((l, d) => {
    clearInterval(timerRef.current);
    clearInterval(wpmRef.current);

    doneRef.current = false;
    elapsedRef.current = 0;
    correctRef.current = 0;
    timeLeftRef.current = d;

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

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!started) return;

    setWpmHistory([{ t: 0, wpm: 0 }]);

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

  /* ================= INDENTATION ================= */
  const getNextLineIndent = (pos) => {
    const nextNewline = snippet.indexOf("\n", pos);
    if (nextNewline === -1) return "";

    let indent = "";
    let i = nextNewline + 1;

    while (i < snippet.length && (snippet[i] === " " || snippet[i] === "\t")) {
      indent += snippet[i];
      i++;
    }

    return indent;
  };

  /* ================= INPUT ================= */
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      processInput(input + "    ");
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (!started) setStarted(true);
      processInput(input + "\n" + getNextLineIndent(input.length));
    }
  };

  const processInput = (val) => {
    if (doneRef.current || val.length > snippet.length) return;

    if (!started) setStarted(true);

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

  const cursorPos = input.length;
  const elapsed = duration - timeLeft;
  const currentWPM = started ? calcWPM(correctRef.current, elapsed || 1) : 0;
  const currentAcc = input.length > 0 ? calcAcc(correct, input.length) : 100;

  return (
    <div className="min-h-screen font-[Space_Grotesk] text-black">

      {/* Hidden input */}
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
          <div className="text-xs font-bold text-gray-500 uppercase mb-2">
            Language
          </div>

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
                onClick={() => {
                  setLang(l.id);
                  reset(l.id, duration);
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          <div className="text-xs font-bold text-gray-500 uppercase mb-2">
            Duration
          </div>

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

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[{ label: "WPM", value: currentWPM },
          { label: "Accuracy", value: `${currentAcc}%` },
          { label: "Time Left", value: `${timeLeft}s` }
          ].map((item, i) => (
            <div key={i}
              className="border-2 rounded border-black px-4 py-3
              shadow-[3px_3px_0_black]
              hover:-translate-x-[3px] hover:-translate-y-[3px]
              hover:shadow-[6px_6px_0_black] transition-all duration-150"
            >
              <div className="text-xs font-bold text-gray-500 uppercase mb-1">
                {item.label}
              </div>
              <div className="text-3xl font-extrabold">{item.value}</div>
            </div>
          ))}
        </div>

        {/* Code */}
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
              : `${errorSet.size} errors`}
        </div>
      </div>
    </div>
  );
}