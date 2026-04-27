import { useState } from 'react';
import { trpc } from '@/providers/trpc';
import { Calendar, Clock, Phone, Mail, MapPin, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useAppStore } from '../hooks/useStore';

const services = [
  'General Tour',
  'Personal Training Consultation',
  'Membership Inquiry',
  'Equipment Purchase',
  'Nutrition Consulting',
  'Group Class Trial',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: 'General Tour',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const setChatOpen = useAppStore((s) => s.setChatOpen);

  const createAppointment = trpc.appointment.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', date: '', time: '', service: 'General Tour', message: '' });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAppointment.mutate(form);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hi AW Gyms! I'd like to book an appointment.\nName: ${form.name || 'N/A'}\nService: ${form.service}\nDate: ${form.date || 'To be confirmed'}\nTime: ${form.time || 'To be confirmed'}`);
    window.open(`https://wa.me/923497814918?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="relative py-32 px-4 sm:px-6 lg:px-8 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="fade-up text-gold text-sm tracking-[0.4em] uppercase mb-4">
            Get in Touch
          </p>
          <h2 className="fade-up font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Begin Your <span className="text-gradient-gold">Journey</span>
          </h2>
          <p className="fade-up text-white/50 max-w-xl mx-auto">
            Whether you're ready to transform your physique, equip your space, or simply
            experience the AW Gyms difference — we're here to guide you.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="fade-up space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm flex-shrink-0">
                  <Phone className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">WhatsApp Direct</p>
                  <a
                    href="https://wa.me/923497814918"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-white transition-colors"
                  >
                    +92 349 7814918
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm flex-shrink-0">
                  <Mail className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Email</p>
                  <p className="text-white/50">contact@awgyms.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm flex-shrink-0">
                  <MapPin className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Location</p>
                  <p className="text-white/50">Premium Location, Main City Center</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gold/10 flex items-center justify-center rounded-sm flex-shrink-0">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-white font-medium mb-1">Hours</p>
                  <p className="text-white/50">5:00 AM – 11:00 PM Daily</p>
                  <p className="text-gold/60 text-xs mt-1">Platinum: 24/7 Access</p>
                </div>
              </div>
            </div>

            <div className="fade-up p-6 bg-white/[0.02] border border-white/5 rounded-sm">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-5 h-5 text-gold" />
                <h4 className="text-white font-medium">AI Assistant Available</h4>
              </div>
              <p className="text-white/40 text-sm mb-4">
                Our intelligent AI system can answer questions, help with bookings,
                product inquiries, and connect you directly to our sales team.
              </p>
              <button
                onClick={() => setChatOpen(true)}
                className="w-full py-3 border border-gold/50 text-gold hover:bg-gold hover:text-black transition-all rounded-sm text-sm tracking-wider uppercase"
              >
                Chat with AI
              </button>
            </div>
          </div>

          {/* Appointment Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <div className="fade-up h-full flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-gold/20 rounded-sm text-center">
                <CheckCircle className="w-16 h-16 text-gold mb-6" />
                <h3 className="text-white text-2xl font-serif font-bold mb-4">Appointment Requested</h3>
                <p className="text-white/50 mb-8 max-w-md">
                  We've received your request. Our team will contact you shortly to confirm.
                  You can also reach us directly on WhatsApp for instant confirmation.
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={handleWhatsApp}
                    className="px-8 py-3 bg-gold text-black font-semibold tracking-wider uppercase text-sm hover:bg-white transition-colors rounded-sm"
                  >
                    Confirm on WhatsApp
                  </button>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="px-8 py-3 border border-white/20 text-white hover:border-gold hover:text-gold transition-all rounded-sm text-sm tracking-wider uppercase"
                  >
                    Book Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="fade-up space-y-6 p-8 bg-white/[0.02] border border-white/5 rounded-sm">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Full Name</label>
                    <input
                      required
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-colors rounded-sm"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-colors rounded-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Phone</label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-colors rounded-sm"
                      placeholder="+92 300 0000000"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">Service</label>
                    <select
                      value={form.service}
                      onChange={(e) => setForm({ ...form, service: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none transition-colors rounded-sm appearance-none"
                    >
                      {services.map((s) => (
                        <option key={s} value={s} className="bg-[#111]">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" /> Preferred Date
                    </label>
                    <input
                      required
                      type="date"
                      value={form.date}
                      onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none transition-colors rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-white/60 text-sm mb-2">
                      <Clock className="w-4 h-4 inline mr-1" /> Preferred Time
                    </label>
                    <input
                      required
                      type="time"
                      value={form.time}
                      onChange={(e) => setForm({ ...form, time: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white focus:border-gold focus:outline-none transition-colors rounded-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm mb-2">Message (Optional)</label>
                  <textarea
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 text-white placeholder-white/20 focus:border-gold focus:outline-none transition-colors rounded-sm resize-none"
                    placeholder="Tell us about your fitness goals..."
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    disabled={createAppointment.isPending}
                    className="flex-1 py-4 bg-gold text-black font-semibold tracking-wider uppercase text-sm hover:bg-white transition-colors rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {createAppointment.isPending ? 'Submitting...' : 'Request Appointment'}
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsApp}
                    className="flex-1 py-4 border border-white/20 text-white hover:border-gold hover:text-gold transition-all rounded-sm text-sm tracking-wider uppercase"
                  >
                    Book via WhatsApp
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
