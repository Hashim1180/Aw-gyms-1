import { useState } from 'react';
import { Box, ExternalLink, RotateCcw } from 'lucide-react';

const models = [
  {
    title: "Premium Dumbbells / PBR Optimized",
    author: "Neske",
    embedUrl: "https://sketchfab.com/models/6e5a3e590d2f4314941c7c97cc500d62/embed",
    modelUrl: "https://sketchfab.com/3d-models/dumbbells-pbr-optimized-model-6e5a3e590d2f4314941c7c97cc500d62",
  },
  {
    title: "Professional Dumbbell",
    author: "donnichols",
    embedUrl: "https://sketchfab.com/models/6f7b4ffa9fb8465dbd7a2356021fe8aa/embed",
    modelUrl: "https://sketchfab.com/3d-models/dumbbell-6f7b4ffa9fb8465dbd7a2356021fe8aa",
  },
  {
    title: "Luxury Gym Environment",
    author: "Zeps3D",
    embedUrl: "https://sketchfab.com/models/fbd1baf5f56743e6bd4299ad91473b9a/embed",
    modelUrl: "https://sketchfab.com/3d-models/gym-fbd1baf5f56743e6bd4299ad91473b9a",
  },
  {
    title: "Gym Dumbbell Set Collection",
    author: "Sousinho",
    embedUrl: "https://sketchfab.com/models/88fe5a1444c045d1b0bd88dd4dcfe79b/embed",
    modelUrl: "https://sketchfab.com/3d-models/gym-dumbell-set-88fe5a1444c045d1b0bd88dd4dcfe79b",
  },
];

export default function Models3D() {
  const [activeModel, setActiveModel] = useState<number | null>(null);

  return (
    <section id="models" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-background noise">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="fade-up text-gold text-sm tracking-[0.4em] uppercase mb-4">
            Interactive 3D
          </p>
          <h2 className="fade-up font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Explore in <span className="text-gradient-gold">3D</span>
          </h2>
          <p className="fade-up text-white/50 max-w-xl mx-auto">
            Interact with our equipment in full 3D. Rotate, zoom, and inspect every
            detail of our premium collection before you commit.
          </p>
        </div>

        {/* Model Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {models.map((model, i) => (
            <div
              key={i}
              className="fade-up group relative bg-white/[0.02] border border-white/5 hover:border-gold/30 transition-all duration-500 rounded-sm overflow-hidden"
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {activeModel === i ? (
                <div className="relative aspect-[4/3]">
                  <iframe
                    title={model.title}
                    src={model.embedUrl}
                    className="w-full h-full"
                    style={{ border: 'none' }}
                    allowFullScreen
                    allow="autoplay; fullscreen; xr-spatial-tracking"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setActiveModel(null)}
                      className="p-2 bg-black/50 backdrop-blur text-white hover:bg-gold hover:text-black transition-all rounded-sm"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                    <a
                      href={model.modelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-black/50 backdrop-blur text-white hover:bg-gold hover:text-black transition-all rounded-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex flex-col items-center justify-center group-hover:from-[#1a1a15] group-hover:to-[#0a0a05] transition-all">
                  <Box className="w-16 h-16 text-gold/30 mb-4 group-hover:text-gold/60 transition-colors" />
                  <h3 className="text-white font-serif text-xl font-bold mb-2">{model.title}</h3>
                  <p className="text-white/40 text-sm mb-6">by {model.author}</p>
                  <button
                    onClick={() => setActiveModel(i)}
                    className="px-6 py-3 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all rounded-sm text-sm tracking-wider uppercase"
                  >
                    Load 3D Model
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
