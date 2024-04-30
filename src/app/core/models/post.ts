import { User } from './user';

export interface Post {
  id: number;
  text: string;
  image: string;
  likes: number;
  username: string;
}

export interface PostCreated {
  text: string;
  image: string;
  user: PostedBy;
  likes: number;
  id: number;
  createdAt: string;
  updatedAt: string;
}
export interface PostedBy {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostLiked {
  id: number;
  text: string;
  image: string;
  likes: number;
  user: User;
  hasLiked: boolean;
}

export interface Comments {
  id: number;
  username: string;
  avatar: string;
  text: String;
  createdAt: Date;
  updatedAt: Date;
}
