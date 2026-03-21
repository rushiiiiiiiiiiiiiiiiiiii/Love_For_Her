import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import {
  ArrowLeft,
  Heart,
  Star,
  Gift,
  Shuffle,
  Pin,
  CheckCircle,
  ArrowUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import momentsData from "../data/proposals.json";
import { useNavigate } from "react-router-dom";
type Moment = {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
};

/*
  OurFutureTogether.jsx
  - Tabs (All / Travel / Dates / Memories / Fun / BigDreams / Adventure / Romantic / Silly)
  - Pin, Complete, Random, Pin list, Progress bar
  - Persisted in localStorage
  - Dreamy pastel UI with heart progress
*/

const LOCAL_KEY = "our_future_state_v1";

function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);

  return [state, setState] as const;
}

export default function OurFutureTogether() {
  const categories = useMemo(() => {
    const cats = new Set(momentsData.map((m) => m.category));
    return ["All", ...Array.from(cats)];
  }, [momentsData]);

  // persistent state: pinnedIds, completedIds, pinnedOrder
  const [state, setState] = usePersistentState(LOCAL_KEY, {
    pinned: [],
    completed: [],
  });
const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [selected, setSelected] = useState<Moment | null>(null);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  // derived lists
  const filtered = momentsData.filter((m) => {
    if (showPinnedOnly && !state.pinned.includes(m.id)) return false;
    if (activeTab === "All") return true;
    return m.category === activeTab;
  });

  const totalCount = momentsData.length;
  const completedCount = state.completed.length;
  const pinnedCount = state.pinned.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const togglePin = (id) => {
    setState((prev) => {
      const pinned = prev.pinned.includes(id)
        ? prev.pinned.filter((p) => p !== id)
        : [id, ...prev.pinned];
      return { ...prev, pinned };
    });
  };

  const toggleComplete = (id) => {
    setState((prev) => {
      const completed = prev.completed.includes(id)
        ? prev.completed.filter((c) => c !== id)
        : [id, ...prev.completed];
      return { ...prev, completed };
    });
  };

  const pickRandom = () => {
    const pool = showPinnedOnly
      ? momentsData.filter((m) => state.pinned.includes(m.id))
      : momentsData;
    if (!pool.length) return;
    const picked = pool[Math.floor(Math.random() * pool.length)];
    setSelected(picked);
    // auto-pin if not already pinned (gentle nudge)
    if (!state.pinned.includes(picked.id)) {
      setState((prev) => ({ ...prev, pinned: [picked.id, ...prev.pinned] }));
    }
  };

  const clearProgress = () =>
    setState({
      pinned: [],
      completed: [],
    });

  // UI helpers

  const pinnedSet = useMemo(() => new Set(state.pinned), [state.pinned]);
  const completedSet = useMemo(
    () => new Set(state.completed),
    [state.completed],
  );
  const isPinned = (id: number) => pinnedSet.has(id);
  const isCompleted = (id: number) => completedSet.has(id);

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
    <div className="min-h-screen relative romantic-gradient overflow-x-hidden">
      {BackgroundLayer}

      <div className="container mx-auto px-4 py-8 relative z-10 max-w-6xl">
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

        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-handwriting text-foreground mb-2 drop-shadow-lg">
            Our Future Together…
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cute things, places to visit, little traditions and big dreams — all
            the moments I want to live with you.
          </p>

          {/* Progress / Heart bar */}
          <div className="mt-6 max-w-xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="w-full bg-background/30 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-rose to-primary transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2 text-center">
                  {completedCount} / {totalCount} completed • {progressPercent}%
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={pickRandom}
                  title="Random Future Moment"
                >
                  <Shuffle className="w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                >
                  {showPinnedOnly ? "Show All" : "Show Pinned"}
                </Button>
              </div>
            </div>

            {/* Small pinned row */}
            {state.pinned.length > 0 && (
              <div className="mt-4 flex items-center gap-3 overflow-x-auto py-2">
                {state.pinned.map((id) => {
                  const m = momentsData.find((x) => x.id === id);
                  if (!m) return null;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelected(m)}
                      className="flex items-center gap-2 px-3 py-2 bg-background/60 rounded-full shadow-sm"
                    >
                      <span className="text-sm">{m.title}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </header>

        {/* Tabs */}
        <nav className="mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveTab(cat);
                  setShowPinnedOnly(false);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeTab === cat
                    ? "bg-gradient-to-r from-rose to-primary text-white"
                    : "bg-background/30 text-muted-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>

        {/* Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item, idx) => (
            <Card
              key={item.id}
              className="overflow-hidden rounded-2xl shadow-md bg-card/60 backdrop-blur animate-fade-in transform transition md:hover:scale-[1.02]"
              style={{ animationDelay: `${idx * 0.03}s` }}
            >
              <div className="h-48 w-full overflow-hidden relative">
                <img
                  loading="lazy"
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 animate-fade-in" />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => togglePin(item.id)}
                    className={`p-2 rounded-full backdrop-blur bg-white/10 ${isPinned(item.id) ? "ring-2 ring-rose/40" : ""}`}
                    title={isPinned(item.id) ? "Unpin" : "Pin"}
                  >
                    <Pin
                      className={`w-4 h-4 ${isPinned(item.id) ? "text-rose" : "text-white"}`}
                    />
                  </button>
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className={`p-2 rounded-full backdrop-blur bg-white/10 ${isCompleted(item.id) ? "ring-2 ring-green-300" : ""}`}
                    title={
                      isCompleted(item.id) ? "Mark as not done" : "Mark as done"
                    }
                  >
                    <CheckCircle
                      className={`w-4 h-4 ${isCompleted(item.id) ? "text-green-300" : "text-white"}`}
                    />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-handwriting text-foreground mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.description}
                    </p>
                    <div className="text-xs text-foreground/70 italic">
                      {item.category}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button className="flex-1" onClick={() => setSelected(item)}>
                    I Want This With You ❤️
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      togglePin(item.id);
                    }}
                  >
                    {isPinned(item.id) ? "Pinned" : "Pin"}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* Footer controls */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            {pinnedCount} pinned • {completedCount} completed • {totalCount}{" "}
            total
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <ArrowUp className="w-4 h-4 mr-2" /> Back to top
            </Button>
            <Button variant="outline" onClick={clearProgress}>
              Reset Progress
            </Button>
          </div>
        </div>
      </div>

      {/* Selected modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 max-w-2xl w-full">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <img
                  loading="lazy"
                  src={selected.image}
                  alt={selected.title}
                  className="w-36 h-36 object-cover rounded-2xl"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-handwriting text-foreground">
                      {selected.title}
                    </h2>
                    {isPinned(selected.id) && (
                      <div className="text-xs px-2 py-1 bg-rose/20 rounded-full">
                        Pinned
                      </div>
                    )}
                    {isCompleted(selected.id) && (
                      <div className="text-xs px-2 py-1 bg-green-200 rounded-full">
                        Done
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground mt-2">
                    {selected.description}
                  </p>

                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={() => {
                        toggleComplete(selected.id);
                      }}
                    >
                      {isCompleted(selected.id)
                        ? "Mark as not done"
                        : "Mark as done"}{" "}
                      ✔
                    </Button>
                    <Button
                      onClick={() => {
                        togglePin(selected.id);
                      }}
                    >
                      {isPinned(selected.id) ? "Unpin" : "Pin"}{" "}
                      <Pin className="w-4 h-4 ml-2" />
                    </Button>
                    <Button variant="outline" onClick={() => setSelected(null)}>
                      Close
                    </Button>
                  </div>

                  <div className="mt-3 text-sm text-muted-foreground">
                    Try adding this to our calendar or pinning it so we
                    remember.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
