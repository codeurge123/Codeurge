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
    <div
      style={{
        background: NB.white,
        border: `2px solid ${NB.black}`,
        borderRadius: 4,
        padding: "8px 14px",
        boxShadow: `3px 3px 0 ${NB.black}`,
        fontFamily: "'Space Grotesk',sans-serif",
        fontSize: 12,
      }}
    >
      <div style={{ color: NB.grayText }}>t+{payload[0].payload.t}s</div>
      <div style={{ fontWeight: 800, fontSize: 16 }}>
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
    <div
      className="nb-grid"
      style={{
        minHeight: "100vh",
        fontFamily: "'Space Grotesk',sans-serif",
        color: NB.black,
      }}
    >
      <div
        style={{ maxWidth: 720, margin: "0 auto", padding: "24px 24px 60px" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
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
            <span>⌨️</span> Codeurge — Results
          </div>
          <button
            className="nb-btn nb-btn-white nb-btn-sm"
            onClick={() => navigate("/")}
          >
            ← Home
          </button>
        </div>

        {/* Grade hero */}
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 24,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              background: gc,
              border: `2px solid ${NB.black}`,
              borderRadius: 4,
              boxShadow: `6px 6px 0 ${NB.black}`,
              padding: "24px 28px",
              minWidth: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 800,
                lineHeight: 1,
                color: grade === "B" ? NB.black : NB.white,
              }}
            >
              {grade}
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color:
                  grade === "B" ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.75)",
                marginTop: 4,
              }}
            >
              {gradeLabels[grade]}
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { label: "WPM", value: wpm, color: NB.black },
              {
                label: "Accuracy",
                value: `${accuracy}%`,
                color: accuracy > 90 ? NB.green : "#E6A000",
              },
              { label: "Chars", value: totalTyped, color: NB.black },
              {
                label: "Errors",
                value: errors,
                color: errors === 0 ? NB.green : NB.red,
              },
            ].map((st, i) => (
              <div
                key={i}
                className="nb-stat-box"
                style={{ padding: "12px 16px" }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: NB.grayText,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 3,
                  }}
                >
                  {st.label}
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: st.color,
                    lineHeight: 1,
                  }}
                >
                  {st.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 20,
          }}
        >
          <div
            className="nb-card"
            style={{
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>⏱</span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: NB.grayText,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Duration
              </div>
              <div style={{ fontSize: 22, fontWeight: 800 }}>{duration}s</div>
            </div>
          </div>
          <div
            className="nb-card"
            style={{
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 24 }}>🌐</span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: NB.grayText,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                Language
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  textTransform: "capitalize",
                }}
              >
                {lang}
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div
          className="nb-card"
          style={{ marginBottom: 16, overflow: "hidden" }}
        >
          <div
            style={{
              borderBottom: `2px solid ${NB.black}`,
              padding: "12px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 700, fontSize: 14 }}>
              📈 WPM Over Time
            </span>
            <span className="nb-tag" style={{ fontSize: 11 }}>
              {lang}
            </span>
          </div>
          <div style={{ padding: "16px 4px 8px" }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart
                data={chartData}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="nb-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={NB.yellow} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={NB.yellow} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={NB.gray} />
                <XAxis
                  dataKey="t"
                  tickFormatter={(v) => `${v}s`}
                  tick={{
                    fill: NB.grayText,
                    fontSize: 11,
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                  stroke={NB.grayMid}
                />
                <YAxis
                  tick={{
                    fill: NB.grayText,
                    fontSize: 11,
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                  stroke={NB.grayMid}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="wpm"
                  stroke={NB.black}
                  strokeWidth={2.5}
                  fill="url(#nb-grad)"
                  dot={{ fill: NB.black, r: 3, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Accuracy bar */}
        <div
          className="nb-card"
          style={{ padding: "18px 20px", marginBottom: 24 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            <span>Accuracy Breakdown</span>
            <span style={{ color: accuracy > 90 ? NB.green : "#E6A000" }}>
              {accuracy}%
            </span>
          </div>
          <div
            style={{
              height: 16,
              background: NB.gray,
              borderRadius: 2,
              border: `2px solid ${NB.black}`,
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${accuracy}%`,
                background: accuracy > 90 ? NB.green : NB.yellow,
                transition: "width 0.8s ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              fontWeight: 600,
              color: NB.grayText,
            }}
          >
            <span>✅ {correct} correct</span>
            <span style={{ color: errors > 0 ? NB.red : NB.grayText }}>
              ❌ {errors} errors
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            className="nb-btn nb-btn-yellow nb-btn-lg"
            onClick={() => navigate("/test")}
            style={{ flex: 1, justifyContent: "center" }}
          >
            ↺ Try Again
          </button>
          <button
            className="nb-btn nb-btn-white nb-btn-lg"
            onClick={() => navigate("/")}
            style={{ flex: 1, justifyContent: "center" }}
          >
            ← Home
          </button>
        </div>
      </div>
    </div>
  );
}
