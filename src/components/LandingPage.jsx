import { useNavigate } from "react-router-dom";
import { NB } from "../constants/theme.js";
import { injectCSS } from "../utils/styles.js";
import { Shapes } from "./Shapes.jsx";
import { useEffect } from "react";

export function LandingPage() {
  const navigate = useNavigate();
  useEffect(() => {
    injectCSS();
  }, []);

  const features = [
    {
      emoji: "",
      title: "Real Code Snippets",
      desc: "Practice with authentic code from 6 programming languages. Each test uses unique snippets that match real development scenarios.",
    },
    {
      emoji: "",
      title: "Live Analytics",
      desc: "Real-time WPM and accuracy tracking with detailed performance metrics. Know your progress instantly.",
    },
    {
      emoji: "",
      title: "Multiple Durations",
      desc: "Choose from 15, 30, 60, or 120-second tests. Perfect for quick practice or comprehensive speed building.",
    },
    {
      emoji: "",
      title: "Performance Reports",
      desc: "Comprehensive results with WPM graphs, accuracy breakdowns, and performance grades to track improvement.",
    },
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
      {/* Announcement bar */}
      <div
        style={{
          background: NB.black,
          color: NB.white,
          textAlign: "center",
          padding: "12px 20px",
          fontSize: 14,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
        }}
      >
        <span>
          ✨ Practice with authentic code snippets from 6 programming languages
        </span>
        <button
          className="nb-btn nb-btn-yellow nb-btn-sm"
          onClick={() => navigate("/test")}
        >
          Try Now
        </button>
      </div>

      {/* Nav */}
      <nav
        style={{
          background: NB.white,
          borderBottom: `1px solid ${NB.gray}`,
          padding: "16px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: `0 1px 0 ${NB.offwhite}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontWeight: 800,
            fontSize: 22,
          }}
        >
          Codeurge
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: "999px",
              background: NB.yellow,
              border: `2px solid ${NB.black}`,
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button
            className="nb-btn nb-btn-white nb-btn-sm"
            onClick={() => navigate("/test")}
          >
            Start Test
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          position: "relative",
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 40px 60px",
          overflow: "visible",
        }}
      >
        <Shapes />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 600,
            animation: "fadeUp 0.6s both",
          }}
        >
          <span
            className="nb-tag"
            style={{
              marginBottom: 24,
              display: "inline-flex",
              background: NB.white,
              color: NB.black,
            }}
          >
            Professional typing practice for developers
          </span>

          <h1
            style={{
              fontSize: "clamp(48px,7vw,80px)",
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              marginTop: 20,
              marginBottom: 24,
              color: NB.black,
            }}
          >
            Master your
            <br />
            <span
              style={{
                background: NB.yellow,
                padding: "0 8px",
                display: "inline-block",
                lineHeight: 1.15,
                color: NB.black,
              }}
            >
              coding speed
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: NB.grayText,
              lineHeight: 1.6,
              maxWidth: 500,
              marginBottom: 40,
            }}
          >
            Improve your programming productivity with realistic code snippets.
            Track your WPM, accuracy, and progress across multiple languages.
          </p>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <button
              className="nb-btn nb-btn-yellow nb-btn-lg"
              onClick={() => navigate("/test")}
              style={{ fontSize: 16, padding: "16px 32px" }}
            >
              Start Practice Session
            </button>
            <button
              className="nb-btn nb-btn-white nb-btn-lg"
              onClick={() => navigate("/test")}
              style={{ fontSize: 16, padding: "16px 32px" }}
            >
              View Demo
            </button>
          </div>
        </div>
      </div>

      {/* Stats banner */}
      <div
        style={{
          background: NB.white,
          borderTop: `1px solid ${NB.gray}`,
          borderBottom: `1px solid ${NB.gray}`,
          padding: "40px 40px",
          boxShadow: `inset 0 1px 0 ${NB.offwhite}, inset 0 -1px 0 ${NB.gray}`,
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: 32,
          }}
        >
          {[
            { n: "10+", label: "Code Snippets" },
            { n: "6", label: "Languages" },
            { n: "4", label: "Test Durations" },
            { n: "100%", label: "Free & Open Source" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", minWidth: 120 }}>
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 800,
                  color: NB.black,
                  marginBottom: 4,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: NB.grayText,
                  letterSpacing: 0.5,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "80px 40px" }}>
        <h2
          style={{
            fontSize: 40,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 12,
            color: NB.black,
          }}
        >
          Why Choose Codeurge?
        </h2>
        <p
          style={{
            textAlign: "center",
            color: NB.grayText,
            marginBottom: 60,
            fontSize: 18,
            maxWidth: 600,
            margin: "0 auto 60px",
          }}
        >
          Designed specifically for developers who want to improve their coding
          efficiency and accuracy.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: 32,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="nb-card"
              style={{
                padding: "32px 28px",
                textAlign: "center",
                border: `1px solid ${NB.gray}`,
                background: NB.white,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 20 }}>{f.emoji}</div>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 18,
                  marginBottom: 12,
                  color: NB.black,
                }}
              >
                {f.title}
              </div>
              <div
                style={{ color: NB.grayText, fontSize: 15, lineHeight: 1.6 }}
              >
                {f.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div
        style={{
          background: NB.black,
          borderTop: `1px solid ${NB.gray}`,
          padding: "80px 40px",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 42,
            fontWeight: 800,
            color: NB.white,
            marginBottom: 16,
          }}
        >
          Ready to improve your coding speed?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.8)",
            marginBottom: 40,
            fontSize: 18,
            maxWidth: 500,
            margin: "0 auto 40px",
          }}
        >
          Join thousands of developers who practice with real code every day. No
          signup required.
        </p>
        <button
          className="nb-btn nb-btn-yellow nb-btn-lg"
          onClick={() => navigate("/test")}
          style={{ fontSize: 18, padding: "18px 40px" }}
        >
          Start Your First Test
        </button>
      </div>
    </div>
  );
}
