
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Video, 
  Image as ImageIcon, 
  FileText, 
  Newspaper, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search,
  Bell,
  Shield,
  Upload,
  Heart,
  MessageCircle,
  ShieldAlert,
  Info,
  Archive as ArchiveIcon,
  HelpCircle,
  CheckCircle2,
  Share2,
  QrCode
} from 'lucide-react';
import { User, AppNotification } from '../types';
import { storage } from '../services/storageService';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  activeView: string;
  setActiveView: (view: string) => void;
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, activeView, setActiveView, searchQuery, setSearchQuery }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    const updateNotifs = () => setNotifications(storage.getNotifications(currentUser.id));
    updateNotifs();
    window.addEventListener('jfl_new_notification', updateNotifs);
    return () => window.removeEventListener('jfl_new_notification', updateNotifs);
  }, [currentUser.id]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'videos', label: 'Vídeos', icon: Video },
    { id: 'images', label: 'Imagens', icon: ImageIcon },
    { id: 'files', label: 'Arquivos', icon: FileText },
    { id: 'news', label: 'Novidades', icon: Newspaper },
    { id: 'chat', label: 'Chat & IA', icon: MessageSquare },
    { id: 'archive', label: 'Arquivo', icon: ArchiveIcon },
  ];

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-gray-200 overflow-hidden font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-gray-800 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between">
          <div className="cursor-pointer" onClick={() => setActiveView('home')}>
            <h1 className="text-xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent italic">
              GIGA WALL JFL
            </h1>
            <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-[0.3em] font-bold">Independência Digital</p>
          </div>
          <button className="md:hidden text-gray-500" onClick={() => setIsSidebarOpen(false)}><X size={20} /></button>
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveView(item.id); setIsSidebarOpen(false); }}
              className={`
                w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                ${activeView === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'hover:bg-gray-800 text-gray-400'}
              `}
            >
              <item.icon size={20} />
              <span className="font-semibold text-sm">{item.label}</span>
            </button>
          ))}

          <div className="pt-6 pb-2 px-4 text-[10px] font-bold text-gray-700 uppercase tracking-widest">Painéis de Gestão</div>
          
          <button
            onClick={() => { setActiveView('admin_dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === 'admin_dashboard' ? 'bg-red-600/10 text-red-400 border border-red-500/20' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Shield size={20} />
            <span className="font-semibold text-sm">Administração</span>
          </button>
          <button
            onClick={() => { setActiveView('creator_dashboard'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === 'creator_dashboard' ? 'bg-purple-600/10 text-purple-400 border border-purple-500/20' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Upload size={20} />
            <span className="font-semibold text-sm">Estúdio Criador</span>
          </button>

          <button
            onClick={() => { setActiveView('access'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === 'access' ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <QrCode size={20} />
            <span className="font-semibold text-sm">Acesso & Convites</span>
          </button>

          <button
            onClick={() => { setActiveView('settings'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeView === 'settings' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-400'}`}
          >
            <Settings size={20} />
            <span className="font-semibold text-sm">Configurações</span>
          </button>
        </nav>

        <div className="p-4 border-t border-gray-800 bg-[#111]">
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-800 rounded-xl cursor-pointer transition-colors" onClick={() => {setActiveView('profile'); setIsSidebarOpen(false);}}>
            <img src={currentUser.avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-gray-700" />
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">{currentUser.displayName}</p>
              <p className="text-[10px] text-gray-500 truncate">{currentUser.username}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-16 bg-[#111]/80 backdrop-blur-xl border-b border-gray-800 flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button className="md:hidden p-2 text-gray-400" onClick={() => setIsSidebarOpen(true)}><Menu size={20} /></button>
            <div className="hidden lg:flex items-center bg-gray-900/50 border border-gray-800 rounded-full px-4 py-1.5 w-full max-w-md transition-all focus-within:border-blue-500/50 focus-within:bg-gray-900">
              <Search size={16} className="text-gray-500" />
              <input 
                type="text" 
                placeholder="Pesquisar no Giga Wall..." 
                className="bg-transparent border-none focus:outline-none ml-3 text-sm w-full text-gray-300" 
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery && setSearchQuery('')} className="text-gray-500 hover:text-white p-1">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 md:space-x-5">
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800/50">
                <Bell size={20} />
                {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-600 text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">{unreadCount}</span>}
              </button>
              
              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-80 bg-[#151515] border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
                      <h3 className="font-black text-xs uppercase tracking-widest">Notificações</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                      {notifications.length > 0 ? notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b border-gray-800/50 flex gap-4 hover:bg-white/5 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-600/5' : ''}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${notif.type === 'like' ? 'bg-red-500/10 text-red-500' : notif.type === 'comment' ? 'bg-blue-500/10 text-blue-500' : notif.type === 'moderation' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-500/10 text-gray-400'}`}>
                            {notif.type === 'like' && <Heart size={16} fill="currentColor" />}
                            {notif.type === 'comment' && <MessageCircle size={16} />}
                            {notif.type === 'moderation' && <ShieldAlert size={16} />}
                            {notif.type === 'system' && <CheckCircle2 size={16} />}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate">{notif.title}</p>
                            <p className="text-[10px] text-gray-500 line-clamp-2">{notif.message}</p>
                          </div>
                        </div>
                      )) : <div className="p-8 text-center text-gray-600 text-xs font-bold uppercase tracking-tighter">Vazio</div>}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button onClick={() => setActiveView('faq')} className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/50"><HelpCircle size={20} /></button>
            <div className="h-6 w-[1px] bg-gray-800"></div>
            <button className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white group bg-gray-900/40 px-3 py-1.5 rounded-xl border border-gray-800/50">
              <LogOut size={16} className="group-hover:text-red-500 transition-colors" /> 
              <span className="hidden sm:inline font-bold">Sair</span>
            </button>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto custom-scrollbar bg-[#0a0a0a] relative">
          <div className="p-4 md:p-10 min-h-screen">
            {children}
            <div className="mt-16 py-8 text-center border-t border-gray-900 text-[9px] text-gray-700 font-black uppercase tracking-[0.5em]">
              &copy; 2024 GIGA WALL JFL • DESENVOLVIDO PARA INDEPENDÊNCIA MULTIMÉDIA
            </div>
          </div>
        </section>
      </main>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #333; }
      `}</style>
    </div>
  );
};

export default Layout;
