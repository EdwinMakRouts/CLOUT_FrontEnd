import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';
import { BasicUser, User } from '../../models/user';

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

  getUserBasicData(id: number) {
    return this.doRequest<BasicUser>('get', `/users/${id}`);
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
   * @param description Bio of the user
   * @param instagram Instagram username of the user
   * @param twitter Twitter username of the user
   * @param pinterest Pinterest username of the user
   * @returns edited user
   */
  updateUserProfile(
    id: number,
    username?: string | null,
    email?: string | null,
    password?: string | null,
    firstName?: string | null,
    lastName?: string | null,
    description?: string | null,
    instagram?: string | null,
    twitter?: string | null,
    pinterest?: string | null,
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
      description: description,
      instagram: instagram,
      twitter: twitter,
      pinterest: pinterest,
      bornDate: bornDate,
      avatar: avatar,
      height: height,
      weight: weight,
    });
  }
  /*
      
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

  /**
   * This method is used to get all the users
   * @returns
   */
  getAllUsers() {
    return this.doRequest<User[]>('get', `/users`);
  }

  matchUsernames(username: string) {
    return this.doRequest<User[]>('get', `/users/${username}/match`);
  }

  deleteUser(id: number) {
    return this.doRequest<User>('delete', `/users/${id}`);
  }
}
