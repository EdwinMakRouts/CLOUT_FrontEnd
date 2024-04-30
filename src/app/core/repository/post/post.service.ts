import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';
import { Post, PostCreated, PostLiked } from '../../models/post';

@Injectable({
  providedIn: 'root',
})
export class PostRepository extends Repository {
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * This method is used to post a post
   * @param text Text of the post
   * @param image Image of the post
   * @param userId Id of the user that posted the post
   * @param etiquetas Tag of the post
   * @returns Observable that tells if the post was posted or not
   */
  post(text: string, image: string, userId: number) {
    return this.doRequest<PostCreated>('post', `/post`, {
      text: text,
      image: image,
      userId: userId,
    });
  }

  /**
   *
   * @returns Observable that returns all the posts
   */
  getPosts(userId?: number) {
    return this.doRequest<Post[]>('get', `/post/feed/${userId}`);
  }

  /**
   *
   * @param postId If of the post that we want to get
   * @returns Post with the id postId
   */
  getPostById(postId: number, userId?: number) {
    return userId
      ? this.doRequest<Post>('get', `/post/${postId}/${userId}`)
      : this.doRequest<Post>('get', `/post/${postId}`);
  }

  /**
   *
   * @param postId Id of the post to edit
   * @param text New text of the post
   * @returns Observable that tells if the post was edited or not
   */
  editPost(postId: number, text: string) {
    return this.doRequest<Post>('put', `/post/${postId}`, {
      text: text,
    });
  }

  /**
   *
   * @returns Observable that returns all the tags
   */
  getTags() {
    return this.doRequest<string[]>('get', '/tag');
  }

  /**
   *  This method is used to like a post
   * @param postId Id of the post to like
   * @param userId Id of the user that liked the post
   * @returns
   */
  likePost(postId: number, userId: number) {
    console.warn(postId);
    return this.doRequest<Post>('post', `/post/${postId}/like`, {
      userId: userId,
    });
  }

  /**
   *  This method is used to dislike a post
   * @param postId Id of the post to dislike
   * @param userId Id of the user that disliked the post
   * @returns
   */
  dislikePost(postId: number, userId: number) {
    console.warn(postId);
    return this.doRequest<Post>('post', `/post/${postId}/unlike`, {
      userId: userId,
    });
  }

  getPostsByUserId(userId: number) {
    return this.doRequest<PostLiked[]>('post', `/post/${userId}`, {});
  }
  /**
   *  This method is used to get the posts that a user liked
   * @param userId Id of the user that we want to get the liked posts
   * @returns
   */
  getLikedPosts(userId: number) {
    return this.doRequest<Post[]>('post', `/post/${userId}/likes`);
  }

  /**
   *  This method is used to get the comments of a post
   * @param postId Id of the post that we want to get the comments
   * @returns
   */
  getComments(postId: number) {
    return this.doRequest<Comment[]>('post', `/post/${postId}/comments`);
  }

  /**
   *  This method is used to post a comment
   * @param postId Id of the post that we want to comment
   * @param text Text of the comment
   * @param userId Id of the user that commented
   * @returns
   */
  createComment(postId: number, userId: number, text: string) {
    return this.doRequest<Comment[]>('post', `/post/${postId}/comment`, {
      text: text,
      userId: userId,
    });
  }

  /**
   *  This method is used to delete a comment
   * @param commentId Id of the comment that we want to delete
   * @returns
   */
  deleteComment(commentId: number) {
    return this.doRequest<Comment[]>('delete', `/post/${commentId}/uncomment`);
  }
}
