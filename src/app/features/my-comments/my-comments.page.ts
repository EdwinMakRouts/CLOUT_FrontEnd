import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Post } from 'src/app/core/models/post';
import { PostService } from 'src/app/core/services/post/post.service';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { ToastService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'app-my-comments',
  templateUrl: './my-comments.page.html',
  styleUrls: ['./my-comments.page.scss'],
})
export class MyCommentsPage implements OnInit {
  loading: boolean = true;
  posts: Post[] = [];

  constructor(
    private navCtrl: NavController,
    private postService: PostService,
    private signalsService: SignalsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  goBack() {
    this.navCtrl.back();
  }
}
