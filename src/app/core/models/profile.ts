export interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  pronouns?: string;
  description?: string;
  isPrivate?: boolean;
  instagram?: string;
  twitter?: string;
  pinterest?: string;
  avatar?: string;
  height?: number;
  weight?: number;
  bornDate: Date;
  age: number;
  createdAt: string;
  updatedAt: string;
}
