import { Component, OnInit, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PostService } from 'src/app/core/services/post/post.service';
import { ToastService } from 'src/app/shared/utils/toast.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { NavController } from '@ionic/angular';
import { EncryptionService } from 'src/app/shared/utils/encryption.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  state: any;
  post!: any;
  loading: boolean = true;
  username!: string;
  uploadDate!: string;
  description!: string;
  isLiked: boolean = false;
  userSignal: WritableSignal<User>;

  constructor(
    private router: Router,
    private postService: PostService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private signalsService: SignalsService,
    private navCtrl: NavController,
    private encryptionService: EncryptionService
  ) {
    this.state = this.router.getCurrentNavigation()?.extras.state;
    this.getPost();
    this.userSignal = this.signalsService.getUserSignal();
  }

  ngOnInit() {}

  getPost() {
    if (this.state) {
      this.post = this.state.post;
      this.loading = false;
      return;
    }
    const postId = this.route.snapshot.paramMap.get('id');
    this.getPostById(+postId!);
  }

  getPostById(postId: number) {
    const userId = this.encryptionService.decryptId(
      localStorage.getItem('userId')!
    );
    this.postService
      .getPostById(postId, +userId ?? null)
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
        this.post = response;
        this.isLiked = this.post.hasLiked;
        console.warn(this.post);
        this.loading = false;
      });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  goBack() {
    this.navCtrl.back();
  }

  copyUrlToPost() {
    navigator.clipboard.writeText(
      `https://clout-pin.web.app/post/${this.post.id}`
    );
    this.toastService.presentToast('URL copiada al portapapeles');
  }

  toggleLike() {
    //this.isLiked = !this.isLiked;
    // this.isLiked = !this.isLiked;
    // this.post.likes += this.isLiked ? 1 : -1;
    console.log(this.post);
    const postId = this.route.snapshot.paramMap.get('id');
    console.log('this.userSignal()', this.userSignal());
    const userId = this.encryptionService.decryptId(
      localStorage.getItem('userId')!
    );

    if (!userId) {
      this.toastService.presentToast(
        'No puedes dar me gusta a una publicación si no tienes la sesión iniciada'
      );
      return;
    }
    if (!this.isLiked) {
      console.log('like');
      this.postService
        .likePost(+postId!, +userId)
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
          this.isLiked = true;
          console.warn(this.post);
          this.loading = false;
        });
    } else {
      console.log('dislike');
      this.postService
        .dislikePost(+postId!, +userId)
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
          this.isLiked = false;
          console.warn(this.post);
          this.loading = false;
        });
    }
  }

  goToProfile() {
    console.log(this.post.user.username);
    console.log(this.userSignal().username);
    console.log(this.post.user.username == this.userSignal().username);

    if (this.post.user.username == this.userSignal().username) {
      this.navCtrl.navigateForward('/profile');
    } else {
      this.navCtrl.navigateForward([
        'profile',
        'name',
        this.post.user.username,
      ]);
    }
  }
}
