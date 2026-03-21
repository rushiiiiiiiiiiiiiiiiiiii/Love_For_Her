// src/pages/FunZone.jsx
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import { ArrowLeft, Heart, Sparkles, Radio } from "lucide-react";
import { Link } from "react-router-dom";
import quizzesData from "@/data/quizzes.json";
import { useGlobalMusic } from "@/hooks/useGlobalMusic";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
/**
 * FunZone.jsx
 * - Keeps all existing functionality
 * - ONLY changes the UI for `compatibility` (pastel romantic style)
 * - No other game logic is modified
 */

const SOUND_SELECT = "/sounds/button-click-289742.mp3"; // small twinkle when selecting an option
const SOUND_CELEBRATE = "/sounds/sound-effect-twinklesparkle-115095.mp3"; // small pop / sparkle
const SOUND_WHEEL = "/sounds/wheel-spin-click-slow-down-101152.mp3"; // wheel spin sound
const SOUND_RESULT = "/sounds/victory-chime-366449.mp3"; // result / victory chime

function getQuestionBatch(type, allQuestions) {
  const BATCH_SIZE = 10;
  const storageKey = type === "love-quiz" ? "loveQuizBatch" : "compatBatch";

  let batchIndex = parseInt(localStorage.getItem(storageKey) || "0");
  let start = batchIndex * BATCH_SIZE;
  let end = start + BATCH_SIZE;

  if (start >= allQuestions.length) {
    batchIndex = 0;
    start = 0;
    end = BATCH_SIZE;
  }

  localStorage.setItem(storageKey, batchIndex + 1);
  return allQuestions.slice(start, end);
}

/* -----------------------
   QuizGame (handles both love-quiz and compatibility)
   ----------------------- */
function QuizGame({ type, questions, onBack }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const { pauseMusic, resumeMusic } = useGlobalMusic();

  useEffect(() => {
    pauseMusic();
    return () => resumeMusic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // points & celebration
  const [lovePoints, setLovePoints] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  // audio refs
  const selectRef = useRef(null);
  const celebrateRef = useRef(null);
  const resultRef = useRef(null);

  useEffect(() => {
    try {
      selectRef.current = new Audio(SOUND_SELECT);
      selectRef.current.volume = 0.45;
    } catch {}
    try {
      celebrateRef.current = new Audio(SOUND_CELEBRATE);
      celebrateRef.current.volume = 0.5;
    } catch {}
    try {
      resultRef.current = new Audio(SOUND_RESULT);
      resultRef.current.volume = 0.6;
    } catch {}
    selectRef.current?.load();
    celebrateRef.current?.load();
    resultRef.current?.load();
  }, []);

  const current = questions[index];

  const handleSelect = (opt) => {
    setSelected(opt);

    // play a small select sound
    try {
      if (selectRef.current) {
        selectRef.current.currentTime = 0;
        selectRef.current.play().catch(() => {});
      }
    } catch {}

    // celebrate visually + sound
    setCelebrate(true);
    try {
      if (celebrateRef.current) {
        celebrateRef.current.currentTime = 0;
        celebrateRef.current.play().catch(() => {});
      }
    } catch {}

    setTimeout(() => setCelebrate(false), 900);
  };

  const handleNext = () => {
    if (!selected) return;

    setLovePoints((p) => p + 10);

    if (index + 1 === questions.length) {
      setShowResult(true);
      try {
        if (resultRef.current) {
          resultRef.current.currentTime = 0;
          resultRef.current.play().catch(() => {});
        }
      } catch {}
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  // Compatibility-specific metrics (purely visual)
  const compatibilityPercent = Math.min(
    100,
    Math.round((lovePoints / (questions.length * 10)) * 100),
  );

  const celebrationItems = useMemo(() => {
    return [...Array(12)].map(() => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      delay: `${Math.random() * 0.25}s`,
      size: `${14 + Math.random() * 20}px`,
    }));
  }, []);
  return (
    <div className="text-center relative animate-fade-in">
      {/* celebration layer */}
      {celebrate && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[40]">
          {celebrationItems.map((item, i) => (
            <span
              key={i}
              className="absolute celebration-pop"
              style={{
                left: item.left,
                top: item.top,
                animationDelay: item.delay,
                fontSize: item.size,
              }}
            >
              {["❤️", "💖", "✨", "💕"][Math.floor(Math.random() * 4)]}
            </span>
          ))}
        </div>
      )}

      {!showResult ? (
        <>
          <h2 className="text-3xl font-handwriting text-foreground mb-4">
            {type === "love-quiz" ? "Love Quiz 💕" : "Compatibility Game 💑"}
          </h2>

          {/* Live points */}
          <p className="text-base font-semibold text-rose-500 mb-4">
            ❤️ Love Points: <span className="font-bold">{lovePoints}</span>
          </p>

          {/* ---------- DIFFERENT UI for compatibility ---------- */}
          {type === "compatibility" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Left: big pastel meter */}
              <div className="md:col-span-1 flex flex-col items-center">
                <div className="relative w-40 h-40 md:w-48 md:h-48 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-50 to-rose-50 shadow-soft p-4">
                  {/* heart meter background */}
                  <div className="absolute inset-0 rounded-full flex items-center justify-center">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/90 flex items-center justify-center shadow-inner">
                      <Heart className="w-10 h-10 text-rose-500 animate-pulse" />
                    </div>
                  </div>

                  {/* circular progress (CSS ring) */}
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#ffe8ec"
                      strokeWidth="2.8"
                    />
                    <path
                      className="stroke-dynamic"
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      strokeLinecap="round"
                      strokeWidth="2.8"
                      strokeDasharray={`${compatibilityPercent}, 100`}
                    />
                    <text
                      x="18"
                      y="19.5"
                      fontSize="4"
                      textAnchor="middle"
                      fill="#ff6b8a"
                      fontWeight="700"
                    >
                      {compatibilityPercent}%
                    </text>
                  </svg>
                </div>

                <p className="mt-3 text-sm text-muted-foreground max-w-[160px]">
                  Compatibility meter shows how playfully close we are during
                  this mini-game.
                </p>
              </div>

              {/* Middle: question */}
              <div className="md:col-span-2">
                <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-6 shadow-soft border border-pink-100">
                  <h3 className="text-xl font-semibold mb-3 text-rose-700">
                    {current.question}
                  </h3>

                  {/* options grid (2x2 on desktop) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {current.options.map((opt) => {
                      const active = selected === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelect(opt)}
                          className={`relative overflow-hidden rounded-xl p-4 text-left transition transform
                            ${active ? "scale-[1.02] shadow-lg" : "md:hover:scale-[1.01]"}
                            ${active ? "bg-gradient-to-br from-rose-500 to-primary text-white" : "bg-white/80 border border-pink-100"}
                          `}
                        >
                          <div className="flex items-start gap-3">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-white/20" : "bg-rose-50"}`}
                            >
                              <span
                                className={`text-xl ${active ? "text-white" : "text-rose-500"}`}
                              >
                                💫
                              </span>
                            </div>
                            <div className="flex-1">
                              <div
                                className={`font-medium ${active ? "text-white" : "text-rose-800"}`}
                              >
                                {opt}
                              </div>
                              <div
                                className={`text-xs mt-1 ${active ? "text-white/90" : "text-muted-foreground"}`}
                              >
                                {/* playful subtext generated for UI feel */}
                                {active
                                  ? "You chose this — nice!"
                                  : "Tap to choose this option"}
                              </div>
                            </div>
                            {/* small tick */}
                            <div
                              className={`ml-2 flex items-center justify-center w-6 h-6 rounded-full ${active ? "bg-white/20 text-white" : "bg-transparent text-pink-400"}`}
                            >
                              {active ? "✓" : ""}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* bottom controls */}
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Question {index + 1} of {questions.length}
                    </div>
                    <div className="flex items-center gap-3">
                      <Button onClick={handleNext} disabled={!selected}>
                        {index + 1 === questions.length
                          ? "See Result 💖"
                          : "Next ➜"}
                      </Button>
                      <Button variant="outline" onClick={onBack}>
                        Back
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ---------- Default love-quiz UI (keeps previous look) ---------- */
            <div>
              <h3 className="text-xl font-semibold mb-4">{current.question}</h3>

              <div className="space-y-3 mb-8 relative z-10">
                {current.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(opt)}
                    className={`w-full p-4 rounded-lg border transition ${selected === opt ? "bg-primary text-white border-primary scale-[1.03]" : "bg-background/40 border-border/50"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <div className="flex flex-col md:flex-row gap-3 justify-center items-center">
                <Button onClick={handleNext} disabled={!selected}>
                  {index + 1 === questions.length ? "See Result 💖" : "Next ➜"}
                </Button>

                <Button variant="outline" onClick={onBack} className="md:ml-2">
                  Back
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="animate-fade-in">
          <h2 className="text-3xl font-handwriting mb-6">
            {type === "love-quiz"
              ? "Your Love Quiz Result 💕"
              : "Your Compatibility Result 💑"}
          </h2>

          <div className="bg-gradient-to-r from-primary/10 to-rose/10 p-6 rounded-xl border border-primary/20 mb-6">
            <p className="text-2xl font-handwriting text-rose-600 mb-2">
              You earned:
            </p>

            <p className="text-1xl font-bold text-rose-500 animate-pulse drop-shadow-[0_0_10px_rgba(255,80,120,0.35)] mb-4">
              ❤️ Love Points: {lovePoints}
            </p>

            <p className="text-lg text-foreground leading-relaxed">
              {type === "love-quiz"
                ? "Your answers were so adorable… I love knowing these little things about you ❤️"
                : `Compatibility score: ${compatibilityPercent}%. We’re beautifully synced! 💑✨`}
            </p>
          </div>

          <Button size="lg" onClick={onBack}>
            Back to Games
          </Button>
        </div>
      )}

      {/* celebration CSS */}
      <style>{`
        .celebration-pop {
          position: absolute;
          opacity: 0;
          transform: translateY(12px) scale(0.7);
          animation: popUp 950ms cubic-bezier(.16,.84,.44,1) forwards;
          pointer-events: none;
          text-shadow: 0 6px 14px rgba(0,0,0,0.08);
        }
        @keyframes popUp {
          0% { opacity: 0; transform: translateY(16px) scale(0.6) rotate(0deg); }
          40% { opacity: 1; transform: translateY(-6px) scale(1.08) rotate(6deg); }
          100% { opacity: 0; transform: translateY(-36px) scale(0.9) rotate(-6deg); }
        }

        /* Soft drop shadows and subtle glow for pastel cards */
        .shadow-soft {
          box-shadow: 0 10px 30px rgba(255,150,170,0.10), inset 0 1px 0 rgba(255,255,255,0.6);
        }

        /* stroke animation if needed */
        .stroke-dynamic {
          stroke: url(#dummy); /* fallback */
        }
      `}</style>
    </div>
  );
}

/* ==========================================================
   MAIN FUN ZONE PAGE (keeps all games intact)
   ========================================================== */
export default function FunZone() {
  const [activeGame, setActiveGame] = useState(null);
  const [wheelSpinning, setWheelSpinning] = useState(false);
  const [wheelResult, setWheelResult] = useState(null);
  const [compliment, setCompliment] = useState(null);
  const resultRef = useRef(null);
  const profile = useMemo(() => storage.getUserProfile(), []);
  const name = profile?.name || "My Love";
  // wheel audio ref
  const navigate = useNavigate();
  const wheelRef = useRef(null);

  useEffect(() => {
    try {
      wheelRef.current = new Audio(SOUND_WHEEL);
      wheelRef.current.volume = 0.45;

      resultRef.current = new Audio(SOUND_RESULT);
      resultRef.current.volume = 0.5;
    } catch {}
  }, []);

  const spinWheel = () => {
    setWheelSpinning(true);
    try {
      if (wheelRef.current) {
        wheelRef.current.currentTime = 0;
        wheelRef.current.play().catch(() => {});
      }
    } catch {}

    setTimeout(() => {
      const randomOption =
        quizzesData.wheelOptions[
          Math.floor(Math.random() * quizzesData.wheelOptions.length)
        ];
      setWheelResult(randomOption);
      setWheelSpinning(false);
      try {
        if (wheelRef.current) {
          wheelRef.current.pause();
          wheelRef.current.currentTime = 0;
        }
      } catch {}
      try {
        resultRef.current?.play().catch(() => {});
      } catch {}
    }, 1800);
  };

  const getCompliment = () => {
    const randomCompliment =
      quizzesData.compliments[
        Math.floor(Math.random() * quizzesData.compliments.length)
      ];
    setCompliment(randomCompliment);
    try {
      const a = new Audio(SOUND_CELEBRATE);
      a.volume = 0.45;
      a.play().catch(() => {});
    } catch {}
  };

  const games = useMemo(
    () => [
      {
        id: "love-quiz",
        title: "Love Quiz",
        emoji: "💕",
        description: "Answer cute questions about us",
        gradient: "from-rose to-primary",
      },
      {
        id: "compatibility",
        title: "Compatibility Game",
        emoji: "💑",
        description: "Let's see how perfectly we match",
        gradient: "from-lavender to-peach",
      },
      {
        id: "wheel",
        title: "Wheel of Love",
        emoji: "🎡",
        description: "Spin and see what I'll do for you",
        gradient: "from-primary to-rose",
      },
      {
        id: "compliments",
        title: "Random Compliment",
        emoji: "✨",
        description: "Get a sweet compliment from me",
        gradient: "from-peach to-gold",
      },
    ],
    [],
  );

  const BackgroundLayer = useMemo(
    () => (
      <>
        <HeartAnimation />
        <BackgroundText />
      </>
    ),
    [],
  );
  
const goHome = () => {
  import("../pages/Home");

  setTimeout(() => {
    navigate("/home", { replace: true });
  }, 50);
};
  return (
    <div className="min-h-screen romantic-gradient relative">
      {BackgroundLayer}

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
          <button onClick={goHome}
            className="
    flex items-center gap-2 px-5 py-2.5 rounded-full
    bg-white/40 backdrop-blur-md border border-white/40
    text-rose-700 font-medium
    shadow-sm
    transition-transform duration-200 ease-out
    hover:bg-white/60 hover:translate-x-[-2px]
    active:scale-95
    will-change-transform
    touch-manipulation
    "
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap">Back Home</span>
          </button>

        <div className="text-center mb-12 animate-fade-in">
          <div className="text-6xl mb-4">🎮</div>
          <h1 className="text-4xl md:text-5xl font-handwriting text-foreground mb-3">
            Fun Zone
          </h1>
          <p className="text-muted-foreground text-lg">
            Games and activities just for us
          </p>
        </div>

        {!activeGame ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {games.map((game, index) => (
              <Card
                key={game.id}
                className="p-8 hover:shadow-[var(--shadow-romantic)] transition-all duration-300 md:hover:scale-105 bg-card/95 backdrop-blur cursor-pointer group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => setActiveGame(game.id)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {game.emoji}
                  </div>
                  <h3 className="text-2xl font-handwriting text-foreground mb-2">
                    {game.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {game.description}
                  </p>
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${game.gradient}`}
                  />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Wheel */}
            {activeGame === "wheel" && (
              <Card className="p-8 bg-card/95 backdrop-blur shadow-[var(--shadow-romantic)]">
                <div className="text-center">
                  <h2 className="text-3xl font-handwriting text-foreground mb-6">
                    Wheel of Love 🎡
                  </h2>

                  <div
                    className={`w-64 h-64 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-rose flex items-center justify-center ${
                      wheelSpinning ? "animate-[spin_1.8s_linear]" : ""
                    }`}
                  >
                    <Radio className="w-32 h-32 text-white" />
                  </div>

                  {wheelResult && (
                    <div className="bg-background/50 rounded-lg p-6 border border-border/50 mb-6">
                      <h3 className="font-semibold text-foreground text-xl mb-2">
                        I will:
                      </h3>
                      <p className="text-foreground/90 text-lg">
                        {wheelResult}
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button
                      onClick={spinWheel}
                      disabled={wheelSpinning}
                      size="lg"
                    >
                      {wheelSpinning ? "Spinning..." : "Spin the Wheel"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveGame(null)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Compliment */}
            {activeGame === "compliments" && (
              <Card className="p-8 bg-card/95 backdrop-blur shadow-[var(--shadow-romantic)]">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 mx-auto mb-6 text-primary" />
                  <h2 className="text-3xl font-handwriting text-foreground mb-6">
                    Your Random Compliment ✨
                  </h2>

                  {compliment && (
                    <div className="bg-gradient-to-r from-primary/10 to-rose/10 rounded-lg p-8 border border-primary/20 mb-6">
                      <p className="text-2xl font-handwriting text-foreground leading-relaxed">
                        "{compliment}"
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center">
                    <Button onClick={getCompliment} size="lg">
                      <Heart className="w-5 h-5 mr-2" />
                      Get Compliment
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => setActiveGame(null)}
                    >
                      Back
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Quiz Games (love-quiz + compatibility) */}
            {(activeGame === "love-quiz" || activeGame === "compatibility") && (
              <Card className="p-8 bg-card/95 backdrop-blur shadow-[var(--shadow-romantic)]">
                <QuizGame
                  type={activeGame}
                  questions={
                    activeGame === "love-quiz"
                      ? getQuestionBatch("love-quiz", quizzesData.loveQuiz)
                      : getQuestionBatch(
                          "compatibility",
                          quizzesData.compatibilityGame,
                        )
                  }
                  onBack={() => setActiveGame(null)}
                />
              </Card>
            )}
          </div>
        )}

        <Card className="mt-8 p-8 bg-gradient-to-r from-primary/10 to-rose/10 border-primary/20 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-rose fill-rose animate-pulse-soft" />
          <p className="text-foreground/90 italic">
            "Having fun with you is my favorite thing in the world, {name} 💕"
          </p>
        </Card>
      </div>
    </div>
  );
}
