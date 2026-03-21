import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import { ArrowLeft, UtensilsCrossed, Shuffle, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import foodData from "@/data/foodOptions.json";
import { useNavigate } from "react-router-dom";
type Food = {
  id: number;
  name: string;
  emoji: string;
  description: string;
  occasion?: string;
};
export default function FoodPicker() {
  const [selectedFood, setSelectedFood] = useState<Food[]>([]);
  const [surprise, setSurprise] = useState<Food | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
const navigate = useNavigate();
  const toggleFood = (food: Food) => {
    setSelectedFood((prev) =>
      prev.find((f) => f.id === food.id)
        ? prev.filter((f) => f.id !== food.id)
        : [...prev, food],
    );
  };

  const surpriseMe = () => {
    let randomFood = foodData[Math.floor(Math.random() * foodData.length)];

    if (selectedFood.length === 1 && selectedFood[0].id === randomFood.id) {
      const filtered = foodData.filter((f) => f.id !== randomFood.id);
      randomFood = filtered[Math.floor(Math.random() * filtered.length)];
    }

    setSurprise(randomFood);
    setSelectedFood([randomFood]);
  };

  const BackgroundLayer = useMemo(
    () => (
      <>
        <HeartAnimation />
        <BackgroundText />
      </>
    ),
    [],
  );
const selectedIds = useMemo(
  () => new Set(selectedFood.map((f) => f.id)),
  [selectedFood]
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
      {/* ❤️ Romantic Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] md:animate-fade-in">
          <div className="bg-card rounded-2xl shadow-xl p-8 max-w-sm w-[90%] text-center relative">
            <Heart className="w-10 h-10 text-rose mx-auto mb-3 animate-pulse" />

            <h2 className="text-2xl font-handwriting text-foreground mb-2">
              It's Final, My Love ❤️
            </h2>

            <p className="text-foreground/80 mb-4 leading-relaxed">
              We will enjoy{" "}
              <strong>{selectedFood.map((f) => f.name).join(", ")}</strong>{" "}
              together. I can’t wait to share this moment with you, baby. 🍽️💕
            </p>

            <div className="flex justify-center gap-3 mb-4">
              {selectedFood.map((food) => (
                <span key={food.id} className="text-3xl">
                  {food.emoji}
                </span>
              ))}
            </div>

            <Button
              className="w-full rounded-full primary-gradient text-white"
              onClick={() => setConfirmOpen(false)}
            >
              Yay! Can't Wait ❤️
            </Button>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-5xl">
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

        {/* Header */}
        <div className="text-center mb-12 md:animate-fade-in">
          <div className="text-6xl mb-4">🍕</div>
          <h1 className="text-4xl md:text-5xl font-handwriting text-foreground mb-3">
            What Should We Eat Today?
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Let me help you decide what to eat
          </p>
          <Button onClick={surpriseMe} size="lg" className="rounded-full">
            <Shuffle className="w-5 h-5 mr-2" />
            Surprise Me!
          </Button>
        </div>

        {/* Surprise card */}
        {surprise && (
          <Card className="p-8 mb-8 bg-gradient-to-r from-primary/10 to-rose/10 border-primary/20 md:animate-fade-in">
            <div className="text-center">
              <div className="text-8xl mb-4">{surprise.emoji}</div>
              <h2 className="text-3xl font-handwriting text-foreground mb-2">
                Let's have {surprise.name}!
              </h2>
              <p className="text-muted-foreground mb-2">
                {surprise.description}
              </p>
              <p className="text-sm text-foreground/80 italic">
                {surprise.occasion}
              </p>
            </div>
          </Card>
        )}

        {/* Food Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 content-visibility-auto gap-4">
          {foodData.map((food, index) => (
            <Card
              key={food.id}
              className={`p-6 hover:shadow-[var(--shadow-romantic)] transition-all duration-300 md:hover:scale-105 will-change-transform bg-card/95 backdrop-blur cursor-pointer md:animate-fade-in group ${
                selectedIds.has(food.id)
                  ? "border-primary shadow-[var(--shadow-romantic)]"
                  : ""
              }`}
              style={{ animationDelay: `${index * 0.02}s` }}
              onClick={() => toggleFood(food)}
            >
              <div className="text-center">
                <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {food.emoji}
                </div>
                <h3 className="font-handwriting text-lg text-foreground mb-1">
                  {food.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {food.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* If food selected */}
        {selectedFood.length > 0 && (
          <Card className="mt-8 p-8 bg-card/95 backdrop-blur shadow-[var(--shadow-romantic)] md:animate-fade-in">
            <div className="text-center">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-primary" />

              <h3 className="text-2xl font-handwriting text-foreground mb-4">
                Our Food Plan
              </h3>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {selectedFood.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center gap-2 bg-background/50 rounded-full px-4 py-2"
                  >
                    <span className="text-2xl">{food.emoji}</span>
                    <span className="text-foreground font-medium">
                      {food.name}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground mb-4">
                Perfect! Let's enjoy{" "}
                {selectedFood.map((f) => f.name).join(", ")} together 💕
              </p>

              <div className="flex justify-center gap-4">
                <Button onClick={() => setSelectedFood([])} variant="outline">
                  Clear Selection
                </Button>

                {/* Confirm button opens modal */}
                <Button
                  className="primary-gradient text-primary-foreground"
                  onClick={() => setConfirmOpen(true)}
                >
                  Confirm Meal Plan ❤️
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Footer */}
        <Card className="mt-8 p-8 bg-gradient-to-r from-peach/10 to-rose/10 border-peach/20 text-center">
          <Heart className="w-12 h-12 mx-auto mb-4 text-rose fill-rose animate-pulse-soft" />
          <p className="text-foreground/90 italic mb-2">
            "Every meal with you is special 🍽️💕"
          </p>
          <p className="text-sm text-muted-foreground">
            Click on your favorites to build your meal plan, or hit surprise me!
          </p>
        </Card>
      </div>
    </div>
  );
}
