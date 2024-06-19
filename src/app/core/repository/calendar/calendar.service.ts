import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';
import { Post } from '../../models/post';

@Injectable({
  providedIn: 'root',
})
export class CalendarRepository extends Repository {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * Method used to get all posts created by a user
   * @param userId The id of the user that we want all posts from
   * @returns An observable that returns all the posts created by the user
   */
  public getAllPostsCreatedByUser(userId: number) {
    return this.doRequest<any>('get', `/calendar/${userId}`);
  }

  /**
   * Method used to get all posts created by a user in a specific day
   * @param userId The id of the user that we want all posts from
   * @param date The date we want all posts from
   * @returns An observable that returns all the posts created by the user in a specific date
   */
  public getCreatedPostsByDate(userId: number, date: Date) {
    return this.doRequest<any[]>(
      'get',
      `/calendar/${userId}/date/${date.getFullYear()}/${
        date.getMonth() + 1
      }/${date.getDate()}`
    );
  }
}
