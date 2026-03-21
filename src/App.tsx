import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { storage } from "./lib/storage";
import { lazy, Suspense } from "react";

import { Heart } from "lucide-react";
const Entry = lazy(() => import("./pages/Entry"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const LockScreen = lazy(() => import("./pages/Lock"));
const Home = lazy(() => import("./pages/Home"));
const DailyMessage = lazy(() => import("./pages/DailyMessage"));
const Timeline = lazy(() => import("./pages/Timeline"));
const LoveCoupans = lazy(() => import("./pages/LoveCoupons"));
const Settings = lazy(() => import("./pages/Settings"));
const NotFound = lazy(() => import("./pages/NotFound"));
const VoiceNotes = lazy(() => import("./pages/VoiceNotes"));
const Moods = lazy(() => import("./pages/Moods"));
const Affirmations = lazy(() => import("./pages/Affirmations"));
const Songs = lazy(() => import("./pages/Songs"));
const Shayaris = lazy(() => import("./pages/Shayaris"));
const Photos = lazy(() => import("./pages/Photos"));
const Calendar = lazy(() => import("./pages/Calendar"));
const FunZone = lazy(() => import("./pages/FunZone"));
const SpecialEvents = lazy(() => import("./pages/SpecialEvents"));
const FoodPicker = lazy(() => import("./pages/FoodPicker"));
const Proposals = lazy(() => import("./pages/Proposals"));
const Reasons = lazy(() => import("./pages/Reasons"));

// import { HeartAnimation } from "@/components/HeartAnimation";
import { useGlobalMusic } from "@/hooks/useGlobalMusic";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isSetupComplete = storage.isSetupComplete();
  const isUnlocked = storage.isUnlocked();
  if (!isSetupComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!isUnlocked) {
    return <Navigate to="/lock" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  const { resumeMusic } = useGlobalMusic();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      resumeMusic();
    }, 300);

    return () => clearTimeout(t);
  }, [resumeMusic]);
  useEffect(() => {
    const interval = setInterval(() => {}, 2000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const theme = storage.getTheme();
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);
    useEffect(() => {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => {
          import("./pages/Home");
          import("./pages/Entry");
        });
      } else {
        const t = setTimeout(() => {
          import("./pages/Home");
          import("./pages/Entry");
        }, 300);

        return () => clearTimeout(t);
      }
    }, []);

    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setAppReady(true), 200);
    return () => clearTimeout(t);
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" />

        {/* Global floating hearts */}
        {/* <HeartAnimation /> */}

        {/* All routes */}
        <Suspense
          fallback={
            <div className="flex items-center justify-center min-h-screen px-6">
              <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-[0_10px_40px_rgba(255,150,170,0.25)] rounded-3xl px-10 py-12 text-center space-y-6 max-w-sm w-full">
                <div className="relative flex items-center justify-center w-24 h-24 mx-auto">
                  <div className="absolute w-20 h-20 rounded-full bg-rose-200/40 blur-md animate-pulse"></div>

                  <Heart className="w-12 h-12 text-rose-500 animate-pulse z-10" />

                  <span className="absolute text-rose-300 text-sm animate-bounce -top-2 left-4">
                    ♡
                  </span>
                  <span className="absolute text-rose-300 text-sm animate-bounce delay-200 -bottom-1 right-4">
                    ♡
                  </span>
                </div>

                <div className="space-y-2">
                  <p className="text-rose-600 font-semibold text-lg tracking-wide">
                    Preparing our love story...
                  </p>

                  <p className="text-sm text-rose-500/80 animate-pulse">
                    Every beautiful memory is getting ready ❤️
                  </p>
                  <div className="w-full h-1 bg-rose-100 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 animate-[loading_3s_linear_infinite] w-1/3"></div>
                  </div>
                </div>
              </div>
            </div>
          }
        >
          {appReady && (
            <Routes>
              {/* ⭐ ENTRY PAGE FIRST */}
              <Route path="/" element={<Entry />} />

              {/* SETUP FLOW */}
              <Route
                path="/onboarding"
                element={
                  storage.isSetupComplete() ? (
                    <Navigate to="/lock" replace />
                  ) : (
                    <Onboarding />
                  )
                }
              />
              <Route path="/lock" element={<LockScreen />} />

              {/* PROTECTED PAGES */}
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/daily-message"
                element={
                  <ProtectedRoute>
                    <DailyMessage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/timeline"
                element={
                  <ProtectedRoute>
                    <Timeline />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/coupans"
                element={
                  <ProtectedRoute>
                    <LoveCoupans />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/voice-notes"
                element={
                  <ProtectedRoute>
                    <VoiceNotes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/moods"
                element={
                  <ProtectedRoute>
                    <Moods />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/affirmations"
                element={
                  <ProtectedRoute>
                    <Affirmations />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/songs"
                element={
                  <ProtectedRoute>
                    <Songs />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/shayaris"
                element={
                  <ProtectedRoute>
                    <Shayaris />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/photos"
                element={
                  <ProtectedRoute>
                    <Photos />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/calendar"
                element={
                  <ProtectedRoute>
                    <Calendar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/fun-zone"
                element={
                  <ProtectedRoute>
                    <FunZone />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/special-events"
                element={
                  <ProtectedRoute>
                    <SpecialEvents />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/food-picker"
                element={
                  <ProtectedRoute>
                    <FoodPicker />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/proposals"
                element={
                  <ProtectedRoute>
                    <Proposals />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reasons"
                element={
                  <ProtectedRoute>
                    <Reasons />
                  </ProtectedRoute>
                }
              />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          )}
        </Suspense>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
