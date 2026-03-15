import { useEffect, useState } from "react";
import { storage } from "@/lib/storage";

export const BackgroundText = () => {
  const [phrases, setPhrases] = useState([]);

  const profile = storage.getUserProfile();
  const name = profile?.name || "my love";

  const romanticPhrases = [
    `love you ${name}`,
    `${name} forever`,
    "My sunshine",
    "My soulmate ❤️",
    "My princess",
    "My World ❤️",
    `${name} ❤️`,
    "Always yours",
  ];

  // generate beautiful random positions
  const randomPosition = (existing: any[]) => {
    let top, left;
    let tries = 0;

    do {
      top = 8 + Math.random() * 80;
      left = 8 + Math.random() * 80;
      tries++;

      const tooClose = existing.some((p) => {
        const dx = p.left - left;
        const dy = p.top - top;
        return Math.sqrt(dx * dx + dy * dy) < 18;
      });

      if (!tooClose) return { top, left };
    } while (tries < 40);

    return { top, left };
  };

  useEffect(() => {
    const placed = [];

    romanticPhrases.forEach((text, i) => {
      const pos = randomPosition(placed);

      placed.push({
        id: i,
        text,
        top: pos.top,
        left: pos.left,
        delay: Math.random() * 4,
        duration: 11 + Math.random() * 6,
        rotate: (Math.random() * 20 - 10).toFixed(2),
        opacity: 0.4 + Math.random() * 0.4,
      });
    });

    setPhrases(placed);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[1]">

      {/* --- FLOATING FADED WHITE ROSES (MATCH ENTRY PAGE STYLE) --- */}
      <img
        src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-white-rose-bud-png-image_10216329.png"
        className="bg-rose-img roseA"
        alt=""
        loading="lazy"
      />
      <img
        src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-white-rose-bud-png-image_10216329.png"
        className="bg-rose-img roseB"
        alt=""
        loading="lazy"
      />
      <img
        src="https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-white-rose-bud-png-image_10216329.png"
        className="bg-rose-img roseC"
        alt=""
        loading="lazy"
      />

      {/* --- FLOATING ROMANTIC WORDS --- */}
      {phrases.map((item: any) => (
        <div
          key={item.id}
          className="
            absolute 
            font-handwriting 
            text-3xl md:text-6xl
            animate-floatingLove
            whitespace-nowrap
            mix-blend-screen
          "
          style={{
            top: `${item.top}%`,
            left: `${item.left}%`,
            transform: `translate(-50%, -50%) rotate(${item.rotate}deg)`,
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`,
            opacity: item.opacity,
            background: "linear-gradient(90deg, #ff99b8, #ffd2da, #ffe8f1)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 10px rgba(255,150,180,0.55))",
          }}
        >
          {item.text}
        </div>
      ))}

      {/* Extra CSS for floating roses */}
      <style>{`
        .bg-rose-img {
          position: absolute;
          opacity: 0.22;
          filter: drop-shadow(0 0 18px rgba(255,255,255,0.4));
          animation: floatRose 12s ease-in-out infinite;
          user-select: none;
          pointer-events: none;
        }

        .roseA {
          top: 15%;
          left: 10%;
          width: 160px;
          animation-delay: 0s;
        }

        .roseB {
          bottom: 18%;
          right: 12%;
          width: 190px;
          animation-delay: 3s;
        }

        .roseC {
          top: 50%;
          left: 70%;
          width: 110px;
          opacity: 0.16;
          animation-delay: 1.5s;
        }

        @keyframes floatRose {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(4deg); }
        }

        /* Floating text animation */
        @keyframes floatingLove {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          50% { transform: translate(-50%, -53%) rotate(2deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        .animate-floatingLove {
          animation: floatingLove linear infinite;
        }
      `}</style>
    </div>
  );
};
