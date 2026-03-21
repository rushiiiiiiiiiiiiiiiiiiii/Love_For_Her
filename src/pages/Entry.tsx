import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Sparkles } from "lucide-react";
// Assuming you have these or you can remove them if not needed
// import { HeartAnimation } from "@/components/HeartAnimation";
// import { BackgroundText } from "@/components/BackgroundText";
import { storage } from "@/lib/storage";
function Entry() {
  const navigate = useNavigate();
  const profile = storage.getUserProfile();
  const girlName = profile?.name || "My Love";
  const [start, setStart] = useState(false);
  const [curtainOpen, setCurtainOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Mouse Parallax State
  const cloud1Ref = useRef<HTMLDivElement>(null);
  const cloud2Ref = useRef<HTMLDivElement>(null);
  const rose1Ref = useRef<HTMLImageElement>(null);
  const rose2Ref = useRef<HTMLImageElement>(null);
  const rose3Ref = useRef<HTMLImageElement>(null);

  // Ripples State
  // const [ripples, setRipples] = useState<
  //   { x: number; y: number; id: number }[]
  // >([]);
  // const [rippleId, setRippleId] = useState(0);

  // Audio ref (optional: if you want to add a soft click sound later)
  // const audioRef = useRef(new Audio('/assets/soft-click.mp3'));

  useEffect(() => {
    setTimeout(() => setCurtainOpen(true), 500);
    setTimeout(() => setStart(true), 1800);
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      cloud1Ref.current?.style.setProperty(
        "transform",
        `translate(${x * 20}px, ${y * 10}px)`,
      );

      cloud2Ref.current?.style.setProperty(
        "transform",
        `translate(${x * -30}px, ${y * -15}px)`,
      );

      rose1Ref.current?.style.setProperty(
        "transform",
        `translate(${x * -15}px, ${y * -15}px)`,
      );

      rose2Ref.current?.style.setProperty(
        "transform",
        `translate(${x * 25}px, ${y * 10}px)`,
      );

      rose3Ref.current?.style.setProperty(
        "transform",
        `translate(${x * -40}px, ${y * 20}px)`,
      );
    };

    // if (window.innerWidth > 768) {
    //   window.addEventListener("mousemove", handleMouseMove);
    //   return () => window.removeEventListener("mousemove", handleMouseMove);
    // }
    if (window.innerWidth < 768) return;
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent double firing
    if (isExiting) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Ripple Logic
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    e.currentTarget.appendChild(ripple);

    setTimeout(() => ripple.remove(), 1000);

    // Trigger Exit Animation
    setIsExiting(true);

    // Delayed Navigation (Wait for the zoom/fade effect)
    setTimeout(() => {
      const isSetupComplete = storage.isSetupComplete();
      const hasPin = storage.getPin();

      if (!isSetupComplete) {
        navigate("/onboarding");
      } else if (hasPin) {
        navigate("/lock");
      } else {
        navigate("/home");
      }
    }, 1200);
  };
  const petals = useMemo(() => {
    const count = window.innerWidth < 768 ? 6 : 15;

    return [...Array(count)].map(() => ({
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${8 + Math.random() * 7}s`,
      opacity: 0.6 + Math.random() * 0.4,
    }));
  }, []);
  return (
    <div
      className={`min-h-screen relative overflow-hidden cursor-pointer transition-all duration-1000 ${isExiting ? "scale-110 opacity-0 filter blur-lg" : "opacity-100"}`}
      onClick={handleClick}
      style={{
        background:
          "radial-gradient(circle at center, #ffeef5 0%, #ffe1eb 40%, #ffc9df 100%)",
      }}
    >
      {/* --- FILM GRAIN TEXTURE (Adds high-end feel) --- */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none z-0 mix-blend-multiply"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/stardust.png")`,
        }}
      ></div>

      {/* --- PARALLAX BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Clouds move slightly opposite to mouse */}
        <div ref={cloud1Ref} className="cloud cloud1" />
        <div ref={cloud2Ref} className="cloud cloud2"></div>

        {/* Floating Roses move with mouse for depth */}
        {/* Replace with your actual image paths */}
        <img
          loading="lazy"
          ref={rose1Ref}
          src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-white-rose-bud-png-image_10216329.png"
          className="floating-rose rose1"
          alt=""
        />
        <img
          loading="lazy"
          ref={rose2Ref}
          src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-white-rose-bud-png-image_10216329.png"
          className="floating-rose rose2"
          alt=""
        />
        <img
          loading="lazy"
          ref={rose3Ref}
          src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-white-rose-bud-png-image_10216329.png"
          className="floating-rose rose3"
          alt=""
        />
      </div>

      {/* --- CURTAINS --- */}
      <div className="absolute inset-0 z-50 pointer-events-none flex justify-between">
        <div className={`curtain left ${curtainOpen ? "open" : ""}`}>
          <div className="curtain-fold"></div>
        </div>
        <div className={`curtain right ${curtainOpen ? "open" : ""}`}>
          <div className="curtain-fold"></div>
        </div>
      </div>

      {/* --- FALLING PETALS (More organic movement) --- */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {petals.map((p, i) => (
          <div
            key={i}
            className="white-petal"
            style={{
              left: p.left,
              animationDelay: p.delay,
              animationDuration: p.duration,
              opacity: p.opacity,
            }}
          />
        ))}
      </div>

      {/* --- RIPPLES --- */}
      {/* {ripples.map((r) => (
  <span
    key={r.id}
    className="ripple"
    style={{ top: r.y, left: r.x }}
  ></span>
))} */}

      {/* --- CENTER STAGE CONTENT --- */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen text-center px-4">
        {/* Glowing Light Behind Text */}
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-400/20 blur-[100px] rounded-full transition-opacity duration-1000 ${start ? "opacity-100" : "opacity-0"}`}
        ></div>

        <div
          className={`transition-all duration-1000 transform ${start ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <Heart
            className="w-24 h-24 text-rose-500 mx-auto mb-6 drop-shadow-glow animate-heartbeat"
            fill="currentColor"
          />

          <h1 className="font-handwriting text-6xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-rose-500 to-rose-700 drop-shadow-sm leading-tight py-2">
            {girlName} <br />
            <span>My World</span>
          </h1>

          <div className="h-px w-32 bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto my-6 opacity-60"></div>

          <p className="text-xl md:text-2xl text-rose-800/80 font-light max-w-lg mx-auto leading-relaxed tracking-wide">
            With all my love,
            <br />
            <span className="italic font-serif text-rose-600">
              I created a world for you.
            </span>
          </p>

          {/* Interactive Call to Action */}
          <div className="mt-16 flex flex-col items-center gap-2 animate-bounce-slow opacity-70 hover:opacity-100 transition-opacity">
            <span className="text-sm tracking-widest uppercase text-rose-700 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Tap to Enter that world
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap');

        .font-handwriting { font-family: 'Dancing Script', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }

        /* === VELVET CURTAINS === */
        .curtain {
          width: 51%;
          height: 100%;
          background: linear-gradient(to right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%); 
          background-color: #ff9a9e;
          position: relative;
          transition: transform 2s cubic-bezier(0.6, 0.05, 0.01, 0.99);
          box-shadow: 0 0 50px rgba(0,0,0,0.2);
          /* Creates a realistic fabric fold texture using gradients */
          background-image: repeating-linear-gradient(90deg, rgba(0,0,0,0.04) 0px, rgba(0,0,0,0) 40px, rgba(255,255,255,0.1) 80px);
        }
        .curtain.left { transform-origin: left top; }
        .curtain.right { transform-origin: right top; }
        
        .curtain.open.left { transform: translateX(-100%) skewX(5deg); }
        .curtain.open.right { transform: translateX(100%) skewX(-5deg); }

        /* === ANIMATIONS === */
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .floating-rose {
        will-change: transform;
          position: absolute;
          opacity: 0.4;
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));
          transition: transform 0.1s ease-out; /* For smooth parallax */
        }
        .rose1 { top: 15%; left: 10%; width: 120px; animation: float 8s ease-in-out infinite; }
        .rose2 { bottom: 20%; right: 10%; width: 140px; animation: float 10s ease-in-out infinite reverse; }
        .rose3 { top: 50%; left: 50%; width: 80px; opacity: 0.2; animation: float 12s ease-in-out infinite; }

        .white-petal {
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border-radius: 100% 0 100% 0;
          box-shadow: 0 0 5px rgba(255,255,255,0.5);
          animation: falling linear infinite;
        }
          .white-petal,
.cloud,
.sparkle-icon {
  will-change: transform;
}

        @keyframes falling {
          0% { transform: translate(0, -10vh) rotate(0deg) scale(0.8); opacity: 0; }
          20% { opacity: 1; transform: translate(20px, 20vh) rotate(45deg) scale(1); }
          100% { transform: translate(-20px, 110vh) rotate(360deg) scale(0.8); opacity: 0; }
        }

        /* Heartbeat with Glow */
        @keyframes heartPulse {
          0% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(244, 63, 94, 0)); }
          50% { transform: scale(1.1); filter: drop-shadow(0 0 15px rgba(244, 63, 94, 0.4)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 0px rgba(244, 63, 94, 0)); }
        }
        .animate-heartbeat { animation: heartPulse 2s infinite ease-in-out; }

        .animate-bounce-slow { animation: bounce 3s infinite; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }

        /* RIPPLE */
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.6);
          box-shadow: 0 0 20px rgba(255, 0, 100, 0.3);
          animation: rippleEffect 1s cubic-bezier(0, 0.2, 0.8, 1) forwards;
          pointer-events: none;
          z-index: 40;
        }
        @keyframes rippleEffect {
          0% { width: 0px; height: 0px; opacity: 0.8; border-width: 5px; }
          100% { width: 800px; height: 800px; opacity: 0; border-width: 0px; }
        }

        /* CLOUDS */
        .cloud {
          position: absolute;
          background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
          width: 400px;
          height: 200px;
          filter: blur(50px);
          opacity: 0.6;
          transition: transform 0.2s ease-out;
        }
        .cloud1 { top: -50px; left: -100px; }
        .cloud2 { bottom: -50px; right: -100px; }
      `}</style>
    </div>
  );
}
export default React.memo(Entry);
