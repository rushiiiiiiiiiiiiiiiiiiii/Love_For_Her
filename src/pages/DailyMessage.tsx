import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartAnimation } from "@/components/HeartAnimation";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { storage } from "@/lib/storage";
import { toast } from "sonner";
import messages from "@/data/messages.json";
import { BackgroundText } from "@/components/BackgroundText";
import { useMemo } from "react";

export default function DailyMessage() {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);
  const [revealed, setRevealed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
 const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
const profile = useMemo(() => storage.getUserProfile(), []);

  /* Select today's message */
  useEffect(() => {
    const day = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const msgIndex = day % messages.length;
    setCurrentMessage(messages[msgIndex]);
  }, []);

  /* Check reveal + favorite */
  useEffect(() => {
    setIsFavorite(storage.isFavorite(currentMessage.id));
    setRevealed(storage.isMessageUnlocked(currentMessage.id));
  }, [currentMessage]);

  /* Reveal message */
  const handleReveal = () => {
    setRevealed(true);
    storage.unlockMessage(currentMessage.id);
    toast.success("Message unlocked! ❤️✨💖");
  };

  /* Toggle favorite */
  const toggleFavorite = () => {
    if (isFavorite) {
      storage.removeFavorite(currentMessage.id);
      toast("Removed from favorites 💔");
    } else {
      storage.addFavorite(currentMessage.id);
      toast.success("Added to favorites ❤️💘");
    }
    setIsFavorite(!isFavorite);
  };

  const risingHearts = React.useMemo(() => {
    const count = isMobile ? 8 : 14;
    return [...Array(count)].map(() => ({
      left: `${5 + Math.random() * 90}%`,
      delay: `${Math.random() * 6}s`,
      size: `${25 + Math.random() * 30}px`,
      opacity: 0.6 + Math.random() * 0.3,
      emoji: ["💗", "💘", "❤️", "💖"][Math.floor(Math.random() * 4)],
    }));
  }, []);

  const floatingEmojis = React.useMemo(() => {
    const count = isMobile ? 10 : 18;
    return [...Array(count)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size: `${18 + Math.random() * 20}px`,
      emoji: ["💖", "✨", "💕", "💗", "💞"][Math.floor(Math.random() * 5)],
    }));
  }, []);

  const burstEmojis = React.useMemo(() => {
    const count = isMobile ? 3 : 6;
    return [...Array(count)].map((_, i) => ({
      left: `${30 + Math.random() * 40}%`,
      top: `${10 + Math.random() * 40}%`,
      delay: `${i * 0.3}s`,
      emoji: ["💖", "💕", "✨"][Math.floor(Math.random() * 3)],
    }));
  }, []);

  const BackgroundLayer = useMemo(
  () => (
    <>
      <HeartAnimation />
      <BackgroundText />
    </>
  ),
  []
);
  return (
    <div className="min-h-screen romantic-gradient relative overflow-hidden">
      {BackgroundLayer}
      {/* Rising large hearts OVER THE CARD */}
      {risingHearts.map((h, i) => (
        <div
          key={"heart-rise-" + i}
          className="heart-rise"
          style={{
            left: h.left,
            animationDelay: h.delay,
            fontSize: h.size,
            opacity: h.opacity,
          }}
        >
          {h.emoji}
        </div>
      ))}

      {/* Floating emojis */}
      {floatingEmojis.map((e, i) => (
        <div
          key={i}
          className="emoji-float"
          style={{
            left: e.left,
            animationDelay: e.delay,
            fontSize: e.size,
          }}
        >
          {e.emoji}
        </div>
      ))}

      <style>{`
        /* Floating small emojis */
        @keyframes floatEmoji {
          0% { transform: translateY(40px) scale(0.9); opacity: 0; }
          40% { opacity: 0.8; }
          100% { transform: translateY(-120vh) scale(1); opacity: 0; }
        }
        .emoji-float {
          position: absolute;
          bottom: -40px;
          animation: floatEmoji 10s linear infinite;
          pointer-events: none;
          opacity: 0.5;
          z-index: 40;  /* NOW ABOVE CARD */
        }
          .emoji-float,
.heart-rise,
.burst-emoji {
  will-change: transform;
}

        /* Rising big hearts */
        @keyframes heartRise {
          0% { transform: translateY(50px) scale(0.8); opacity: 0; }
          30% { opacity: 0.9; }
          100% { transform: translateY(-110vh) scale(1.1); opacity: 0; }
        }
        .heart-rise {
          position: absolute;
          bottom: -50px;
          animation: heartRise 11s linear infinite;
          pointer-events: none;
          filter: drop-shadow(0 0 14px rgba(255, 120, 150, 0.6));
          z-index: 50; /* FIXED: HEARTS NOW IN FRONT */
        }

        /* Burst animation */
        .burst-emoji {
          position: absolute;
          font-size: 30px;
          animation: burstUp 900ms forwards ease-out;
          pointer-events: none;
          z-index: 60; /* Also above */
        }
        @keyframes burstUp {
          0% { opacity: 0; transform: translateY(12px) scale(0.5); }
          40% { opacity: 1; transform: translateY(-12px) scale(1.2); }
          100% { opacity: 0; transform: translateY(-32px) scale(0.8); }
        }

        /* Reaction buttons */
        .reaction-btn {
          transition: transform 0.2s;
        }
        .reaction-btn:hover {
          transform: scale(1.25);
        }

        /* Selected emoji styling */
        .reaction-selected {
          background: rgba(255, 182, 193, 0.45);
          padding: 6px 12px;
          border-radius: 16px;
          box-shadow: 0 0 12px rgba(255, 140, 160, 0.5);
          transform: scale(1.3);
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-2xl">
        {/* Back */}
        <Link to="/home" replace>
          <Button
    className="mb-6 flex items-center gap-2 rounded-full px-5 py-2 
    bg-white/40 backdrop-blur-md border border-white/40 
    text-rose-700 hover:bg-white/60 
    shadow-[0_6px_20px_rgba(255,120,150,0.25)] 
    transition-all duration-300 hover:scale-105"
  >
    <ArrowLeft className="w-4 h-4" />
    Back Home
  </Button>
        </Link>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-handwriting text-foreground mb-2">
            Today’s Message, {profile?.name} 💖✨
          </h1>
          <p className="text-muted-foreground">
            A gift from my heart to you 💕
          </p>
        </div>

        {/* Main Card */}
        <Card className="p-8 animate-fade-in bg-card/95 backdrop-blur shadow-[0_0_35px_rgba(255,120,150,0.35)] border border-rose-300/20 relative z-20">
          {/* BEFORE REVEAL */}
          {!revealed ? (
            <div className="text-center space-y-6 relative">
              {/* Burst hearts */}
              {burstEmojis.map((e, i) => (
                <div
                  key={i}
                  className="burst-emoji"
                  style={{
                    left: e.left,
                    top: e.top,
                    animationDelay: e.delay,
                  }}
                >
                  {e.emoji}
                </div>
              ))}

              <div className="text-6xl animate-pulse-soft">
                {currentMessage.emoji}
              </div>

              <h2 className="text-2xl font-handwriting text-foreground">
                {currentMessage.title}
              </h2>

              <p className="text-muted-foreground">Tap below to reveal ✨</p>

              <Button
                onClick={handleReveal}
                className="primary-gradient text-primary-foreground text-lg px-8 py-6 rounded-2xl shadow-lg"
              >
                Reveal Message 💖✨
              </Button>
            </div>
          ) : (
            /* AFTER REVEAL */
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-5xl mb-3 animate-bounce-slow">
                  {currentMessage.emoji}
                </div>
                <h2 className="text-3xl font-handwriting text-foreground">
                  {currentMessage.title} 💕
                </h2>
              </div>

              {/* Message Box */}
              <div className="bg-white/40 p-4 rounded-xl shadow-inner border border-white/40 backdrop-blur-md space-y-4 animate-fade-in">
                <p className="text-foreground leading-relaxed whitespace-pre-line text-lg">
                  {currentMessage.message}
                </p>

                {currentMessage.message_mr && (
                  <p className="text-pink-700/70 italic whitespace-pre-line text-lg">
                    {currentMessage.message_mr}
                  </p>
                )}
              </div>

              {/* Emoji reactions with highlighting */}
              <div className="flex justify-center gap-4 mt-4">
                {["❤️", "💖", "✨", "🥺", "💗"].map((emoji, i) => (
                  <button
                    key={i}
                    className={`reaction-btn text-3xl ${
                      selectedEmoji === emoji ? "reaction-selected" : ""
                    }`}
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      toast.success(`You reacted ${emoji}`);
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              {/* Favorite */}
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={toggleFavorite}
                  className="text-lg"
                >
                  {isFavorite ? "💖 Favorited" : "♡ Add to Favorites"}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-muted-foreground">
          <p>New message every day ✨💌</p>
        </div>
      </div>
    </div>
  );
}
