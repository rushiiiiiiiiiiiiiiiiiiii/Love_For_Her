/* ====== IMPORTS ====== */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BackgroundText } from "@/components/BackgroundText";

import { ArrowLeft, Play, Pause, Mic, Heart, Calendar } from "lucide-react";

import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, useMemo } from "react";
import voiceNotesData from "@/data/voiceNotes.json";
import { useGlobalMusic } from "@/hooks/useGlobalMusic";
import { storage } from "@/lib/storage";
/* ============================================================
   MAIN COMPONENT — With Beautiful TOP SPRINKLES Animation
============================================================== */

export default function VoiceNotes() {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { pauseMusic, resumeMusic } = useGlobalMusic();
  const profile = useMemo(() => storage.getUserProfile(), []);
const name = profile?.name || "My Love";
const navigate = useNavigate()
  const categoryColors: Record<string, string> = {
    daily: "bg-rose/20 text-rose border-rose/30",
    romantic: "bg-primary/20 text-primary border-primary/30",
    emotional: "bg-lavender/20 text-lavender border-lavender/30",
    supportive: "bg-peach/20 text-peach border-peach/30",
  };

  /* ===== Progress Tracking ===== */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("timeupdate", update);

    return () => audio.removeEventListener("timeupdate", update);
  }, [playingId]);

  /* ===== Play Note ===== */
  const playNote = (note: any) => {
  pauseMusic();

  // ❌ REMOVE THIS
  // const audio = new Audio(note.file);
  // audioRef.current = audio;
  // audio.play();

  // ✅ JUST FAKE PLAY UI
  setPlayingId(note.id);

  // Optional: auto stop after few seconds
  setTimeout(() => {
    setPlayingId(null);
    setProgress(0);
    resumeMusic();
  }, 2000);
};

  /* ===== Pause ===== */
  const pauseNote = () => {
    if (audioRef.current) audioRef.current.pause();
    setPlayingId(null);
  };

  /* ===== Seek ===== */
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const newPercent = Number(e.target.value);
    setProgress(newPercent);
    audioRef.current.currentTime =
      (newPercent / 100) * audioRef.current.duration;
  };

  /* ===== Sprinkle Count Based on Screen Width ===== */
  const sprinkleCount = useMemo(() => {
    if (window.innerWidth < 640) return 18;
    if (window.innerWidth < 1024) return 30;
    return 40;
  }, []);
  const sprinkles = useMemo(() => {
    return Array.from({ length: sprinkleCount }).map(() => ({
      size: 4 + Math.random() * 6,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 6 + Math.random() * 8,
    }));
  }, [sprinkleCount]);

  
const goHome = () => {
  import("../pages/Home");

  setTimeout(() => {
    navigate("/home", { replace: true });
  }, 50);
};
  return (
    <div className="min-h-screen romantic-gradient relative overflow-hidden">
      <BackgroundText />

      {/* 🌟 SPRINKLES — ONLY WHEN PLAYING */}
      {playingId && (
        <div className="sprinkle-container pointer-events-none fixed inset-0 z-40">
          {sprinkles.map((s, i) => (
            <span
              key={i}
              className="sprinkle"
              style={{
                left: `${s.left}%`,
                width: s.size,
                height: s.size,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            ></span>
          ))}
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="container mx-auto px-4 py-8 relative z-50 max-w-4xl">
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
          <div className="text-6xl mb-4">🎤</div>
          <h1 className="text-4xl md:text-5xl font-handwriting text-foreground mb-3">
            My Voice Notes For You
          </h1>
          <p className="text-muted-foreground text-lg">
            Whenever you miss me… just listen, I’m right here with you. 💗
          </p>
        </div>

        <div className="space-y-4">
          {voiceNotesData.map((note, index) => {
            const isPlaying = note.id === playingId;

            return (
              <Card
                key={note.id}
                className={`p-6 bg-card/95 backdrop-blur transition-all duration-500 animate-fade-in group 
                  ${
                    isPlaying
                      ? "shadow-[0_0_30px_rgba(255,120,150,0.45)] scale-[1.01]"
                      : "hover:shadow-[0_0_20px_rgba(200,150,170,0.3)]"
                  }
                `}
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* MIC ICON */}
                  <div
                    className={`p-3 rounded-xl transition-all duration-[1200ms] ease-in-out
                      ${
                        isPlaying
                          ? "bg-gradient-to-br from-rose to-primary shadow-lg scale-110"
                          : "bg-gradient-to-br from-primary to-rose"
                      }
                    `}
                  >
                    <Mic className="w-6 h-6 text-white" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground text-lg mb-1">
                          {note.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {note.description}
                        </p>
                        {isPlaying && (
                          <p className="text-rose text-sm italic animate-pulse">
                            Listening to your boy’s voice… 💗
                          </p>
                        )}
                      </div>

                      <Badge className={categoryColors[note.category]}>
                        {note.category}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {note.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {note.duration}
                      </div>
                    </div>

                    {/* CONTROLS */}
                    <div className="flex items-center gap-3 flex-wrap w-full">
                      {isPlaying ? (
                        <Button onClick={pauseNote} className="rounded-full">
                          <Pause className="w-4 h-4 mr-2" /> Pause
                        </Button>
                      ) : (
                        <Button
                          onClick={() => playNote(note)}
                          className="rounded-full"
                        >
                          <Play className="w-4 h-4 mr-2" /> Play
                        </Button>
                      )}

                      {isPlaying && (
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={progress}
                          onChange={handleSeek}
                          className="flex-1 w-full accent-rose h-2 rounded-full cursor-pointer mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-8 bg-gradient-to-r from-primary/10 to-rose/10 border-primary/20 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-rose fill-rose animate-pulse-soft" />
          <p className="text-foreground/90 italic">
            "Whenever your heart misses me… press play. I'm always here with
            you, {name} ❤️"
          </p>
        </Card>
      </div>

      {/* ===== SPRINKLE CSS ===== */}
      <style>{`
        .sprinkle {
          position: absolute;
          top: -20px;
          background: radial-gradient(circle, rgba(255,255,255,0.95), rgba(255,200,220,0.55));
          border-radius: 50%;
          box-shadow: 0 0 6px rgba(255,180,200,0.5);
          animation-name: sprinkleFall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0.8;
  will-change: transform;
        }

        @keyframes sprinkleFall {
          0% {
            transform: translateY(0) translateX(0) scale(0.9);
            opacity: 0;
          }
          18% {
            opacity: 0.9;
          }
          60% {
            opacity: 0.8;
            transform: translateY(60vh) translateX(4px) scale(1);
          }
          100% {
            transform: translateY(120vh) translateX(-6px) scale(1.05);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
