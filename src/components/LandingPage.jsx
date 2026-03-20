import { useNavigate } from "react-router-dom";
import { injectCSS } from "../utils/styles.js";
import { Shapes } from "./Shapes.jsx";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

const DEMO_URL =
    "https://drive.google.com/file/d/1b-bZ9YWCaB1WtTSd6fTtQFzHPemM6Fyt/preview";
const DEMO_AUDIO_URL =
    "https://drive.google.com/file/d/1b-bZ9YWCaB1WtTSd6fTtQFzHPemM6Fyt/view";

export function LandingPage() {
    const navigate = useNavigate();
    const [isDemoOpen, setIsDemoOpen] = useState(false);

    useEffect(() => {
        injectCSS();
    }, []);

    useEffect(() => {
        if (!isDemoOpen) return undefined;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setIsDemoOpen(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isDemoOpen]);

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
        <div className="min-h-screen font-[Space_Grotesk] text-black">

            {/* Announcement */}
            <div className="bg-black text-white text-center px-5 py-3 flex justify-center items-center gap-4 text-sm font-medium">
                <span>Practice with authentic code snippets from 6 programming languages</span>
                <button
                    onClick={() => navigate("/test")}
                    className="
          border-2 border-black bg-yellow-400 px-2 font-bold
          shadow-[3px_3px_0_black] transition text-black
          hover:-translate-x-[2px] hover:-translate-y-[2px] 
          active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
          "
                >
                    Try Now
                </button>
            </div>

            {/* Navbar */}
            <nav className="bg-white border-b px-10 py-4 flex justify-between items-center shadow-[0_1px_0_#eee]">
                <div className="flex items-center gap-3 text-2xl font-extrabold">
                    <span className="w-6 h-6 rounded-full bg-yellow-400 border-2 border-black" />
                    Codeurge
                </div>

                <div className="flex gap-3">


                    <button
                        onClick={() =>
                            window.open(
                                "https://github.com/codeurge123/codeurge",
                                "_blank"
                            )
                        }
                        className="
            border-2 border-black px-3 py-1 bg-white font-bold flex items-center gap-1
            shadow-[3px_3px_0_black] transition
            hover:-translate-x-[2px] hover:-translate-y-[2px] rounded-md hover:shadow-[4px_4px_0_black]
            active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_black]
            "
                    >
                        <FaStar /> Star on GitHub
                    </button>
                </div>
            </nav>

            {/* Hero */}
            <div className="relative max-w-[1100px] mx-auto px-10 py-20">
                <Shapes />

                <div className="relative z-10 max-w-[600px] animate-[fadeUp_0.6s]">

                    <span className="inline-block mb-6 border-2 rounded-full border-black px-3 py-1 bg-white text-sm font-bold shadow-[3px_3px_0_black]">
                        Professional typing practice for developers
                    </span>

                    <h1 className="text-[clamp(48px,7vw,80px)] font-extrabold leading-tight mb-6">
                        Master your <br />
                        <span className="bg-yellow-400 px-2">coding speed</span>
                    </h1>

                    <p className="text-lg text-gray-500 mb-10 max-w-[500px] leading-relaxed">
                        Improve your programming productivity with realistic code snippets. Track your WPM, accuracy, and progress across multiple languages.
                    </p>

                    <div className="flex gap-4 flex-wrap">
                        <button
                            onClick={() => navigate("/test")}
                            className="
              border-2 border-black bg-yellow-400  px-4 py-2 font-bold text-lg
              shadow-[4px_4px_0_black] transition
              hover:-translate-x-[2px] hover:-translate-y-[2px] rounded-lg hover:shadow-[6px_6px_0_black]
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
              "
                        >
                            Start Practice Session
                        </button>

                        <button
                            onClick={() => setIsDemoOpen(true)}
                            className="
              border-2 border-black bg-white px-4 py-2 font-bold text-lg
              shadow-[4px_4px_0_black] transition
              hover:-translate-x-[2px] hover:-translate-y-[2px] rounded-lg hover:shadow-[6px_6px_0_black]
              active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
              "
                        >
                            View Demo
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white border-y px-10 py-10">
                <div className="max-w-[900px] mx-auto flex justify-around flex-wrap gap-8">
                    {[
                        { n: "10+", label: "Snippets" },
                        { n: "6", label: "Languages" },
                        { n: "4", label: "Durations" },
                        { n: "100%", label: "Free" },
                    ].map((s, i) => (
                        <div key={i} className="text-center min-w-[120px]">
                            <div className="text-3xl font-extrabold mb-1">{s.n}</div>
                            <div className="text-sm font-semibold text-gray-500">
                                {s.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Features */}
            <div className="max-w-[1300px] mx-auto px-10 py-20">
                <h2 className="text-4xl font-extrabold text-center mb-4">
                    Why Choose Codeurge?
                </h2>

                <p className="text-center text-gray-500 mb-14 text-lg max-w-[600px] mx-auto">
                    Designed specifically for developers who want to improve their coding efficiency and accuracy.
                </p>

                <div className="grid  grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8">
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className="
              relative border border-black rounded bg-white px-7 py-8 text-center
              shadow-[3px_3px_0_black] transition

              before:absolute before:inset-0 before:bg-yellow-200 before:opacity-0 before:transition
              after:absolute after:inset-0 after:border after:translate-x-[4px] after:translate-y-[4px] after:-z-10

              hover:-translate-x-[3px] hover:-translate-y-[3px]
              hover:shadow-[6px_6px_0_black]
              hover:before:opacity-30
              "
                        >
                            <div className="text-4xl mb-5">{f.emoji}</div>
                            <div className="font-bold text-lg mb-2">{f.title}</div>
                            <div className="text-gray-500 text-sm leading-relaxed">
                                {f.desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="bg-black text-center px-10 py-20">
                <h2 className="text-4xl font-extrabold text-white mb-4">
                    Ready to improve your coding speed?
                </h2>

                <p className="text-white/80 mb-10 text-lg max-w-[500px] mx-auto">
                    Join thousands of developers who practice with real code every day. No signup required.
                </p>

                <button
                    onClick={() => navigate("/test")}
                    className="
          border-2 border-black bg-yellow-400 px-10 py-4 font-bold text-lg
          shadow-[4px_4px_0_black] transition
          hover:-translate-x-[2px] hover:-translate-y-[2px]
          active:translate-x-[4px] active:translate-y-[4px] active:shadow-none
          "
                >
                    Start Your First Test
                </button>
            </div>

            {isDemoOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 px-4 py-6 flex items-center justify-center animate-[fadeIn_0.25s_ease-out]"
                    onClick={() => setIsDemoOpen(false)}
                >
                    <div
                        className="w-full max-w-5xl bg-[#FAFAF8] border-2 border-black rounded-xl shadow-[8px_8px_0_black] overflow-hidden animate-[demoPop_0.32s_cubic-bezier(0.22,1,0.36,1)] origin-center"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-5 py-2 border-b-2 border-black bg-white">
                            <div>
                                <div className="text-lg font-extrabold">Codeurge Demo</div>
                                <div className="text-sm text-gray-500">
                                    Take a quick walkthrough of the product
                                </div>
                            </div>

                            <div className="flex items-center gap-3">

                                <button
                                    onClick={() => setIsDemoOpen(false)}
                                    className="border-2 border-black px-3 py-1 hover:bg-gray-100 bg-white font-bold shadow-[3px_3px_0_black] rounded-md transition hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0_black] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        <div className="bg-black">
                            <iframe
                                title="Codeurge Demo"
                                src={DEMO_URL}
                                className="w-full h-[70vh] min-h-[420px]"
                                allow="autoplay; fullscreen"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
