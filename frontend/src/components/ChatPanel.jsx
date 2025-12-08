import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Globe, Loader2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendQuery } from '../api';

const ChatPanel = () => {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: 'Hello! I can help you analyze emissions data or find relevant information from the web. What would you like to know?', sources: [] }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = { id: Date.now(), role: 'user', text: input, sources: [] };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);

        try {
            const data = await sendQuery(userMsg.text);
            const botResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                text: data.response,
                sources: data.sources || []
            };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chat error:", error);
            const errorResponse = {
                id: Date.now() + 1,
                role: 'assistant',
                text: "Sorry, I'm having trouble connecting to the server. Please check if the backend is running.",
                sources: []
            };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-md bg-white/5 sticky top-0 z-10">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles className="text-primary" size={20} />
                        AI Assistant
                    </h2>
                    <p className="text-sm text-muted-foreground">Powered by EcoTracker Intelligence</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-3`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary' : 'bg-white/10'}`}>
                                    {msg.role === 'user' ? <User size={16} className="text-primary-foreground" /> : <Sparkles size={16} className="text-primary" />}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div
                                        className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground rounded-tr-none'
                                            : 'bg-white/10 text-white rounded-tl-none border border-white/5'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    {/* Sources Section */}
                                    {msg.sources && msg.sources.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {msg.sources.map((source, idx) => (
                                                <a
                                                    key={idx}
                                                    href={source.uri}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors"
                                                >
                                                    <Globe size={10} />
                                                    <span className="max-w-[120px] truncate">{source.title}</span>
                                                    <ExternalLink size={10} />
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {isTyping && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                        <div className="flex flex-row gap-3">
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Sparkles size={16} className="text-primary" />
                            </div>
                            <div className="bg-white/5 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Searching the web...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-white/5 bg-black/20 backdrop-blur-md">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about emissions or global trends..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-4 pr-12 text-white placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim()}
                        className="absolute right-2 p-2 bg-primary rounded-lg text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Globe size={12} /> Web Search Enabled</span>
                    <span>•</span>
                    <span>Database Connected</span>
                </div>
            </div>
        </div>
    );
};

export default ChatPanel;
