
import React from 'react';
import { MOCK_CONTENT } from '../constants';
import ContentCard from '../components/ContentCard';
import { TrendingUp, Clock, Star, Zap, ChevronRight, Filter } from 'lucide-react';
import { Content, ContentCategory } from '../types';

interface DashboardProps {
  onContentClick: (id: string) => void;
  filteredContent: Content[];
  selectedCategory: ContentCategory | 'Todos';
  setSelectedCategory: (cat: ContentCategory | 'Todos') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onContentClick, filteredContent, selectedCategory, setSelectedCategory }) => {
  const featured = MOCK_CONTENT[1];
  const categories: (ContentCategory | 'Todos')[] = [
    'Todos',
    'Arte Digital',
    'Natureza',
    'Software',
    'Fotografia',
    'Música',
    'Educação',
    'Tecnologia',
    'Jogos',
    'Filmes',
    'Design'
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Hero Section */}
      <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden group">
        <img 
          src={featured.thumbnail} 
          alt="Hero" 
          className="w-full h-full object-cover brightness-[0.4] group-hover:scale-105 transition-transform duration-[3000ms]"
        />
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 space-y-4 max-w-3xl">
          <div className="flex items-center space-x-2 text-blue-400 font-bold tracking-tighter uppercase text-xs">
            <Zap size={16} fill="currentColor" /> <span>Destaque da Semana</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">
            {featured.title}
          </h1>
          <p className="text-gray-300 text-sm md:text-base line-clamp-2 max-w-xl">
            {featured.description}
          </p>
          <div className="flex gap-4 pt-4">
            <button 
              onClick={() => onContentClick(featured.id)}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Explorar Agora
            </button>
            <button className="hidden sm:block px-6 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl border border-white/20 hover:bg-white/20 transition-colors">
              Detalhes
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar">
        <div className="p-2.5 bg-gray-900 border border-gray-800 rounded-xl text-gray-500">
          <Filter size={18} />
        </div>
        <div className="flex gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border ${
                selectedCategory === cat 
                ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Sections based on Filter */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black flex items-center gap-3 italic">
            <TrendingUp size={24} className="text-blue-500" /> 
            {selectedCategory === 'Todos' ? 'Descobrir Tudo' : `Explorando ${selectedCategory}`}
          </h2>
          {filteredContent.length > 4 && (
             <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest bg-gray-900/50 px-3 py-1 rounded-full">
               {filteredContent.length} Resultados
             </span>
          )}
        </div>
        
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map(content => (
              <ContentCard key={content.id} content={content} onClick={onContentClick} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-gray-800 rounded-3xl bg-[#111]/30">
            <p className="text-gray-600 font-bold uppercase tracking-[0.2em] text-sm">Nenhum conteúdo nesta categoria no momento</p>
          </div>
        )}
      </div>

      {selectedCategory === 'Todos' && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black flex items-center gap-3 italic">
              <Star size={24} className="text-yellow-500" /> Recomendados JFL
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...MOCK_CONTENT].reverse().slice(0, 4).map(content => (
              <ContentCard key={content.id} content={content} onClick={onContentClick} />
            ))}
          </div>
        </div>
      )}

      {/* CTA Footer */}
      <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-[2.5rem] p-10 md:p-16 text-center space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10 space-y-4">
          <h3 className="text-3xl md:text-4xl font-black italic">Torne-se um Criador no Giga Wall JFL</h3>
          <p className="text-gray-400 max-w-xl mx-auto text-lg leading-relaxed">
            Publique seus conteúdos multimédia, acompanhe suas estatísticas e conecte-se com uma audiência global sem intermediários.
          </p>
          <div className="pt-6">
            <button className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 uppercase tracking-[0.2em] text-xs">
              Solicitar Verificação Agora
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default Dashboard;
