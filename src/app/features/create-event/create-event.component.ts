import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Following } from 'src/app/core/models/following';
import { EventService } from 'src/app/core/services/events/events.service';
import { ToastService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.scss'],
})
export class CreateEventComponent implements OnInit {
  @Input() data: any;
  @Output() notifyParent: EventEmitter<string> = new EventEmitter<string>();

  thereIsEvent!: boolean;
  postId!: number;
  eventId!: number;
  eventName!: string;
  eventDescription!: string;
  eventLocality!: string;
  eventFriends: number[] = [];

  following: Following[] = [];

  constructor(
    private eventService: EventService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    console.log(this.data);
    this.thereIsEvent = this.data.thereIsEvent;
    this.following = this.data.following;

    if (this.thereIsEvent) {
      this.eventId = this.data.eventId;
      this.eventName = this.data.eventName;
      this.eventDescription = this.data.eventDescription;
      this.eventLocality = this.data.eventLocality;
      this.eventFriends = this.data.eventFriends.map(Number);
    } else {
      this.postId = this.data.postId;
    }
  }

  confirm() {
    if (this.thereIsEvent) {
      this.eventService
        .editEvent(
          this.eventId,
          this.eventName,
          this.eventDescription,
          this.eventLocality,
          this.eventFriends
        )
        .subscribe((res) => {
          if (res) {
            this.notifyParent.emit('Edited/Created');
          } else {
            this.toastService.presentToast('Error al editar evento');
          }
        });
    } else {
      this.eventService
        .createEvent(
          this.postId,
          this.eventName,
          this.eventDescription,
          this.eventLocality,
          this.eventFriends
        )
        .subscribe((res) => {
          if (res) {
            this.notifyParent.emit('Edited/Created');
          } else {
            this.toastService.presentToast('Error al crear evento');
          }
        });
    }
  }

  cancel() {
    this.notifyParent.emit('Canceled');
  }

  selectUser(user: any) {
    const id = user.id;
    if (this.eventFriends.includes(id)) {
      this.eventFriends = this.eventFriends.filter((id) => id !== user.id);
    } else {
      this.eventFriends.push(id);
    }
  }
}
