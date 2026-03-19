import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { NB } from "../constants/theme.js";
import { injectCSS } from "../utils/styles.js";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#FAFAF8] border-2 border-[#0D0D0D] rounded px-3 py-2 shadow-[3px_3px_0_#0D0D0D] font-[Space_Grotesk] text-xs">
      <div className="text-gray-500">t+{payload[0].payload.t}s</div>
      <div className="font-extrabold text-base">
        {payload[0].value} WPM
      </div>
    </div>
  );
};

export function Report() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    injectCSS();
  }, []);

  const { wpm, accuracy, duration, lang, wpmHistory, totalTyped, correct } =
    data;

  const errors = totalTyped - correct;

  const grade =
    wpm >= 80 ? "S" : wpm >= 60 ? "A" : wpm >= 45 ? "B" : wpm >= 30 ? "C" : "D";

  const gradeColors = {
    S: "#00C853",
    A: "#0057FF",
    B: NB.yellow,
    C: "#FF8800",
    D: NB.red,
  };

  const gradeLabels = {
    S: "Elite Tier",
    A: "Excellent",
    B: "Good",
    C: "Fair",
    D: "Beginner",
  };

  const gc = gradeColors[grade];

  const chartData =
    wpmHistory.length > 1
      ? wpmHistory
      : [
          { t: 0, wpm: 0 },
          { t: Math.floor(duration / 2), wpm: Math.floor(wpm / 2) },
          { t: duration, wpm },
        ];

  return (
    <div className="min-h-screen font-[Space_Grotesk] text-[#0D0D0D]">
      <div className="max-w-[720px] mx-auto px-6 pt-6 pb-14">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-7 pb-4 border-b-2 border-black">
          <div className="font-extrabold text-xl flex items-center gap-2">
            Codeurge — Results
          </div>
          <button
            className="border-2 border-black px-3 py-1 text-sm bg-white shadow-[3px_3px_0_black]  active:translate-x-1 rounded active:translate-y-1 active:shadow-[1px_1px_0_black] transition-all duration-200"
            onClick={() => navigate("/")}
          >
            ← Home
          </button>
        </div>

        {/* Grade hero */}
        <div className="flex gap-5 mb-6 items-stretch">
          <div
            className="border-2 border-black rounded shadow-[6px_6px_0_black] px-7 py-6 min-w-[120px] flex flex-col items-center justify-center"
            style={{ background: gc }}
          >
            <div
              className={`text-[72px] font-extrabold leading-none ${
                grade === "B" ? "text-black" : "text-white"
              }`}
            >
              {grade}
            </div>
            <div
              className={`font-bold text-xs mt-1 ${
                grade === "B"
                  ? "text-black/60"
                  : "text-white/75"
              }`}
            >
              {gradeLabels[grade]}
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-2.5">
            {[
              { label: "WPM", value: wpm, color: "text-black" },
              {
                label: "Accuracy",
                value: `${accuracy}%`,
                color: accuracy > 90 ? "text-green-600" : "text-yellow-600",
              },
              { label: "Chars", value: totalTyped, color: "text-black" },
              {
                label: "Errors",
                value: errors,
                color: errors === 0 ? "text-green-600" : "text-red-600",
              },
            ].map((st, i) => (
              <div key={i} className="border-2 border-black shadow-[3px_3px_0_black] px-4 py-3">
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {st.label}
                </div>
                <div className={`text-2xl font-extrabold ${st.color}`}>
                  {st.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra stats */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="border-2 border-black shadow-[3px_3px_0_black] px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">⏱</span>
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Duration
              </div>
              <div className="text-xl font-extrabold">{duration}s</div>
            </div>
          </div>

          <div className="border-2 border-black shadow-[3px_3px_0_black] px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">🌐</span>
            <div>
              <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                Language
              </div>
              <div className="text-xl font-extrabold capitalize">
                {lang}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="border-2 border-black shadow-[3px_3px_0_black] mb-4 overflow-hidden">
          <div className="border-b-2 border-black px-5 py-3 flex justify-between items-center">
            <span className="font-bold text-sm">WPM Over Time</span>
            <span className="text-xs border-2 border-black rounded-full shadow-[1px_1px_0_black] px-2 py-0.5">{lang}</span>
          </div>

          <div className="px-1 pt-4 pb-2">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="nb-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NB.yellow} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={NB.yellow} stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="4 4" stroke={NB.gray} />

                <XAxis dataKey="t" tickFormatter={(v) => `${v}s`} />
                <YAxis />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="wpm"
                  stroke={NB.black}
                  strokeWidth={2.5}
                  fill="url(#nb-grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy */}
        <div className="border-2 border-black shadow-[3px_3px_0_black] px-5 py-5 mb-6">
          <div className="flex justify-between font-bold text-sm mb-3">
            <span>Accuracy Breakdown</span>
            <span
              className={accuracy > 90 ? "text-green-600" : "text-yellow-600"}
            >
              {accuracy}%
            </span>
          </div>

          <div className="h-4 bg-gray-200 border-2 border-black overflow-hidden mb-2">
            <div
              className={`h-full ${
                accuracy > 90 ? "bg-green-500" : "bg-yellow-400"
              } transition-all duration-700`}
              style={{ width: `${accuracy}%` }}
            />
          </div>

          <div className="flex justify-between text-sm font-semibold text-gray-500">
            <span>{correct} correct</span>
            <span className={errors > 0 ? "text-red-600" : ""}>
              ❌ {errors} errors
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 border-2 border-black bg-yellow-400 py-3 cursor-pointer hover:bg-yellow-500 font-bold shadow-[3px_3px_0_black] hover:shadow-[5px_5px_0_black] active:translate-x-1 rounded-md active:translate-y-1 active:shadow-[1px_1px_0_black] transition-all duration-200 "
            onClick={() => navigate("/test")}
          >
            ↺ Try Again
          </button>

          <button
            className="flex-1 border-2 border-black bg-white py-3 cursor-pointer hover:bg-gray-100 font-bold shadow-[3px_3px_0_black] rounded-md hover:shadow-[5px_5px_0_black] active:translate-x-1 active:translate-y-1 active:shadow-[1px_1px_0_black] transition-all duration-200"
            onClick={() => navigate("/")}
          >
            ← Home
          </button>
        </div>
      </div>
    </div>
  );
}