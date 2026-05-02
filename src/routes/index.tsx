import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { CategoryRow } from "@/components/CategoryRow";
import { JourneyStrip } from "@/components/JourneyStrip";
import { Destinations } from "@/components/Destinations";
import { Footer } from "@/components/Footer";

import stayMara from "@/assets/stay-mara.jpg";
import stayNairobi from "@/assets/stay-nairobi.jpg";
import stayDiani from "@/assets/stay-diani.jpg";
import expSafari from "@/assets/exp-safari.jpg";
import expBalloon from "@/assets/exp-balloon.jpg";
import foodKenya from "@/assets/food-kenya.jpg";

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
    ],
  }),
});

const stayCards = [
  {
    image: stayMara,
    title: "Mara Skyline Tented Suite",
    location: "Maasai Mara",
    price: "$420",
    priceUnit: "/night",
    rating: 4.95,
    badge: "Hero stay",
  },
  {
    image: stayNairobi,
    title: "Westlands Sky Penthouse",
    location: "Nairobi",
    price: "$180",
    priceUnit: "/night",
    rating: 4.82,
  },
  {
    image: stayDiani,
    title: "Diani Beachfront Villa",
    location: "Diani Beach",
    price: "$310",
    priceUnit: "/night",
    rating: 4.9,
    badge: "Coast favourite",
  },
];

const expCards = [
  {
    image: expSafari,
    title: "Big Five Sunset Game Drive",
    location: "Maasai Mara",
    price: "$160",
    priceUnit: "/person",
    rating: 4.97,
    badge: "Most loved",
  },
  {
    image: expBalloon,
    title: "Hot Air Balloon Sunrise",
    location: "Maasai Mara",
    price: "$480",
    priceUnit: "/person",
    rating: 4.99,
  },
  {
    image: foodKenya,
    title: "Nyama Choma Tasting Trail",
    location: "Nairobi",
    price: "$45",
    priceUnit: "/person",
    rating: 4.78,
    badge: "Local",
  },
];

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <CategoryRow
          eyebrow="Stays"
          title="Sleep where the story begins."
          description="Hand-picked tented camps, beach villas and city sanctuaries across Kenya — vetted by our local hosts."
          cards={stayCards}
        />
        <JourneyStrip />
        <CategoryRow
          eyebrow="Experiences"
          title="Days you'll talk about forever."
          description="Safaris, sunrise flights, cultural deep-dives and culinary trails — booked seamlessly alongside your stay."
          cards={expCards}
        />
        <Destinations />
        <Footer />
      </main>
    </div>
  );
}
