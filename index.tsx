
import React, { useState, useMemo, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ContentDetail from './components/ContentDetail';
import ChatSystem from './components/ChatSystem';
import CreatorStudio from './components/CreatorStudio';
import AdminPanel from './components/AdminPanel';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import NewsFeed from './pages/NewsFeed';
import AccessPortal from './pages/AccessPortal';
import { FAQ, PrivacyPolicy, TermsOfUse, Contact } from './pages/StaticPages';
import PlatformStats from './pages/PlatformStats';
import Archive from './pages/Archive';
import { MOCK_USERS } from './constants';
import { User, Content, ContentCategory } from './types';
import { storage } from './services/storageService';

const App = () => {
  const [currentUser] = useState<User>(MOCK_USERS[1]);
  const [activeView, setActiveView] = useState('home');
  const [selectedContentId, setSelectedContentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'Todos'>('Todos');
  const [allContent, setAllContent] = useState<Content[]>([]);

  useEffect(() => {
    setAllContent(storage.getContent());
    const handleUpdate = () => setAllContent(storage.getContent());
    window.addEventListener('jfl_new_notification', handleUpdate);
    return () => window.removeEventListener('jfl_new_notification', handleUpdate);
  }, []);

  const handleContentClick = (id: string) => {
    setSelectedContentId(id);
    setActiveView('content_detail');
  };

  const filteredContent = useMemo(() => {
    return allContent.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allContent, searchQuery, selectedCategory]);

  const renderView = () => {
    switch (activeView) {
      case 'home': 
        return (
          <Dashboard 
            onContentClick={handleContentClick} 
            filteredContent={filteredContent}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        );
      case 'videos':
      case 'images':
      case 'files':
        const typeMap: Record<string, string> = { videos: 'video', images: 'image', files: 'file' };
        const typeFiltered = filteredContent.filter(c => c.type === typeMap[activeView]);
        return (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h2 className="text-4xl font-black capitalize tracking-tighter">{activeView}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {typeFiltered.map(content => (
                <ContentDetail.MiniCard key={content.id} content={content} onClick={handleContentClick} />
              ))}
            </div>
          </div>
        );
      case 'content_detail':
        const content = allContent.find(c => c.id === selectedContentId);
        return content ? <ContentDetail content={content} onBack={() => setActiveView('home')} /> : <div>Conteúdo não encontrado.</div>;
      case 'chat': return <ChatSystem currentUser={currentUser} />;
      case 'creator_dashboard': return <CreatorStudio currentUser={currentUser} />;
      case 'admin_dashboard': return <AdminPanel currentUser={currentUser} />;
      case 'profile': return <Profile user={currentUser} onContentClick={handleContentClick} />;
      case 'settings': return <Settings />;
      case 'news': return <NewsFeed />;
      case 'access': return <AccessPortal />;
      case 'faq': return <FAQ />;
      case 'contact': return <Contact />;
      case 'privacy': return <PrivacyPolicy />;
      case 'terms': return <TermsOfUse />;
      case 'stats': return <PlatformStats />;
      case 'archive': return <Archive onContentClick={handleContentClick} />;
      default: return <Dashboard onContentClick={handleContentClick} filteredContent={filteredContent} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />;
    }
  };

  return (
    <Layout 
      currentUser={currentUser} 
      activeView={activeView} 
      setActiveView={(view) => {
        setActiveView(view);
        setSearchQuery('');
        setSelectedCategory('Todos');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
    >
      {renderView()}
    </Layout>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
