import { Injectable, Injector } from '@angular/core';
import { Repository } from '../../base/repository.repository';
import { Events } from '../../models/events';

@Injectable({
  providedIn: 'root',
})
export class EventsRepository extends Repository {
  constructor(injector: Injector) {
    super(injector);
  }

  getAllEvents() {
    return this.doRequest('get', '/events');
  }

  deleteEventById(eventId: number) {
    return this.doRequest('delete', `/events/${eventId}`);
  }

  createEvent(
    postId: number,
    title: string,
    description?: string,
    location?: string,
    friendsId?: number[]
  ) {
    return this.doRequest('post', '/events', {
      postId: postId,
      title: title,
      description: description,
      location: location,
      friendsId: friendsId,
    });
  }

  editEvent(
    eventId: number,
    title: string,
    description?: string,
    location?: string,
    friendsId?: number[]
  ) {
    return this.doRequest('put', `/events/${eventId}`, {
      title,
      description,
      location,
      friendsId,
    });
  }
}
