import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, MessageCircle, Instagram, Youtube, ExternalLink } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { useAppStore } from "@/store/useAppStore";
import VideoBackground from "@/components/VideoBackground";

export default function Nexus() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const addMessage = useAppStore((s) => s.addMessage);
  
  const contactMutation = trpc.contact.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
      addMessage({ role: "ai", text: "New lead captured from the Nexus contact form. System will route to sales team.", timestamp: Date.now() });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    contactMutation.mutate({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      source: "form",
    });
  };

  return (
    <section id="nexus" className="relative min-h-screen w-full py-32 overflow-hidden">
      <VideoBackground src="/videos/23271.mp4" overlay />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-cyber text-[10px] font-mono tracking-[0.3em] uppercase mb-4 block">
            // NEXUS_04
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
            JOIN THE <span className="text-cyber">NETWORK</span>
          </h2>
          <p className="text-platinum text-sm max-w-lg mx-auto leading-relaxed">
            Your transformation starts with a single connection. Reach out and let our 
            systems architect your evolution.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-cyber" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-platinum tracking-wider block mb-1">DIRECT LINE</span>
                <a href="tel:+923497814918" className="text-white hover:text-cyber transition-colors font-mono text-sm">
                  +92 349 7814918
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-cyber" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-platinum tracking-wider block mb-1">DATA STREAM</span>
                <span className="text-white font-mono text-sm">admin@awgyms.com</span>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gunmetal border border-white/10 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4 text-cyber" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-platinum tracking-wider block mb-1">HEADQUARTERS</span>
                <span className="text-white text-sm">Karachi, Pakistan</span>
              </div>
            </div>

            <div className="pt-4">
              <a
                href={`https://wa.me/923497814918`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white text-sm font-semibold hover:bg-[#128C7E] transition-colors"
                data-hoverable
              >
                <MessageCircle className="w-5 h-5" />
                CONNECT ON WHATSAPP
              </a>
            </div>

            <div className="flex gap-4 pt-4">
              <a href="#" className="w-10 h-10 bg-gunmetal border border-white/10 flex items-center justify-center hover:border-cyber/30 transition-colors" data-hoverable>
                <Instagram className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gunmetal border border-white/10 flex items-center justify-center hover:border-cyber/30 transition-colors" data-hoverable>
                <Youtube className="w-4 h-4 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-gunmetal border border-white/10 flex items-center justify-center hover:border-cyber/30 transition-colors" data-hoverable>
                <ExternalLink className="w-4 h-4 text-white" />
              </a>
            </div>
          </div>

          <div className="bg-gunmetal/30 border border-white/5 p-6">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <div className="w-12 h-12 bg-cyber/20 border border-cyber/30 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-5 h-5 text-cyber" />
                </div>
                <h3 className="text-lg font-heading font-semibold text-white mb-2">TRANSMISSION SENT</h3>
                <p className="text-sm text-platinum">Our systems have received your request. Expect contact within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-platinum tracking-wider block mb-2">IDENTITY *</label>
                  <input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-void text-white text-sm px-4 py-3 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                    placeholder="Your name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-mono text-platinum tracking-wider block mb-2">EMAIL</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-void text-white text-sm px-4 py-3 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                      placeholder="email@domain.com"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-mono text-platinum tracking-wider block mb-2">COMMS *</label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-void text-white text-sm px-4 py-3 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-mono text-platinum tracking-wider block mb-2">MESSAGE</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full bg-void text-white text-sm px-4 py-3 border border-white/10 focus:border-cyber/50 focus:outline-none font-mono resize-none"
                    placeholder="Describe your requirements..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full bg-cyber/20 text-cyber border border-cyber/30 py-3 text-xs font-mono tracking-[0.2em] uppercase hover:bg-cyber/30 transition-colors disabled:opacity-50"
                  data-hoverable
                >
                  {contactMutation.isPending ? "TRANSMITTING..." : "TRANSMIT REQUEST"}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[10px] font-mono text-platinum/50 tracking-wider">
            AW GYMS // 2024 // ALL SYSTEMS OPERATIONAL
          </span>
          <span className="text-[10px] font-mono text-platinum/50 tracking-wider">
            DESIGNED BY AI AUTOMATION NETWORK
          </span>
        </div>
      </div>
    </section>
  );
}
