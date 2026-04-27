import { useEffect } from 'react';
import Navigation from '../sections/Navigation';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Products from '../sections/Products';
import VideoGallery from '../sections/VideoGallery';
import Models3D from '../sections/Models3D';
import Contact from '../sections/Contact';
import Footer from '../sections/Footer';
import AIChatbot from '../components/AIChatbot';
import WhatsAppButton from '../components/WhatsAppButton';

export default function Home() {
  useEffect(() => {
    // Intersection Observer for fade-up animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.fade-up, .scale-in').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative bg-background min-h-screen">
      <Navigation />
      <Hero />
      <About />
      <Products />
      <VideoGallery />
      <Models3D />
      <Contact />
      <Footer />
      <AIChatbot />
      <WhatsAppButton />
    </div>
  );
}
