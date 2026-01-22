
import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Link as LinkIcon, 
  Github, 
  Code, 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  Key, 
  Lock, 
  Eye, 
  EyeOff, 
  Terminal,
  Database,
  ArrowUpCircle,
  Layers,
  Zap
} from 'lucide-react';
import { storage } from '../services/storageService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'hosting'>('hosting');
  
  // Repo States
  const [repoUrl, setRepoUrl] = useState(storage.getGitHubRepo());
  const [isPrivate, setIsPrivate] = useState(storage.getIsRepoPrivate());
  const [token, setToken] = useState(storage.getGitHubToken());
  const [showToken, setShowToken] = useState(false);
  
  // UI States
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFullSyncing, setIsFullSyncing] = useState(false);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'error' | 'success'}[]>([]);
  const [repoData, setRepoData] = useState<any>(null);

  const addLog = (msg: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [{ msg, type }, ...prev].slice(0, 50));
  };

  const parseGitHubUrl = (url: string) => {
    try {
      const cleanUrl = url.trim().replace(/\/$/, "");
      const match = cleanUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
      if (match) return { owner: match[1], repo: match[2] };
      return null;
    } catch (e) { return null; }
  };

  const githubRequest = async (path: string, method = 'GET', body?: any) => {
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) throw new Error("URL do Repo inválida");
    
    const headers: any = {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    };
    if (token.trim()) headers['Authorization'] = `Bearer ${token.trim()}`;

    const res = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!res.ok && res.status !== 404) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Erro ${res.status}`);
    }
    return res;
  };

  const uploadFile = async (path: string, content: string, message: string) => {
    try {
      // 1. Tentar pegar o SHA do arquivo se ele existir
      const checkRes = await githubRequest(`/contents/${path}`);
      let sha = undefined;
      if (checkRes.status === 200) {
        const data = await checkRes.json();
        sha = data.sha;
      }

      // 2. Upload (Base64)
      const base64Content = btoa(unescape(encodeURIComponent(content)));
      await githubRequest(`/contents/${path}`, 'PUT', {
        message,
        content: base64Content,
        sha
      });
      return true;
    } catch (err: any) {
      addLog(`Erro em ${path}: ${err.message}`, 'error');
      return false;
    }
  };

  const handleFullProjectSync = async () => {
    if (!token.trim()) {
      addLog("Token necessário para escrever arquivos no GitHub.", "error");
      return;
    }

    setIsFullSyncing(true);
    addLog("Iniciando CLONAGEM TOTAL do sistema para o GitHub...", "info");

    // Aqui mapeamos os arquivos que a plataforma conhece de si mesma
    // Em um ambiente real, poderíamos fetch() cada arquivo. 
    // Como estamos em um ambiente dinâmico, simulamos a lista base.
    const filesToSync = [
      { path: 'index.html', url: './index.html' },
      { path: 'index.tsx', url: './index.tsx' },
      { path: 'types.ts', url: './types.ts' },
      { path: 'constants.tsx', url: './constants.tsx' },
      { path: 'metadata.json', url: './metadata.json' },
      { path: 'manifest.json', url: './manifest.json' },
      { path: 'sw.js', url: './sw.js' },
      { path: 'services/storageService.ts', url: './services/storageService.ts' },
      { path: 'services/geminiService.ts', url: './services/geminiService.ts' },
      { path: 'components/Layout.tsx', url: './components/Layout.tsx' },
      { path: 'components/ContentCard.tsx', url: './components/ContentCard.tsx' },
      { path: 'components/ContentDetail.tsx', url: './components/ContentDetail.tsx' },
      { path: 'components/ChatSystem.tsx', url: './components/ChatSystem.tsx' },
      { path: 'components/CreatorStudio.tsx', url: './components/CreatorStudio.tsx' },
      { path: 'components/AdminPanel.tsx', url: './components/AdminPanel.tsx' },
      { path: 'pages/Dashboard.tsx', url: './pages/Dashboard.tsx' },
      { path: 'pages/Profile.tsx', url: './pages/Profile.tsx' },
      { path: 'pages/Settings.tsx', url: './pages/Settings.tsx' },
      { path: 'pages/NewsFeed.tsx', url: './pages/NewsFeed.tsx' },
      { path: 'pages/AccessPortal.tsx', url: './pages/AccessPortal.tsx' },
      { path: 'pages/Archive.tsx', url: './pages/Archive.tsx' },
      { path: 'pages/PlatformStats.tsx', url: './pages/PlatformStats.tsx' },
      { path: 'pages/StaticPages.tsx', url: './pages/StaticPages.tsx' },
    ];

    let successCount = 0;

    for (let i = 0; i < filesToSync.length; i++) {
      const file = filesToSync[i];
      addLog(`[${i + 1}/${filesToSync.length}] Processando ${file.path}...`, 'info');
      
      try {
        const response = await fetch(file.url);
        const text = await response.text();
        const success = await uploadFile(file.path, text, `Deploy total via Giga Wall JFL - ${file.path}`);
        if (success) successCount++;
      } catch (e) {
        addLog(`Falha ao ler ${file.path} localmente.`, 'error');
      }
    }

    if (successCount === filesToSync.length) {
      addLog("SISTEMA TOTALMENTE TRANSFERIDO!", "success");
      addLog("Seu GitHub agora contém o código completo da plataforma.", "success");
    } else {
      addLog(`Transferência concluída com avisos: ${successCount}/${filesToSync.length} arquivos enviados.`, "info");
    }
    setIsFullSyncing(false);
  };

  const handleConnectRepo = async () => {
    setIsVerifying(true);
    addLog("Verificando acesso...", "info");
    try {
      const res = await githubRequest('');
      if (res.ok) {
        const data = await res.json();
        setRepoData(data);
        storage.setGitHubRepo(repoUrl);
        storage.setGitHubToken(token);
        addLog("Conexão estabelecida!", "success");
      }
    } catch (err: any) {
      addLog(`Erro: ${err.message}`, "error");
    } finally { setIsVerifying(false); }
  };

  const handleSyncDataOnly = async () => {
    setIsSyncing(true);
    addLog("Sincronizando banco de dados (acervo.json)...", "info");
    const content = storage.getContent();
    const success = await uploadFile('data/acervo.json', JSON.stringify(content, null, 2), "Update acervo.json");
    if (success) addLog("Acervo sincronizado!", "success");
    setIsSyncing(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 animate-in fade-in duration-700 px-4 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 italic">
            <SettingsIcon size={36} className="text-blue-500" /> Sistema
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Gestão de hospedagem e implantação no GitHub.</p>
        </div>
        
        <div className="flex p-1 bg-gray-900/50 border border-gray-800 rounded-2xl">
          <button onClick={() => setActiveTab('general')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Geral</button>
          <button onClick={() => setActiveTab('hosting')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'hosting' ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Hospedagem</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black flex items-center gap-3"><Github /> GitHub Config</h3>
              <div className="flex bg-black border border-gray-800 p-1 rounded-xl">
                 <button onClick={() => setIsPrivate(false)} className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase ${!isPrivate ? 'bg-blue-600' : ''}`}>Público</button>
                 <button onClick={() => setIsPrivate(true)} className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase ${isPrivate ? 'bg-emerald-600' : ''}`}>Privado</button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">URL do Repositório</label>
                <div className="bg-black/40 border border-gray-800 rounded-2xl p-4 flex items-center">
                  <LinkIcon size={18} className="text-gray-600 mr-3" />
                  <input type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/usuario/repo" className="bg-transparent border-none focus:outline-none text-sm font-mono text-blue-400 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Personal Access Token</label>
                <div className="relative">
                  <input type={showToken ? "text" : "password"} value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxx" className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 text-sm font-mono text-emerald-400 outline-none focus:border-emerald-500/50" />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                  <button onClick={() => setShowToken(!showToken)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">{showToken ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
              <button onClick={handleConnectRepo} disabled={isVerifying} className="py-4 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all disabled:opacity-50">
                {isVerifying ? <RefreshCw className="animate-spin mx-auto" /> : 'Verificar Conexão'}
              </button>
              
              <button onClick={handleSyncDataOnly} disabled={!repoData || isSyncing} className="py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50">
                {isSyncing ? <RefreshCw className="animate-spin" /> : <Database size={16} />}
                Sincronizar Acervo
              </button>
            </div>

            <div className="pt-6 border-t border-gray-800">
               <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/30 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 text-white rounded-2xl">
                      <Layers size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-white">Full System Sync</h4>
                      <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">Clonar todo o código-fonte para o GitHub</p>
                    </div>
                  </div>
                  <p className="text-xs text-indigo-200/60 leading-relaxed italic">
                    Este comando transferirá todos os arquivos (.tsx, .html, .json) para o seu repositório, permitindo que você hospede a plataforma em serviços como GitHub Pages ou Vercel.
                  </p>
                  <button 
                    onClick={handleFullProjectSync}
                    disabled={!repoData || isFullSyncing}
                    className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50"
                  >
                    {isFullSyncing ? <RefreshCw className="animate-spin" /> : <Zap size={18} fill="white" />}
                    {isFullSyncing ? 'Enviando Projeto...' : 'Transferir Todo o Código'}
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black border border-gray-800 rounded-[2rem] overflow-hidden flex flex-col h-[600px] shadow-2xl">
             <div className="p-4 border-b border-gray-800 bg-gray-900/50 flex items-center gap-2">
               <Terminal size={14} className="text-blue-500" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Log de Operações</span>
             </div>
             <div className="p-4 font-mono text-[10px] space-y-2 overflow-y-auto custom-scrollbar flex-1 bg-black/50">
               {logs.length > 0 ? logs.map((log, i) => (
                 <div key={i} className={`flex gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-emerald-400' : 'text-gray-500'}`}>
                   <span className="opacity-30">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                   <span className="font-medium">{log.msg}</span>
                 </div>
               )) : <div className="text-gray-800 italic">Nenhuma operação recente.</div>}
             </div>
             <button onClick={() => setLogs([])} className="p-4 text-[9px] font-black uppercase text-gray-600 hover:text-white border-t border-gray-800">Limpar Console</button>
          </div>
        </div>
      </div>
      
      {repoData && (
        <div className="flex justify-center pt-8">
           <a href={repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-8 py-3 bg-gray-900 border border-gray-800 rounded-2xl text-xs font-bold text-gray-400 hover:text-white transition-all">
             <ArrowUpCircle size={18} /> Ver Repositório no GitHub
           </a>
        </div>
      )}
    </div>
  );
};

export default Settings;
