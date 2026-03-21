import reasons from "@/data/reasons.json";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import { ArrowLeft, Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useCallback } from "react";
import { useMemo } from "react";
import { storage } from "@/lib/storage";
import { useNavigate } from "react-router-dom";
type Reason = {
  id: number;
  text: string;
};

export default function Reasons() {
  const [randomReason, setRandomReason] = useState<Reason | null>(null);
  const profile = useMemo(() => storage.getUserProfile(), []);
const name = profile?.name || "My Love";
const navigate = useNavigate();
  const shuffleReason = useCallback(() => {
    if (!reasons.length) return;

    const random = reasons[Math.floor(Math.random() * reasons.length)];
    setRandomReason(random);

    window.scrollTo({ top: 0, behavior: "smooth" });
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
    <div className="min-h-screen romantic-gradient relative overflow-hidden">
      {BackgroundLayer}

      {/* Floating hearts */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="floating-hearts text-rose absolute top-10 left-10 text-4xl">
          ❤️
        </div>
        <div className="floating-hearts text-rose absolute top-1/2 right-10 text-5xl">
          💕
        </div>
        <div className="floating-hearts text-rose absolute bottom-20 left-1/2 text-4xl">
          💖
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
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

        {/* Heading */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="relative inline-block">
            <Sparkles className="absolute -top-6 -left-6 text-rose animate-spin-slow" />
            <Sparkles className="absolute -bottom-6 -right-6 text-rose animate-spin-slow" />

            <Heart className="w-12 h-12 mx-auto text-rose animate-pulse mb-3 drop-shadow-lg" />
          </div>

          <h1 className="text-4xl font-handwriting text-foreground drop-shadow-lg">
            100 Reasons Why I Love You {name} ❤️
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            Every reason comes straight from my heart.
          </p>
        </div>

        {/* Random Reason Popup */}
        {randomReason && (
          <div className="mb-6 p-6 rounded-xl bg-rose/20 border border-rose/30 shadow-lg animate-fade-in-down text-center">
            <p className="text-rose font-handwriting text-2xl mb-2">
              Reason #{randomReason.id}
            </p>
            <p className="text-lg text-foreground">{randomReason.text}</p>
          </div>
        )}

        <div className="flex justify-center mb-10">
          <Button
            onClick={shuffleReason}
            className="rounded-full px-8 py-3 bg-rose text-white shadow-lg hover:scale-105 transition-all"
          >
            Give Me a Random Reason 💞
          </Button>
        </div>

        {/* All Reasons List */}
        <div className="space-y-4 animate-fade-in">
          {reasons.map((item, index) => (
            <div
              key={item.id}
              className="
                p-4 rounded-xl 
                bg-white/80 
                backdrop-blur 
                border border-rose/20 
                shadow-soft 
                transition-all 
                hover:shadow-[0_8px_24px_hsl(340_80%_70%/.35)] 
                hover:scale-[1.02]
                relative
              "
              style={{ animationDelay: `${index * 0.02}s` }}
            >
              {/* Decorative small heart */}
              <Heart className="w-5 h-5 text-rose absolute -top-2 -left-2 animate-pulse" />

              <p className="font-handwriting text-lg text-foreground leading-relaxed">
                <span className="font-bold text-rose">{item.id}. </span>
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Ending ❤️ */}
        <div className="text-center mt-12 mb-12 animate-fade-in-up">
          <Heart className="w-14 h-14 text-rose mx-auto mb-3 animate-pulse drop-shadow-lg" />

          <p className="text-2xl font-handwriting text-rose drop-shadow">
            You are my forever reason {name} ❤️
          </p>
        </div>

        <div className="text-center mb-10">
          <Button
            className="rounded-full px-8 py-3 primary-gradient text-white hover:scale-105 transition-all"
            onClick={() => {
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Read Again 💕
          </Button>
        </div>
      </div>
    </div>
  );
}
