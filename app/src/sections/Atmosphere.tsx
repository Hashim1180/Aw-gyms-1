import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import VideoBackground from "@/components/VideoBackground";

gsap.registerPlugin(ScrollTrigger);

export default function Atmosphere() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [flashActive, setFlashActive] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "+=150%",
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const progress = self.progress;
          
          // Card flip: 0 to 180 degrees over first 60% of scroll
          const flipProgress = Math.min(progress * 1.8, 1);
          if (cardRef.current) {
            cardRef.current.style.transform = `rotateY(${flipProgress * 180}deg)`;
          }
          
          // Flash at midpoint (90 degrees = 50% flip progress)
          if (flipProgress > 0.45 && flipProgress < 0.55 && !flashActive) {
            setFlashActive(true);
            setTimeout(() => setFlashActive(false), 150);
          }
          
          setCardFlipped(flipProgress > 0.5);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [flashActive]);

  return (
    <section
      ref={sectionRef}
      id="atmosphere"
      className="relative h-screen w-full flex items-center justify-center overflow-hidden"
    >
      <VideoBackground src="/videos/23269.mp4" overlay />

      <div className="relative z-10 max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-left">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-cyber text-[10px] font-mono tracking-[0.3em] uppercase mb-4 block"
          >
            // PROTOCOL_01
          </motion.span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
            INTENSITY IS NOT
            <br />
            AN <span className="text-energy">OPTION</span>
            <br />
            IT IS THE <span className="text-cyber">PROTOCOL</span>
          </h2>
          <p className="text-platinum text-sm max-w-md leading-relaxed">
            Every repetition is data. Every set is a signal. AW GYMS transforms raw effort into 
            measurable evolution. Our systems don't just track progress — they architect it.
          </p>
        </div>

        <div className="flex justify-center" style={{ perspective: "1000px" }}>
          <div
            ref={cardRef}
            className="relative w-64 h-40 sm:w-80 sm:h-48"
            style={{ transformStyle: "preserve-3d", transform: "rotateY(0deg)" }}
          >
            {/* Front */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gunmetal to-industrial border border-white/10 rounded-sm"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="w-full h-full p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-3 left-3 w-2 h-2 bg-cyber/50 rounded-full" />
                <div className="absolute top-3 right-3 w-2 h-2 bg-cyber/50 rounded-full" />
                <div className="absolute bottom-3 left-3 w-2 h-2 bg-cyber/50 rounded-full" />
                <div className="absolute bottom-3 right-3 w-2 h-2 bg-cyber/50 rounded-full" />
                
                <span className="text-[10px] font-mono text-platinum tracking-[0.4em] mb-2">ACCESS PASS</span>
                <span className="text-2xl font-heading font-bold text-white tracking-wider">[ AW ]</span>
                <div className="mt-3 w-24 h-1 bg-gradient-to-r from-transparent via-cyber/50 to-transparent" />
                <span className="mt-2 text-[9px] font-mono text-platinum/60 tracking-widest">MEMBERSHIP REQUIRED</span>
              </div>
            </div>

            {/* Back */}
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-cyber/20 to-industrial border border-cyber/30 rounded-sm"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="w-full h-full p-6 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-cyber/5" />
                <AnimatePresence>
                  {cardFlipped && (
                    <motion.span
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="text-3xl font-heading font-bold text-cyber tracking-wider relative z-10"
                    >
                      GRANTED
                    </motion.span>
                  )}
                </AnimatePresence>
                <div className="mt-3 w-20 h-[2px] bg-cyber relative z-10" />
                <span className="mt-2 text-[9px] font-mono text-cyber/70 tracking-widest relative z-10">ACCESS AUTHORIZED</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flash overlay */}
      <AnimatePresence>
        {flashActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.08 }}
            className="fixed inset-0 z-[2000] bg-cyber pointer-events-none"
            style={{ mixBlendMode: "overlay" }}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
