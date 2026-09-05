'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Sparkles,
  User,
  Bot,
  Loader2,
  Trash2,
  Lightbulb,
  Zap,
} from 'lucide-react';
import { UserProfile, ChatMessage } from '@/types/fitness';
import { chatCoachAction } from '@/app/actions/fitnessActions';

interface AiChatCoachProps {
  profile: UserProfile;
  onOpenProfile: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    role: 'assistant',
    content: `👋 Hello! I am **PulseAI**, your personal fitness and nutrition coach.

How can I help you today? You can ask me for:
- Food substitutions (e.g., *"What can I substitute for eggs in breakfast?"*)
- Quick workout adjustments or form cues
- Optimal protein timing and recovery advice
- Daily water and electrolyte targets`,
    timestamp: 'Just now',
  },
];

const SUGGESTED_QUESTIONS = [
  'What can I substitute for eggs in the morning?',
  'How much protein should I eat per meal to maximize muscle synthesis?',
  'Give me a 10-minute core workout I can do right now with zero equipment.',
  'What should I eat 30 minutes before a heavy workout?',
  'How do I stay in a calorie deficit without feeling hungry all day?',
];

export const AiChatCoach: React.FC<AiChatCoachProps> = ({ profile, onOpenProfile }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInput('');
    setLoading(true);

    const historyForAi = updatedHistory
      .filter((m) => m.role === 'user' || m.role === 'assistant')
      .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    const response = await chatCoachAction(text, profile, historyForAi);
    setLoading(false);

    if (response.success && response.data) {
      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.data,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } else {
      const errorMessage: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ ${response.error || 'Sorry, I could not generate a response. Please verify your GEMINI_API_KEY in .env.local.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleClear = () => {
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className="glass-panel rounded-3xl border border-zinc-800 flex flex-col h-[78vh] max-h-[850px] relative overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800 bg-zinc-950/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-black font-black shadow-lg shadow-emerald-500/20">
              ⚡
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-zinc-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-sm sm:text-base">PulseAI Nutrition & Workout Coach</h3>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-mono font-bold">
                ONLINE
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Personalized for: {profile.fitnessGoal} ({profile.weight}kg)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProfile}
            className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl transition-all hidden sm:block"
          >
            Edit Metrics
          </button>
          <button
            onClick={handleClear}
            className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-850 rounded-xl transition-colors"
            title="Reset Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-zinc-800 text-zinc-200 border border-zinc-700'
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-1`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                    isUser
                      ? 'bg-emerald-500 text-black font-medium rounded-tr-none'
                      : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800/90 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
                <div className={`text-[10px] text-zinc-500 px-1 ${isUser ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </motion.div>
          );
        })}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-900/90 border border-zinc-800/90 p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2 text-xs text-zinc-400">
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Thinking with Gemini...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-zinc-950/40 border-t border-zinc-900/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
        <span className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1 flex-shrink-0">
          <Lightbulb className="w-3 h-3 text-amber-400" /> Suggestions:
        </span>
        {SUGGESTED_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            disabled={loading}
            className="text-[11px] bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-emerald-300 border border-zinc-800 px-2.5 py-1 rounded-full whitespace-nowrap transition-all flex-shrink-0"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-950/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything (e.g., 'What can I substitute for eggs in my breakfast?')..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black flex items-center justify-center transition-all cursor-pointer flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
