import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserRepository extends Repository {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * This method is used to register a user
   * @param username Username of the user
   * @param bio Bio of the user
   * @param email Email of the user
   * @param password Password of the user
   * @param firstName First name of the user
   * @param lastName Last name of the user
   * @param bornDate Born date of the user
   * @param avatar Avatar of the user
   * @param height Height of the user
   * @param weight Weight of the user
   * @returns Observable that tells if the user was registered or not
   */
  registerUser(
    username: string,
    bio: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    bornDate: Date,
    avatar?: any,
    height?: number,
    weight?: number
  ) {
    return this.doRequest<User>('post', `/register`, {
      username: username,
      bio: bio,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      bornDate: bornDate,
      avatar: avatar,
      height: height,
      weight: weight,
    });
  }

  /**
   * This method is used to login a user
   * @param email Email of the user
   * @param password Password of the user
   * @returns Observable that tells if the user was logged or not
   */

  loginUser(email: string, password: string) {
    return this.doRequest<User>('post', `/login`, {
      email: email,
      password: password,
    });
  }

  /**
   * @param id Id of the user
   * @returns User with the given id
   */

  getUserProfile(id: number) {
    return this.doRequest<User>('get', `/users/${id}/profile`);
  }

  /**
   * @param username Username of the user
   * @returns User with the given username
   */
  getUserProfileWithUsername(username: string) {
    return this.doRequest<User>('get', `/users/${username}/profile`);
  }

  /**
   * This method is used to edit a user
   * @param id Id of the user
   * @param username Username of the user
   * @param email Email of the user
   * @param password Password of the user
   * @param firstName First name of the user
   * @param lastName Last name of the user
   * @param bornDate Born date of the user
   * @param avatar Avatar of the user
   * @param height Height of the user
   * @param weight Weight of the user
   * @param pronouns Pronouns of the user
   * @param bio Bio of the user
   * @param isPrivate If the user is private or not
   * @param instagram_username Instagram username of the user
   * @param twitter_username Twitter username of the user
   * @param pinterest_username Pinterest username of the user
   * @returns edited user
   */
  updateUserProfile(
    id: number,
    username?: string | null,
    email?: string | null,
    password?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    pronouns?: string | null,
    bio?: string | null,
    isPrivate?: boolean | null,
    instagram_username?: string | null,
    twitter_username?: string | null,
    pinterest_username?: string | null,
    bornDate?: Date | null,
    avatar?: any | null,
    height?: number | null,
    weight?: number | null
  ) {
    return this.doRequest<User>('put', `/users/${id}`, {
      username: username,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      bornDate: bornDate,
      avatar: avatar,
      height: height,
      weight: weight,
      pronouns: pronouns,
      bio: bio,
      isPrivate: isPrivate,
      instagram_username: instagram_username,
      twitter_username: twitter_username,
      pinterest_username: pinterest_username,
    });
      
   * This method is used to follow a user
   * @param userId Id of the user to follow
   * @param followerId Id of the user that follows
   * @returns
   */
  followUser(userId: number, followerId: number) {
    return this.doRequest<User>('post', `/followers/${userId}/follow`, {
      followerId: followerId,
    });
  }

  /**
   * This method is used to unfollow a user
   * @param userId Id of the user to unfollow
   * @param followerId Id of the user that unfollows
   * @returns
   */
  unfollowUser(userId: number, followerId: number) {
    return this.doRequest<User>('delete', `/followers/${userId}/unfollow`, {
      followerId: followerId,
    });
  }
}
