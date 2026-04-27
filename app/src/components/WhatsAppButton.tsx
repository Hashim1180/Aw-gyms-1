import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/923497814918"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
