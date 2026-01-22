
import { Content, AppNotification, ChatMessage, Comment } from '../types';
import { MOCK_CONTENT, MOCK_NOTIFICATIONS } from '../constants';

const CONTENT_KEY = 'jfl_content_store';
const NOTIF_KEY = 'jfl_notif_store';
const LIKES_KEY = 'jfl_user_likes';
const CHAT_KEY = 'jfl_chat_history';
const COMMENTS_KEY = 'jfl_content_comments';
const REPO_KEY = 'jfl_github_repo';
const REPO_PRIVATE_KEY = 'jfl_github_is_private';
const REPO_TOKEN_KEY = 'jfl_github_token';

export const storage = {
  getContent: (): Content[] => {
    const stored = localStorage.getItem(CONTENT_KEY);
    return stored ? JSON.parse(stored) : MOCK_CONTENT;
  },
  saveContent: (content: Content[]) => {
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  },
  addContent: (newItem: Content) => {
    const current = storage.getContent();
    const updated = [newItem, ...current];
    storage.saveContent(updated);
    storage.addNotification({
      id: Date.now().toString(),
      userId: newItem.creatorId,
      type: 'system',
      title: 'Upload Concluído',
      message: `Seu conteúdo "${newItem.title}" foi publicado com sucesso.`,
      createdAt: new Date().toISOString(),
      read: false
    });
  },
  getComments: (contentId: string): Comment[] => {
    const stored = localStorage.getItem(`${COMMENTS_KEY}_${contentId}`);
    return stored ? JSON.parse(stored) : [];
  },
  addComment: (contentId: string, comment: Comment) => {
    const comments = storage.getComments(contentId);
    localStorage.setItem(`${COMMENTS_KEY}_${contentId}`, JSON.stringify([...comments, comment]));
    window.dispatchEvent(new CustomEvent('jfl_new_comment', { detail: { contentId } }));
  },
  getNotifications: (userId: string): AppNotification[] => {
    const stored = localStorage.getItem(NOTIF_KEY);
    const all = stored ? JSON.parse(stored) : MOCK_NOTIFICATIONS;
    return all.filter((n: AppNotification) => n.userId === userId);
  },
  addNotification: (notif: AppNotification) => {
    const stored = localStorage.getItem(NOTIF_KEY);
    const all = stored ? JSON.parse(stored) : MOCK_NOTIFICATIONS;
    localStorage.setItem(NOTIF_KEY, JSON.stringify([notif, ...all]));
    window.dispatchEvent(new CustomEvent('jfl_new_notification'));
  },
  toggleLike: (contentId: string): boolean => {
    const likes = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
    const index = likes.indexOf(contentId);
    let isLiked = false;
    if (index > -1) {
      likes.splice(index, 1);
    } else {
      likes.push(contentId);
      isLiked = true;
    }
    localStorage.setItem(LIKES_KEY, JSON.stringify(likes));
    return isLiked;
  },
  getIsLiked: (contentId: string): boolean => {
    const likes = JSON.parse(localStorage.getItem(LIKES_KEY) || '[]');
    return likes.includes(contentId);
  },
  getChatHistory: (): ChatMessage[] => {
    const stored = localStorage.getItem(CHAT_KEY);
    return stored ? JSON.parse(stored) : [];
  },
  saveChatMessage: (msg: ChatMessage) => {
    const history = storage.getChatHistory();
    localStorage.setItem(CHAT_KEY, JSON.stringify([...history, msg]));
  },
  clearChat: () => {
    localStorage.removeItem(CHAT_KEY);
  },
  // GitHub Integration
  getGitHubRepo: () => localStorage.getItem(REPO_KEY) || '',
  setGitHubRepo: (url: string) => localStorage.setItem(REPO_KEY, url),
  getIsRepoPrivate: () => localStorage.getItem(REPO_PRIVATE_KEY) === 'true',
  setIsRepoPrivate: (isPrivate: boolean) => localStorage.setItem(REPO_PRIVATE_KEY, String(isPrivate)),
  getGitHubToken: () => localStorage.getItem(REPO_TOKEN_KEY) || '',
  setGitHubToken: (token: string) => localStorage.setItem(REPO_TOKEN_KEY, token)
};
