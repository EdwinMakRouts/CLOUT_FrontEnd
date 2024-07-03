import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Chat, Message } from 'src/app/core/models/chat';
import { Following } from 'src/app/core/models/following';
import { User } from 'src/app/core/models/user';
import { ChatService } from 'src/app/core/services/chat/chat.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { StateService } from 'src/app/core/services/state/state.service';
import { ToastService } from 'src/app/shared/utils/toast.service';
import { format } from 'date-fns';
import { FollowingService } from 'src/app/core/services/following/following.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  userSignal: WritableSignal<User>;
  myId: number;

  hisUser!: Following;
  chat!: Chat;
  messages: Message[] = [];
  allUsers: Following[] = [];
  loading = false;

  commentText = '';

  constructor(
    private stateService: StateService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private chatService: ChatService,
    private signalsService: SignalsService,
    private followingService: FollowingService,
    private cdr: ChangeDetectorRef
  ) {
    this.userSignal = this.signalsService.getUserSignal();
    this.myId = this.userSignal().id;
  }

  ionViewWillEnter() {
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.loading = true;
    console.log(this.route.snapshot.paramMap.get('id'));

    if (this.route.snapshot.paramMap.get('id') == '0') {
      this.hisUser = this.stateService.getUser();
      this.loading = false;
    }

    if (this.route.snapshot.paramMap.get('id') != '0') {
      this.getInitialData();
    }
  }

  goBack() {
    this.navCtrl.navigateForward(['chat']);
  }

  goToProfile() {
    this.navCtrl.navigateForward(`/profile/name/${this.hisUser.username}`);
  }

  transformDate(value: string | Date) {
    const date = new Date(value);
    return format(date, 'dd-MM-yyyy ') + 'a las ' + format(date, 'HH:mm');
  }

  sendMessage() {
    this.chatService
      .createMessage(this.myId, this.hisUser.id, this.commentText)
      .subscribe((res: any) => {
        if (res.error) {
          this.toastService.presentToast('Error al enviar el mensaje');
        } else {
          if (this.route.snapshot.paramMap.get('id') != '0') location.reload();

          if (this.route.snapshot.paramMap.get('id') == '0')
            this.navCtrl.navigateForward([`chat/${res.chat.id}`]);
        }
      });
  }

  getInitialData() {
    this.followingService.getAllUsers().subscribe((response: any) => {
      if (response.error) {
        this.toastService.presentToast(
          'Error al obtener los usuarios que sigues'
        );
      } else {
        this.allUsers = response;
        this.getChat();
      }
    });
  }

  getChat() {
    this.chatService.getChatsOfUser(this.myId).subscribe((response: any) => {
      if (response.error) {
        this.toastService.presentToast('Error al obtener los chats');
      } else {
        this.chat = response.find(
          (chat: Chat) =>
            chat.id === Number(this.route.snapshot.paramMap.get('id'))
        );
        this.messages = this.chat.messages;
        this.getUser();
        this.loading = false;
        this.updateLastConnection();
      }
    });
  }

  getUser() {
    const user = this.allUsers.find(
      (f) =>
        f.id ==
        (this.chat.userId_1 == this.myId
          ? this.chat.userId_2
          : this.chat.userId_1)
    ) as Following;
    this.hisUser = user;
  }

  disableButton() {
    return this.commentText === '';
  }

  private updateLastConnection() {
    this.chatService
      .updateLastConnection(this.myId, this.chat.id)
      .subscribe((response: any) => {
        if (response.error) {
          this.toastService.presentToast('Error al actualizar la conexión');
        }
        console.log('Actualizado con exito');
      });
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.commentText.trim() !== '') {
      this.sendMessage();
    }
  }
}
