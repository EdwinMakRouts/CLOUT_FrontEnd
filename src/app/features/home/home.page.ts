import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { IonModal, NavController } from '@ionic/angular';
import { catchError, of } from 'rxjs';
import { Post } from 'src/app/core/models/post';
import { User } from 'src/app/core/models/user';
import { PostService } from 'src/app/core/services/post/post.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { EncryptionService } from 'src/app/shared/utils/encryption.service';
import { ToastService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  etiquetas = [
    { value: 'comida', label: 'Verano' },
    { value: 'viaje', label: 'Invierno' },
    { value: 'tecnología', label: 'Y2k' },
  ];

  img!: string;
  description!: string;
  state: any;
  postsArrived: boolean = false;
  userSignal: WritableSignal<User>;
  isLiked: boolean = false;
  loading: boolean = false;
  posts: any[] = [];
  selectedEtiquetas: string[] = [];
  @ViewChild(IonModal) modal!: IonModal;

  constructor(
    private postService: PostService,
    private toastService: ToastService,
    private router: Router,
    private signalsService: SignalsService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private encryptionService: EncryptionService
  ) {
    this.state = this.router.getCurrentNavigation()?.extras.state;
    this.userSignal = this.signalsService.getUserSignal();
    console.log('user', this.userSignal);
    console.log('userSignal()', this.userSignal());
  }

  ngOnInit() {}

  ionViewDidEnter() {
    this.getPosts(this.userSignal().id);
    this.cd.detectChanges();
  }

  async post() {
    this.comprimirImagen();

    const imgToSend = this.img.replace('data:image/jpeg;base64,', '');
    this.postService
      .post(this.description, imgToSend, this.userSignal().id)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response) => {
        if (response.error)
          this.toastService.presentToast(response.error.message);
        else {
          this.posts.unshift(response);
          console.warn('LO QUE ENVIO ES: ', imgToSend);
          console.log('LO QUE RECIBO DE LA RESPONSE ES: ', response);
        }
      });
  }

  async getPosts(id: number) {
    this.postService
      .getPosts(id)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response) => {
        this.postsArrived = true;
        if (response.error) {
          console.error('error', response.error);
          return;
        } else {
          console.log('LO QUE ME LLEGA DE LOS POSTS ES ESTO: ', response);
          this.posts = response;
          this.postsArrived = true;
        }
      });
  }

  async takePicture() {
    try {
      const picture = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        saveToGallery: true,
        promptLabelHeader: 'Selecciona de donde quieres obtener la foto',
        promptLabelCancel: 'Cancelar',
        promptLabelPicture: 'Hacer foto',
        promptLabelPhoto: 'Seleccionar de la galería',
        source: CameraSource.Prompt,
      });
      this.img = picture.dataUrl || '';
      console.log('img', this.img);
      const button = document.getElementById('outfit-button')!;
      const addOutfit = document.getElementById('add-outfit')!;
      console.log(addOutfit);
      button.style.backgroundImage = `url(${this.img.replace('&quot;', '')})`;
      button.style.backgroundColor = 'none !important';
      addOutfit.style.background = 'none !important';
    } catch (_) {
      this.toastService.presentToast(
        'Parece que ha habido un problema al seleccionar la foto'
      );
    }
  }

  comprimirImagen() {
    const img = new Image();
    img.src = this.img;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0, img.width, img.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
    this.img = dataUrl;
  }

  cancel() {
    this.modal.dismiss();
  }

  goTo(dest: string, extras?: any) {
    this.router.navigate([dest], { state: extras });
  }

  async confirm() {
    if (!this.img) {
      this.toastService.presentToast('Debes seleccionar una imagen');
      return;
    }
    await this.post();
    this.modal.dismiss();
    this.img = '';
  }

  async refreshPage(ev: any) {
    await this.getPosts(this.userSignal().id);
    ev.target.complete();
  }

  goToProfile(username: string) {
    this.navCtrl.navigateForward(`/profile/name/${username}`);
  }

  goToPost(postId: number) {
    this.navCtrl.navigateForward(`/post/${postId}`);
  }

  toggleLike(post: any) {
    //this.isLiked = !this.isLiked;
    // this.isLiked = !this.isLiked;
    // this.post.likes += this.isLiked ? 1 : -1;
    console.log(this.post);

    console.log('this.userSignal()', this.userSignal());
    const userId = this.encryptionService.decryptId(
      localStorage.getItem('userId')!
    );

    if (!post.hasLiked) {
      console.log('like');
      this.postService
        .likePost(+post.id!, +userId)
        .pipe(
          catchError((error) => {
            return of(error);
          })
        )
        .subscribe((response) => {
          console.log('response', response);
          if (response.error) {
            this.toastService.presentToast(response.error.message);
            this.loading = false;
            return;
          }
          post.hasLiked = true;
          console.warn(this.post);
          this.loading = false;
        });
    } else {
      console.log('dislike');
      this.postService
        .dislikePost(+post.id!, +userId)
        .pipe(
          catchError((error) => {
            return of(error);
          })
        )
        .subscribe((response) => {
          console.log('aqui');
          if (response.error) {
            this.toastService.presentToast(response.error.message);
            this.loading = false;
            return;
          }
          post.hasLiked = false;
          console.warn(this.post);
          this.loading = false;
        });
    }
  }

  noComments() {
    this.toastService.presentToast(
      'La funcionalidad de los comentarios no está disponible aún'
    );
  }
}
