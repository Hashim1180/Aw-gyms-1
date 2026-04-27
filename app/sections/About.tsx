import { useRef, useEffect } from 'react';
import { Award, Dumbbell, Users, Zap } from 'lucide-react';

const stats = [
  { icon: Dumbbell, value: '500+', label: 'Premium Equipment' },
  { icon: Users, value: '12K+', label: 'Elite Members' },
  { icon: Award, value: '50+', label: 'Expert Trainers' },
  { icon: Zap, value: '24/7', label: 'Platinum Access' },
];

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    const elements = sectionRef.current?.querySelectorAll('.fade-up');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative py-32 px-4 sm:px-6 lg:px-8 bg-background noise">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="fade-up text-gold text-sm tracking-[0.4em] uppercase mb-4">
            Our Legacy
          </p>
          <h2 className="fade-up font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Crafted for <span className="text-gradient-gold">Excellence</span>
          </h2>
          <p className="fade-up text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
            AW Gyms is not merely a fitness center — it is a sanctuary where ambition
            meets precision. Every surface, every machine, every moment is engineered
            to elevate your potential beyond conventional limits.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="fade-up group p-8 border border-white/5 hover:border-gold/30 transition-all duration-500 bg-white/[0.02] hover:bg-white/[0.05] rounded-sm"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <stat.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform" />
              <p className="text-3xl sm:text-4xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-white/40 text-sm tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Story sections */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="fade-up space-y-6">
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-white">
              The <span className="text-gold">Philosophy</span>
            </h3>
            <p className="text-white/50 leading-relaxed">
              We believe fitness is the ultimate luxury. Like a Rolex timepiece or an Apple device,
              every detail at AW Gyms is obsessively refined. From the ambient lighting that adapts
              to your circadian rhythm, to the temperature-controlled training zones, to the
              hand-selected equipment from the world's finest manufacturers.
            </p>
            <p className="text-white/50 leading-relaxed">
              Our space is designed not just for exercise, but for transformation.
              Floor-to-ceiling windows bathe the facility in natural light. Acoustic engineering
              ensures perfect silence in recovery zones. Biophilic design brings nature indoors,
              creating an environment where the body heals and the mind sharpens.
            </p>
            <div className="flex gap-4 pt-4">
              <div className="px-4 py-2 border border-gold/30 text-gold text-sm tracking-wider uppercase">
                Precision
              </div>
              <div className="px-4 py-2 border border-gold/30 text-gold text-sm tracking-wider uppercase">
                Luxury
              </div>
              <div className="px-4 py-2 border border-gold/30 text-gold text-sm tracking-wider uppercase">
                Results
              </div>
            </div>
          </div>

          <div className="fade-up relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/23270.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 border border-gold/20 rounded-sm" />
            <div className="absolute -top-6 -right-6 w-24 h-24 border border-gold/20 rounded-sm" />
          </div>
        </div>
      </div>
    </section>
  );
}
