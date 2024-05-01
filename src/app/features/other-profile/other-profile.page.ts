import { Component, OnInit, WritableSignal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { catchError, of } from 'rxjs';
import { UserService } from 'src/app/core/services/user/user.service';
import { PostService } from 'src/app/core/services/post/post.service';
import { ToastService } from 'src/app/shared/utils/toast.service';
import { get } from 'cypress/types/lodash';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { FollowingService } from 'src/app/core/services/following/following.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.page.html',
  styleUrls: ['./other-profile.page.scss'],
})
export class OtherProfilePage implements OnInit {
  id!: number;
  username!: string;
  avatar!: string;
  bio!: string;
  instagram!: string;
  twitter!: string;
  pinterest!: string;
  userFound: boolean = false;
  loading: boolean = true;
  isFollowing = false;
  height!: number;
  weight!: number;

  outfits: any = [];
  userSignal: WritableSignal<any>;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastService: ToastService,
    private postService: PostService,
    private signalsService: SignalsService,
    private followingService: FollowingService
  ) {
    this.username = this.route.snapshot.paramMap.get('username')!;
    this.userSignal = this.signalsService.getUserSignal();
  }

  ngOnInit() {
    console.warn(this.username);
    this.getProfileWithUsername(this.username);
  }

  goTo(dest: string, extras?: any) {
    this.navCtrl.navigateRoot(dest);
  }

  getProfileWithUsername(username: string) {
    this.userService
      .getUserProfileWithUsername(username)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((res) => {
        if (res.error) {
          console.warn(res.error);
          this.toastService.presentToast(res.error.message);
          this.loading = false;
          return;
        }
        this.id = res.id;
        this.userFound = true;
        this.loading = false;
        this.instagram = res.profile.instagram;
        this.twitter = res.profile.twitter;
        this.pinterest = res.profile.pinterest;
        this.bio = res.profile.description;
        this.height = res.profile.height;
        this.weight = res.profile.weight;
        const timestamp = new Date().getTime();
        this.avatar = res.profile.avatar;
        this.avatar += `?nocache=${timestamp}`;
        this.isFollowingUser();
        this.getPosts(this.id);
      });
  }

  getPosts(id: number) {
    this.postService
      .getPostsByUserId(id)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response: any) => {
        console.log('response', response);
        if (response.error)
          this.toastService.presentToast(response.error.message);
        else {
          this.outfits = response;
          console.log(response);
        }
      });
  }

  isFollowingUser() {
    const user = this.userSignal();
    this.followingService
      .isFollowing(this.id, user.id)
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((res: any) => {
        if (res.error) {
          console.warn(res.error);
          this.toastService.presentToast(res.error.message);
          return;
        } else {
          this.isFollowing = res.isFollowing;
        }
      });
  }

  followOrUnfollow() {
    const user = this.userSignal();
    if (this.isFollowing) {
      this.followingService
        .unfollow(this.id, user.id)
        .pipe(
          catchError((error) => {
            return of(error);
          })
        )
        .subscribe((res: any) => {
          if (res.error) {
            console.warn(res.error);
            this.toastService.presentToast(res.error.message);
            return;
          } else {
            this.isFollowing = false;
          }
        });
    } else {
      this.followingService
        .follow(this.id, user.id)
        .pipe(
          catchError((error) => {
            return of(error);
          })
        )
        .subscribe((res: any) => {
          if (res.error) {
            console.warn(res.error);
            this.toastService.presentToast(res.error.message);
            return;
          } else {
            this.isFollowing = true;
          }
        });
    }
  }

  copyCurrentUrl() {
    const currentUrl = window.location.href;
    const tempInput = document.createElement('input');
    tempInput.value = currentUrl;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    this.toastService.presentToast('URL copiada al portapapeles');
  }

  goToOutfit(id: number) {
    this.navCtrl.navigateForward(['post', id]);
  }

  goBack() {
    this.navCtrl.back();
  }
}
