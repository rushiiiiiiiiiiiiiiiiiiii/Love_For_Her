import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import {
  ArrowLeft,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import photosData from "@/data/photos.json";
import { useGlobalMusic } from "@/hooks/useGlobalMusic";

export default function Photos() {
  const [selectedMedia, setSelectedMedia] = useState<number | null>(null);
  const [slideshowActive, setSlideshowActive] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const [loadingStates, setLoadingStates] = useState(
    Array(photosData.length).fill(true),
  );

  const slideshowInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // GLOBAL MUSIC
  const { pauseMusic, resumeMusic } = useGlobalMusic();

  // PRELOAD ALL VIDEOS
  useEffect(() => {
    photosData
      .filter((m) => m.file.endsWith(".mp4"))
      .forEach((m) => {
        const v = document.createElement("video");
        v.src = m.file;
        v.preload = "metadata";
        v.muted = true;
        v.playsInline = true;
        v.load();
      });
  }, []);

  // SLIDESHOW AUTOPLAY
  useEffect(() => {
    if (!slideshowActive) return;

    slideshowInterval.current = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % photosData.length);
    }, 4000);

    return () => {
      if (slideshowInterval.current) {
        clearInterval(slideshowInterval.current);
        slideshowInterval.current = null;
      }
    };
  }, [slideshowActive]);

  const toggleSlideshow = () => {
    if (slideshowActive) {
      setSlideshowActive(false);
      if (slideshowInterval.current) clearInterval(slideshowInterval.current);
    } else {
      setSelectedMedia(null);
      setSlideIndex(0);
      pauseMusic();
      setSlideshowActive(true);
    }
  };

  const nextSlide = () =>
    setSlideIndex((prev) => (prev + 1) % photosData.length);

  const prevSlide = () =>
    setSlideIndex((prev) => (prev - 1 + photosData.length) % photosData.length);

  const isVideo = useCallback((file: string) => file.endsWith(".mp4"), []);

  const closeFullscreen = () => {
    if (selectedMedia !== null && isVideo(photosData[selectedMedia].file)) {
      const vid = document.getElementById(
        "fullscreen-video",
      ) as HTMLVideoElement | null;
      if (vid) vid.pause();
    }

    setSelectedMedia(null);
    resumeMusic();
  };

  const handleLoaded = (index: number) => {
    setLoadingStates((prev) => {
      const updated = [...prev];
      updated[index] = false;
      return updated;
    });
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
  return (
    <div className="min-h-screen romantic-gradient relative">
      {BackgroundLayer}

      <div className="container mx-auto px-4 py-8 max-w-6xl relative z-10">
        <Link to="/home" replace>
          <Button
            className="mb-6 flex items-center gap-2 rounded-full px-5 py-2 
    bg-white/40 backdrop-blur hover:shadow-[0_0_20px_rgba(255,150,170,0.4)] transition-md border border-white/40 
    text-rose-700 hover:bg-white/60 
    shadow-[0_6px_20px_rgba(255,120,150,0.25)] 
    transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back Home
          </Button>
        </Link>

        <div className="text-center mb-12">
          <div className="text-6xl mb-4">💞📸</div>
          <h1 className="text-4xl md:text-5xl font-handwriting mb-3">
            Our Memories Together
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Every photo and video holds a moment of our love ❤️
          </p>

          <Button size="lg" onClick={toggleSlideshow}>
            {slideshowActive ? (
              <>
                <Pause className="w-5 h-5 mr-2" /> Pause Slideshow
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" /> Start Slideshow
              </>
            )}
          </Button>
        </div>
        <Card className="mb-8 p-6 text-center bg-white/60 backdrop-blur border border-rose-200">
          <Sparkles className="w-6 h-6 mx-auto text-rose mb-2 animate-pulse" />
          <p className="font-handwriting text-xl text-rose-700">
            Imagine this gallery filled with your own memories ❤️
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your photos and videos when you create your own love website.
          </p>
        </Card>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photosData.map((item, index) => (
            <Card
              key={item.id}
              className="rounded-2xl overflow-hidden bg-card/95 backdrop-blur border border-rose-300/40 hover:scale-[1.03] hover:shadow-[0_0_20px_rgba(255,150,170,0.5)] transition-transform will-change-transform cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                pauseMusic();
                setSlideshowActive(false);
                setSelectedMedia(index);
              }}
            >
              <div className="p-3 bg-gradient-to-br from-rose-100/50 to-pink-50/40 rounded-2xl">
                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-rose-300/50">
                  {/* BLUR LOADER */}
                  {loadingStates[index] && (
                    <div className="absolute inset-0 bg-pink-200/20 backdrop-blur-md animate-pulse" />
                  )}

                  {isVideo(item.file) ? (
                    <video
                      src={item.file}
                      muted
                      autoPlay
                      loop
                      playsInline
                      preload="auto"
                      onLoadedData={() => handleLoaded(index)}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        loadingStates[index]
                          ? "blur-md opacity-40"
                          : "blur-0 opacity-100"
                      }`}
                    />
                  ) : (
                    <img
                      loading="lazy"
                      src={item.file}
                      onLoad={() => handleLoaded(index)}
                      className={`w-full h-full object-cover transition-transform duration-500 ${
                        loadingStates[index]
                          ? "blur-md opacity-40"
                          : "blur-0 opacity-100"
                      }`}
                    />
                  )}
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-handwriting text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.date}</p>
                <p className="text-sm italic opacity-80">"{item.caption}"</p>
              </div>
            </Card>
          ))}
          <Card className="rounded-2xl border-dashed border-2 border-rose-300 flex flex-col items-center justify-center text-center p-6 bg-white/40 backdrop-blur hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,150,170,0.4)] transition">
            <Heart className="w-8 h-8 text-rose animate-pulse mb-2" />
            <p className="font-handwriting text-lg text-rose">
              Your next memory could appear here ❤️
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Add your own photos when you create your website.
            </p>
          </Card>
        </div>

        {/* SLIDESHOW VIEW */}
        {slideshowActive && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex flex-col items-center justify-center p-4 animate-fade-in">
            <div className="max-w-3xl max-h-[70vh] rounded-2xl overflow-hidden border-4 border-rose-200/60 shadow-xl">
              <div className="relative w-full h-full">
                {isVideo(photosData[slideIndex].file) ? (
                  <video
                    src={photosData[slideIndex].file}
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={() => handleLoaded(slideIndex)}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      loadingStates[slideIndex]
                        ? "blur-md opacity-40"
                        : "blur-0 opacity-100"
                    }`}
                  />
                ) : (
                  <img
                    loading="lazy"
                    src={photosData[slideIndex].file}
                    onLoad={() => handleLoaded(slideIndex)}
                    className={`w-full h-full object-cover transition-transform duration-500 ${
                      loadingStates[slideIndex]
                        ? "blur-md opacity-40"
                        : "blur-0 opacity-100"
                    }`}
                  />
                )}
              </div>
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-md px-6 py-4 rounded-xl text-white text-center border border-white/20 max-w-xl">
              <h2 className="text-3xl font-handwriting">
                {photosData[slideIndex].title}
              </h2>
              <p className="opacity-80">{photosData[slideIndex].date}</p>
              <p className="italic opacity-90 mt-1">
                "{photosData[slideIndex].caption}"
              </p>
              <p className="mt-3 text-sm opacity-80">
                Imagine your partner watching your memories here ❤️
              </p>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Button variant="secondary" onClick={prevSlide}>
                <ChevronLeft className="w-5 h-5 mr-2" /> Prev
              </Button>

              <Button variant="secondary" onClick={toggleSlideshow}>
                <Pause className="w-4 h-4 mr-2" /> Pause
              </Button>

              <Button variant="secondary" onClick={nextSlide}>
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* FULLSCREEN VIEW */}
        {selectedMedia !== null && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeFullscreen}
          >
            {/* ❌ CLOSE BUTTON */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-[60]
               bg-white/20 backdrop-blur-md
               rounded-full p-2
               hover:bg-white/30
               transition"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            <Card
              className="max-w-4xl w-full p-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl animate-fade-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative rounded-xl overflow-hidden border-4 border-rose-200/60 shadow-xl max-h-[70vh]">
                {isVideo(photosData[selectedMedia].file) ? (
                  <video
                    id="fullscreen-video"
                    src={photosData[selectedMedia].file}
                    autoPlay
                    controls
                    playsInline
                    preload="auto"
                    onLoadedData={() => handleLoaded(selectedMedia)}
                    className={`h-screen w-screen object-contain transition-opacity duration-500 ${
                      loadingStates[selectedMedia]
                        ? "blur-md opacity-40"
                        : "blur-0 opacity-100"
                    }`}
                  />
                ) : (
                  <img
                    loading="lazy"
                    src={photosData[selectedMedia].file}
                    onLoad={() => handleLoaded(selectedMedia)}
                    className={`h-screen w-screen object-contain transition-transform duration-500 ${
                      loadingStates[selectedMedia]
                        ? "blur-md opacity-40"
                        : "blur-0 opacity-100"
                    }`}
                  />
                )}
              </div>

              <div className="text-center text-white mt-4">
                <h2 className="text-3xl font-handwriting">
                  {photosData[selectedMedia].title}
                </h2>
                <p className="opacity-80">{photosData[selectedMedia].date}</p>
                <p className="italic opacity-90 mt-2">
                  "{photosData[selectedMedia].caption}"
                </p>
              </div>
            </Card>
          </div>
        )}

        <Card className="mt-8 p-8 bg-gradient-to-r from-primary/10 to-rose/10 text-center border border-rose-300/30">
          <Heart className="w-12 h-12 mx-auto mb-3 text-rose fill-rose animate-pulse-soft" />
          <p className="italic text-foreground/90">
            "Our memories are my favorite love story 📷💗"
          </p>
          <p className="text-sm text-muted-foreground mt-3">
            Imagine this gallery filled with your own memories ❤️
          </p>

          <a
            href="https://wa.me/9324004785?text=Hi%20I%20want%20a%20love%20website"
            target="_blank"
            className="inline-block mt-4 px-6 py-3 rounded-xl bg-rose-500 text-white hover:bg-rose-600 transition"
          >
            ❤️ Create My Love Website
          </a>
        </Card>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0); opacity: 0; }
          25% { opacity: 1; }
          100% { transform: translateY(-120vh); opacity: 0; }
        }
        .fade-slide {
          opacity: 0;
          transform: scale(0.95);
          animation: fadeIn 1s forwards ease;
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
