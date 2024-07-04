import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';

@Injectable({
  providedIn: 'root',
})
export class ChatRepository extends Repository {
  constructor(injector: Injector) {
    super(injector);
  }

  getChatsOfUser(userId: number) {
    return this.doRequest('get', `/chat/${userId}`);
  }

  createMessage(myId: number, hisId: number, message: string) {
    return this.doRequest('post', `/chat/`, {
      myId: myId,
      hisId: hisId,
      message: message,
    });
  }

  deleteMessage(messageId: number) {
    return this.doRequest('delete', `/chat/${messageId}`);
  }

  updateLastConnection(userId: number, chatId: number) {
    return this.doRequest('put', `/chat/${userId}/${chatId}`);
  }

  isThereNewMessagesInChat(userId: number, chatId?: number) {
    if (!chatId) return this.doRequest('get', `/chat/${userId}`);

    return this.doRequest('get', `/chat/${userId}/${chatId}`);
  }

  sendMessageToChatPDF(message: string) {
    return this.doRequest('post', `/chat/chat`, {
      message: message,
    });
  }
}
