import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartAnimation } from "@/components/HeartAnimation";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
} from "lucide-react";
import { Link } from "react-router-dom";
import timeline from "@/data/timeline.json";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
export default function Timeline() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigate = useNavigate();
  const currentMoment = timeline[currentIndex];

  /* ----------- HANDLE AUTOPLAY ----------- */
  useEffect(() => {
    if (!autoplay) return;

    intervalRef.current = setInterval(() => {
      nextMoment();
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoplay]);

  /* Reset autoplay when manually changed */
  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(nextMoment, 4000);

    return () => clearInterval(interval);
  }, [autoplay, currentIndex]);

  const nextMoment = () => {
    setCurrentIndex((prev) => (prev + 1) % timeline.length);
  };

  const prevMoment = () => {
    setCurrentIndex((prev) => (prev - 1 + timeline.length) % timeline.length);
  };

  const toggleAutoplay = () => {
    setAutoplay((prev) => !prev);
  };

  const BackgroundLayer = useMemo(
    () => (
      <>
        <HeartAnimation />
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

      <style>{`
        .fade-slide {
          opacity: 0;
          transform: translateY(10px);
          animation: fadeUp 0.7s ease forwards;
        }

        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
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

        {/* HEADER */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-handwriting text-foreground mb-2">
            Our Story Together
          </h1>
          <p className="text-muted-foreground">
            Every moment with you is precious ✨
          </p>
        </div>

        {/* CARD */}
        <Card className="p-8 animate-fade-in bg-card/95 backdrop-blur shadow-[var(--shadow-romantic)]">
          <div key={currentIndex} className="space-y-6 fade-slide">
            {/* EMOJI + TITLE */}
            <div className="text-center">
              <div className="text-6xl mb-4 animate-bounce-slow">
                {currentMoment.emoji}
              </div>
              <div className="text-sm text-muted-foreground mb-2">
                {currentMoment.date}
              </div>
              <h2 className="text-3xl font-handwriting text-foreground mb-4">
                {currentMoment.title}
              </h2>
            </div>

            {/* IMAGE */}
            <div className="relative w-full max-h-[600px] rounded-lg overflow-hidden border-4 border-white shadow-lg bg-black/10 flex justify-center items-center">
              <img
                loading="lazy"
                src={currentMoment.image}
                loading="lazy"
                alt={currentMoment.title}
                className="h-full w-auto object-contain fade-slide will-change-transform"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                <p className="text-white text-sm font-handwriting">
                  Moment {currentIndex + 1} of {timeline.length}
                </p>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="prose prose-lg max-w-none">
              <p className="text-foreground leading-relaxed text-center fade-slide">
                {currentMoment.description}
              </p>
            </div>

            {/* NAVIGATION */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button variant="outline" size="icon" onClick={prevMoment}>
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {timeline.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-primary w-8"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <Button variant="outline" size="icon" onClick={nextMoment}>
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* SLIDESHOW BUTTON */}
            <div className="text-center mt-4">
              <Button
                variant="ghost"
                onClick={toggleAutoplay}
                className="text-sm"
              >
                {autoplay ? (
                  <>
                    <Pause className="w-4 h-4 mr-2" /> Stop Slideshow
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" /> Play Slideshow
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
