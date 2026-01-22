
import React, { useState, useEffect, useRef } from 'react';
import { Send, User as UserIcon, Users, Cpu, MoreVertical, Search, ShieldCheck, MessageSquare, Image as ImageIcon, X, Trash2 } from 'lucide-react';
import { User, ChatMessage } from '../types';
import { GoogleGenAI } from "@google/genai";
import { checkModeration } from '../services/geminiService';
import { storage } from '../services/storageService';

const ChatSystem: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [chatMode, setChatMode] = useState<'individual' | 'group' | 'ai'>('ai');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Carregar histórico salvo no início
    setMessages(storage.getChatHistory());
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearChatHistory = () => {
    if (confirm("Deseja apagar todo o histórico de conversas?")) {
      storage.clearChat();
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() && !selectedImage) return;

    if (inputValue.trim()) {
      const modResult = await checkModeration(inputValue);
      if (modResult.status === 'VIOLATION') {
        const alertMsg: ChatMessage = {
          id: Date.now().toString(),
          senderId: 'system',
          senderName: 'Segurança JFL',
          text: `⚠️ Mensagem bloqueada: ${modResult.reason}`,
          timestamp: new Date().toLocaleTimeString(),
          isAi: true
        };
        setMessages(prev => [...prev, alertMsg]);
        setInputValue('');
        return;
      }
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.displayName,
      text: inputValue || (selectedImage ? "[Imagem enviada]" : ""),
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, newMessage]);
    storage.saveChatMessage(newMessage);
    
    const currentInput = inputValue;
    const currentImage = selectedImage;
    setInputValue('');
    setSelectedImage(null);

    if (chatMode === 'ai') {
      setIsTyping(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        let parts: any[] = [{ text: currentInput || "O que você vê nesta imagem?" }];
        
        if (currentImage) {
          parts.push({
            inlineData: {
              mimeType: 'image/jpeg',
              data: currentImage.split(',')[1],
            },
          });
        }

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: { parts },
          config: {
            systemInstruction: "Você é o assistente multimédia oficial do Giga Wall JFL. Você responde dúvidas técnicas sobre a plataforma, analisa conteúdos multimédia e ajuda na navegação. Mantenha um tom profissional e senior.",
          },
        });

        const aiResponse: ChatMessage = {
          id: (Date.now() + 1).toString(),
          senderId: 'ai_educational',
          senderName: 'Giga IA Educativa',
          text: response.text || "Não consegui processar sua solicitação.",
          timestamp: new Date().toLocaleTimeString(),
          isAi: true
        };
        setMessages(prev => [...prev, aiResponse]);
        storage.saveChatMessage(aiResponse);
      } catch (err) {
        console.error(err);
      } finally {
        setIsTyping(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-180px)] max-w-6xl mx-auto flex bg-[#111] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      <aside className="w-80 border-r border-gray-800 hidden lg:flex flex-col bg-[#0d0d0d]">
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-bold px-2">Conversas</h2>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Pesquisar chats..." 
              className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-xs focus:border-blue-500 outline-none"
            />
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <button 
            onClick={() => setChatMode('ai')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${chatMode === 'ai' ? 'bg-blue-600/10 border border-blue-500/20 text-blue-400' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <div className="p-2 bg-blue-500 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Cpu size={20} />
            </div>
            <div className="text-left overflow-hidden">
              <p className="font-bold text-sm">IA Assistente</p>
              <p className="text-[10px] truncate opacity-60">Memória Ativa</p>
            </div>
          </button>
          <button 
            onClick={() => setChatMode('group')}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all ${chatMode === 'group' ? 'bg-purple-600/10 border border-purple-500/20 text-purple-400' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <div className="p-2 bg-purple-500 rounded-xl text-white">
              <Users size={20} />
            </div>
            <div className="text-left">
              <p className="font-bold text-sm">Comunidade Geral</p>
              <p className="text-[10px] opacity-60">Tempo Real</p>
            </div>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800">
           <button 
            onClick={clearChatHistory}
            className="w-full flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase text-red-500/60 hover:text-red-500 transition-colors"
           >
             <Trash2 size={12} /> Limpar Histórico
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col bg-black/20">
        <header className="h-20 border-b border-gray-800 flex items-center justify-between px-8 bg-[#111]/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl ${chatMode === 'ai' ? 'bg-blue-500' : 'bg-gray-700'}`}>
              {chatMode === 'ai' ? <Cpu size={20} /> : <Users size={20} />}
            </div>
            <div>
              <h3 className="font-bold capitalize">{chatMode === 'ai' ? 'Giga IA Multimédia' : 'Chat da Comunidade'}</h3>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck size={10} className="text-blue-400" /> Analisador de Arquivos JFL
              </p>
            </div>
          </div>
          <button className="p-2 text-gray-500 hover:text-white"><MoreVertical size={20} /></button>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-6" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-3 max-w-[80%] ${msg.senderId === currentUser.id ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`space-y-1 ${msg.senderId === currentUser.id ? 'items-end' : 'items-start'}`}>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.senderId === currentUser.id 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/10' 
                      : 'bg-[#1a1a1a] border border-gray-800 text-gray-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-600 font-bold px-1">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800/50 px-4 py-2 rounded-full flex gap-1.5 items-center">
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 bg-[#111]/50 border-t border-gray-800">
          {selectedImage && (
            <div className="mb-4 relative w-20 h-20">
              <img src={selectedImage} className="w-full h-full object-cover rounded-xl border border-blue-500" />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1"
              >
                <X size={12} />
              </button>
            </div>
          )}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="bg-black/40 border border-gray-800 rounded-2xl p-2 flex items-center gap-2"
          >
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageSelect}
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
            >
              <ImageIcon size={20} />
            </button>
            <input 
              type="text" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Envie uma mensagem ou imagem para análise..."
              className="flex-1 bg-transparent border-none focus:outline-none px-4 py-2 text-sm"
            />
            <button 
              type="submit"
              disabled={(!inputValue.trim() && !selectedImage) || isTyping}
              className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ChatSystem;
