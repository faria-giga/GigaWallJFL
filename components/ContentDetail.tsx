
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Download, 
  Heart, 
  Share2, 
  Eye, 
  MessageSquare, 
  ShieldAlert, 
  Calendar,
  Tag,
  CheckCircle2,
  Loader2,
  Send
} from 'lucide-react';
import { Content, Comment } from '../types';
import { storage } from '../services/storageService';

interface ContentDetailProps {
  content: Content;
  onBack: () => void;
}

const ContentDetail: React.FC<ContentDetailProps> & { MiniCard: any } = ({ content, onBack }) => {
  const [likes, setLikes] = useState(content.likes);
  const [isLiked, setIsLiked] = useState(storage.getIsLiked(content.id));
  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'versions'>('details');
  const [showShareToast, setShowShareToast] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    setComments(storage.getComments(content.id));
    const handleUpdate = (e: any) => {
      if (e.detail?.contentId === content.id) {
        setComments(storage.getComments(content.id));
      }
    };
    window.addEventListener('jfl_new_comment', handleUpdate);
    return () => window.removeEventListener('jfl_new_comment', handleUpdate);
  }, [content.id]);

  const handleLike = () => {
    const newState = storage.toggleLike(content.id);
    setIsLiked(newState);
    setLikes(prev => newState ? prev + 1 : prev - 1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  const handleDownload = () => {
    setDownloading(true);
    setDownloadProgress(0);
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloading(false), 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      contentId: content.id,
      userId: 'currentUser', // Simplificado
      userName: 'Você',
      userHandle: '@voce',
      text: commentText,
      createdAt: new Date().toISOString(),
      status: 'approved'
    };
    storage.addComment(content.id, newComment);
    setCommentText('');
  };

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group">
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
        <span className="font-semibold">Voltar para Início</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl relative">
            {content.type === 'video' ? (
              <div className="aspect-video bg-black flex items-center justify-center relative group">
                <img src={content.thumbnail} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center cursor-pointer">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2"></div>
                  </div>
                </div>
              </div>
            ) : (
              <img src={content.thumbnail} alt={content.title} className="w-full h-auto max-h-[600px] object-contain mx-auto" />
            )}
            
            {(showShareToast || (downloading && downloadProgress === 100)) && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-2xl animate-in fade-in slide-in-from-bottom-2">
                <CheckCircle2 size={14} /> 
                {showShareToast ? "Link copiado!" : "Download Concluído!"}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-3xl font-black">{content.title}</h1>
            <div className="flex items-center gap-3">
              <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${isLiked ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'}`}>
                <Heart size={18} fill={isLiked ? "currentColor" : "none"} /> {likes}
              </button>
              <button onClick={handleDownload} disabled={downloading} className="relative flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold shadow-lg disabled:opacity-70 overflow-hidden">
                {downloading ? <><Loader2 size={18} className="animate-spin" /> {downloadProgress}%</> : <><Download size={18} /> Baixar</>}
              </button>
              <button onClick={handleShare} className="p-2.5 bg-gray-800 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-700"><Share2 size={18} /></button>
            </div>
          </div>

          <div className="flex gap-6 border-b border-gray-800">
            {['details', 'comments', 'versions'].map((tab) => (
              (tab !== 'versions' || content.type === 'file') && (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`pb-4 px-2 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-500 hover:text-white'}`}
                >
                  {tab === 'details' ? 'Descrição' : tab === 'comments' ? `Comentários (${comments.length})` : 'Changelog'}
                </button>
              )
            ))}
          </div>

          <div className="py-4 leading-relaxed text-gray-300 min-h-[300px]">
            {activeTab === 'details' && (
              <div className="space-y-6">
                <p className="text-gray-400">{content.description}</p>
                <div className="flex flex-wrap gap-2">
                  {content.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 px-3 py-1 bg-gray-800 text-gray-400 text-[10px] font-bold uppercase rounded-lg border border-gray-700">
                      <Tag size={12} /> {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {activeTab === 'comments' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center font-bold">U</div>
                  <div className="flex-1 space-y-3">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Adicione um comentário construtivo..." 
                      className="w-full bg-[#111] border border-gray-800 rounded-2xl p-4 text-sm focus:border-blue-500 outline-none min-h-[100px] resize-none" 
                    />
                    <div className="flex justify-end">
                      <button 
                        onClick={handlePostComment}
                        disabled={!commentText.trim()}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2"
                      >
                        <Send size={14} /> Publicar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {comments.length > 0 ? [...comments].reverse().map((c) => (
                    <div key={c.id} className="p-5 bg-gray-900/30 border border-gray-800 rounded-2xl space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sm text-blue-400">{c.userName} <span className="text-gray-600 text-[10px] font-medium ml-2">{c.userHandle}</span></span>
                        <span className="text-[10px] text-gray-600 font-bold uppercase">{new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{c.text}</p>
                    </div>
                  )) : (
                    <div className="text-center py-12 text-gray-600 text-xs font-bold uppercase italic tracking-[0.2em] border border-dashed border-gray-800 rounded-3xl">
                      Nenhum comentário ainda. Seja o primeiro!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] border border-gray-800 rounded-[2rem] p-6 space-y-6 sticky top-24">
            <div className="flex items-center gap-4 pb-6 border-b border-gray-800">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 p-[2px]">
                <img src="https://picsum.photos/seed/creator/100" className="w-full h-full rounded-full object-cover border-2 border-[#111]" />
              </div>
              <div className="overflow-hidden">
                <p className="font-bold truncate text-sm">Pixel Master</p>
                <p className="text-[10px] text-blue-400 font-bold flex items-center gap-1 uppercase">Verificado <CheckCircle2 size={10} /></p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500 flex items-center gap-2 uppercase tracking-widest"><Eye size={14} /> Views</span>
                <span className="font-black">{content.views.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500 flex items-center gap-2 uppercase tracking-widest"><Download size={14} /> Downloads</span>
                <span className="font-black">{content.downloads.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-500 flex items-center gap-2 uppercase tracking-widest"><Calendar size={14} /> Data</span>
                <span className="font-black">{new Date(content.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            <button className="w-full py-3 bg-gray-900 border border-gray-800 text-gray-400 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-all">
              Seguir Criador
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ContentDetail.MiniCard = ({ content, onClick }: { content: Content, onClick: (id: string) => void }) => (
  <div onClick={() => onClick(content.id)} className="group cursor-pointer">
    <div className="aspect-video bg-[#111] rounded-2xl overflow-hidden mb-3 border border-gray-800 group-hover:border-blue-500/50 transition-all shadow-lg relative">
      <img src={content.thumbnail} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[9px] font-bold text-gray-300 uppercase">
        {content.type}
      </div>
    </div>
    <div className="px-1">
      <h3 className="font-bold text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">{content.title}</h3>
      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-1">{content.category} • {content.views.toLocaleString()} views</p>
    </div>
  </div>
);

export default ContentDetail;
