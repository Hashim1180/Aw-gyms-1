import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navigation from "@/components/Navigation";
import CyberCursor from "@/components/CyberCursor";
import AIChatWidget from "@/components/AIChatWidget";
import WhatsAppButton from "@/components/WhatsAppButton";
import Hero from "@/sections/Hero";
import Atmosphere from "@/sections/Atmosphere";
import Intelligence from "@/sections/Intelligence";
import Arsenal from "@/sections/Arsenal";
import Nexus from "@/sections/Nexus";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(lenis.raf as any);
    };
  }, []);

  return (
    <div className="relative">
      <CyberCursor />
      <Navigation />
      
      <main>
        <Hero />
        <Atmosphere />
        <Intelligence />
        <Arsenal />
        <Nexus />
      </main>

      <AIChatWidget />
      <WhatsAppButton />
    </div>
  );
}
