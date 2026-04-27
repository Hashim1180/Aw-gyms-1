import { getDb } from "../api/queries/connection";
import { products, videos, siteSettings } from "./schema";

async function seed() {
  const db = getDb();
  console.log("Seeding database...");

  await db.insert(products).values([
    {
      name: "Premium Hex Dumbbells Set",
      description: "Professional-grade rubber hex dumbbells with ergonomic chrome handles. Available in pairs from 5kg to 50kg. Anti-roll design with noise-dampening construction.",
      price: "45000.00",
      image: "/images/24947.jpg",
      category: "equipment",
      featured: true,
      inStock: true,
    },
    {
      name: "Olympic Bench Press Station",
      description: "Commercial-grade adjustable bench press with safety spotter arms, heavy-duty steel frame rated for 500kg, and precision linear bearings for smooth motion.",
      price: "85000.00",
      image: "/images/24948.jpg",
      category: "equipment",
      featured: true,
      inStock: true,
    },
    {
      name: "ON Gold Standard Whey Protein",
      description: "Optimum Nutrition 100% Whey Gold Standard - 5LB (2.27kg). 24g protein per serving, 5.5g BCAAs, banned substance tested. Vanilla Ice Cream flavor.",
      price: "12500.00",
      image: "/images/24949.jpg",
      category: "supplements",
      featured: true,
      inStock: true,
    },
    {
      name: "Kevin Levrone Gold Creatine",
      description: "Premium micronized creatine monohydrate for explosive strength, enhanced recovery, and lean muscle gains. 300g unflavored.",
      price: "4500.00",
      image: "/images/24950.jpg",
      category: "supplements",
      featured: false,
      inStock: true,
    },
    {
      name: "Interlocking Gym Floor Mats",
      description: "High-density EVA foam interlocking tiles - 60x60cm each. Shock-absorbing, water-resistant, non-slip surface. Perfect for home or commercial gym flooring.",
      price: "8000.00",
      image: "/images/24951.jpg",
      category: "equipment",
      featured: false,
      inStock: true,
    },
    {
      name: "Freemotion Commercial Treadmill",
      description: "Premium commercial treadmill with 15.6\" HD touchscreen, incline up to 15%, speeds to 20km/h, cushioned deck technology, and 50+ workout programs.",
      price: "285000.00",
      image: "/images/24952.jpg",
      category: "cardio",
      featured: true,
      inStock: true,
    },
    {
      name: "Elliptical Cross Trainer",
      description: "Magnetic resistance elliptical with 16 resistance levels, heart rate monitoring, LCD display, and smooth dual-action handlebars for full-body cardio.",
      price: "95000.00",
      image: "/images/24953.jpg",
      category: "cardio",
      featured: false,
      inStock: true,
    },
  ]);

  const videoFiles = [
    "23250.mp4", "23251.mp4", "23258.mp4", "23259.mp4", "23260.mp4",
    "23261.mp4", "23262.mp4", "23263.mp4", "23269.mp4", "23270.mp4",
    "23271.mp4", "23272.mp4", "23273.mp4", "23274.mp4", "23275.mp4",
  ];

  for (let i = 0; i < videoFiles.length; i++) {
    await db.insert(videos).values({
      title: `AW Gyms Cinematic ${i + 1}`,
      description: `Premium fitness cinematic showcase video ${i + 1}`,
      url: `/videos/${videoFiles[i]}`,
      thumbnail: `/images/24947.jpg`,
      category: i < 5 ? "promo" : i < 10 ? "workout" : "ambience",
      featured: i < 3,
    });
  }

  await db.insert(siteSettings).values([
    { key: "whatsapp_number", value: "+923497814918" },
    { key: "gym_name", value: "AW Gyms" },
    { key: "tagline", value: "Where Luxury Meets Performance" },
    { key: "address", value: "Premium Location, Main City Center" },
    { key: "hours", value: "5:00 AM - 11:00 PM Daily" },
  ]);

  console.log("Seeding complete.");
  process.exit(0);
}

seed();
