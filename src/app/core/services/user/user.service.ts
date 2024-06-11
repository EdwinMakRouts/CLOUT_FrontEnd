import { Injectable } from '@angular/core';
import { UserRepository } from '../../repository/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private repo: UserRepository) {}

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
  public register(
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
    return this.repo.registerUser(
      username,
      email,
      password,
      firstName,
      lastName,
      bornDate,
      avatar,
      height,
      weight
    );
  }

  /**
   * This method is used to login a user
   * @param email Email of the user
   * @param password Password of the user
   * @returns Observable that tells if the user was logged or not
   */
  public login(email: string, password: string) {
    return this.repo.loginUser(email, password);
  }

  public getUserBasicData(id: number) {
    return this.repo.getUserBasicData(id);
  }

  public getUserProfile(id: number) {
    return this.repo.getUserProfile(id);
  }

  public getUserProfileWithUsername(username: string) {
    return this.repo.getUserProfileWithUsername(username);
  }

  public updateUserProfile(
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
    return this.repo.updateUserProfile(
      id,
      username,
      email,
      password,
      firstName,
      lastName,
      description,
      instagram,
      twitter,
      pinterest,
      bornDate,
      avatar,
      height,
      weight
    );
  }
  /**
   * This method is used to follow a user
   * @param userId Id of the user to follow
   * @param followerId Id of the user that follows
   * @returns
   */
  public followUser(userId: number, followerId: number) {
    return this.repo.followUser(userId, followerId);
  }

  /**
   * This method is used to unfollow a user
   * @param userId Id of the user to unfollow
   * @param followerId Id of the user that unfollows
   * @returns
   */
  public unfollowUser(userId: number, followerId: number) {
    return this.repo.unfollowUser(userId, followerId);
  }

  /**
   * This method is used to let the user log out of the app
   */
  public logOut() {
    return localStorage.removeItem('userId');
  }

  public getAllUsers() {
    return this.repo.getAllUsers();
  }

  public matchUsernames(username: string) {
    return this.repo.matchUsernames(username);
  }

  public deleteUser(id: number) {
    return this.repo.deleteUser(id);
  }
}
