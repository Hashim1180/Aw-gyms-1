import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { getAiResponse } from "@/lib/aiEngine";
import { trpc } from "@/providers/trpc";

export default function AIChatWidget() {
  const { isChatOpen, toggleChat, chatMessages, addMessage, isAiTyping, setAiTyping, aiEnabled } = useAppStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const aiLogMutation = trpc.aiLog.create.useMutation();
  const sessionId = useRef(`session_${Date.now()}`);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAiTyping]);

  const handleSend = () => {
    if (!input.trim() || isAiTyping) return;
    
    const userMsg = { role: "user" as const, text: input.trim(), timestamp: Date.now() };
    addMessage(userMsg);
    setInput("");
    setAiTyping(true);

    setTimeout(() => {
      const response = getAiResponse(userMsg.text);
      const aiMsg = { role: "ai" as const, text: response.text, timestamp: Date.now() };
      addMessage(aiMsg);
      setAiTyping(false);
      
      aiLogMutation.mutate({
        sessionId: sessionId.current,
        userMessage: userMsg.text,
        aiResponse: response.text,
        intent: response.intent as any,
      });
    }, 1200 + Math.random() * 800);
  };

  if (!aiEnabled) return null;

  return (
    <>
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-industrial border border-gunmetal rounded-lg overflow-hidden shadow-2xl shadow-cyber/10"
          >
            <div className="bg-gunmetal/80 px-4 py-3 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyber animate-pulse" />
                <span className="text-xs font-mono text-cyber tracking-wider">AW AI // ONLINE</span>
              </div>
              <button onClick={toggleChat} className="text-platinum hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "ai" && (
                    <div className="w-6 h-6 rounded bg-cyber/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-cyber" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-3 py-2 rounded text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-cyber/20 text-white border border-cyber/30"
                        : "bg-gunmetal text-platinum border border-white/5"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3 h-3 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}
              {isAiTyping && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded bg-cyber/20 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-cyber" />
                  </div>
                  <div className="bg-gunmetal px-3 py-2 rounded border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-platinum rounded-full animate-typing" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-platinum rounded-full animate-typing" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-platinum rounded-full animate-typing" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-white/5 bg-gunmetal/50">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about products..."
                  className="flex-1 bg-void text-white text-xs px-3 py-2 rounded border border-white/10 focus:border-cyber/50 focus:outline-none font-mono"
                />
                <button
                  onClick={handleSend}
                  disabled={isAiTyping || !input.trim()}
                  className="bg-cyber/20 text-cyber px-3 py-2 rounded border border-cyber/30 hover:bg-cyber/30 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleChat}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-industrial border border-cyber/30 flex items-center justify-center shadow-lg shadow-cyber/20 animate-pulse-glow"
        data-hoverable
      >
        {isChatOpen ? (
          <X className="w-5 h-5 text-cyber" />
        ) : (
          <Sparkles className="w-5 h-5 text-cyber" />
        )}
      </motion.button>
    </>
  );
}
