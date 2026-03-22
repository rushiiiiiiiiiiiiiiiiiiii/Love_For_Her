import { useState, useMemo } from "react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { HeartAnimation } from "@/components/HeartAnimation";
import { ArrowLeft, Moon, Sun, User, Lock, Trash2, Heart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { storage } from "@/lib/storage";
import { toast } from "sonner";

export default function Settings() {
  const navigate = useNavigate();
  const profile = useMemo(() => storage.getUserProfile(), []);
  const [name, setName] = useState(profile?.name || "");
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmNewPin, setConfirmNewPin] = useState("");
  const [theme, setTheme] = useState(storage.getTheme());
  const [showClearModal, setShowClearModal] = useState(false);
  // const profile = useMemo(() => storage.getUserProfile(), []);
  const gname = profile?.name || "My Love";

  const handleUpdateName = () => {
    if (name.trim().length < 2)
      return toast.error("Name must be at least 2 characters");
    storage.updateUserProfile({ name: name.trim() });
    toast.success("Name updated! ❤️");
  };

  const handleUpdatePin = () => {
    if (!storage.verifyPin(currentPin))
      return toast.error("Current PIN is incorrect");
    if (newPin.length < 4)
      return toast.error("New PIN must be at least 4 characters");
    if (newPin !== confirmNewPin) return toast.error("PINs do not match");
    storage.updateUserProfile({ pin: newPin });
    setCurrentPin("");
    setNewPin("");
    setConfirmNewPin("");
    toast.success("PIN updated successfully! 🔒");
  };

  const handleThemeChange = useCallback(
    (mode) => {
      setTheme(mode);
      storage.setTheme(mode);
      toast.success(`Theme changed to ${mode}`);
    },
    [storage],
  );

  const handleClearData = () => {
    setShowClearModal(true);
  };

  const confirmClearData = useCallback(() => {
    storage.clearAll();
    toast.success("All data cleared!");
    navigate("/");
  }, [navigate]);
  const BackgroundLayer = useMemo(() => <HeartAnimation />, []);

  const ClearModal = useMemo(() => {
    if (!showClearModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-md px-6 animate-fade-in">
        <div className="relative bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_25px_80px_rgba(255,120,150,0.35)] rounded-3xl p-10 max-w-sm w-full text-center animate-modal-in">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-28 h-28 bg-rose-200/40 blur-3xl rounded-full"></div>

          <Heart className="w-12 h-12 mx-auto text-rose-500 mb-4 animate-pulse" />

          <h2 className="text-2xl font-handwriting text-rose-700 mb-3">
            Begin Our Story Again?
          </h2>

          <p className="text-sm text-rose-900/70 mb-6 leading-relaxed">
            This will gently reset our little world — your name, memories, and
            settings.
            <br />
            <br />
            But don't worry… a beautiful new story can begin anytime. ❤️
          </p>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="w-full border-rose-200 hover:bg-rose-50"
              onClick={() => setShowClearModal(false)}
            >
              Keep Our Story
            </Button>

            <Button
              className="w-full bg-rose-500 hover:bg-rose-600 text-white shadow-md"
              onClick={confirmClearData}
            >
              Begin Again
            </Button>
          </div>
        </div>
      </div>
    );
  }, [showClearModal, confirmClearData]);

  const goHome = () => {
    import("../pages/Home");

    setTimeout(() => {
      navigate("/home", { replace: true });
    }, 50);
  };
  return (
    <div className="min-h-screen romantic-gradient relative pb-20">
      {BackgroundLayer}

      {/* ✨ Extra Styling */}
      <style>{`
        .section-card {
          background: rgba(255, 255, 255, 0.38);
          backdrop-filter: blur(14px);
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.32);
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .section-card:hover {
          transform: translate3d(0,-3px,0);
          box-shadow: 0 12px 38px rgba(255,150,180,0.25);
        }
        .fade-up {
          animation: fadeUp 0.6s ease forwards;
          will-change: transform, opacity;
        }
          .white-petal,
.animate-heart,
.animate-modal-in {
  will-change: transform, opacity;
}
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
          .animate-fade-in {
  animation: fadeBackdrop 0.3s ease;
}

@keyframes fadeBackdrop {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-modal-in {
  animation: modalSoftIn 0.45s cubic-bezier(.21,1.02,.73,1);
}

@keyframes modalSoftIn {
  0% {
    opacity: 0;
    transform: translateY(40px) scale(.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
      `}</style>

      <div className="container mx-auto px-5 py-10 max-w-2xl relative z-10">
        <Button
          onClick={goHome}
          className="mb-6 flex items-center gap-2 rounded-full px-5 py-2 
    bg-white/40 backdrop-blur-md border border-white/40 
    text-rose-700 hover:bg-white/60 
    shadow-[0_6px_20px_rgba(255,120,150,0.25)] 
    transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft className="w-4 h-4" />
          Back Home
        </Button>

        <div className="text-center fade-up mb-8">
          <h1 className="text-5xl font-handwriting text-foreground mb-1">
            Settings
          </h1>
          <p className="text-muted-foreground">
            Customize your beautiful space 💖
          </p>
        </div>

        <div className="space-y-8">
          {/* NAME */}
          <Card className="p-6 section-card fade-up">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Your Name</h2>
            </div>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
            />
            <Button className="w-full mt-3" onClick={handleUpdateName}>
              Update Name
            </Button>
          </Card>

          {/* THEME */}
          <Card
            className="p-6 section-card fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center gap-3 mb-3">
              {theme === "light" ? (
                <Sun className="w-5 h-5 text-primary" />
              ) : (
                <Moon className="w-5 h-5 text-primary" />
              )}
              <h2 className="text-xl font-semibold">Theme</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={theme === "light" ? "default" : "outline"}
                className="shadow-sm"
                onClick={() => handleThemeChange("light")}
              >
                <Sun className="w-4 h-4 mr-2" /> Light
              </Button>

              <Button
                variant={theme === "dark" ? "default" : "outline"}
                className="shadow-sm"
                onClick={() => handleThemeChange("dark")}
              >
                <Moon className="w-4 h-4 mr-2" /> Dark
              </Button>
            </div>
          </Card>

          {/* PIN */}
          <Card
            className="p-6 section-card fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Lock className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Change PIN</h2>
            </div>

            <div className="space-y-3">
              <Input
                type="password"
                autoComplete="off"
                placeholder="Current PIN"
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
              />
              <Input
                type="password"
                placeholder="New PIN"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm New PIN"
                value={confirmNewPin}
                onChange={(e) => setConfirmNewPin(e.target.value)}
              />
              <Button className="w-full" onClick={handleUpdatePin}>
                Update PIN
              </Button>
            </div>
          </Card>

          {/* CLEAR DATA */}
          <Card
            className="p-6 section-card fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <Trash2 className="w-5 h-5 text-rose-600" />
              <h2 className="text-xl font-semibold text-rose-600">
                Start Again
              </h2>
            </div>

            <p className="text-sm text-foreground/70 mb-4">
              Clears PIN, name, theme, favorites, messages & all app memory and
              start again.
            </p>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleClearData}
            >
              Clear Data
            </Button>
          </Card>
        </div>

        <div className="text-center mt-10 text-sm text-muted-foreground fade-up">
          <p>Made with ❤️ for {gname} By Vijay</p>
        </div>
      </div>
      {ClearModal}
    </div>
  );
}
