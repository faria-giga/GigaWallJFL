
import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Link as LinkIcon, 
  Github, 
  Code, 
  RefreshCw, 
  CheckCircle2, 
  Lock, 
  Eye, 
  EyeOff, 
  Terminal,
  Database,
  ArrowUpCircle,
  Layers,
  Zap,
  Smartphone,
  Cpu,
  Package,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileCode,
  FileText,
  Play,
  X,
  AlertCircle
} from 'lucide-react';
import { storage } from '../services/storageService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'hosting' | 'mobile'>('hosting');
  
  // Repo States
  const [repoUrl, setRepoUrl] = useState(storage.getGitHubRepo());
  const [isPrivate, setIsPrivate] = useState(storage.getIsRepoPrivate());
  const [token, setToken] = useState(storage.getGitHubToken());
  const [showToken, setShowToken] = useState(false);
  
  // UI States
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFullSyncing, setIsFullSyncing] = useState(false);
  const [isBuildingApk, setIsBuildingApk] = useState(false);
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
    
    if (!res.ok && res.status !== 404 && res.status !== 204) {
      const errorData = await res.json();
      throw new Error(errorData.message || `Erro ${res.status}`);
    }
    return res;
  };

  const uploadFile = async (path: string, content: string, message: string) => {
    try {
      const checkRes = await githubRequest(`/contents/${path}`);
      let sha = undefined;
      if (checkRes.status === 200) {
        const data = await checkRes.json();
        sha = data.sha;
      }
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

    const githubWorkflow = `
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

    const androidWorkflow = `
name: Build Android APK
on:
  workflow_dispatch:
  repository_dispatch:
    types: [build-apk]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Build Android APK
        uses: pwa-builder/pwa-starter-action@v1.3
        with:
          pwa-url: "https://\${{ github.repository_owner }}.github.io/\${{ github.event.repository.name }}/"
          android-package-id: "com.jfl.gigawall"
          android-app-name: "Giga Wall JFL"
      - name: Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: giga-wall-apk
          path: ./*.apk
`;

    const readmeMd = `# Giga Wall JFL\n\nPlataforma digital independente.\n\n## Como gerar o APK\n\n1. Ative o **GitHub Pages** nas configurações do repo.\n2. Vá em **Actions** > **Build Android APK**.\n3. Clique em **Run workflow**.`;

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
      { path: '.github/workflows/deploy.yml', content: githubWorkflow },
      { path: '.github/workflows/android-apk.yml', content: androidWorkflow },
      { path: 'README.md', content: readmeMd },
      { path: 'data/acervo.json', content: JSON.stringify(storage.getContent(), null, 2) }
    ];

    let successCount = 0;
    for (let i = 0; i < filesToSync.length; i++) {
      const file = filesToSync[i];
      addLog(`[${i + 1}/${filesToSync.length}] Enviando ${file.path}...`, 'info');
      try {
        let contentToUpload = "";
        if ('content' in file) {
          contentToUpload = file.content;
        } else {
          const response = await fetch(file.url);
          contentToUpload = await response.text();
        }
        const success = await uploadFile(file.path, contentToUpload, `Fix build: update to pwa-starter-action - ${file.path}`);
        if (success) successCount++;
      } catch (e) { addLog(`Falha em ${file.path}`, 'error'); }
    }

    if (successCount === filesToSync.length) {
      addLog("SISTEMA SINCRONIZADO COM ACTIONS CORRIGIDAS!", "success");
    } else {
      addLog(`Sync parcial: ${successCount}/${filesToSync.length} arquivos enviados.`, "info");
    }
    setIsFullSyncing(false);
  };

  const handleTriggerApkBuild = async () => {
    setIsBuildingApk(true);
    addLog("Disparando build corrigida no GitHub...", "info");
    try {
      await githubRequest('/dispatches', 'POST', {
        event_type: 'build-apk'
      });
      addLog("Build iniciada! Verifique a aba 'Actions' no GitHub.", "success");
    } catch (err: any) {
      addLog(`Erro: ${err.message}`, "error");
    } finally {
      setIsBuildingApk(false);
    }
  };

  const handleConnectRepo = async () => {
    setIsVerifying(true);
    try {
      const res = await githubRequest('');
      if (res.ok) {
        const data = await res.json();
        setRepoData(data);
        storage.setGitHubRepo(repoUrl);
        storage.setGitHubToken(token);
        addLog("Conexão estabelecida!", "success");
      }
    } catch (err: any) { addLog(`Erro: ${err.message}`, "error"); }
    finally { setIsVerifying(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 px-4 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 italic">
            <SettingsIcon size={36} className="text-blue-500" /> Sistema
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Gestão técnica e distribuição nativa.</p>
        </div>
        
        <div className="flex p-1 bg-gray-900/50 border border-gray-800 rounded-2xl">
          <button onClick={() => setActiveTab('general')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'general' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>Geral</button>
          <button onClick={() => setActiveTab('hosting')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'hosting' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>Hospedagem</button>
          <button onClick={() => setActiveTab('mobile')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${activeTab === 'mobile' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500'}`}>Mobile & APK</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'hosting' && (
            <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl animate-in slide-in-from-left-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-3 text-white"><Github /> GitHub Config</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">URL do Repositório</label>
                  <input type="text" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} placeholder="https://github.com/usuario/repo" className="w-full bg-black/40 border border-gray-800 rounded-2xl p-4 text-sm font-mono text-blue-400 focus:outline-none" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">PAT Token</label>
                  <div className="relative">
                    <input type={showToken ? "text" : "password"} value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxx" className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 px-4 text-sm font-mono text-emerald-400 outline-none" />
                    <button onClick={() => setShowToken(!showToken)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">{showToken ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleConnectRepo} disabled={isVerifying} className="py-4 bg-white text-black font-black rounded-2xl uppercase text-[11px] disabled:opacity-50">
                  {isVerifying ? <RefreshCw className="animate-spin mx-auto" /> : 'Verificar Conexão'}
                </button>
                <button onClick={handleFullProjectSync} disabled={!repoData || isFullSyncing} className="py-4 bg-blue-600 text-white font-black rounded-2xl uppercase text-[11px] flex items-center justify-center gap-3 disabled:opacity-50">
                  {isFullSyncing ? <RefreshCw className="animate-spin" /> : <Zap size={18} fill="white" />}
                  Sincronizar & Corrigir Actions
                </button>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-10 space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10 text-emerald-500"><Smartphone size={160} /></div>
                
                <h3 className="text-2xl font-black flex items-center gap-3 text-white"><Package className="text-emerald-500" /> APK Corrigido</h3>
                
                <div className="bg-amber-900/10 border border-amber-500/20 p-6 rounded-3xl flex gap-4 items-start">
                   <AlertCircle className="text-amber-500 flex-shrink-0" />
                   <div className="space-y-1">
                      <p className="text-xs font-black text-white">Importante!</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">
                         O build falhou porque a Action `pwa-auth` não existia. Atualizamos o sistema para usar a **pwa-starter-action@v1.3**. 
                         É obrigatório clicar em <strong>"Sincronizar & Corrigir"</strong> na aba Hospedagem antes de gerar o APK novamente.
                      </p>
                   </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/20 border border-emerald-500/30 p-8 rounded-3xl space-y-6 relative z-10">
                   <button 
                    onClick={handleTriggerApkBuild}
                    disabled={!repoData || isBuildingApk}
                    className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase text-xs flex items-center justify-center gap-3 shadow-xl disabled:opacity-50 hover:bg-emerald-500 transition-all"
                   >
                     {isBuildingApk ? <RefreshCw className="animate-spin" /> : <Cpu size={18} />}
                     Gerar Novo APK (Correção Ativada)
                   </button>
                   <p className="text-center text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest">
                     Isso enviará o sinal de build para o script corrigido no seu repositório.
                   </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-black border border-gray-800 rounded-[2.5rem] overflow-hidden flex flex-col h-[650px] shadow-2xl">
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
               )) : <div className="text-gray-800 italic text-center py-20">Nenhuma operação recente.</div>}
             </div>
             <button onClick={() => setLogs([])} className="p-4 text-[9px] font-black uppercase text-gray-600 hover:text-white border-t border-gray-800">Limpar Console</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
