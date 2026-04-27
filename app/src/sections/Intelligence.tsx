import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cpu, Zap, Eye } from "lucide-react";
import VideoBackground from "@/components/VideoBackground";

gsap.registerPlugin(ScrollTrigger);

const sketchfabModels = [
  {
    title: "Dumbbells / PBR Optimized",
    url: "https://sketchfab.com/models/6e5a3e590d2f4314941c7c97cc500d62/embed",
  },
  {
    title: "Gym Environment",
    url: "https://sketchfab.com/models/fbd1baf5f56743e6bd4299ad91473b9a/embed",
  },
];

function SketchfabEmbed({ url, title }: { url: string; title: string }) {
  return (
    <div className="relative w-full aspect-video bg-gunmetal border border-white/10 rounded overflow-hidden group">
      <iframe
        title={title}
        frameBorder="0"
        allowFullScreen
        allow="autoplay; fullscreen; xr-spatial-tracking"
        xr-spatial-tracking="true"
        execution-while-out-of-viewport="true"
        execution-while-not-rendered="true"
        web-share="true"
        src={url}
        className="absolute inset-0 w-full h-full"
      />
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-void to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <span className="text-[10px] font-mono text-cyber">{title}</span>
      </div>
    </div>
  );
}

export default function Intelligence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        const chars = textRef.current.querySelectorAll(".decode-char");
        gsap.from(chars, {
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 20,
          stagger: 0.02,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const decodeText = (text: string) => {
    return text.split("").map((char, i) => (
      <span key={i} className="decode-char inline-block">
        {char === " " ? "\u00A0" : char}
      </span>
    ));
  };

  return (
    <section
      ref={sectionRef}
      id="intelligence"
      className="relative min-h-screen w-full py-32 overflow-hidden"
    >
      <VideoBackground src="/videos/23270.mp4" overlay />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-16">
          <span className="text-cyber text-[10px] font-mono tracking-[0.3em] uppercase mb-4 block">
            // SYSTEM_02
          </span>
          <h2
            ref={textRef}
            className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6"
          >
            {decodeText("AUTONOMOUS")}
            <br />
            <span className="text-cyber">{decodeText("COACHING")}</span>
          </h2>
          <p className="text-platinum text-sm max-w-xl leading-relaxed">
            Our AI engine analyzes your biometric data to construct real-time training cycles. 
            No guesswork. Only results. The future of fitness is not human-led — it is 
            machine-augmented.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sketchfabModels.map((model, i) => (
            <motion.div
              key={model.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <SketchfabEmbed url={model.url} title={model.title} />
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { icon: Cpu, title: "NEURAL ANALYSIS", desc: "Real-time biometric processing engine" },
            { icon: Zap, title: "ADAPTIVE LOAD", desc: "Dynamic weight adjustment protocols" },
            { icon: Eye, title: "VISION TRACKING", desc: "Movement pattern recognition AI" },
          ].map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="bg-gunmetal/50 border border-white/5 p-6 hover:border-cyber/30 transition-colors"
            >
              <feature.icon className="w-5 h-5 text-cyber mb-4" />
              <h3 className="text-xs font-mono text-white tracking-wider mb-2">{feature.title}</h3>
              <p className="text-[11px] text-platinum/70 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
