import stayCozy from "@/assets/stay-cozy-livingroom.jpg";
import stayLoft from "@/assets/stay-aesthetic-loft.jpg";
import stayBalcony from "@/assets/stay-urban-balcony.jpg";
import stayRooftop from "@/assets/stay-rooftop-lights.jpg";
import stayRainy from "@/assets/stay-rainy-balcony.jpg";
import staySpa from "@/assets/stay-spa-bath.jpg";
import stayOverwater from "@/assets/stay-overwater-hut.jpg";
import stayMara from "@/assets/stay-mara.jpg";
import stayDiani from "@/assets/stay-diani.jpg";
import stayNairobi from "@/assets/stay-nairobi.jpg";

import expBalloon from "@/assets/exp-balloon.jpg";
import expSafari from "@/assets/exp-safari.jpg";
import foodKenya from "@/assets/food-kenya.jpg";
import planeCoast from "@/assets/plane-coast.jpg";

import heroKenya from "@/assets/hero-kenya.jpg";
import destItaly from "@/assets/dest-italy.jpg";
import destCroatia from "@/assets/dest-croatia.jpg";
import destMontenegro from "@/assets/dest-montenegro.jpg";
import destEgypt from "@/assets/dest-egypt.jpg";
import destJapan from "@/assets/dest-japan.jpg";
import destPetra from "@/assets/dest-petra.jpg";
import destZen from "@/assets/dest-zen.jpg";
import destRio from "@/assets/dest-rio.jpg";
import destSingapore from "@/assets/dest-singapore.jpg";

export type ServiceSlug =
  | "stays"
  | "experiences"
  | "flights"
  | "attractions"
  | "food"
  | "transport";

export type Listing = {
  id: string;
  title: string;
  location: string;
  price: string;
  priceUnit?: string;
  rating: number;
  badge?: string;
  image: string;
  description: string;
};

export type Country = {
  slug: string;
  name: string;
  tagline: string;
  hero: string;
  status: "Live" | "Soon";
  services: Partial<Record<ServiceSlug, Listing[]>>;
};

export const SERVICE_LABELS: Record<ServiceSlug, string> = {
  stays: "Stays",
  experiences: "Experiences",
  flights: "Flights",
  attractions: "Attractions",
  food: "Food",
  transport: "Car Rentals",
};

const kenyaStays: Listing[] = [
  { id: "westlands-sky-penthouse", title: "Westlands Sky Penthouse", location: "Nairobi", price: "$180", priceUnit: "/night", rating: 4.82, badge: "City favourite", image: stayLoft, description: "A floor-to-ceiling glass penthouse over the Westlands skyline with concierge orchestration." },
  { id: "mara-skyline-tented-suite", title: "Mara Skyline Tented Suite", location: "Maasai Mara", price: "$420", priceUnit: "/night", rating: 4.95, badge: "Hero stay", image: stayCozy, description: "Canvas walls, copper bath, and a deck that opens onto the migration corridor." },
  { id: "diani-beachfront-villa", title: "Diani Beachfront Villa", location: "Diani Beach", price: "$310", priceUnit: "/night", rating: 4.9, badge: "Coast favourite", image: stayOverwater, description: "Whitewashed villa steps from the reef, with private chef and dhow charters." },
  { id: "karen-garden-loft", title: "Karen Garden Loft", location: "Karen, Nairobi", price: "$140", priceUnit: "/night", rating: 4.78, image: stayBalcony, description: "Quiet garden loft tucked into Karen — coffee on the balcony, giraffes nearby." },
  { id: "kilimani-rain-studio", title: "Kilimani Rain Studio", location: "Nairobi", price: "$95", priceUnit: "/night", rating: 4.71, image: stayRainy, description: "Cinematic rainy-window studio with high-speed wifi for nomads." },
  { id: "naivasha-spa-cabin", title: "Naivasha Spa Cabin", location: "Lake Naivasha", price: "$220", priceUnit: "/night", rating: 4.88, badge: "Wellness", image: staySpa, description: "Lakeside spa cabin with hot mineral soaks and morning yoga decks." },
  { id: "lamu-rooftop-riad", title: "Lamu Rooftop Riad", location: "Lamu Old Town", price: "$260", priceUnit: "/night", rating: 4.93, image: stayRooftop, description: "Swahili coral-stone riad with rooftop lanterns over the dhow harbour." },
  { id: "mara-river-camp", title: "Mara River Tented Camp", location: "Maasai Mara", price: "$380", priceUnit: "/night", rating: 4.91, image: stayMara, description: "Riverside tents at the heart of the migration crossing season." },
  { id: "diani-palm-bungalow", title: "Diani Palm Bungalow", location: "Diani Beach", price: "$165", priceUnit: "/night", rating: 4.84, image: stayDiani, description: "Open-air bungalow under palms, two minutes from the white sand." },
  { id: "nairobi-skyline-suite", title: "Nairobi Skyline Suite", location: "Nairobi CBD", price: "$210", priceUnit: "/night", rating: 4.86, image: stayNairobi, description: "City skyline suite with floor-to-ceiling glass and rooftop pool access." },
];

const kenyaExperiences: Listing[] = [
  { id: "big-five-sunset-game-drive", title: "Big Five Sunset Game Drive", location: "Maasai Mara", price: "$160", priceUnit: "/person", rating: 4.97, badge: "Most loved", image: expSafari, description: "Private 4x4 sunset game drive with expert tracker and sundowner setup." },
  { id: "hot-air-balloon-sunrise", title: "Hot Air Balloon Sunrise", location: "Maasai Mara", price: "$480", priceUnit: "/person", rating: 4.99, image: expBalloon, description: "Float over the Mara at first light, then a champagne breakfast on the plains." },
  { id: "nyama-choma-tasting-trail", title: "Nyama Choma Tasting Trail", location: "Nairobi", price: "$45", priceUnit: "/person", rating: 4.78, badge: "Local", image: foodKenya, description: "Three legendary grills, one local guide, unlimited stories." },
  { id: "wasini-dhow-snorkel-day", title: "Wasini Dhow & Snorkel Day", location: "South Coast", price: "$120", priceUnit: "/person", rating: 4.86, image: stayOverwater, description: "Sail to Kisite Marine Park, snorkel the reef, lunch on Wasini." },
];

const kenyaFlights: Listing[] = [
  { id: "nbo-msa-coast-hop", title: "Nairobi → Mombasa Coast Hop", location: "Vuelo route", price: "$92", priceUnit: "/seat", rating: 4.7, image: planeCoast, description: "Direct hop to the coast with Vuelo's flexible-fare engine." },
  { id: "nbo-mara-bush-charter", title: "Nairobi → Maasai Mara Bushplane", location: "Bush charter", price: "$210", priceUnit: "/seat", rating: 4.92, image: planeCoast, description: "Charter bushplane to the Mara airstrips — lodge transfer included." },
  { id: "nbo-zanzibar", title: "Nairobi → Zanzibar Direct", location: "Regional", price: "$140", priceUnit: "/seat", rating: 4.74, image: planeCoast, description: "Direct regional connector to Stone Town and the Zanzibar archipelago." },
  { id: "nbo-kilimanjaro", title: "Nairobi → Kilimanjaro", location: "Regional", price: "$130", priceUnit: "/seat", rating: 4.69, image: planeCoast, description: "Quick hop to Kilimanjaro for Tanzania safari connections." },
];

const country = (over: Partial<Country> & Pick<Country, "slug" | "name" | "hero">): Country => ({
  status: "Soon",
  tagline: "",
  services: {},
  ...over,
});

export const COUNTRIES: Country[] = [
  country({
    slug: "kenya", name: "Kenya", hero: heroKenya, status: "Live",
    tagline: "Where the migration meets the modern coast.",
    services: { stays: kenyaStays, experiences: kenyaExperiences, flights: kenyaFlights },
  }),
  country({
    slug: "italy", name: "Italy", hero: destItaly,
    tagline: "Slow afternoons, ancient stone, espresso clarity.",
    services: {
      stays: [
        { id: "trastevere-loft", title: "Trastevere Atelier Loft", location: "Rome", price: "$220", priceUnit: "/night", rating: 4.9, image: stayLoft, description: "Cobblestone-side loft with Roman rooftops at the window." },
        { id: "amalfi-cliff-suite", title: "Amalfi Cliff Suite", location: "Amalfi Coast", price: "$540", priceUnit: "/night", rating: 4.96, badge: "Hero stay", image: stayOverwater, description: "Cliffside suite with infinity terrace over the Tyrrhenian." },
        { id: "milan-design-flat", title: "Milan Design District Flat", location: "Milan", price: "$190", priceUnit: "/night", rating: 4.81, image: stayBalcony, description: "Brera-adjacent designer flat for the design week crowd." },
        { id: "florence-vintage-suite", title: "Florence Vintage Suite", location: "Florence", price: "$240", priceUnit: "/night", rating: 4.87, image: stayCozy, description: "Vaulted-ceiling suite a block from the Duomo." },
      ],
      experiences: [
        { id: "colosseum-after-hours", title: "Colosseum After-Hours Tour", location: "Rome", price: "$110", priceUnit: "/person", rating: 4.95, badge: "Iconic", image: destItaly, description: "Skip the crowds — enter after sunset with an archaeologist." },
        { id: "tuscan-vineyard-day", title: "Tuscan Vineyard Day", location: "Chianti", price: "$180", priceUnit: "/person", rating: 4.92, image: destZen, description: "Cellar tour, lunch in the vines, three-estate tasting." },
      ],
    },
  }),
  country({
    slug: "croatia", name: "Croatia", hero: destCroatia,
    tagline: "Walled cities, Adriatic blues, island-hop forever.",
    services: {
      stays: [
        { id: "dubrovnik-old-town-suite", title: "Dubrovnik Old Town Suite", location: "Dubrovnik", price: "$280", priceUnit: "/night", rating: 4.93, badge: "Hero stay", image: destCroatia, description: "Inside the city walls, balcony over terracotta rooftops." },
        { id: "hvar-harbour-loft", title: "Hvar Harbour Loft", location: "Hvar", price: "$210", priceUnit: "/night", rating: 4.85, image: stayLoft, description: "Wake to yachts in the harbour, lavender on the wind." },
        { id: "split-riva-apartment", title: "Split Riva Apartment", location: "Split", price: "$160", priceUnit: "/night", rating: 4.78, image: stayBalcony, description: "Diocletian's Palace at one door, the Riva at the other." },
        { id: "rovinj-coastal-cottage", title: "Rovinj Coastal Cottage", location: "Rovinj", price: "$190", priceUnit: "/night", rating: 4.84, image: stayRooftop, description: "Istrian stone cottage with a private slipway to the sea." },
      ],
      experiences: [
        { id: "elaphiti-island-sail", title: "Elaphiti Island Sail", location: "Dubrovnik", price: "$140", priceUnit: "/person", rating: 4.91, image: destCroatia, description: "Three islands, two swims, one long Adriatic lunch." },
      ],
    },
  }),
  country({
    slug: "montenegro", name: "Montenegro", hero: destMontenegro,
    tagline: "Fjord-like bays and stone-island hideaways.",
    services: {
      stays: [
        { id: "sveti-stefan-villa", title: "Sveti Stefan Stone Villa", location: "Sveti Stefan", price: "$620", priceUnit: "/night", rating: 4.97, badge: "Hero stay", image: destMontenegro, description: "Iconic island-village stone villa over the Adriatic." },
        { id: "kotor-bay-loft", title: "Kotor Bay Loft", location: "Kotor", price: "$170", priceUnit: "/night", rating: 4.83, image: stayLoft, description: "Old-town loft tucked under the fortress walls." },
        { id: "budva-marina-suite", title: "Budva Marina Suite", location: "Budva", price: "$200", priceUnit: "/night", rating: 4.79, image: stayBalcony, description: "Marina-side suite, two minutes from old-town beaches." },
        { id: "perast-heritage-room", title: "Perast Heritage Room", location: "Perast", price: "$150", priceUnit: "/night", rating: 4.88, image: stayCozy, description: "Baroque-era room across from the islets of Perast." },
      ],
    },
  }),
  country({
    slug: "egypt", name: "Egypt", hero: destEgypt,
    tagline: "Desert temples, Nile sails, Red Sea reefs.",
    services: {
      stays: [
        { id: "cairo-pyramid-view-suite", title: "Cairo Pyramid-View Suite", location: "Giza", price: "$240", priceUnit: "/night", rating: 4.86, badge: "Iconic view", image: destEgypt, description: "Wake up to the Pyramids on the horizon." },
        { id: "luxor-nile-felucca-stay", title: "Luxor Nile Felucca Stay", location: "Luxor", price: "$180", priceUnit: "/night", rating: 4.82, image: destPetra, description: "Sleep aboard a traditional felucca on the Nile." },
        { id: "dahab-reef-cabin", title: "Dahab Reef Cabin", location: "Dahab", price: "$120", priceUnit: "/night", rating: 4.79, image: stayOverwater, description: "Step from your cabin into the Blue Hole reef." },
        { id: "alexandria-corniche-flat", title: "Alexandria Corniche Flat", location: "Alexandria", price: "$110", priceUnit: "/night", rating: 4.71, image: stayBalcony, description: "Mediterranean breeze on the Corniche, espresso below." },
      ],
    },
  }),
  country({
    slug: "japan", name: "Japan", hero: destJapan,
    tagline: "Neon nights, mountain temples, bullet-train clarity.",
    services: {
      stays: [
        { id: "kyoto-machiya-house", title: "Kyoto Machiya Townhouse", location: "Kyoto", price: "$300", priceUnit: "/night", rating: 4.96, badge: "Hero stay", image: destZen, description: "Restored wooden machiya with cedar bath and zen garden." },
        { id: "tokyo-shinjuku-tower-suite", title: "Tokyo Shinjuku Tower Suite", location: "Tokyo", price: "$420", priceUnit: "/night", rating: 4.92, image: stayRooftop, description: "Skyline suite over Shinjuku — neon below, futons above." },
        { id: "hakone-onsen-ryokan", title: "Hakone Onsen Ryokan", location: "Hakone", price: "$360", priceUnit: "/night", rating: 4.95, image: staySpa, description: "Private onsen ryokan with Mount Fuji at dawn." },
        { id: "osaka-dotonbori-loft", title: "Osaka Dotonbori Loft", location: "Osaka", price: "$190", priceUnit: "/night", rating: 4.81, image: stayRainy, description: "Above the neon canals — street-food crawl at your door." },
      ],
    },
  }),
];

export const getCountry = (slug: string) =>
  COUNTRIES.find((c) => c.slug === slug.toLowerCase());

export const getListing = (
  countrySlug: string,
  service: ServiceSlug,
  id: string,
) => getCountry(countrySlug)?.services[service]?.find((l) => l.id === id);
