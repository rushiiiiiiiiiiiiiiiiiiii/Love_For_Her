import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartAnimation } from "@/components/HeartAnimation";
import { BackgroundText } from "@/components/BackgroundText";
import { useMemo } from "react";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Heart,
  PartyPopper,
  Cake,
} from "lucide-react";

import { Link } from "react-router-dom";
import calendarData from "@/data/calendar.json";
import dayjs from "dayjs";
import { MiniLoveCalendar } from "@/components/MiniLoveCalendar";

export default function Calendar() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case "birthday":
        return <Cake className="w-6 h-6 text-rose" />;
      case "anniversary":
        return <Heart className="w-6 h-6 text-rose" />;
      case "special":
        return <PartyPopper className="w-6 h-6 text-primary" />;
      default:
        return <CalendarIcon className="w-6 h-6 text-primary" />;
    }
  };
  const today = dayjs();
  const daysLeft = (date: string) => {
    return dayjs(date).diff(today, "day");
  };
  const countdownEvents = useMemo(() => ["birthday", "anniversary"], []);



  const typeColors: Record<string, string> = {
    birthday: "bg-rose/20 text-rose border-rose/40",
    anniversary: "bg-primary/20 text-primary border-primary/40",
    special: "bg-gold/20 text-gold border-gold/40",
    date: "bg-lavender/20 text-lavender border-lavender/40",
    trip: "bg-peach/20 text-peach border-peach/40",
    temple: "bg-rose/20 text-rose border-rose/40",
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
  const sortedEvents = useMemo(() => {
    return [...calendarData].sort((a, b) => {
      if (a.sortOrder && b.sortOrder) {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }
      }

      return dayjs(a.date).diff(dayjs(b.date));
    });
  }, []);

  const nextEvent = sortedEvents.find((e) => daysLeft(e.date) >= 0);

  return (
    <div className="min-h-screen romantic-gradient relative">
      {BackgroundLayer}
      <div className="container mx-auto px-4 py-8 relative z-10 max-w-4xl">
        {/* BACK BUTTON */}
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

        {/* HEADER */}
        <div className="text-center mb-8 md:animate-fade-in">
          <div className="text-6xl mb-4">💖</div>
          <h1 className="text-4xl md:text-5xl font-handwriting text-foreground drop-shadow mb-3">
            Our Love Calendar
          </h1>
          <p className="text-muted-foreground text-lg">
            Beautiful moments & special days we'll celebrate together ✨
          </p>
        </div>

        {/* NEXT UPCOMING EVENT */}
        {nextEvent && (
          <div className="text-center mb-10 md:animate-fade-in">
            <p className="text-lg text-primary font-medium">
              Next Special Day in{" "}
              <span className="font-bold text-rose">
                {daysLeft(nextEvent.date)} days ❤️
              </span>
            </p>
          </div>
        )}

        {/* DIVIDER */}
        <div className="text-center my-12">
          <p className="text-xl font-handwriting text-rose/90">
            — Our Most Beautiful Moments 💞 —
          </p>
        </div>

        {/* EVENTS LIST */}
        <div className="space-y-8">
          {sortedEvents.map((event, index) => {
            const remaining = daysLeft(event.date);

            return (
              <Card
                key={event.id}
                className="overflow-hidden rounded-2xl bg-card/90 backdrop-blur-lg shadow-[var(--shadow-romantic)] md:animate-fade-in"
                style={{ animationDelay: `${index * 0.07}s` }}
              >
                {/* IMAGE */}
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    loading="lazy"
                    style={{ willChange: "transform" }}
                    decoding="async"
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* COUNTDOWN */}
                  {countdownEvents.includes(event.type) && remaining >= 0 && (
                    <div className="absolute bottom-3 left-3 bg-rose/70 backdrop-blur px-4 py-1 rounded-full text-sm font-semibold text-white shadow">
                      ❤️ {remaining} days remaining
                    </div>
                  )}

                  {/* CUSTOM TAGS */}
                  {event.type === "date" && (
                    <div className="absolute bottom-3 left-3 bg-white/30 backdrop-blur px-4 py-1 rounded-full text-sm text-white shadow">
                      🎬 Any day is perfect for a date with you 💕
                    </div>
                  )}

                  {event.type === "trip" && (
                    <div className="absolute bottom-3 left-3 bg-white/30 backdrop-blur px-4 py-1 rounded-full text-sm text-white shadow">
                      🌴 Any day… let's go together ❤️
                    </div>
                  )}

                  {event.type === "temple" && (
                    <div className="absolute bottom-3 left-3 bg-white/30 backdrop-blur px-4 py-1 rounded-full text-sm text-white shadow">
                      🛕 Any day is perfect for a temple visit with you ❤️
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-6">
                  {/* MINI CALENDAR FOR BDAY & ANNIVERSARY */}
                  {(event.type === "birthday" ||
                    event.type === "anniversary") && (
                    <MiniLoveCalendar event={event} />
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      {event.title}
                    </h3>

                    <Badge className={typeColors[event.type]}>
                      {event.type}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground text-sm mb-2">
                    {dayjs(event.date).format("DD MMMM, YYYY")}
                  </p>

                  <div className="flex items-center gap-2 mb-2">
                    {getEventIcon(event.type)}
                    <p className="text-foreground/90">{event.description}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* FULL LOVE CALENDAR */}
        {/* <div className="mt-16">
          <h2 className="text-3xl font-handwriting text-center mb-6 text-rose drop-shadow">
            Love Calendar Overview 🗓️💖
          </h2> */}

        {/* pass full list */}
        {/* <MiniLoveCalendar event={{ date: dayjs().format("YYYY-MM-01") }} /> */}
        {/* </div> */}

        {/* FOOTER */}
        <div className="mt-16 text-center">
          <Heart className="w-12 h-12 mx-auto text-rose animate-pulse mb-4" />
          <p className="text-lg text-foreground/80 italic">
            “More memories, more magic… our story is just beginning.” ✨
          </p>
        </div>
      </div>
    </div>
  );
}
