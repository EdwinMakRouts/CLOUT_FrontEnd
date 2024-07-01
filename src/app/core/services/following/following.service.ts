import { Injectable } from '@angular/core';
import { FollowingRepository } from '../../repository/following/following.service';

@Injectable({
  providedIn: 'root',
})
export class FollowingService {
  constructor(private repo: FollowingRepository) {}

  public getAllUsers() {
    return this.repo.getAllUsers();
  }

  /**
   *
   * @param id
   * @returns Observable that tells the following of the user
   */
  public getFollowing(id: number) {
    return this.repo.getFollowing(id);
  }

  /**
   *
   * @param id
   * @param followerId
   * @returns Observable that tells if the user was unfollowed
   */
  public unfollow(id: number, followerId: number) {
    return this.repo.unfollow(id, followerId);
  }

  public follow(id: number, followerId: number) {
    return this.repo.follow(id, followerId);
  }

  public isFollowing(id: number, followerId: number) {
    return this.repo.isFollowing(id, followerId);
  }
}
