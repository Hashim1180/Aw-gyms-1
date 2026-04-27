import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, X, Film } from 'lucide-react';
import { trpc } from '@/providers/trpc';

export default function VideoGallery() {
  const { data: videos, isLoading } = trpc.video.list.useQuery();
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const openVideo = (url: string) => {
    setActiveVideo(url);
    setIsPlaying(true);
    setIsMuted(false);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section id="videos" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="fade-up text-gold text-sm tracking-[0.4em] uppercase mb-4">
            Cinematic Experience
          </p>
          <h2 className="fade-up font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Video <span className="text-gradient-gold">Gallery</span>
          </h2>
          <p className="fade-up text-white/50 max-w-xl mx-auto">
            Immerse yourself in the AW Gyms universe. Every frame captures the essence
            of uncompromising dedication and luxury fitness culture.
          </p>
        </div>

        {/* Featured Video */}
        <div className="fade-up mb-12">
          <div className="relative aspect-video rounded-sm overflow-hidden bg-black border border-white/5">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/23271.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <p className="text-gold text-xs tracking-wider uppercase mb-2">Featured</p>
              <h3 className="text-white text-2xl font-serif font-bold">AW Gyms Cinematic Reel</h3>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/5 animate-pulse aspect-video rounded-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {videos?.map((video: NonNullable<typeof videos>[number], i: number) => (
              <button
                key={video.id}
                onClick={() => openVideo(video.url)}
                className="fade-up group relative aspect-video rounded-sm overflow-hidden bg-black border border-white/5 hover:border-gold/30 transition-all duration-500"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <video
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => e.currentTarget.pause()}
                >
                  <source src={video.url} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all">
                    <Play className="w-5 h-5 text-white group-hover:text-black ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-xs font-medium truncate">{video.title}</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider">{video.category}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <button
            onClick={closeVideo}
            className="absolute top-6 right-6 text-white/60 hover:text-white z-10"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-6xl">
            <video
              ref={videoRef}
              autoPlay
              src={activeVideo}
              className="w-full rounded-sm"
              onEnded={() => setIsPlaying(false)}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-gold hover:text-black transition-all"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center gap-2 text-white/40 text-sm">
                <Film className="w-4 h-4" />
                <span>AW Gyms Premium</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
