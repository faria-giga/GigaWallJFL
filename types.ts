
export enum UserRole {
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  USER = 'USER'
}

export interface User {
  id: string;
  username: string; // @handle
  displayName: string;
  avatar: string;
  role: UserRole;
  age: number;
  nationality: string;
  verified: boolean;
  bio?: string;
}

export type ContentType = 'video' | 'image' | 'file';

export type ContentCategory = 
  | 'Arte Digital' 
  | 'Natureza' 
  | 'Software' 
  | 'Fotografia' 
  | 'Música' 
  | 'Educação' 
  | 'Tecnologia' 
  | 'Jogos' 
  | 'Filmes' 
  | 'Design'
  | 'Outros';

export interface Content {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  creatorId: string;
  thumbnail: string;
  url: string;
  views: number;
  likes: number;
  downloads: number;
  createdAt: string;
  tags: string[];
  category: ContentCategory;
  restrictedCountries?: string[];
  ageRestricted: boolean;
  version?: string;
  changelog?: string;
  requirements?: string;
}

export interface Comment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userHandle: string;
  text: string;
  createdAt: string;
  status: 'pending' | 'approved';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isAi?: boolean;
}

export interface AppNotification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'moderation' | 'system';
  title: string;
  message: string;
  contentId?: string;
  createdAt: string;
  read: boolean;
}
