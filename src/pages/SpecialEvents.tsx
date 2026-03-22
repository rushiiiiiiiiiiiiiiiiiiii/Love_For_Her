import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import { ArrowLeft, Heart } from "lucide-react";
import { storage } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
export default function SpecialEvents() {
  const profile = useMemo(() => storage.getUserProfile(), []);
  const name = profile?.name || "My Love";
  const navigate = useNavigate();
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
    <div className="min-h-screen relative bg-gradient-to-b from-pink-100 via-pink-200 to-pink-300 overflow-hidden pb-32">
      {BackgroundLayer}

      {/* EXTRA STYLES */}
      <style>{`
        .fade-up {
  animation: fadeUp 1s ease forwards;
  will-change: transform, opacity;
}
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
/* 🩷✨ Aesthetic Romantic Progress Bars ✨🩷 */

.story-meter {
  width: 100%;
  height: 14px;
  background: rgba(255, 255, 255, 0.45);
  border-radius: 50px;
  overflow: hidden;
  margin-top: 12px;
  position: relative;
  box-shadow:
    inset 0 2px 6px rgba(255, 255, 255, 0.7),
    inset 0 -2px 6px rgba(0, 0, 0, 0.08),
    0 4px 14px rgba(255, 150, 170, 0.25);
}

.story-meter::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 14px;
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0.65),
    rgba(255,255,255,0.15)
  );
  pointer-events: none;
}

.story-meter-fill {
  height: 100%;
  background: linear-gradient(
    90deg,
    #ff5b8a,
    #ff82a6,
    #ff9fbd,
    #ffbdd1
  );
  background-size: 300% 100%;
  animation:
    fillBar 2.2s ease forwards,
    shine 3s infinite linear;
  border-radius: 50px;
  box-shadow:
    0 0 12px rgba(255, 120, 150, 0.55),
    0 0 25px rgba(255, 175, 200, 0.6);
}

@keyframes shine {
  0% { background-position: 0% 0%; }
  100% { background-position: -300% 0%; }
}
@keyframes certificateGlow {
  0% { box-shadow: 0 0 10px rgba(255,120,150,0.15); }
  50% { box-shadow: 0 0 45px rgba(255,120,150,0.35); }
  100% { box-shadow: 0 0 10px rgba(255,120,150,0.15); }
}

@keyframes fillBar {
  0% { width: 0%; }
  100% { width: var(--fill); }
}

        .certificate-paper {
          width: 100%;
          max-width: 520px;
          aspect-ratio: 1 / 1.41;
          background: #fff8f0;
          border: 2px solid #e8c9a8;
          border-radius: 12px;
          padding: 24px 20px;
          margin-left: auto;
          margin-right: auto;
        }

        @media (min-width: 768px) {
          .certificate-paper {
            aspect-ratio: unset;
            height: auto;
            padding: 40px 50px;
            max-width: 600px;
          }
        }

        .glass {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(18px);
          border-radius: 28px;
          border: 1px solid rgba(255, 255, 255, 0.45);
          box-shadow: 0 8px 40px rgba(0,0,0,0.12);
        }

        .divider-flower {
          width: 260px;
          height: 120px;
          margin: 0 auto -20px auto;
          background-image: url('/icons/flower.png');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          transform: translateY(-10px);
        }
      `}</style>

      {/* CONTENT */}
      <div className="relative z-10 container mx-auto px-6 max-w-4xl">
        <div className="pt-10 pb-6 fade-up">
          <Button
            onClick={goHome}
            className="mb-6 flex items-center gap-2 rounded-full px-5 py-2 
    bg-white/40 backdrop-blur-md border border-white/40 
    text-rose-700 hover:bg-white/60 
    shadow-[0_6px_20px_rgba(255,120,150,0.25)] 
    transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Button>
        </div>

        <h1 className="fade-up text-center text-6xl md:text-7xl font-handwriting text-pink-900 mb-4">
          The Story of Us ❤️
        </h1>

        <p className="fade-up text-center text-lg text-pink-900/70 max-w-2xl mx-auto mb-16 leading-relaxed">
          A soft, honest, beautiful journey of two people who weren’t perfect —
          but perfect for each other.
        </p>

        {/* MAIN SECTION */}
        <div className="glass p-10 fade-up">
          <h2 className="text-4xl md:text-5xl font-handwriting text-center text-pink-800 mb-2">
            Why Our Love Is Different 🌟
          </h2>

          <div className="divider-flower" />

          {/* STORY BLOCKS WITH METERS */}
          <div className="space-y-12 text-pink-900">
            {/* 1. Understanding */}
            <div className="p-6 rounded-2xl glass">
              <h3 className="text-2xl font-semibold mb-2">
                💞 We Understand Without Explaining
              </h3>
              <p className="text-pink-900/80">
                Our connection is silent, deep, natural. We feel each other’s
                emotions instantly — something most couples never experience.
              </p>

              <div
                className="story-meter"
                style={{ "--fill": "100%" } as React.CSSProperties}
              >
                <div className="story-meter-fill"></div>
              </div>
              <p className="text-xs text-pink-700 mt-1">
                Understanding Level: 100%
              </p>
            </div>

            {/* 2. Care */}
            <div className="p-6 rounded-2xl glass">
              <h3 className="text-2xl font-semibold mb-2">
                🌸 We Care in a Soft, Pure Way
              </h3>
              <p className="text-pink-900/80">
                Our care feels like calmness, like warmth, like home. It isn't
                forced — it flows naturally.
              </p>

              <div
                className="story-meter"
                style={{ "--fill": "97%" } as React.CSSProperties}
              >
                <div className="story-meter-fill"></div>
              </div>
              <p className="text-xs text-pink-700 mt-1">Softness Level: 97%</p>
            </div>

            {/* 3. Loyalty */}
            <div className="p-6 rounded-2xl glass">
              <h3 className="text-2xl font-semibold mb-2">
                ❤️ Our Loyalty Is Unshakeable
              </h3>
              <p className="text-pink-900/80">
                No confusion. No doubts. We choose each other again and again —
                even on hard days.
              </p>

              <div
                className="story-meter"
                style={{ "--fill": "100%" } as React.CSSProperties}
              >
                <div className="story-meter-fill"></div>
              </div>
              <p className="text-xs text-pink-700 mt-1">
                Loyalty Strength: 100%
              </p>
            </div>

            {/* 4. Fights */}
            <div className="p-6 rounded-2xl glass">
              <h3 className="text-2xl font-semibold mb-2">
                🔥 We Fight But We Don’t Leave
              </h3>
              <p className="text-pink-900/80">
                Arguments don’t break us — they build us. Because leaving was
                never an option.
              </p>

              <div
                className="story-meter"
                style={{ "--fill": "100%" } as React.CSSProperties}
              >
                <div className="story-meter-fill"></div>
              </div>
              <p className="text-xs text-pink-700 mt-1">Bond Stability: 92%</p>
            </div>

            {/* 5. Effort */}
            <div className="p-6 rounded-2xl glass">
              <h3 className="text-2xl font-semibold mb-2">
                💛 Our Efforts Never Stop
              </h3>
              <p className="text-pink-900/80">
                We show love daily — through messages, care, patience, and small
                acts that mean everything.
              </p>

              <div
                className="story-meter"
                style={{ "--fill": "100%" } as React.CSSProperties}
              >
                <div className="story-meter-fill"></div>
              </div>
              <p className="text-xs text-pink-700 mt-1">
                Daily Effort Level: 95%
              </p>
            </div>

            {/* 6. Safety */}
            <div className="p-6 rounded-2xl glass">
              <h3 className="text-2xl font-semibold mb-2">
                🌙 We Feel Safe With Each Other
              </h3>
              <p className="text-pink-900/80">
                We can be raw, emotional, vulnerable — and still feel protected.
                That’s a once-in-a-lifetime bond.
              </p>

              <div
                className="story-meter"
                style={{ "--fill": "100%" } as React.CSSProperties}
              >
                <div className="story-meter-fill"></div>
              </div>
              <p className="text-xs text-pink-700 mt-1">
                Emotional Safety: 99%
              </p>
            </div>
          </div>

          {/* CERTIFICATE */}
          <div
            className="
            certificate-paper 
            mt-10 md:mt-16 
            text-center 
            px-4 md:px-6 
            py-6 md:py-10 
            relative 
            max-w-md mx-auto 
            rounded-xl 
            bg-white/70 backdrop-blur-md shadow-lg
          "
            style={{ animation: "certificateGlow 6s infinite ease-in-out" }}
          >
            {/* Decorative hearts */}
            <div className="absolute top-3 left-3 text-pink-300 text-2xl md:text-3xl">
              ♡
            </div>
            <div className="absolute top-3 right-3 text-pink-300 text-2xl md:text-3xl">
              ♡
            </div>
            <div className="absolute bottom-3 left-3 text-pink-300 text-2xl md:text-3xl">
              ♡
            </div>
            <div className="absolute bottom-3 right-3 text-pink-300 text-2xl md:text-3xl">
              ♡
            </div>

            <Heart
              aria-hidden="true"
              className="w-8 md:w-10 h-8 md:h-10 text-pink-700 mx-auto mb-2 md:mb-3 animate-pulse"
            />

            <h2 className="text-xl md:text-4xl font-handwriting text-pink-900 mb-1 md:mb-2 drop-shadow">
              ✨ Perfect Couple Certificate ✨
            </h2>

            <p className="text-pink-900 text-xs md:text-base tracking-wide">
              This certifies that
            </p>

            <p className="text-2xl md:text-5xl font-bold text-pink-800 my-3 md:my-4 drop-shadow">
              Vijay ❤️ {name}
            </p>

            <p className="text-pink-900 text-xs md:text-base tracking-wide">
              are forever recognized as
            </p>

            <p className="text-lg md:text-3xl font-semibold text-pink-700 mb-3 md:mb-4">
              ⭐ The Perfect Couple of the Universe ⭐
            </p>

            <p className="text-pink-900/80 text-xs md:text-sm leading-relaxed max-w-xs md:max-w-xl mx-auto px-2">
              For magical loyalty, unbreakable trust, soft emotional connection,
              and a once-in-a-lifetime love that makes every moment beautiful.
            </p>

            {/* Divider */}
            <div className="w-full max-w-[200px] md:max-w-sm mx-auto my-5 md:my-8 border-t border-pink-300"></div>

            {/* Signatures + Stamp */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 items-center">
              {/* Left signature */}
              <div className="text-center">
                <p className="text-pink-800 font-handwriting text-base md:text-xl mb-1">
                  {name}
                </p>
                <div className="w-16 md:w-24 mx-auto border-t border-pink-400"></div>
                <p className="text-[10px] md:text-xs text-pink-600 mt-1">
                  Her Signature
                </p>
              </div>

              {/* STAMP */}
              <div className="text-center">
                <div
                  className="
                  w-20 h-20 md:w-32 md:h-32 
                  mx-auto 
                  rounded-full 
                  bg-gradient-to-br from-pink-100 to-pink-200
                  border-[2px] md:border-[3px] border-pink-500
                  shadow-[0_0_12px_rgba(255,182,193,0.5)] 
                  flex flex-col items-center justify-center
                  rotate-[-3deg]
                  relative
                "
                >
                  <div className="absolute inset-1 md:inset-2 rounded-full border border-pink-400"></div>

                  <p className="text-pink-700 font-bold text-[7px] md:text-xs tracking-widest">
                    OFFICIAL
                  </p>
                  <Heart
                    aria-hidden="true"
                    className="w-5 h-5 md:w-7 md:h-7 text-pink-600 my-[2px] md:my-1 animate-pulse"
                  />
                  <p className="text-pink-700 font-bold text-[7px] md:text-xs tracking-widest">
                    LOVE STAMP
                  </p>
                </div>

                <p className="text-[10px] md:text-xs text-pink-600 mt-2">
                  Official Love Stamp
                </p>
              </div>

              {/* Right signature */}
              <div className="text-center">
                <p className="text-pink-800 font-handwriting text-base md:text-xl mb-1">
                  Vijay
                </p>
                <div className="w-16 md:w-24 mx-auto border-t border-pink-400"></div>
                <p className="text-[10px] md:text-xs text-pink-600 mt-1">
                  His Signature
                </p>
              </div>
            </div>

            {/* Issued Date */}
            <p className="text-[10px] md:text-xs text-pink-700 mt-6 md:mt-8 font-medium tracking-wide">
              📅 Issued on: <span className="underline">January 2025</span>
            </p>

            <p className="mt-4 md:mt-6 text-[8px] md:text-[10px] text-pink-500 uppercase tracking-widest">
              — Registered in the Book of Eternal Love —
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
