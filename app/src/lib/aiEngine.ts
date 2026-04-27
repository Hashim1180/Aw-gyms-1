const responses: Record<string, string> = {
  protein: "Our Gold Standard Whey delivers 24g of pure protein per serving with 5.5g BCAAs. It's banned-substance tested and available in Vanilla Ice Cream. Price: PKR 8,500. Shall I connect you with our sales team on WhatsApp?",
  whey: "Our Gold Standard Whey delivers 24g of pure protein per serving with 5.5g BCAAs. It's banned-substance tested and available in Vanilla Ice Cream. Price: PKR 8,500. Shall I connect you with our sales team on WhatsApp?",
  creatine: "Kevin Levrone Gold Creatine provides enhanced strength and power output. 300g tub. Price: PKR 4,200. Would you like to add this to your arsenal?",
  dumbbell: "We have premium hex dumbbells starting from 2.5kg to 50kg pairs. Rogue quality standard. Price range: PKR 2,500 - PKR 45,000 per pair. The PBR optimized 3D model is available for viewing on our site.",
  treadmill: "Freemotion commercial-grade treadmill with incline, decline, and iFit compatibility. Price: PKR 185,000. Full warranty included.",
  bench: "Heavy-duty adjustable bench press with spotter arms and weight storage. Rated for 500kg. Price: PKR 35,000.",
  bike: "Commercial elliptical bike with magnetic resistance and heart rate monitoring. Price: PKR 42,000.",
  floor: "High-density EVA interlocking gym floor mats. 1m x 1m x 15mm thickness. Shock absorbent and noise reducing. Price: PKR 1,200 per tile.",
  price: "Our products range from PKR 1,200 (floor mats) to PKR 185,000 (commercial treadmill). All prices include GST. Bulk orders receive 15% discount. What specific equipment are you interested in?",
  gym: "AW GYMS is Pakistan's premier luxury fitness equipment supplier. We provide commercial-grade gym setups, supplements, and full facility design. Our AI-driven sales system ensures you get exactly what you need. WhatsApp us at +92 349 7814918.",
  supplement: "We carry Optimum Nutrition Whey, Kevin Levrone Creatine, pre-workouts, and full supplement stacks. All products are authentic and imported. Would you like a custom stack recommendation?",
  equipment: "Our equipment catalog includes dumbbells, barbells, benches, treadmills, bikes, racks, and complete gym setups. All commercial grade. Request a catalog via WhatsApp: +92 349 7814918.",
  contact: "You can reach AW GYMS directly on WhatsApp: +92 349 7814918. Our sales team is available 24/7. Or visit our showroom in Karachi.",
  hello: "Welcome to AW GYMS. I am the AW AI — your autonomous training and equipment coordinator. How can I optimize your fitness protocol today?",
  hi: "Welcome to AW GYMS. I am the AW AI — your autonomous training and equipment coordinator. How can I optimize your fitness protocol today?",
  default: "I understand you're looking for fitness solutions. AW GYMS specializes in premium gym equipment and supplements. You can browse our Arsenal section or connect directly with our sales team on WhatsApp: +92 349 7814918. What specific product category interests you — Equipment, Supplements, or Gym Setup?",
};

export function getAiResponse(input: string): { text: string; intent: string } {
  const lower = input.toLowerCase();
  
  for (const [keyword, response] of Object.entries(responses)) {
    if (lower.includes(keyword)) {
      return { text: response, intent: keyword };
    }
  }
  
  return { text: responses.default, intent: "general" };
}
