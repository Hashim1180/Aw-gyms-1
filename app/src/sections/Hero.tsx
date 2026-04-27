import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { ChevronDown, Play } from 'lucide-react';
import { useAppStore } from '../hooks/useStore';

function Particles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 300;

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return [pos];
  }, []);

  useFrame(() => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y += 0.0003;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#c9a962"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

function FloatingRings() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[3, 0.02, 16, 100]} />
          <meshStandardMaterial color="#c9a962" transparent opacity={0.3} emissive="#c9a962" emissiveIntensity={0.2} />
        </mesh>
      </Float>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.3}>
        <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]} position={[0, 0, 0]}>
          <torusGeometry args={[4, 0.015, 16, 100]} />
          <meshStandardMaterial color="#8b7355" transparent opacity={0.2} emissive="#8b7355" emissiveIntensity={0.1} />
        </mesh>
      </Float>
      <Float speed={1} rotationIntensity={0.7} floatIntensity={0.4}>
        <mesh rotation={[Math.PI / 6, Math.PI / 2, Math.PI / 8]} position={[0, 0, 0]}>
          <torusGeometry args={[2.5, 0.025, 16, 100]} />
          <meshStandardMaterial color="#d4b896" transparent opacity={0.25} emissive="#d4b896" emissiveIntensity={0.15} />
        </mesh>
      </Float>
    </group>
  );
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const setChatOpen = useAppStore((s) => s.setChatOpen);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {});
    }
  }, []);

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 1.5s ease' }}
      >
        <source src="/videos/23269.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay */}
      <div className="absolute inset-0 video-overlay" />

      {/* Three.js Canvas */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#c9a962" />
          <Particles />
          <FloatingRings />
          <Stars radius={50} depth={50} count={1000} factor={3} saturation={0} fade speed={0.5} />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 text-center">
        <div className="fade-up visible">
          <p className="text-gold text-sm tracking-[0.4em] uppercase mb-4 font-medium">
            Luxury Fitness Redefined
          </p>
        </div>

        <h1 className="fade-up visible font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white leading-tight mb-6">
          <span className="block">AW</span>
          <span className="block text-gradient-gold">GYMS</span>
        </h1>

        <p className="fade-up visible text-white/60 text-lg sm:text-xl max-w-2xl mb-10 font-light leading-relaxed">
          Where precision engineering meets human potential.
          <br className="hidden sm:block" />
          Experience fitness at a level reserved for the extraordinary.
        </p>

        <div className="fade-up visible flex flex-col sm:flex-row gap-4 items-center">
          <button
            onClick={() => scrollTo('#contact')}
            className="shine px-10 py-4 bg-gold text-black font-semibold tracking-wider uppercase text-sm hover:bg-white transition-colors duration-300 rounded-sm"
          >
            Book a Tour
          </button>
          <button
            onClick={() => setChatOpen(true)}
            className="group px-10 py-4 border border-white/30 text-white font-semibold tracking-wider uppercase text-sm hover:border-gold hover:text-gold transition-all duration-300 rounded-sm flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            AI Assistant
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 text-white/40 hover:text-gold transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </section>
  );
}
