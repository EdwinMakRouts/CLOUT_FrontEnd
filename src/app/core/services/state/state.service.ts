import { Injectable } from '@angular/core';
import { Chat } from '../../models/chat';
import { Following } from '../../models/following';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  user!: Following;
  refresh = false;

  constructor() {}

  setUser(user: Following) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
