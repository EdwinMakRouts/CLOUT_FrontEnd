import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';
import { Following } from '../../models/following';

@Injectable({
  providedIn: 'root',
})
export class FollowingRepository extends Repository {
  constructor(injector: Injector) {
    super(injector);
  }

  getAllUsers() {
    return this.doRequest<Following[]>('get', '/followers');
  }

  /**
   *
   * @param id
   * @returns Observable that tells the following of the user
   */
  getFollowing(id: number) {
    return this.doRequest<Following[]>('get', `/followers/${id}/following`);
  }

  /**
   *
   * @param id
   * @param followerId
   * @returns Observable that tells if the user was unfollowed
   */
  unfollow(id: number, followerId: number) {
    return this.doRequest<Following[]>('delete', `/followers/${id}/unfollow`, {
      followerId: followerId,
    });
  }

  follow(id: number, followerId: number) {
    return this.doRequest<Following[]>('post', `/followers/${id}/follow`, {
      followerId: followerId,
    });
  }

  isFollowing(id: number, followerId: number) {
    return this.doRequest<Following[]>('get', `/followers/${id}/${followerId}`);
  }
}
