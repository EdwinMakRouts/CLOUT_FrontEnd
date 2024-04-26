import { Component, OnInit, WritableSignal } from '@angular/core';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/core/models/user';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { ToastService } from 'src/app/shared/utils/toast.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  currentEvents: any[] = [];
  userSignal: WritableSignal<any>;

  constructor(
    private navCtrl: NavController,
    private signalsService: SignalsService,
    private toastService: ToastService,
    private userService: UserService
  ) {
    this.userSignal = this.signalsService.getUserSignal();
  }

  ngOnInit() {
    const user = this.userSignal();

    this.userService
      .getAllUsers()
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response: any) => {
        console.log(response);
        if (response.error) {
          this.toastService.presentToast(response.error);
        } else {
          this.currentEvents = response;
          this.currentEvents = this.currentEvents.filter(
            (u) => u.username !== user.username
          );
        }
      });
  }

  async searchUser(event: any) {
    const user = this.userSignal();
    let query = String(event.target.value);
    console.log(query);
    console.log(query.length);

    if (query.length > 0) {
      if (query == '@') return;
      if (query.startsWith('@')) {
        query = query.substring(1);
      }

      // Hacer la llamada
      this.userService
        .matchUsernames(query)
        .pipe(
          catchError((error) => {
            return of(error);
          })
        )
        .subscribe((response: any) => {
          console.log(response);
          if (response.error) {
            this.toastService.presentToast(response.error);
          } else {
            this.currentEvents = response;
            this.currentEvents = this.currentEvents.filter(
              (u) => u.username !== user.username
            );
            this.currentEvents.forEach((element) => {
              element.profile = {
                avatar: element.avatar,
              };
            });
          }
        });
    } else {
      // Hacer la llamada que traiga a todos los ususarios
      this.userService
        .getAllUsers()
        .pipe(
          catchError((error) => {
            return of(error);
          })
        )
        .subscribe((response: any) => {
          console.log(response);
          if (response.error) {
            this.toastService.presentToast(response.error);
          } else {
            this.currentEvents = response;
            this.currentEvents = this.currentEvents.filter(
              (u) => u.username !== user.username
            );
          }
        });
    }
  }

  async goToOtherUserProfile(username: string) {
    this.navCtrl.navigateForward(`/profile/name/${username}`);
  }
}
