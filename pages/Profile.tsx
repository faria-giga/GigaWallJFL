
import React from 'react';
import { User, Content } from '../types';
import { MOCK_CONTENT } from '../constants';
import { MapPin, Calendar, Heart, Download, Eye, Settings, Edit2 } from 'lucide-react';

interface ProfileProps {
  user: User;
  onContentClick: (id: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onContentClick }) => {
  const userActivity = MOCK_CONTENT.slice(0, 3); // Simulação de histórico

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="relative h-48 rounded-3xl bg-gradient-to-r from-blue-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
      </div>

      <div className="relative px-8 -mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex items-end gap-6">
            <div className="relative group">
              <img 
                src={user.avatar} 
                className="w-32 h-32 rounded-3xl border-4 border-[#0a0a0a] object-cover shadow-2xl" 
              />
              <button className="absolute bottom-2 right-2 p-2 bg-blue-600 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Edit2 size={16} />
              </button>
            </div>
            <div className="pb-2">
              <h1 className="text-3xl font-black">{user.displayName}</h1>
              <p className="text-blue-400 font-bold text-sm">{user.username}</p>
            </div>
          </div>
          <div className="flex gap-3 pb-2">
            <button className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors flex items-center gap-2">
              <Settings size={18} /> Configurar Perfil
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
        <div className="space-y-6">
          <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500">Sobre</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {user.bio || "Nenhuma biografia disponível ainda. Conte ao mundo quem você é!"}
            </p>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                <MapPin size={16} className="text-blue-500" /> {user.nationality}
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                <Calendar size={16} className="text-blue-500" /> Membro desde 2024
              </div>
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-3xl p-6">
            <h3 className="font-bold text-sm uppercase tracking-widest text-gray-500 mb-4">Medalhas</h3>
            <div className="flex gap-2">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 border border-blue-500/20" title="Pioneiro">
                <Calendar size={20} />
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 border border-purple-500/20" title="Verificado">
                <Heart size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="flex gap-6 border-b border-gray-800">
            <button className="pb-4 px-2 text-sm font-bold border-b-2 border-blue-500 text-blue-500">Histórico de Atividade</button>
            <button className="pb-4 px-2 text-sm font-bold text-gray-500 hover:text-white">Favoritos</button>
            <button className="pb-4 px-2 text-sm font-bold text-gray-500 hover:text-white">Downloads</button>
          </div>

          <div className="space-y-4">
            {userActivity.map((content) => (
              <div 
                key={content.id} 
                onClick={() => onContentClick(content.id)}
                className="bg-[#111] border border-gray-800 p-4 rounded-2xl flex items-center gap-6 hover:bg-gray-800 transition-all cursor-pointer group"
              >
                <img src={content.thumbnail} className="w-24 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mb-1">Visualizou</p>
                  <h4 className="font-bold group-hover:text-blue-400 transition-colors">{content.title}</h4>
                </div>
                <div className="text-[10px] text-gray-600 font-bold uppercase">Há 2 dias</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
