import { Injectable } from '@angular/core';
import { EventsRepository } from '../../repository/events/events.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private repo: EventsRepository) {}

  getAllEvents() {
    return this.repo.getAllEvents();
  }

  deleteEventById(eventId: number) {
    return this.repo.deleteEventById(eventId);
  }

  createEvent(
    postId: number,
    title: string,
    description?: string,
    location?: string,
    friendsId?: number[]
  ) {
    return this.repo.createEvent(
      postId,
      title,
      description,
      location,
      friendsId
    );
  }

  editEvent(
    eventId: number,
    title: string,
    description?: string,
    location?: string,
    friendsId?: number[]
  ) {
    return this.repo.editEvent(
      eventId,
      title,
      description,
      location,
      friendsId
    );
  }
}
