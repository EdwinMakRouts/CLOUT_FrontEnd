import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { max } from 'cypress/types/lodash';
import { catchError, of } from 'rxjs';
import { Post } from 'src/app/core/models/post';
import { PostService } from 'src/app/core/services/post/post.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { ToastService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.page.html',
  styleUrls: ['./my-posts.page.scss'],
})
export class MyPostsPage implements OnInit {
  loading: boolean = true;
  posts: Post[] = [];

  constructor(
    private navCtrl: NavController,
    private postService: PostService,
    private signalsService: SignalsService,
    private toastService: ToastService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.getPosts();
  }

  goBack() {
    this.navCtrl.navigateBack(['profile', 'settings']);
  }

  goToOutfit(id: number) {
    this.navCtrl.navigateForward(['post', id]);
  }

  getPosts() {
    this.postService
      .getPosts(this.signalsService.getUserSignal()().id)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response) => {
        if (response.error) {
          this.toastService.presentToast(response.error.message);
          this.loading = false;
          return;
        }

        console.log(response);
        this.posts = response;
        this.loading = false;
      });
  }

  async editPost(post: Post) {
    const alert = await this.alertController.create({
      header: 'Escribe la información que quieres cambiar',
      inputs: [
        {
          name: 'input1',
          type: 'text',
          placeholder: 'descripción',
          attributes: {
            maxlength: 255,
          },
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //Do nothing
          },
        },
        {
          text: 'Acceptar',
          handler: (alertData: any) => {
            let descripción = alertData.input1;

            if (descripción.length > 255) {
              this.toastService.presentToast(
                'La descripción no puede ser mayor a 255 caracteres'
              );
              return;
            }

            //realizar la llamada a la api para editar la cuenta
            this.postService
              .editPost(post.id, alertData.input1)
              .pipe(
                catchError((error) => {
                  return of(error);
                })
              )
              .subscribe((response) => {
                if (response.error) {
                  this.toastService.presentToast(response.error.message);
                  return;
                }

                console.log(response);
                this.getPosts();
              });
          },
        },
      ],
      cssClass: 'alertita',
    });
    await alert.present();
  }

  async deletePost(id: number) {
    const alert = await this.alertController.create({
      header: '¿Estas seguro que quieres eliminar está publicación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //Do nothing
          },
        },
        {
          text: 'Acceptar',
          handler: () => {
            //realizar la llamada a la api para eliminar la cuenta
            this.postService
              .deletePost(id)
              .pipe(
                catchError((error) => {
                  return of(error);
                })
              )
              .subscribe((response) => {
                if (response.error) {
                  this.toastService.presentToast(response.error.message);
                  return;
                }

                console.log(response);
                this.getPosts();
              });
          },
        },
      ],
      cssClass: 'alertita',
    });
    await alert.present();
  }
}
