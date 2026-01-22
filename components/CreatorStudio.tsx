
import React, { useState } from 'react';
import { Upload, Video, Image as ImageIcon, FileText, BarChart2, Globe, Shield, Trash2, Edit3, Plus, Bell, Heart, MessageCircle, ShieldAlert, CheckCircle2, Sparkles, X } from 'lucide-react';
import { User, Content, AppNotification, ContentCategory, ContentType } from '../types';
import { storage } from '../services/storageService';
import { generateSmartTags } from '../services/geminiService';

const CreatorStudio: React.FC<{ currentUser: User }> = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'notifications'>('upload');
  
  // Estados do formulário de upload
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState<ContentCategory>('Arte Digital');
  const [formType, setFormType] = useState<ContentType>('video');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const creatorContent = storage.getContent().filter(c => c.creatorId === currentUser.id);
  const notifications = storage.getNotifications(currentUser.id);

  const categories: ContentCategory[] = [
    'Arte Digital', 'Natureza', 'Software', 'Fotografia', 'Música', 
    'Educação', 'Tecnologia', 'Jogos', 'Filmes', 'Design', 'Outros'
  ];

  const handlePublish = () => {
    if (!formTitle.trim() || !formDescription.trim()) return;
    
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        
        const newContent: Content = {
          id: Date.now().toString(),
          title: formTitle,
          description: formDescription,
          category: formCategory,
          type: formType,
          tags: formTags,
          creatorId: currentUser.id,
          thumbnail: `https://picsum.photos/seed/${Date.now()}/400/225`,
          url: '#',
          views: 0,
          likes: 0,
          downloads: 0,
          createdAt: new Date().toISOString(),
          ageRestricted: false
        };

        storage.addContent(newContent);
        setIsUploading(false);
        setUploadProgress(0);
        setShowSuccess(true);
        setFormTitle('');
        setFormDescription('');
        setFormTags([]);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    }, 200);
  };

  const handleSuggestTags = async () => {
    if (!formTitle.trim() || !formDescription.trim()) return;
    setIsGeneratingTags(true);
    const suggested = await generateSmartTags(formTitle, formDescription);
    setFormTags(prev => Array.from(new Set([...prev, ...suggested])));
    setIsGeneratingTags(false);
  };

  const isFormValid = formTitle.trim().length > 0 && formDescription.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-500 px-2 md:px-0">
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#111] p-6 md:p-8 rounded-3xl border border-gray-800">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-xl shadow-blue-500/20 flex-shrink-0">
            <Upload size={28} className="md:w-8 md:h-8" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-black">Estúdio do Criador</h1>
            <p className="text-gray-500 font-medium text-xs md:text-sm">Gerencie suas publicações e analise seu desempenho.</p>
          </div>
        </div>
        
        <div className="flex overflow-x-auto pb-2 lg:pb-0 gap-2 no-scrollbar">
          <button 
            onClick={() => setActiveTab('upload')}
            className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold transition-all border text-xs md:text-sm ${activeTab === 'upload' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
          >
            Novo Upload
          </button>
          <button 
            onClick={() => setActiveTab('manage')}
            className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold transition-all border text-xs md:text-sm ${activeTab === 'manage' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
          >
            Conteúdos
          </button>
          <button 
            onClick={() => setActiveTab('notifications')}
            className={`whitespace-nowrap px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold transition-all border flex items-center gap-2 text-xs md:text-sm ${activeTab === 'notifications' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}
          >
            <Bell size={16} /> Alertas
          </button>
        </div>
      </header>

      {activeTab === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-[#111] border border-gray-800 p-6 md:p-8 rounded-3xl space-y-6 md:space-y-8">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2"><Plus className="text-blue-500" /> Detalhes</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Tipo de Conteúdo</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ContentType)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                  >
                    <option value="video">Vídeo (MP4, MKV)</option>
                    <option value="image">Imagem (JPG, PNG)</option>
                    <option value="file">Arquivo (ZIP, EXE)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Categoria</label>
                  <select 
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ContentCategory)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 flex justify-between">
                  <span>Título</span>
                  {!formTitle.trim() && <span className="text-red-500 lowercase font-medium">*obrigatório</span>}
                </label>
                <input 
                  type="text" 
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full bg-gray-900 border rounded-xl p-3 text-sm outline-none transition-all ${!formTitle.trim() && formTitle.length > 0 ? 'border-red-500' : 'border-gray-800 focus:border-blue-500'}`} 
                  placeholder="Ex: Meu novo projeto 4K" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase text-gray-500 flex justify-between">
                  <span>Descrição</span>
                  {!formDescription.trim() && <span className="text-red-500 lowercase font-medium">*obrigatório</span>}
                </label>
                <textarea 
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className={`w-full bg-gray-900 border rounded-xl p-3 text-sm outline-none min-h-[100px] md:min-h-[120px] transition-all ${!formDescription.trim() && formDescription.length > 0 ? 'border-red-500' : 'border-gray-800 focus:border-blue-500'}`} 
                  placeholder="Conte mais sobre o que está publicando..." 
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Tags</label>
                  <button 
                    onClick={handleSuggestTags}
                    disabled={isGeneratingTags || !isFormValid}
                    className="flex items-center gap-1.5 text-[9px] font-black uppercase text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-40"
                  >
                    <Sparkles size={12} className={isGeneratingTags ? 'animate-spin' : ''} /> 
                    {isGeneratingTags ? 'Analisando...' : 'Sugerir Tags com IA'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-900 rounded-xl border border-gray-800 min-h-[50px]">
                  {formTags.map(tag => (
                    <span key={tag} className="px-2 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold uppercase rounded border border-gray-700 flex items-center gap-2">
                      #{tag}
                      <button onClick={() => setFormTags(prev => prev.filter(t => t !== tag))} className="hover:text-red-500"><X size={10} /></button>
                    </span>
                  ))}
                  <input 
                    type="text" 
                    placeholder="Adicionar..." 
                    className="bg-transparent text-[10px] border-none focus:outline-none w-20 text-gray-400"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        setFormTags(prev => [...new Set([...prev, e.currentTarget.value.trim().toLowerCase()])]);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 md:space-y-8">
            <div className="bg-[#111] border border-gray-800 p-6 md:p-8 rounded-3xl space-y-6">
              <h3 className="text-lg md:text-xl font-bold flex items-center gap-2"><Globe className="text-emerald-500" /> Distribuição</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="flex items-center gap-3">
                    <Shield className="text-red-500" size={18} />
                    <span className="text-xs md:text-sm font-bold">Restrição de Idade (+18)</span>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600 rounded" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-500">Visibilidade Geográfica</label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input type="text" className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-3 text-sm focus:border-blue-500 outline-none" placeholder="Países (ex: BR, PT)" />
                    <button className="px-4 py-3 bg-gray-800 rounded-xl text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">Mundial</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-600/5 border border-blue-500/20 p-8 rounded-3xl flex flex-col items-center justify-center text-center space-y-4 border-dashed cursor-pointer hover:bg-blue-600/10 transition-all">
              <div className="w-14 h-14 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Upload size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Arraste seu arquivo aqui</p>
                <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">ou clique para navegar</p>
              </div>
            </div>

            <div className="space-y-4">
              {showSuccess && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-400 animate-in slide-in-from-bottom-2">
                  <CheckCircle2 size={18} />
                  <span className="text-xs font-bold uppercase tracking-tighter">Conteúdo enviado com sucesso para moderação!</span>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase">
                    <span>Processando Arquivo...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden border border-gray-800">
                    <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                </div>
              )}
              
              <button 
                onClick={handlePublish}
                disabled={!isFormValid || isUploading}
                className={`w-full py-4 font-black rounded-2xl transition-all shadow-xl uppercase tracking-widest text-xs md:text-sm flex items-center justify-center gap-2 ${
                  isFormValid && !isUploading 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20' 
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700 shadow-none'
                }`}
              >
                {isUploading ? 'Enviando...' : 'Publicar Agora'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'manage' && (
        <div className="bg-[#111] border border-gray-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800 bg-[#0d0d0d]">
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Conteúdo</th>
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Tipo</th>
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Stats</th>
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase text-gray-600 tracking-widest">Ações</th>
                </tr>
              </thead>
              <tbody>
                {creatorContent.length > 0 ? creatorContent.map((content) => (
                  <tr key={content.id} className="border-b border-gray-800 hover:bg-gray-800/20 transition-colors">
                    <td className="p-4 md:p-6">
                      <div className="flex items-center gap-3">
                        <img src={content.thumbnail} className="w-12 h-8 md:w-16 md:h-10 object-cover rounded-lg flex-shrink-0" />
                        <div className="overflow-hidden">
                          <p className="font-bold text-xs md:text-sm truncate">{content.title}</p>
                          <p className="text-[9px] text-gray-600 uppercase font-black">{new Date(content.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <span className="text-[9px] font-black px-2 py-1 bg-gray-900 border border-gray-800 rounded text-gray-500 uppercase tracking-tighter">
                        {content.type}
                      </span>
                    </td>
                    <td className="p-4 md:p-6">
                      <div className="flex gap-4 text-[10px] font-black">
                        <span className="flex items-center gap-1 text-blue-500/70"><BarChart2 size={12} /> {content.views}</span>
                        <span className="flex items-center gap-1 text-emerald-500/70"><Upload size={12} /> {content.downloads}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <div className="flex gap-2">
                        <button className="p-2 bg-gray-800 text-gray-500 rounded-lg hover:text-white transition-colors"><Edit3 size={14} /></button>
                        <button className="p-2 bg-red-900/10 text-red-500/60 rounded-lg hover:bg-red-900/30 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-gray-600 text-xs font-bold uppercase italic">Você ainda não publicou nada.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-[#111] border border-gray-800 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-bold flex items-center gap-2"><Bell className="text-blue-500" /> Central de Alertas</h3>
            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest hidden sm:inline">Últimos 30 dias</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {notifications.length > 0 ? notifications.map((notif) => (
              <div key={notif.id} className={`p-4 md:p-6 bg-gray-900/30 border border-gray-800 rounded-2xl flex gap-4 md:gap-6 items-start transition-all hover:border-gray-700 ${!notif.read ? 'border-l-4 border-l-blue-600' : ''}`}>
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  notif.type === 'like' ? 'bg-red-500/10 text-red-500' :
                  notif.type === 'comment' ? 'bg-blue-500/10 text-blue-500' :
                  notif.type === 'moderation' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-gray-500/10 text-gray-500'
                }`}>
                  {notif.type === 'like' && <Heart size={18} className="md:w-6 md:h-6" fill="currentColor" />}
                  {notif.type === 'comment' && <MessageCircle size={18} className="md:w-6 md:h-6" />}
                  {notif.type === 'moderation' && <ShieldAlert size={18} className="md:w-6 md:h-6" />}
                  {notif.type === 'system' && <CheckCircle2 size={18} className="md:w-6 md:h-6" />}
                </div>
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-1">
                    <div className="overflow-hidden w-full">
                      <h4 className="font-bold text-sm md:text-base truncate">{notif.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{notif.message}</p>
                    </div>
                    <span className="text-[9px] font-black text-gray-700 uppercase tracking-tighter whitespace-nowrap">
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-gray-600 text-xs font-bold uppercase border border-gray-800 rounded-3xl border-dashed">
                Não há alertas recentes no seu estúdio.
              </div>
            )}
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

export default CreatorStudio;
