import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import VideoBackground from "@/components/VideoBackground";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title reveal
      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 80,
          opacity: 0,
          duration: 1.2,
          ease: "power4.out",
          delay: 0.3,
        });
      }
      
      if (subtitleRef.current) {
        gsap.from(subtitleRef.current, {
          y: 40,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
          delay: 0.6,
        });
      }
      
      if (ctaRef.current) {
        gsap.from(ctaRef.current, {
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power4.out",
          delay: 0.9,
        });
      }

      // Scroll-driven blur and scale
      gsap.to(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        filter: "blur(10px)",
        scale: 1.1,
        opacity: 0,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <VideoBackground src="/videos/23268.mp4" overlay />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <span className="inline-block px-3 py-1 border border-cyber/30 text-cyber text-[10px] font-mono tracking-[0.3em] uppercase">
            AW GYMS // EST. 2024
          </span>
        </motion.div>

        <h1
          ref={titleRef}
          className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-heading font-bold text-white leading-[0.9] tracking-tight mb-6"
        >
          DEFINE YOUR
          <br />
          <span className="text-gradient-cyber">LIMITS</span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-platinum text-sm sm:text-base md:text-lg max-w-xl mx-auto mb-10 font-light tracking-wide"
        >
          The next generation of physical evolution. Autonomous coaching. Premium equipment.
          Zero compromise.
        </p>

        <button
          ref={ctaRef}
          onClick={() => document.getElementById("atmosphere")?.scrollIntoView({ behavior: "smooth" })}
          className="group relative px-8 py-4 bg-transparent border border-white/20 text-white text-xs font-mono tracking-[0.2em] uppercase hover:border-cyber hover:text-cyber transition-all duration-300"
          data-hoverable
        >
          <span className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          INITIATE SEQUENCE
        </button>
      </div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ArrowDown className="w-5 h-5 text-platinum/50" />
      </motion.div>
    </section>
  );
}
