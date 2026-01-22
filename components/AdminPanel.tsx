
import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  AlertTriangle, 
  Activity, 
  Settings, 
  MessageCircle, 
  BarChart, 
  Globe,
  UserPlus,
  Trash2,
  ShieldAlert,
  Search,
  CheckCircle,
  MoreVertical
} from 'lucide-react';
import { User, UserRole } from '../types';
import { MOCK_USERS, MOCK_CONTENT } from '../constants';

const AdminPanel: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'moderation' | 'config'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  if (currentUser.role !== UserRole.ADMIN) {
    return (
      <div className="p-8 md:p-12 text-center text-red-500 font-black bg-red-500/5 border border-red-500/20 rounded-3xl mx-4 uppercase text-xs tracking-[0.2em]">
        ACESSO NEGADO: REQUER PRIVILÉGIOS ADMINISTRATIVOS
      </div>
    );
  }

  const stats = [
    { label: 'Usuários Ativos', value: '1,284', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Contas Registradas', value: '8,421', icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { label: 'Moderação', value: '12', icon: ShieldAlert, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'Performance', value: '98.2%', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 px-2 md:px-0">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-800">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-red-600/20 flex-shrink-0">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">Painel de Controle</h1>
            <p className="text-gray-500 font-medium text-xs md:text-sm">Controle total da infraestrutura Giga Wall JFL.</p>
          </div>
        </div>
        
        <nav className="flex p-1 bg-black/40 rounded-2xl border border-gray-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart },
            { id: 'users', label: 'Usuários', icon: Users },
            { id: 'moderation', label: 'Moderação', icon: ShieldAlert },
            { id: 'config', label: 'Config', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap
                ${activeTab === tab.id ? 'bg-gray-800 text-white shadow-lg' : 'text-gray-600 hover:text-gray-400'}
              `}
            >
              <tab.icon size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </header>

      {activeTab === 'dashboard' && (
        <div className="space-y-6 md:space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <div key={i} className="bg-[#111] border border-gray-800 p-5 md:p-6 rounded-3xl hover:border-gray-700 transition-colors">
                <div className={`${s.bg} ${s.color} w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <s.icon size={20} className="md:w-6 md:h-6" />
                </div>
                <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest mb-1">{s.label}</p>
                <p className="text-xl md:text-3xl font-black">{s.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-3">
                <Activity className="text-blue-500" /> Fluxo Recente
              </h3>
              <div className="space-y-4">
                {[
                  { user: '@pixel_master', action: 'Publicou vídeo', target: 'Drone 4K', time: '2m', color: 'text-blue-500/70' },
                  { user: '@user_jfl', action: 'Comentou em', target: 'Wallpaper', time: '15m', color: 'text-purple-500/70' },
                  { user: '@admin_jfl', action: 'Removeu item', target: 'file_v.zip', time: '1h', color: 'text-red-500/70' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-2xl border border-gray-800/50">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-[10px] font-black flex-shrink-0">{item.user[1].toUpperCase()}</div>
                      <div className="overflow-hidden">
                        <p className="text-[11px] md:text-sm truncate">
                          <span className="font-bold text-gray-300">{item.user}</span>
                          <span className="text-gray-600 mx-2">{item.action}</span>
                          <span className={`font-bold ${item.color}`}>{item.target}</span>
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-gray-700 uppercase ml-2">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-3">
                <AlertTriangle className="text-yellow-600" /> Alertas
              </h3>
              <div className="space-y-3">
                {[
                  { msg: 'Login Suspeito (China)', severity: 'HIGH' },
                  { msg: 'Filtro de Spam Ativo', severity: 'MED' },
                ].map((alert, i) => (
                  <div key={i} className="p-4 bg-gray-900/40 rounded-2xl border-l-4 border-red-600 flex flex-col gap-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[8px] font-black text-red-600 uppercase tracking-widest">{alert.severity}</span>
                      <span className="text-[8px] text-gray-700 font-black">AGORA</span>
                    </div>
                    <p className="text-xs font-bold text-gray-300">{alert.msg}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 bg-gray-900 text-gray-600 rounded-xl text-[9px] font-black hover:text-white transition-colors uppercase tracking-[0.2em]">
                Limpar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#111] border border-gray-800 rounded-3xl overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-800 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0d0d]">
            <h3 className="font-bold text-lg">Utilizadores</h3>
            <div className="relative w-full md:w-80">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input 
                type="text" 
                placeholder="Pesquisar..."
                className="w-full bg-black/40 border border-gray-800 rounded-xl py-2 pl-10 pr-4 text-[11px] font-bold focus:border-blue-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-black/20 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                  <th className="p-4 md:p-6">Utilizador</th>
                  <th className="p-4 md:p-6">Cargo</th>
                  <th className="p-4 md:p-6">Local</th>
                  <th className="p-4 md:p-6">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/30">
                {MOCK_USERS.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-800/10 transition-colors">
                    <td className="p-4 md:p-6">
                      <div className="flex items-center gap-3">
                        <img src={user.avatar} className="w-9 h-9 rounded-full border border-gray-800 flex-shrink-0" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-xs md:text-sm truncate text-gray-300">{user.displayName}</p>
                          <p className="text-[10px] text-gray-600 truncate">{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <span className={`px-2 py-1 rounded text-[9px] font-black uppercase border ${
                        user.role === UserRole.ADMIN ? 'border-red-500/10 text-red-500/70 bg-red-500/5' :
                        user.role === UserRole.CREATOR ? 'border-blue-500/10 text-blue-500/70 bg-blue-500/5' :
                        'border-gray-500/10 text-gray-500/70 bg-gray-500/5'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 md:p-6">
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-black uppercase">
                        <Globe size={12} className="opacity-40" /> {user.nationality}
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <div className="flex gap-2">
                        <button className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-[9px] font-black hover:text-white transition-colors uppercase tracking-widest">Editar</button>
                        <button className="p-1.5 bg-red-900/10 text-red-500/40 rounded-lg hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-3"><ShieldAlert className="text-red-600" /> Denúncias</h3>
            <div className="space-y-4">
              {MOCK_CONTENT.slice(0, 3).map((c, i) => (
                <div key={i} className="bg-gray-900/30 border border-gray-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <img src={c.thumbnail} className="w-14 h-9 object-cover rounded-lg flex-shrink-0" />
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate text-gray-300">{c.title}</p>
                      <p className="text-[9px] text-red-500/60 font-black uppercase tracking-tighter">Copyright</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 bg-emerald-900/10 text-emerald-500/60 rounded-lg hover:text-emerald-500 transition-colors"><CheckCircle size={16} /></button>
                    <button className="p-2 bg-red-900/10 text-red-500/60 rounded-lg hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-3"><MessageCircle className="text-blue-600" /> IA Moderador</h3>
            <div className="bg-black/30 p-6 rounded-2xl border border-gray-800/50 space-y-4">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tight leading-relaxed">Filtro Gemini Pro: 99.4% precisão.</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Auto-Moderação</span>
                  <div className="w-9 h-5 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-900 rounded-xl">
                  <span className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Filtro Educativo</span>
                  <div className="w-9 h-5 bg-blue-600 rounded-full relative p-1 cursor-pointer">
                    <div className="w-3 h-3 bg-white rounded-full absolute right-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-8">
          <h3 className="text-lg md:text-xl font-bold flex items-center gap-3"><Settings className="text-gray-500" /> Sistema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] border-b border-gray-800 pb-2">Identidade</h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Nome da Rede</label>
                  <input type="text" value="Giga Wall JFL" readOnly className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs font-bold text-gray-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-600 uppercase">Suporte JFL</label>
                  <input type="text" value="gigawalljfl@gmail.com" readOnly className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-xs font-bold text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase text-gray-700 tracking-[0.3em] border-b border-gray-800 pb-2">Segurança</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <Globe className="text-blue-600" size={18} />
                    <span className="text-xs font-bold text-gray-300">Bloqueio IP Global</span>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-2xl border border-gray-800/50">
                  <div className="flex items-center gap-3">
                    <Activity className="text-emerald-600" size={18} />
                    <span className="text-xs font-bold text-gray-300">Sincronização PWA</span>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 accent-blue-600 rounded" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 flex justify-end">
            <button className="w-full sm:w-auto px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest text-xs">
              Salvar Configuração
            </button>
          </div>
        </div>
      )}
      
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AdminPanel;
