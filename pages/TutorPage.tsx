import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, Trash2 } from 'lucide-react';
import { askTutor } from '../services/geminiService';
import { ChatMessage } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const MotionDiv = motion.div as any;

const TutorPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'model', text: 'Namaskara! 🙏 I am your E-Prayog AI Tutor, powered by Gemini. Ask me anything about your Karnataka PUC Science practicals — Physics, Chemistry, Biology, Math, or Computer Science.\n\nನಾನು ನಿಮ್ಮ ವರ್ಚುವಲ್ ಲ್ಯಾಬ್ ಟ್ಯೂಟರ್. ಏನಾದರೂ ಕೇಳಿ!', timestamp: Date.now() },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput(''); setLoading(true);
    try {
      const reply = await askTutor(input, 'General');
      setMessages(prev => [...prev, { id: `m-${Date.now()}`, role: 'model', text: reply, timestamp: Date.now() }]);
    } catch {
      setMessages(prev => [...prev, { id: `e-${Date.now()}`, role: 'model', text: '⚠️ Sorry, I could not get a response. Check your API key or internet connection.', timestamp: Date.now() }]);
    } finally { setLoading(false); }
  };

  const quickQuestions = [
    "What is Ohm's Law?",
    "Explain photosynthesis",
    "What is the mirror formula?",
    "Difference between mitosis and meiosis",
    "What is Wheatstone bridge principle?",
    "Explain acid-base titration",
  ];

  return (
    <div className="min-h-screen pt-20 pb-6 px-4 md:px-8 lg:px-16 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
            <Bot size={24} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-white">AI Lab Tutor</h1>
            <p className="text-sm text-slate-400">Powered by Gemini 2.0 Flash • Karnataka PUC Syllabus</p>
          </div>
          <button onClick={() => setMessages([messages[0]])} className="ml-auto p-2 rounded-xl bg-white/5 text-slate-500 hover:text-red-400 transition-colors" title="Clear chat">
            <Trash2 size={16} />
          </button>
        </div>

        {/* Chat area */}
        <div ref={chatContainerRef} className="flex-1 glass-panel rounded-2xl p-4 mb-4 overflow-y-auto max-h-[60vh] space-y-4">
          <AnimatePresence>
            {messages.map(msg => (
              <MotionDiv key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-emerald-500/20' : 'bg-purple-500/20'}`}>
                  {msg.role === 'user' ? '👤' : <Bot size={16} className="text-purple-400" />}
                </div>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === 'user' ? 'bg-emerald-500/15 text-emerald-100' : 'bg-white/5 text-slate-200'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </MotionDiv>
            ))}
          </AnimatePresence>
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center"><Bot size={16} className="text-purple-400" /></div>
              <div className="bg-white/5 rounded-2xl px-4 py-3 flex gap-1 items-center">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Quick questions */}
        {messages.length <= 2 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {quickQuestions.map((q, i) => (
              <button key={i} onClick={() => { setInput(q); }} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white transition-all">
                <Sparkles size={10} className="inline mr-1" />{q}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything about Karnataka PUC Science..." disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/50 disabled:opacity-50" />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all disabled:opacity-30 flex items-center gap-2">
            <Send size={16} /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorPage;
