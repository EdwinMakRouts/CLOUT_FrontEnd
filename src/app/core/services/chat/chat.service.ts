import { Injectable } from '@angular/core';
import { ChatRepository } from '../../repository/chat/chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private repo: ChatRepository) {}

  getChatsOfUser(userId: number) {
    return this.repo.getChatsOfUser(userId);
  }

  createMessage(myId: number, hisId: number, message: string) {
    return this.repo.createMessage(myId, hisId, message);
  }

  deleteMessage(messageId: number) {
    return this.repo.deleteMessage(messageId);
  }

  updateLastConnection(userId: number, chatId: number) {
    return this.repo.updateLastConnection(userId, chatId);
  }

  isThereNewMessagesInChat(userId: number, chatId?: number) {
    return this.repo.isThereNewMessagesInChat(userId, chatId);
  }

  sendMessageToChatPDF(message: string) {
    return this.repo.sendMessageToChatPDF(message);
  }
}
