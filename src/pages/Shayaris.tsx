import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import { ArrowLeft, BookHeart, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import shayarisData from "@/data/shayaris.json";
import { useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
export default function Shayaris() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const profile = useMemo(() => storage.getUserProfile(), []);
  const name = profile?.name || "My Love";
  const navigate = useNavigate();
  // random on open
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * shayarisData.length);
    setCurrentIndex(randomIndex);
  }, []);

  const nextShayari = () => {
    setCurrentIndex((prev) => (prev + 1) % shayarisData.length);
    setShowTranslation(false);
  };

  const randomShayari = () => {
    const randomIndex = Math.floor(Math.random() * shayarisData.length);
    setCurrentIndex(randomIndex);
    setShowTranslation(false);
  };

  const current = shayarisData[currentIndex] ?? {
    text: "No shayari found",
    translation: "",
    category: "romantic",
  };

  const categoryColors: Record<string, string> = {
    romantic: "from-rose to-primary",
    emotional: "from-lavender to-peach",
    sweet: "from-peach to-gold",
  };

  const floatingHearts = useMemo(() => {
    return [...Array(6)].map((_, i) => ({
      left: `${10 + Math.random() * 80}%`,
      top: `${10 + Math.random() * 80}%`,
      size: `${20 + Math.random() * 20}px`,
      delay: `${i * 0.8}s`,
    }));
  }, []);
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

      {/* ✨ Extra Styles */}
      <style>{`
        .shayari-card {
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(18px);
          border-radius: 24px;
          border: 1px solid rgba(255,255,255,0.5);
          box-shadow: 0 10px 45px rgba(255,150,170,0.35);
          animation: fadeSlide 0.9s ease;
        }

        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateY(30px) scale(0.96); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .floating-heart {
          position: absolute;
          animation: floatUp 4s infinite ease-in-out;
          opacity: 0.4;
          will-change: transform;
        }

        @keyframes floatUp {
          0% { transform: translateY(20px); opacity: 0.3; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-20px); opacity: 0.3; }
        }

        .translation-box {
          animation: fadeIn 0.7s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-3xl">
        {/* Header */}
        <button
          onClick={goHome}
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

        <div className="text-center mb-10 animate-fade-in">
          <div className="text-6xl mb-3">📖</div>
          <h1 className="text-5xl font-handwriting text-foreground mb-2">
            My Shayaris For You
          </h1>
          <p className="text-muted-foreground text-lg">
            Beautiful words from my heart to yours 💕
          </p>
        </div>

        {/* Main Card */}
        <Card
          key={currentIndex}
          className="shayari-card p-10 relative overflow-hidden"
        >
          {/* floating soft hearts */}
          {floatingHearts.map((heart, i) => (
            <div
              key={i}
              className="floating-heart"
              style={{
                left: heart.left,
                top: heart.top,
                fontSize: heart.size,
                animationDelay: heart.delay,
              }}
            >
              ❤️
            </div>
          ))}

          {/* divider */}
          <div
            className={`h-1 w-32 mx-auto rounded-full bg-gradient-to-r ${
              categoryColors[current.category] || "from-rose to-primary"
            } mb-10 shadow-md`}
          />

          {/* Shayari text */}
          <p className="text-2xl  md:text-4xl text-center text-foreground leading-relaxed mb-6 font-serif drop-shadow-sm">
            “{current.text}”
          </p>

          <p className="text-center text-muted-foreground italic mb-6">
            — Your Vijay ❤️
          </p>

          {/* Translation */}
          {showTranslation && (
            <div className="translation-box bg-white/40 p-6 rounded-lg border border-white/60 shadow-inner">
              <p className="text-center text-foreground/80 italic leading-relaxed">
                {current.translation}
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex flex-col items-center gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowTranslation(!showTranslation)}
            >
              {showTranslation ? "Hide" : "Show"} Translation
            </Button>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={nextShayari}>
                Next
              </Button>
              <Button onClick={randomShayari}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Random
              </Button>
            </div>
          </div>

          {/* bullets */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {shayarisData.map((_, idx) => (
              <div
                key={idx}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? "w-8 bg-primary shadow-lg"
                    : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>
        </Card>

        {/* Footer card */}
        <Card className="p-6 bg-gradient-to-r from-rose/10 to-foreground/5 text-center mt-8">
          <BookHeart className="w-10 h-10 mx-auto mb-3 text-rose-400" />
          <p className="text-foreground/90 italic text-lg">
            “Every word is written only for you, {name} 💗”
          </p>
        </Card>
      </div>
    </div>
  );
}
