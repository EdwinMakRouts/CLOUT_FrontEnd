import { Component, OnInit, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { PostService } from 'src/app/core/services/post/post.service';
import { ToastService } from 'src/app/shared/utils/toast.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { IonicModule, NavController } from '@ionic/angular';
import { EncryptionService } from 'src/app/shared/utils/encryption.service';
import { User } from 'src/app/core/models/user';
import { Comments } from 'src/app/core/models/post';

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

  comments: Comments[] = [];
  pressedComment = false;
  commentText: string = '';
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
    this.userSignal = this.signalsService.getUserSignal();
    this.getPost();
  }

  ngOnInit() {
    this.userSignal = this.signalsService.getUserSignal();
  }

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
    const postId = this.route.snapshot.paramMap.get('id');
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
            return;
          }
          this.isLiked = false;
          console.warn(this.post);
        });
    }
  }

  toggleComments() {
    this.pressedComment = !this.pressedComment;
    const opacityElement = document.getElementById('opacity');

    if (this.pressedComment && opacityElement) {
      this.getComments();
      opacityElement.style.opacity = '0.5';
    } else if (!this.pressedComment && opacityElement) {
      opacityElement.style.opacity = '1';
    }
  }

  getComments() {
    const postId = this.post.id;
    this.postService
      .getComments(postId)
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
        this.comments = response;
        console.log(this.comments);
      });
  }

  async createComment() {
    const id = this.userSignal().id;

    if (this.commentText.length === 0) {
      return;
    }

    this.postService
      .createComment(this.post.id, id, this.commentText)
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

        this.commentText = '';
        this.getComments();
      });
  }

  goToProfile() {
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
