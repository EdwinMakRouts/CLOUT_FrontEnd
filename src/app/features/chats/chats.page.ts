import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonModal, NavController } from '@ionic/angular';
import { catchError, of } from 'rxjs';
import { Chat } from 'src/app/core/models/chat';
import { Following } from 'src/app/core/models/following';
import { User } from 'src/app/core/models/user';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { FollowingService } from 'src/app/core/services/following/following.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { ToastService } from 'src/app/shared/utils/toast.service';
import { format } from 'date-fns';
import { StateService } from 'src/app/core/services/state/state.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats: Chat[] = [];
  userSignal: WritableSignal<User>;
  myId: number;
  loading: boolean = false;
  allUsers: Following[] = [];

  notChatOpended: Following[] = [];
  openChat: number[] = [];
  @ViewChild(IonModal) modal!: IonModal;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private chatService: ChatService,
    private followingService: FollowingService,
    private signalsService: SignalsService,
    private stateService: StateService,
    private cdr: ChangeDetectorRef
  ) {
    this.userSignal = this.signalsService.getUserSignal();
    this.myId = this.userSignal().id;
    console.log(this.myId);
  }

  ionViewWillEnter() {
    this.getFollowing();
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loading = true;
    this.getFollowing();
  }

  goBack() {
    this.navCtrl.navigateForward(['home']);
  }

  getChats() {
    this.chatService.getChatsOfUser(this.myId).subscribe((response: any) => {
      if (response.error) {
        this.toastService.presentToast('Error al obtener los chats');
      } else {
        this.chats = response;
        console.log(this.chats);

        for (let chat of this.chats) {
          const userId_1 = chat.userId_1;
          const userId_2 = chat.userId_2;

          if (userId_1 != this.myId) {
            this.openChat.push(userId_1);
          }

          if (userId_2 != this.myId) {
            this.openChat.push(userId_2);
          }
        }

        this.notChatOpended = this.allUsers.filter(
          (f) => !this.openChat.includes(f.id) && f.id != this.myId
        );
      }
      this.loading = false;
    });
  }

  getFollowing() {
    this.followingService.getAllUsers().subscribe((response: any) => {
      if (response.error) {
        this.toastService.presentToast(
          'Error al obtener los usuarios que sigues'
        );
      } else {
        this.allUsers = response;
        console.log(this.allUsers);
      }
      this.getChats();
    });
  }

  getImage(chat: Chat) {
    const message = chat.messages[chat.messages.length - 1];

    if (message.userId == this.myId) {
      if (this.myId == chat.userId_1) {
        return this.allUsers.find((f) => f.id == chat.userId_2)?.avatar;
      }
      return this.allUsers.find((f) => f.id == chat.userId_1)?.avatar;
    } else {
      if (message.userId == chat.userId_1) {
        return this.allUsers.find((f) => f.id == chat.userId_1)?.avatar;
      }
      return this.allUsers.find((f) => f.id == chat.userId_2)?.avatar;
    }
  }

  getUsername(chat: Chat) {
    const message = chat.messages[chat.messages.length - 1];

    if (message.userId == this.myId) {
      if (this.myId == chat.userId_1) {
        return this.allUsers.find((f) => f.id == chat.userId_2)?.username;
      }
      return this.allUsers.find((f) => f.id == chat.userId_1)?.username;
    } else {
      if (message.userId == chat.userId_1) {
        return this.allUsers.find((f) => f.id == chat.userId_1)?.username;
      }
      return this.allUsers.find((f) => f.id == chat.userId_2)?.username;
    }
  }

  transformDate(value: string | Date) {
    const date = new Date(value);
    return format(date, 'dd-MM-yyyy ') + 'a las ' + format(date, 'HH:mm');
  }

  isNotified(chat: Chat) {
    if (this.myId == chat.userId_1) {
      return chat.lastConnectionUser_1
        ? chat.lastConnectionUser_1 < chat.lastMessageDate
        : true;
    } else {
      return chat.lastConnectionUser_2
        ? chat.lastConnectionUser_2 < chat.lastMessageDate
        : true;
    }
  }

  cancel() {
    this.modal.dismiss();
  }

  goToChat(chat: Chat) {
    this.navCtrl.navigateForward(['chat', chat.id]);
    this.modal.dismiss();
  }

  goToNewChat(user: Following) {
    this.stateService.setUser(user);
    this.navCtrl.navigateForward(['chat', 0]);
    this.modal.dismiss();
  }
}
