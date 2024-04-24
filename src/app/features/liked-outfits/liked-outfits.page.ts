import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { catchError, map, of } from 'rxjs';
import { Post, PostLiked } from 'src/app/core/models/post';
import { PostService } from 'src/app/core/services/post/post.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { ToastService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'app-liked-outfits',
  templateUrl: './liked-outfits.page.html',
  styleUrls: ['./liked-outfits.page.scss'],
})
export class LikedOutfitsPage implements OnInit {
  loading: boolean = true;
  likedPosts: any;
  arrayOfArrays: any[][] = [];
  constructor(
    private navCtrl: NavController,
    private postService: PostService,
    private signalsService: SignalsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.getPosts();
  }

  getPosts() {
    this.postService
      .getLikedPosts(this.signalsService.getUserSignal()().id)
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
        this.likedPosts = response;
        this.likedPosts.forEach((post: PostLiked, index: number) => {
          if (index % 3 == 0) {
            this.arrayOfArrays.push([post]);
          } else {
            this.arrayOfArrays[this.arrayOfArrays.length - 1].push(post);
          }
        });
        this.loading = false;
      });
  }

  goToProfile() {
    this.navCtrl.navigateBack(['profile', 'settings']);
  }

  goToOutfit(id: number) {
    this.navCtrl.navigateForward(['post', id]);
  }
}
