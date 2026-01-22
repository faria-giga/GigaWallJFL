
import React from 'react';
import { Newspaper, Bell, Zap, Terminal, ExternalLink } from 'lucide-react';

const NewsFeed = () => {
  const news = [
    {
      id: 1,
      tag: 'Atualização',
      title: 'Giga Wall v2.5: Sistema de Comentários Ativo!',
      desc: 'Agora você pode interagir diretamente com os criadores e discutir sobre os conteúdos publicados no portal.',
      date: 'HOJE',
      icon: <Zap size={20} />,
      color: 'bg-blue-600'
    },
    {
      id: 2,
      tag: 'Segurança',
      title: 'Melhorias no Algoritmo de Moderação Gemini',
      desc: 'Refinamos nosso filtro IA para garantir um ambiente mais seguro e livre de spam para todos os usuários.',
      date: 'ONTEM',
      icon: <Terminal size={20} />,
      color: 'bg-emerald-600'
    },
    {
      id: 3,
      tag: 'Comunidade',
      title: 'Novos Filtros de Busca Grounded',
      desc: 'O assistente IA agora utiliza Google Search Grounding para trazer tendências mundiais de design e tecnologia.',
      date: '2 DIAS ATRÁS',
      icon: <Newspaper size={20} />,
      color: 'bg-purple-600'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12 animate-in fade-in duration-700">
      <div className="flex items-center gap-6">
        <div className="p-5 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-500/20">
          <Newspaper size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter">Novidades JFL</h1>
          <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em]">Central de Comunicados da Rede</p>
        </div>
      </div>

      <div className="space-y-6">
        {news.map((item) => (
          <div key={item.id} className="bg-[#111] border border-gray-800 rounded-3xl p-8 flex gap-8 items-start hover:border-blue-500/30 transition-all group">
            <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center flex-shrink-0 shadow-lg`}>
              {item.icon}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black uppercase text-blue-500 tracking-widest">{item.tag}</span>
                <span className="text-[10px] font-black text-gray-700 uppercase">{item.date}</span>
              </div>
              <h2 className="text-2xl font-black group-hover:text-blue-400 transition-colors">{item.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              <button className="flex items-center gap-2 text-[10px] font-black text-gray-500 uppercase hover:text-white transition-colors">
                Ler mais <ExternalLink size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-10 bg-gradient-to-r from-blue-900/10 to-transparent border border-blue-500/10 rounded-[2.5rem] text-center space-y-4">
        <Bell className="mx-auto text-blue-500" size={32} />
        <h3 className="text-xl font-bold">Deseja ser notificado sobre mudanças críticas?</h3>
        <p className="text-sm text-gray-500">Ative as notificações do sistema em suas configurações de perfil.</p>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
          Ativar Agora
        </button>
      </div>
    </div>
  );
};

export default NewsFeed;
