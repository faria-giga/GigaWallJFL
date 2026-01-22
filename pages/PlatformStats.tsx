
import React from 'react';
import { BarChart3, Users, Download, Globe, Server, Cpu } from 'lucide-react';

const PlatformStats = () => {
  return (
    <div className="max-w-6xl mx-auto py-12 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black italic">Platform Analytics</h1>
        <p className="text-gray-500 font-medium">Dados de desempenho e infraestrutura em tempo real.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Uploads Totais', value: '4,521', icon: Server, color: 'text-blue-500' },
          { label: 'Países Ativos', value: '142', icon: Globe, color: 'text-emerald-500' },
          { label: 'Consultas IA', value: '158k', icon: Cpu, color: 'text-purple-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#111] border border-gray-800 p-8 rounded-3xl space-y-2">
            <stat.icon size={32} className={stat.color} />
            <p className="text-3xl font-black">{stat.value}</p>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-12 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-5">
           <BarChart3 size={200} />
        </div>
        <div className="relative z-10 space-y-8">
          <h3 className="text-2xl font-black">Crescimento da Comunidade</h3>
          <div className="h-64 flex items-end gap-2">
            {[40, 65, 45, 90, 85, 100, 75, 95, 110].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-lg transition-all hover:opacity-80 cursor-help"
                style={{ height: `${h}%` }}
                title={`Mês ${i + 1}: ${h * 100} novos usuários`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span>Jan</span>
            <span>Mar</span>
            <span>Mai</span>
            <span>Jul</span>
            <span>Set</span>
            <span>Nov</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformStats;
