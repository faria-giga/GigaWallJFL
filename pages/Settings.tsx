
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
  // Fix: Adding missing 'X' icon from lucide-react
  X
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
      - name: Build PWA to APK
        uses: pwa-builder/pwa-auth@v1.1
        with:
          # Configurações básicas para TWA
          pwa-url: "https://\${{ github.repository_owner }}.github.io/\${{ github.event.repository.name }}/"
          android-package-id: "com.jfl.gigawall"
          android-app-name: "Giga Wall JFL"
      - name: Upload APK
        uses: actions/upload-artifact@v4
        with:
          name: giga-wall-apk
          path: ./*.apk
`;

    const readmeMd = `# Giga Wall JFL\n\nPlataforma digital independente para publicação, gestão e distribuição de conteúdos multimédia e arquivos digitais.\n\n## Como executar\n\nEste projeto é um PWA estático. Basta abrir o \`index.html\` em um servidor web.\n\n## GitHub Actions\n\n- **Deploy**: Automático via GitHub Pages.\n- **Android APK**: Vá na aba 'Actions' e execute o workflow 'Build Android APK' para gerar seu arquivo instalável.`;

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
        
        const success = await uploadFile(file.path, contentToUpload, `Deploy total via Giga Wall JFL - ${file.path}`);
        if (success) successCount++;
      } catch (e) { addLog(`Falha em ${file.path}`, 'error'); }
    }

    if (successCount === filesToSync.length) {
      addLog("SISTEMA SINCRONIZADO E CONFIGURADO PARA APK!", "success");
    } else {
      addLog(`Concluído com avisos: ${successCount}/${filesToSync.length} arquivos enviados.`, "info");
    }
    setIsFullSyncing(false);
  };

  const handleTriggerApkBuild = async () => {
    setIsBuildingApk(true);
    addLog("Solicitando geração de APK ao GitHub Actions...", "info");
    try {
      await githubRequest('/dispatches', 'POST', {
        event_type: 'build-apk'
      });
      addLog("Build solicitada com sucesso!", "success");
      addLog("Vá para a aba 'Actions' do seu repositório para acompanhar o progresso.", "info");
    } catch (err: any) {
      addLog(`Erro ao disparar build: ${err.message}`, "error");
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
    <div className="max-w-5xl mx-auto space-y-12 py-10 animate-in fade-in duration-700 px-4 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black flex items-center gap-4 italic">
            <SettingsIcon size={36} className="text-blue-500" /> Sistema
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Gestão técnica e distribuição nativa do Giga Wall.</p>
        </div>
        
        <div className="flex p-1 bg-gray-900/50 border border-gray-800 rounded-2xl">
          <button onClick={() => setActiveTab('general')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'general' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}>Geral</button>
          <button onClick={() => setActiveTab('hosting')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'hosting' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>Hospedagem</button>
          <button onClick={() => setActiveTab('mobile')} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'mobile' ? 'bg-emerald-600 text-white shadow-lg' : 'text-gray-500'}`}>Mobile & APK</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {activeTab === 'hosting' && (
            <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl animate-in slide-in-from-left-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black flex items-center gap-3 text-white"><Github /> GitHub Config</h3>
                <div className="flex bg-black border border-gray-800 p-1 rounded-xl">
                   <button onClick={() => setIsPrivate(false)} className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase ${!isPrivate ? 'bg-blue-600 text-white' : 'text-gray-500'}`}>Público</button>
                   <button onClick={() => setIsPrivate(true)} className={`px-4 py-1 rounded-lg text-[9px] font-black uppercase ${isPrivate ? 'bg-emerald-600 text-white' : 'text-gray-500'}`}>Privado</button>
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
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">PAT Token</label>
                  <div className="relative">
                    <input type={showToken ? "text" : "password"} value={token} onChange={(e) => setToken(e.target.value)} placeholder="ghp_xxxxxxxxxxxx" className="w-full bg-black/40 border border-gray-800 rounded-2xl py-4 pl-12 text-sm font-mono text-emerald-400 outline-none focus:border-emerald-500/50" />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                    <button onClick={() => setShowToken(!showToken)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600">{showToken ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={handleConnectRepo} disabled={isVerifying} className="py-4 bg-white text-black font-black rounded-2xl uppercase tracking-widest text-[11px] hover:bg-gray-200 transition-all disabled:opacity-50">
                  {isVerifying ? <RefreshCw className="animate-spin mx-auto" /> : 'Verificar Conexão'}
                </button>
                <button 
                  onClick={handleFullProjectSync}
                  disabled={!repoData || isFullSyncing}
                  className="py-4 bg-blue-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                  {isFullSyncing ? <RefreshCw className="animate-spin" /> : <Zap size={18} fill="white" />}
                  {isFullSyncing ? 'Enviando...' : 'Sincronizar Tudo (Deploy)'}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
              <div className="bg-[#111] border border-gray-800 rounded-[2.5rem] p-10 space-y-8 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-10 opacity-10 rotate-12 text-emerald-500">
                  <Smartphone size={160} />
                </div>
                
                <div className="relative z-10">
                  <h3 className="text-2xl font-black flex items-center gap-3 text-white"><Package className="text-emerald-500" /> APK no GitHub Actions</h3>
                  <p className="text-gray-400 text-sm mt-2 leading-relaxed italic">
                    Gere seu APK automaticamente nos servidores do GitHub sem precisar instalar nada no seu computador.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="p-6 bg-black/40 border border-gray-800 rounded-3xl space-y-4">
                    <div className="flex items-center gap-3 text-blue-400 font-black text-xs uppercase tracking-widest">
                      <ShieldCheck size={16} /> Status Integração
                    </div>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-500">GitHub Conectado</span>
                        {repoData ? <CheckCircle2 size={14} className="text-emerald-500" /> : <X size={14} className="text-red-500" />}
                      </li>
                      <li className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-500">Workflow de APK</span>
                        <CheckCircle2 size={14} className="text-emerald-500 opacity-50" />
                      </li>
                      <li className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-gray-500">Permissão Write</span>
                        {token ? <CheckCircle2 size={14} className="text-emerald-500" /> : <X size={14} className="text-red-500" />}
                      </li>
                    </ul>
                  </div>

                  <div className="p-6 bg-emerald-900/10 border border-emerald-500/20 rounded-3xl flex flex-col justify-center gap-3">
                    <h4 className="text-sm font-black text-white">Geração Automática</h4>
                    <p className="text-[10px] text-emerald-400/70 font-bold uppercase tracking-widest leading-relaxed">
                      Utilizamos o PWABuilder Action para converter o seu site em um binário Android assinado.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600/10 to-emerald-900/20 border border-emerald-500/30 p-8 rounded-3xl space-y-6 relative z-10">
                   <div className="flex items-center gap-4">
                     <div className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg">
                       <Play size={20} fill="white" />
                     </div>
                     <div>
                       <h4 className="font-black text-white">Disparar Build Remota</h4>
                       <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest">Execute o pipeline de compilação agora</p>
                     </div>
                   </div>
                   
                   <button 
                    onClick={handleTriggerApkBuild}
                    disabled={!repoData || isBuildingApk}
                    className="w-full py-5 bg-emerald-600 text-white font-black rounded-2xl uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50"
                   >
                     {isBuildingApk ? <RefreshCw className="animate-spin" /> : <Cpu size={18} />}
                     {isBuildingApk ? 'Processando Solicitação...' : 'Gerar APK no GitHub'}
                   </button>
                   
                   <p className="text-center text-[9px] text-emerald-500/60 font-bold uppercase tracking-widest">
                     Após disparar, seu APK aparecerá como 'Artifact' na aba Actions do GitHub.
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
