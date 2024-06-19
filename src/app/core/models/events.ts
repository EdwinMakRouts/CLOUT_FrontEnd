import { Post } from './post';

export interface Events {
  id: number;
  title: string;
  description?: string;
  location?: string;
  ownerId: number;
  post: Post;
  friendsId?: number[];
  createdAt?: Date;
  updatedAt?: Date;
}
