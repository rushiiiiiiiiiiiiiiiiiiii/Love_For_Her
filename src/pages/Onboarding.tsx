// ⭐⭐⭐ FULL UPDATED CODE WITH BUTTON SOUNDS ⭐⭐⭐

import React, { useState, useEffect, useRef, useMemo } from "react";

import { useNavigate } from "react-router-dom";
import {
  Heart,
  Lock,
  Sparkles,
  Delete,
  Moon,
  Sun,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  // const [confirmPin, setConfirmPin] = useState("");
  // const [isConfirmMode, setIsConfirmMode] = useState(false);
  const [theme, setTheme] = useState("light");
const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
  // Visual State
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [spotlightPos, setSpotlightPos] = useState({ x: "50%", y: "50%" });
  const [isExiting, setIsExiting] = useState(false);

  // Interactive Effects State
  const [ripples, setRipples] = useState([]);
  const [clickSparkles, setClickSparkles] = useState([]);
  const rippleIdRef = useRef(0);
  const sparkleIdRef = useRef(0);

  // -----------------------
  // ⭐ SOUND EFFECTS
  // -----------------------
  const clickRef = useRef(null);
  const softRef = useRef(null);

  useEffect(() => {
    try {
      clickRef.current = new Audio(
        "/sounds/sound-effect-twinklesparkle-115095.mp3",
      );
      clickRef.current.volume = 0.5;

      softRef.current = new Audio("/sounds/toy-piano-key-g-102603.mp3");
      softRef.current.volume = 0.4;
    } catch {}
  }, []);

  const playClick = () => {
    try {
      clickRef.current.currentTime = 0;
      clickRef.current.play().catch(() => {});
    } catch {}
  };

  const playSoft = () => {
    try {
      softRef.current.currentTime = 0;
      softRef.current.play().catch(() => {});
    } catch {}
  };

  // -------------------------------------
  // EFFECT: Parallax & Spotlight
  // -------------------------------------
 useEffect(() => {
  if (isMobile) return;

  let ticking = false;

  const handleMouseMove = (e) => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      mousePosRef.current = { x, y };
      setSpotlightPos({ x: `${e.clientX}px`, y: `${e.clientY}px` });

      ticking = false;
    });
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, [isMobile]);

  const petals = useMemo(() => {
    const count = isMobile ? 14 : 20;
    return [...Array(count)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${8 + Math.random() * 5}s`,
      scale: 0.5 + Math.random() * 0.5,
    }));
  }, [isMobile]);
  const particles = useMemo(() => {
    const count = isMobile ? 16 : 25;
    return [...Array(count)].map(() => ({
      width: Math.random() * 3 + 1,
      height: Math.random() * 3 + 1,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: `${15 + Math.random() * 20}s`,
      delay: `${Math.random() * 5}s`,
    }));
  }, []);
  // -------------------------------------
  // GLOBAL CLICK EFFECTS
  // -------------------------------------
  const handleGlobalClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    rippleIdRef.current += 1;
    const newRippleId = rippleIdRef.current;
    if (ripples.length > 6) return;
setRipples((prev) => [...prev, { x, y, id: newRippleId }]);
    setTimeout(
      () => setRipples((prev) => prev.filter((r) => r.id !== newRippleId)),
      1000,
    );

    const sparkCount = isMobile ? 6 : 8;
    const newSparkles = Array.from({ length: sparkCount }).map(() => {
      sparkleIdRef.current += 1;
      return { x, y, id: sparkleIdRef.current };
    });

    setClickSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setClickSparkles((prev) =>
        prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id)),
      );
    }, 1000);
  };

  // -------------------------------------
  // HANDLERS
  // -------------------------------------
  const handleNameSubmit = (e) => {
    e?.stopPropagation();
    playClick();

    if (name.trim().length < 2) {
      toast.error("Please enter your name, my love");
      return;
    }
    setStep(2);
  };

  const handlePress = (num, e) => {
    e.stopPropagation();
    playSoft();

    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        setTimeout(() => setStep(3), 300); // ⭐ directly go to theme step
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    playSoft();
    setPin(pin.slice(0, -1));
  };

  // Auto-submit PIN when confirm reaches 4
  // useEffect(() => {
  //   if (isConfirmMode && confirmPin.length === 4) {
  //     if (pin !== confirmPin) {
  //       toast.error("The keys don't match. Try again?");
  //       setConfirmPin("");
  //       setPin("");
  //       setIsConfirmMode(false);
  //     } else {
  //       setTimeout(() => setStep(3), 300);
  //     }
  //   }
  // }, [confirmPin, isConfirmMode, pin]);

  const handleComplete = (e) => {
    e?.stopPropagation();
    playClick();

    setIsExiting(true);

    storage.setUserProfile({
      name: name.trim(),
      pin,
      theme,
      setupComplete: true,
    });
    storage.setTheme(theme);
    storage.unlock(); 

    setTimeout(() => {
      toast.success(`Welcome home, ${name}. ❤️`);
      navigate("/home");
    }, 1000);
  };

  // -------------------------------------
  // PAGE STYLES
  // -------------------------------------
  const backgroundStyle =
    theme === "light"
      ? "radial-gradient(circle at center, #fff0f5 0%, #ffe4e8 100%)"
      : "radial-gradient(circle at center, #2d1b2e 0%, #1a1016 100%)";

  const textGradient =
    theme === "light"
      ? "from-rose-500 to-rose-700"
      : "from-rose-300 to-rose-100";

  const cardBg =
    theme === "light"
      ? "bg-white/30 border-white/50"
      : "bg-black/30 border-white/10";

  // -------------------------------------
  // RETURN UI
  // -------------------------------------
  return (
    <div
      className={`min-h-screen relative overflow-hidden flex items-center justify-center p-4 transition-all duration-1000 background-breathe ${
        isExiting ? "scale-110 opacity-0 blur-lg" : "opacity-100"
      }`}
      style={{ background: backgroundStyle }}
      onClick={handleGlobalClick}
    >
      {/* TEXTURE */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none z-0 mix-blend-overlay"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`,
        }}
      ></div>

      {/* PETALS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {petals.map((p, i) => (
          <div
            key={i}
            className="white-petal"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: theme === "light" ? 0.6 : 0.2,
              transform: `scale(${p.scale})`,
            }}
          />
        ))}
      </div>

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {particles.map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full blur-[1px] animate-float ${
              theme === "light" ? "bg-white" : "bg-rose-200/20"
            }`}
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${15 + Math.random() * 20}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* CLOUD PARALLAX */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className={`cloud cloud1 ${
            theme === "dark" ? "opacity-[0.08]" : "opacity-60"
          }`}
          style={{
            transform: `translate3d(${mousePosRef.current.x * 20}px, ${mousePosRef.current.y * 10}px,0)`,
          }}
        ></div>
        <div
          className={`cloud cloud2 ${
            theme === "dark" ? "opacity-[0.08]" : "opacity-60"
          }`}
          style={{
            transform: `translate3d(${mousePosRef.current.x * -20}px, ${mousePosRef.current.y * -10}px, 0)`,
          }}
        ></div>
      </div>

      {/* RIPPLE EFFECTS */}
      {ripples.map((r) => (
        <span key={r.id} className="ripple" style={{ top: r.y, left: r.x }} />
      ))}

      {/* CLICK SPARKLES */}
      {clickSparkles.map((s) => (
        <Sparkles
          key={s.id}
          className="click-sparkle text-rose-300/80"
          style={{ left: s.x, top: s.y }}
        />
      ))}

      {/* SPOTLIGHT */}
      <div
        className={`absolute w-[600px] h-[600px] blur-[100px] rounded-full pointer-events-none transition-opacity duration-700 z-0 ${
          theme === "light" ? "bg-rose-400/20" : "bg-rose-500/15"
        }`}
        style={{
          left: spotlightPos.x,
          top: spotlightPos.y,
          transform: "translate(-50%, -50%)",
        }}
      ></div>

      {/* MAIN CARD */}
      <div
        className={`relative z-20 w-full max-w-md transition-all duration-500 ${
          step === 2 ? "max-w-sm" : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`backdrop-blur-xl shadow-[0_8px_32px_rgba(31,38,135,0.1)] rounded-3xl p-8 md:p-10 border ${cardBg} transition-all duration-500 relative overflow-hidden`}
        >
          {/* PROGRESS BAR */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gray-200/20">
            <div
              className="h-full bg-rose-500 transition-all duration-500"
              style={{ width: `${(step / 3) * 100}%` }}
            ></div>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center">
                <Heart
                  className={`w-16 h-16 mx-auto animate-heartbeat ${
                    theme === "light" ? "text-rose-500" : "text-rose-400"
                  }`}
                  fill="currentColor"
                />
                <h1
                  className={`text-4xl md:text-5xl font-handwriting font-bold bg-clip-text text-transparent bg-gradient-to-br ${textGradient} mb-3`}
                >
                  Before We Begin...
                </h1>
                <p
                  className={`text-lg ${
                    theme === "light" ? "text-rose-900/60" : "text-rose-100/60"
                  }`}
                >
                  Can you please Enter your good name, my love?
                </p>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your beautiful name..."
                  className={`
      w-full bg-transparent border-b-2 py-3 text-center 
      text-3xl font-serif tracking-wide
      placeholder:text-lg placeholder:opacity-40
      outline-none transition-all duration-300
      ${
        theme === "light"
          ? "border-rose-200 text-rose-900 focus:border-rose-500 placeholder-rose-300"
          : "border-rose-800 text-rose-100 focus:border-rose-400 placeholder-rose-700"
      }
    `}
                  autoFocus
                />
                <Sparkles className="absolute right-2 top-3 w-5 h-5 text-rose-400 opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 animate-spin-slow" />
              </div>

              <button
                onClick={handleNameSubmit}
                disabled={name.length < 2}
                className="w-full py-4 rounded-2xl font-medium text-lg tracking-wide shadow-lg flex items-center justify-center gap-2 bg-gradient-to-r from-rose-400 to-rose-600 text-white"
              >
                Continue <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6 animate-fade-in-up text-center">
              <h3 className="text-2xl md:text-3xl font-['Parisienne']">
                This world opens only for your touch..
              </h3>

              <div className="flex items-center justify-between mb-4 w-full">
                <button
                  onClick={() => {
                    playClick();
                    setStep(1);
                  }}
                  className="p-2 rounded-full"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center">
                  <Lock className="w-8 h-8 mb-2 text-rose-500" />
                  <h2 className="text-2xl font-handwriting">
                    Create a Secret Key
                  </h2>
                </div>

                <div className="w-10"></div>
              </div>

              {/* PIN DOTS */}
              <div className="flex justify-center gap-4 mb-6">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full ${
                      pin.length > i ? "bg-rose-500" : "bg-rose-200"
                    }`}
                  ></div>
                ))}
              </div>

              {/* KEYPAD */}
              <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    onClick={(e) => handlePress(num, e)}
                    className="h-16 w-16 rounded-full bg-white/40 text-rose-900 text-2xl backdrop-blur-sm"
                  >
                    {num}
                  </button>
                ))}

                <div className="h-16 w-16"></div>

                <button
                  onClick={(e) => handlePress("0", e)}
                  className="h-16 w-16 rounded-full bg-white/40 text-rose-900 text-2xl"
                >
                  0
                </button>

                <button
                  onClick={handleDelete}
                  className="h-16 w-16 rounded-full text-rose-500"
                >
                  <Delete className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center space-y-2">
                <Sparkles className="w-12 h-12 mx-auto animate-spin-slow text-amber-400" />
                <h1 className="text-4xl font-handwriting font-bold">
                  Set the Mood
                </h1>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* LIGHT THEME */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setTheme("light");
                  }}
                  className={`
          group relative p-6 rounded-2xl border-2 transition-all duration-500 
          flex flex-col items-center gap-3 overflow-hidden

          ${
            theme === "light"
              ? "border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.4)] scale-[1.04] bg-gradient-to-br from-rose-50 to-pink-100"
              : "border-transparent bg-white/40 hover:bg-white/60"
          }
        `}
                >
                  {/* Glow Ring */}
                  {theme === "light" && (
                    <div className="absolute inset-0 rounded-2xl bg-rose-300/30 blur-xl animate-pulse"></div>
                  )}

                  <Sun
                    className={`w-10 h-10 relative z-10 ${
                      theme === "light"
                        ? "text-rose-600 drop-shadow-lg"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`relative z-10 font-medium ${
                      theme === "light" ? "text-rose-900" : "text-gray-700"
                    }`}
                  >
                    Morning
                  </span>
                </button>

                {/* DARK THEME */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClick();
                    setTheme("dark");
                  }}
                  className={`
          group relative p-6 rounded-2xl border-2 transition-all duration-500 
          flex flex-col items-center gap-3 overflow-hidden

          ${
            theme === "dark"
              ? "border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] scale-[1.04] bg-gradient-to-br from-slate-900 to-purple-900"
              : "border-transparent bg-white/40 hover:bg-slate-800/10"
          }
        `}
                >
                  {/* Glow Ring */}
                  {theme === "dark" && (
                    <div className="absolute inset-0 rounded-2xl bg-purple-400/20 blur-xl animate-pulse"></div>
                  )}

                  <Moon
                    className={`w-10 h-10 relative z-10 ${
                      theme === "dark"
                        ? "text-purple-300 drop-shadow-lg"
                        : "text-gray-600"
                    }`}
                  />
                  <span
                    className={`relative z-10 font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-700"
                    }`}
                  >
                    Midnight
                  </span>
                </button>
              </div>

              <button
                onClick={handleComplete}
                className="w-full py-4 rounded-2xl bg-rose-500 text-white text-lg mt-4 shadow-lg hover:bg-rose-600 transition"
              >
                Enter Our World
              </button>
            </div>
          )}
        </div>
      </div>

      {/* GLOBAL STYLES */}
      <style>{`
        .white-petal {
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 100% 0 100% 0;
          animation: falling linear infinite;
          top: -10%;
        }

        @keyframes falling {
          0% { transform: translate(0, -10px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translate(-20px, 110vh) rotate(360deg); opacity: 0; }
        }

        .animate-float {
          animation: float 5s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -10px); }
        }

        .ripple {
          position: absolute;
          border-radius: 50%;
          width: 10px;
          height: 10px;
          background: rgba(255,255,255,0.4);
          animation: rippleAnim 0.8s forwards;
        }

        @keyframes rippleAnim {
          0% { transform: scale(0.2); opacity: 0.6; }
          100% { transform: scale(20); opacity: 0; }
        }

        .click-sparkle {
          position: absolute;
          width: 16px;
          height: 16px;
          animation: sparkleBurst 0.8s ease-out forwards;
        }

        @keyframes sparkleBurst {
          0% { opacity: 1; transform: scale(0); }
          100% { opacity: 0; transform: scale(1.5) translateY(-40px); }
        }

        .cloud {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%);
          width: 500px;
          height: 300px;
          filter: blur(45px);
        }

        .cloud1 { top: -100px; left: -100px; }
        .cloud2 { bottom: -100px; right: -100px; }
      `}</style>
    </div>
  );
}
