import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Zap, Dna, Send, User, Bot, HelpCircle } from 'lucide-react';
import { streamChatResponse, ChatMessage } from '../services/chatService';

const AGENTS = {
  CONCIERGE: {
    id: 'concierge',
    name: 'Deep Getty Concierge',
    role: 'Membership & Accounts',
    icon: MessageSquare,
    color: 'text-white',
    prompt: `You are the Deep Getty Concierge. 
             Your job is to help users with their account, billing, and general navigation.
             Key Info:
             - Membership is $97/month.
             - There is a 24-hour trial period.
             - You can help them find their way around Studio, Go, and Life.
             - Be polite, efficient, and premium.`
  },
  DEVICE: {
    id: 'device',
    name: 'Device Specialist',
    role: 'Integrations (Whoop, Oura, Apple)',
    icon: Zap,
    color: 'text-blue-400',
    prompt: `You are the Deep Getty Device Specialist.
             Your job is to help users sync their wearables.
             Key Info:
             - We support Whoop 4.0, Oura Ring, and Apple Health.
             - To sync, they need to go to the 'Deep Getty Go' section.
             - If data isn't syncing, suggest checking bluetooth permissions or re-authenticating.
             - Be technical but accessible.`
  },
  PROTOCOL: {
    id: 'protocol',
    name: 'Protocol Specialist',
    role: 'Peptides & Medical FAQ',
    icon: Dna,
    color: 'text-red-500',
    prompt: `You are the Deep Getty Protocol Specialist.
             Your job is to answer questions about Peptides and Biohacking.
             Key Info:
             - Protocols are add-ons ($997).
             - Common peptides: BPC-157 (Recovery), TB-500 (Healing), CJC-1295 (Growth).
             - ALWAYS Include a disclaimer: "I am an AI, not a doctor. Please consult the physician assigned to your protocol."
             - Do not give specific medical advice for serious conditions.`
  }
};

const Support: React.FC = () => {
  const [activeAgent, setActiveAgent] = useState<keyof typeof AGENTS>('CONCIERGE');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({
    concierge: [{ role: 'model', text: 'Hello. I am your concierge. How can I assist with your Deep Getty membership today?' }],
    device: [{ role: 'model', text: 'Device Specialist online. Need help syncing your Whoop, Oura, or Apple Watch?' }],
    protocol: [{ role: 'model', text: 'Welcome to the Lab. I can answer questions about our peptide protocols. Remember, I am an AI assistant, not a physician.' }]
  });
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeAgent]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const currentAgentKey = activeAgent.toLowerCase();
    const userText = input;
    setInput('');

    // Add User Message
    const newHistory = [
      ...messages[currentAgentKey],
      { role: 'user' as const, text: userText }
    ];

    setMessages(prev => ({
      ...prev,
      [currentAgentKey]: newHistory
    }));

    setIsTyping(true);

    // Stream AI Response
    let fullResponse = "";
    await streamChatResponse(
      newHistory, 
      AGENTS[activeAgent].prompt, 
      (chunk) => {
        fullResponse += chunk;
        setMessages(prev => ({
          ...prev,
          [currentAgentKey]: [
            ...newHistory,
            { role: 'model' as const, text: fullResponse }
          ]
        }));
      }
    );

    setIsTyping(false);
  };

  return (
    <div className="animate-in fade-in duration-500 h-[85vh] flex gap-6">
      
      {/* Sidebar - Agent Selection */}
      <div className="w-1/3 hidden md:flex flex-col gap-4">
        <h1 className="text-3xl font-serif font-bold text-white mb-4">Support Center</h1>
        {Object.entries(AGENTS).map(([key, agent]) => (
          <button
            key={key}
            onClick={() => setActiveAgent(key as keyof typeof AGENTS)}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeAgent === key 
                ? 'bg-zinc-800 border-blue-500/50 shadow-lg shadow-blue-900/10' 
                : 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800'
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <agent.icon className={`w-5 h-5 ${agent.color}`} />
              <span className="font-bold text-white">{agent.name}</span>
            </div>
            <p className="text-xs text-gray-400">{agent.role}</p>
          </button>
        ))}
        
        <div className="mt-auto p-4 bg-zinc-900 rounded-xl border border-zinc-800">
          <div className="flex items-center gap-2 text-gray-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span className="text-xs font-bold">FAQ Quick Links</span>
          </div>
          <ul className="text-xs text-gray-500 space-y-2 pl-6 list-disc">
            <li className="hover:text-white cursor-pointer">How to cancel membership?</li>
            <li className="hover:text-white cursor-pointer">Return policy for Merch</li>
            <li className="hover:text-white cursor-pointer">HIPAA Data Privacy</li>
          </ul>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
        
        {/* Chat Header (Mobile friendly agent switch could go here, simply showing name for now) */}
        <div className="p-4 border-b border-zinc-800 bg-black/20 flex items-center gap-3">
          <div className={`p-2 rounded-full bg-black`}>
             {React.createElement(AGENTS[activeAgent].icon, { className: `w-5 h-5 ${AGENTS[activeAgent].color}` })}
          </div>
          <div>
             <h3 className="font-bold text-white">{AGENTS[activeAgent].name}</h3>
             <div className="flex items-center gap-2">
               <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
               <span className="text-xs text-gray-400">Online</span>
             </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages[activeAgent.toLowerCase()].map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-zinc-700'}`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
              </div>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-zinc-800 text-gray-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                 <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-zinc-800 p-4 rounded-2xl rounded-tl-none">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-zinc-800 bg-black/20">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message ${AGENTS[activeAgent].name}...`}
              className="flex-1 bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="bg-white text-black p-3 rounded-xl hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Support;