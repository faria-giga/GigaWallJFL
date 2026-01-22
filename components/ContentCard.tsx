
import React from 'react';
import { Play, Download, Heart, Eye, MoreVertical, ShieldAlert } from 'lucide-react';
import { Content } from '../types';

interface ContentCardProps {
  content: Content;
  onClick: (id: string) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onClick }) => {
  return (
    <div 
      className="group bg-[#151515] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all cursor-pointer"
      onClick={() => onClick(content.id)}
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={content.thumbnail} 
          alt={content.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          {content.type === 'video' && (
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Play size={24} fill="white" className="ml-1" />
            </div>
          )}
          {content.type === 'image' && (
            <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Eye size={24} className="text-white" />
            </div>
          )}
          {content.type === 'file' && (
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
              <Download size={24} className="text-white" />
            </div>
          )}
        </div>
        
        {content.ageRestricted && (
          <div className="absolute top-2 right-2 bg-red-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldAlert size={12} /> 18+
          </div>
        )}

        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-gray-300 font-medium">
          {content.category}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-blue-400 transition-colors">{content.title}</h3>
          <button className="text-gray-600 hover:text-white">
            <MoreVertical size={16} />
          </button>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 h-8 leading-relaxed">
          {content.description}
        </p>

        <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 border-t border-gray-800 pt-3">
          <div className="flex items-center space-x-3">
            <span className="flex items-center"><Eye size={14} className="mr-1 opacity-60" /> {content.views.toLocaleString()}</span>
            <span className="flex items-center"><Heart size={14} className="mr-1 opacity-60" /> {content.likes}</span>
          </div>
          {content.type === 'file' && (
            <span className="flex items-center text-emerald-500"><Download size={14} className="mr-1" /> {content.downloads}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
