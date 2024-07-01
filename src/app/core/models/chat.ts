export interface Chat {
  id: number;
  messages: Message[];
  lastMessageDate: Date;
  userId_1: number;
  lastConnectionUser_1?: Date;
  userId_2: number;
  lastConnectionUser_2?: Date;
}

export interface Message {
  id: number;
  message: string;
  userId: number;
  createdAt: Date;
}
