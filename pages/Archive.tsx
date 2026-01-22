
import React, { useState } from 'react';
import { MOCK_CONTENT } from '../constants';
import { Calendar, Search, Filter } from 'lucide-react';

const Archive: React.FC<{ onContentClick: (id: string) => void }> = ({ onContentClick }) => {
  const [filter, setFilter] = useState('');
  
  const sortedContent = [...MOCK_CONTENT].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black">Arquivo Cronológico</h1>
          <p className="text-gray-500">Todo o acervo do Giga Wall JFL organizado por data.</p>
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Filtrar por nome ou tag..."
            className="bg-[#111] border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-sm w-64 focus:border-blue-500 outline-none"
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {/* Grupos por Mês (Simulado) */}
        <div>
          <h2 className="text-xs font-black text-blue-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
            <Calendar size={14} /> Outubro 2024
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {sortedContent.map((content) => (
              <div 
                key={content.id}
                onClick={() => onContentClick(content.id)}
                className="bg-[#111] border border-gray-800 p-4 rounded-2xl flex items-center justify-between hover:bg-gray-800 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-6">
                  <span className="text-xs font-bold text-gray-600 font-mono">
                    {new Date(content.createdAt).toLocaleDateString()}
                  </span>
                  <img src={content.thumbnail} className="w-12 h-12 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <h4 className="font-bold group-hover:text-blue-400 transition-colors">{content.title}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{content.category}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {content.tags.slice(0, 2).map(t => (
                    <span key={t} className="text-[9px] px-2 py-0.5 bg-gray-900 border border-gray-800 rounded text-gray-500">#{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Archive;
