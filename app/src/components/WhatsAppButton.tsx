import { motion } from "framer-motion";
import { Phone } from "lucide-react";

const WHATSAPP_NUMBER = "+923497814918";

export default function WhatsAppButton() {
  const handleClick = () => {
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}`, "_blank");
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
      data-hoverable
      title="Chat on WhatsApp"
    >
      <Phone className="w-6 h-6 text-white" />
    </motion.button>
  );
}
