import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import { ArrowLeft, Heart, Gift, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
// Love Coupons Book - single-file React component
// Drop this file in your pages/components folder and import it in routes.

const defaultCoupons = [
  {
    id: "c1",
    title: "Unlimited Kisses",
    description: "Redeem for soft, infinite kisses from me whenever you want.",
    uses: 999,
    emoji: "💋",
  },
  {
    id: "c2",
    title: "Unlimited Hugs",
    description: "Warm, tight hugs from me anytime you need comfort.",
    uses: 999,
    emoji: "🤗",
  },
  {
    id: "c3",
    title: "Movie Date",
    description: "You choose the movie, I bring snacks, cuddles and vibes.",
    uses: 999,
    emoji: "🎬",
  },
  {
    id: "c4",
    title: "Street Food Date",
    description:
      "A Unlimited Street Food date, you and me and our special food",
    uses: 999,
    emoji: "🕯️",
  },

  {
    id: "c5",
    title: "Massage Session",
    description: "A relaxing 30-minute massage session from me.",
    uses: 999,
    emoji: "💆‍♀️",
  },
  {
    id: "c6",
    title: "Future Planning Date",
    description: "We talk about our dreams, future plans, and us — deeply.",
    uses: 999,
    emoji: "🌙",
  },
  {
    id: "c7",
    title: "A Song For You",
    description: "I sing a romantic or cute song just for you.",
    uses: 999,
    emoji: "🎤",
  },
  {
    id: "c8",
    title: "A Love Letter",
    description: "I’ll write you a handwritten-style digital love letter.",
    uses: 999,
    emoji: "💌",
  },
  {
    id: "c9",
    title: "Your Wish, My Command",
    description: "You ask for anything cute or romantic — I must do it.",
    uses: 999,
    emoji: "✨",
  },
  {
    id: "c10",
    title: "One Long Voice Note",
    description:
      "A long, heartfelt voice message from me whenever you miss me.",
    uses: 999,
    emoji: "🎧",
  },
];

type Coupon = {
  id: string;
  title: string;
  description: string;
  uses: number;
  emoji: string;
};

export default function LoveCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const raw = localStorage.getItem("love_coupons_v1");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return defaultCoupons;
  });
const navigate = useNavigate();
  const [selected, setSelected] = useState<Coupon | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [justRedeemed, setJustRedeemed] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("love_coupons_v1", JSON.stringify(coupons));
    } catch (e) {}
  }, [coupons]);

  const openCoupon = (c: Coupon) => {
    setSelected(c);
    setShowModal(true);
  };

  const redeemCoupon = (couponId) => {
    setCoupons((prev) =>
      prev.map((c) => {
        if (c.id !== couponId) return c;
        const remaining = (c.uses ?? 0) - 1;
        return { ...c, uses: Math.max(0, remaining) };
      }),
    );

    setJustRedeemed(couponId);
    setShowModal(false);

    // tiny confetti like effect via class (your project may already have confetti util)
    setTimeout(() => setJustRedeemed(null), 1800);
  };

  const resetCoupons = () => {
    localStorage.removeItem("love_coupons_v1");
    setCoupons(defaultCoupons);
  };
const BackgroundLayer = useMemo(
  () => (
    <>
      <HeartAnimation />
      <BackgroundText />
    </>
  ),
  []
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
        <div className="mb-6">
          <Button onClick={goHome}
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

        <div className="text-center mb-8">
          <h1 className="text-4xl font-handwriting text-foreground mb-2">
            Love Coupons Book
          </h1>
          <p className="text-muted-foreground">
            Redeem a coupon whenever you want — each one is made by me for you.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <Card
              key={coupon.id}
              className={`p-6 hover:scale-105 transition-transform duration-300 bg-card/95 backdrop-blur relative`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-3xl mb-2">{coupon.emoji}</div>
                  <h3 className="text-lg font-semibold mb-1">{coupon.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {coupon.description}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Uses left</div>
                  <div className="text-xl font-semibold">{coupon.uses}</div>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => openCoupon(coupon)}
                  size="sm"
                  className="flex-1"
                >
                  Open
                </Button>
                <Button
                  onClick={() => redeemCoupon(coupon.id)}
                  size="sm"
                  variant="outline"
                  disabled={coupon.uses <= 0}
                >
                  Redeem
                </Button>
              </div>

              {justRedeemed === coupon.id && (
                <div className="absolute -top-3 -right-3 bg-rose-500 text-white rounded-full p-2 shadow-lg animate-pulse">
                  <Check className="w-4 h-4" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {coupons.filter((c) => c.uses > 0).length} coupons available •{" "}
            {coupons.length} total
          </div>

          {/* <div className="flex items-center gap-3">
            <Button onClick={() => {
              // add a fun random coupon
              const id = `c_custom_${Date.now()}`;
              const newCoupon = { id, title: "Custom Surprise", description: "A little surprise planned by me.", uses: 1, emoji: "🎉" };
              setCoupons([newCoupon, ...coupons]);
            }} variant="ghost">Add Surprise</Button>

            <Button onClick={resetCoupons} variant="outline">Reset</Button>
          </div> */}
        </div>

        {/* Modal */}
        {showModal && selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            <Card className="relative z-10 p-6 max-w-lg w-full">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-4xl mb-2">{selected.emoji}</div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {selected.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {selected.description}
                  </p>
                </div>

                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-full hover:bg-background/30"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="mt-4 flex gap-3">
                <Button onClick={() => redeemCoupon(selected.id)}>
                  Redeem Now
                </Button>
                <Button variant="outline" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}

        <div className="text-center mt-8 text-sm text-muted-foreground">
          Every coupon is a promise — redeem it whenever you want, and I’ll keep
          it.
        </div>
      </div>
    </div>
  );
}
