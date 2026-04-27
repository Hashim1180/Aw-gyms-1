import { useState, useRef, useEffect } from 'react';
import { trpc } from '@/providers/trpc';
import { MessageCircle, X, Send, Bot, User, Sparkles, Phone } from 'lucide-react';
import { useAppStore } from '../hooks/useStore';

interface Message {
  id: number;
  role: 'user' | 'ai';
  text: string;
  intent?: string;
}

export default function AIChatbot() {
  const { chatOpen, setChatOpen } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'ai',
      text: 'Welcome to AW Gyms! I\'m your AI sales assistant. I can help with memberships, equipment, supplements, booking tours, or connecting you to our team. How may I assist you today?',
      intent: 'greeting',
    },
  ]);
  const [input, setInput] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = trpc.chat.send.useMutation({
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        { id: data.id, role: 'ai', text: data.response, intent: data.intent },
      ]);
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: input,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    sendMessage.mutate({
      message: input,
      name: name || undefined,
      email: email || undefined,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent('Hi AW Gyms! I was chatting with your AI assistant and would like to speak with a human sales representative.');
    window.open(`https://wa.me/923497814918?text=${text}`, '_blank');
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 ${
          chatOpen
            ? 'bg-white/10 text-white hover:bg-red-500'
            : 'bg-gold text-black hover:bg-white'
        }`}
      >
        {chatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-[380px] max-w-[calc(100vw-48px)] bg-[#111] border border-white/10 rounded-sm shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-gold/20 to-transparent border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div>
                <h4 className="text-white font-medium text-sm">AW Gyms AI Assistant</h4>
                <p className="text-gold/60 text-xs">Online — Intelligent Sales System</p>
              </div>
            </div>
          </div>

          {/* Profile Form (first time) */}
          {showForm && (
            <div className="p-4 bg-white/5 border-b border-white/5">
              <p className="text-white/60 text-xs mb-3">Help us personalize your experience:</p>
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:border-gold focus:outline-none rounded-sm mb-2"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:border-gold focus:outline-none rounded-sm"
              />
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[300px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'ai'
                      ? 'bg-gold/20'
                      : 'bg-white/10'
                  }`}
                >
                  {msg.role === 'ai' ? (
                    <Bot className="w-4 h-4 text-gold" />
                  ) : (
                    <User className="w-4 h-4 text-white" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-sm text-sm leading-relaxed ${
                    msg.role === 'ai'
                      ? 'bg-white/5 text-white/80'
                      : 'bg-gold/20 text-white'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {sendMessage.isPending && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-gold animate-pulse" />
                </div>
                <div className="bg-white/5 px-3 py-2 rounded-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gold/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2 mb-3">
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-1 px-3 py-1.5 bg-green-600/20 text-green-400 text-xs rounded-sm hover:bg-green-600/30 transition-colors"
              >
                <Phone className="w-3 h-3" />
                Talk to Human
              </button>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-1 px-3 py-1.5 bg-white/5 text-white/40 text-xs rounded-sm hover:bg-white/10 transition-colors"
              >
                <User className="w-3 h-3" />
                {showForm ? 'Hide' : 'Profile'}
              </button>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about memberships, products, bookings..."
                className="flex-1 px-3 py-2 bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:border-gold focus:outline-none rounded-sm"
              />
              <button
                onClick={handleSend}
                disabled={sendMessage.isPending || !input.trim()}
                className="px-3 py-2 bg-gold text-black rounded-sm hover:bg-white transition-colors disabled:opacity-30"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
