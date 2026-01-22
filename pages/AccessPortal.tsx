
import React, { useState } from 'react';
import { Share2, Smartphone, Globe, QrCode, Copy, CheckCircle2, Download, ShieldCheck } from 'lucide-react';

const AccessPortal = () => {
  const [copied, setCopied] = useState(false);
  const platformUrl = "https://gigawall.jfl.portal"; // URL Simulada

  const copyToClipboard = () => {
    navigator.clipboard.writeText(platformUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-12 animate-in fade-in duration-700 px-4">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-blue-600/10 rounded-full text-blue-500 mb-2">
          <Globe size={40} />
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter">Portal de Acesso</h1>
        <p className="text-gray-500 max-w-2xl mx-auto font-medium">
          O Giga Wall JFL é uma rede independente. Compartilhe o acesso com sua comunidade ou instale como um aplicativo nativo.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card de Compartilhamento */}
        <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full"></div>
          <h3 className="text-2xl font-black flex items-center gap-3">
            <Share2 className="text-blue-500" /> Link Direto
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Use este link para convidar novos colaboradores ou acessar de qualquer navegador no mundo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-black/40 border border-gray-800 rounded-2xl px-6 py-4 font-mono text-sm text-blue-400 flex items-center overflow-hidden">
              <span className="truncate">{platformUrl}</span>
            </div>
            <button 
              onClick={copyToClipboard}
              className={`px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20'}`}
            >
              {copied ? <><CheckCircle2 size={16} /> Copiado</> : <><Copy size={16} /> Copiar</>}
            </button>
          </div>

          <div className="pt-6 border-t border-gray-800/50 flex items-center gap-6">
            <div className="p-4 bg-white rounded-2xl">
              {/* QR Code Simulado com Lucide para estética */}
              <QrCode size={100} className="text-black" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-sm">QR Code de Acesso</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Aponte a câmera para entrar</p>
            </div>
          </div>
        </div>

        {/* Card PWA / Mobile */}
        <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-3xl rounded-full"></div>
          <h3 className="text-2xl font-black flex items-center gap-3">
            <Smartphone className="text-purple-500" /> Modo Aplicativo
          </h3>
          <p className="text-sm text-gray-400 leading-relaxed">
            Instale o Giga Wall na sua tela de início para uma experiência mais rápida, estável e com acesso offline.
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-4 p-5 bg-gray-900/40 rounded-2xl border border-gray-800">
              <div className="p-2 bg-gray-800 rounded-xl text-purple-400 flex-shrink-0">
                <Download size={18} />
              </div>
              <div>
                <p className="text-xs font-bold mb-1">Passo 1: Instalação</p>
                <p className="text-[10px] text-gray-500 font-medium">No navegador, clique em "Instalar App" ou "Adicionar à Tela de Início".</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-gray-900/40 rounded-2xl border border-gray-800">
              <div className="p-2 bg-gray-800 rounded-xl text-emerald-400 flex-shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-xs font-bold mb-1">Passo 2: Autonomia</p>
                <p className="text-[10px] text-gray-500 font-medium">Uma vez instalado, o app funcionará de forma independente do navegador.</p>
              </div>
            </div>
          </div>

          <button className="w-full py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl hover:bg-white/10 transition-all uppercase tracking-[0.2em] text-xs">
            Guia Completo de Instalação
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-900/10 to-transparent border border-blue-500/10 rounded-[3rem] p-12 text-center space-y-6">
        <h3 className="text-2xl font-black">Por que uma plataforma independente?</h3>
        <p className="text-sm text-gray-500 max-w-3xl mx-auto leading-relaxed">
          Ao contrário das redes sociais tradicionais, o Giga Wall JFL não vende seus dados. 
          O acesso é restrito aos membros da comunidade, garantindo que o conteúdo seja 
          distribuído sem algoritmos de manipulação ou anúncios invasivos.
        </p>
      </div>
    </div>
  );
};

export default AccessPortal;
