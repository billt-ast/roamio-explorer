import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryRow } from "@/components/CategoryRow";
import { JourneyStrip } from "@/components/JourneyStrip";
import { CountryHighlights } from "@/components/CountryHighlights";
import { Footer } from "@/components/Footer";
import { PerksInfo } from "@/components/PerksInfo";

import stayCozy from "@/assets/stay-cozy-livingroom.jpg";
import stayLoft from "@/assets/stay-aesthetic-loft.jpg";
import stayBalcony from "@/assets/stay-urban-balcony.jpg";
import stayRooftop from "@/assets/stay-rooftop-lights.jpg";
import stayRainy from "@/assets/stay-rainy-balcony.jpg";
import staySpa from "@/assets/stay-spa-bath.jpg";
import stayOverwater from "@/assets/stay-overwater-hut.jpg";

import expSpa from "@/assets/stay-spa-bath.jpg";
import expCozy from "@/assets/stay-cozy-livingroom.jpg";
import expRooftop from "@/assets/stay-rooftop-lights.jpg";
import expOverwater from "@/assets/stay-overwater-hut.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Roamio — Explore Kenya like never before" },
      {
        name: "description",
        content:
          "Stays, safaris, flights, food and transport — orchestrated into one fluid journey across Kenya. The modern travel OS.",
      },
      { property: "og:title", content: "Roamio — Explore Kenya like never before" },
      {
        property: "og:description",
        content: "The fluid travel OS for Kenya. Plan, book and live the journey.",
      },
      { property: "og:url", content: "https://roamio-explorer.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://roamio-explorer.lovable.app/" }],
  }),
});

const stayCards = [
  { image: stayLoft, title: "Westlands Sky Penthouse", location: "Nairobi", price: "$180", priceUnit: "/night", rating: 4.82, badge: "City favourite", href: "/kenya/stays/westlands-sky-penthouse" },
  { image: stayCozy, title: "Mara Skyline Tented Suite", location: "Maasai Mara", price: "$420", priceUnit: "/night", rating: 4.95, badge: "Hero stay", href: "/kenya/stays/mara-skyline-tented-suite" },
  { image: stayOverwater, title: "Diani Beachfront Villa", location: "Diani Beach", price: "$310", priceUnit: "/night", rating: 4.9, badge: "Coast favourite", href: "/kenya/stays/diani-beachfront-villa" },
  { image: stayBalcony, title: "Karen Garden Loft", location: "Karen, Nairobi", price: "$140", priceUnit: "/night", rating: 4.78, href: "/kenya/stays/karen-garden-loft" },
];

const expCards = [
  { image: expCozy, title: "Big Five Sunset Game Drive", location: "Maasai Mara", price: "$160", priceUnit: "/person", rating: 4.97, badge: "Most loved", href: "/kenya/experiences/big-five-sunset-game-drive" },
  { image: expRooftop, title: "Hot Air Balloon Sunrise", location: "Maasai Mara", price: "$480", priceUnit: "/person", rating: 4.99, href: "/kenya/experiences/hot-air-balloon-sunrise" },
  { image: expSpa, title: "Nyama Choma Tasting Trail", location: "Nairobi", price: "$45", priceUnit: "/person", rating: 4.78, badge: "Local", href: "/kenya/experiences/nyama-choma-tasting-trail" },
  { image: expOverwater, title: "Wasini Dhow & Snorkel Day", location: "South Coast", price: "$120", priceUnit: "/person", rating: 4.86, href: "/kenya/experiences/wasini-dhow-snorkel-day" },
];

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <CountryHighlights />
        <CategoryRow
          eyebrow="Stays"
          title="Sleep where the story begins."
          description="Hand-picked tented camps, beach villas and city sanctuaries across Kenya — vetted by our local hosts."
          cards={stayCards}
          viewAllHref="/kenya/stays"
          viewAllLabel="View all stays"
        />
        <JourneyStrip />
        <CategoryRow
          eyebrow="Experiences"
          title="Days you'll talk about forever."
          description="Safaris, sunrise flights, cultural deep-dives and culinary trails — booked seamlessly alongside your stay."
          cards={expCards}
          viewAllHref="/kenya/experiences"
          viewAllLabel="View all experiences"
        />
        <PerksInfo />
        <Footer />
      </main>
    </div>
  );
}
