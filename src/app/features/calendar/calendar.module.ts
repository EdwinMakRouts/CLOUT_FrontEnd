import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CalendarPageRoutingModule } from './calendar-routing.module';

import { CalendarPage } from './calendar.page';
import { NgCalendarModule } from 'ionic2-calendar';
import localeEsES from '@angular/common/locales/es';
import { PostComponent } from 'src/app/shared/components/post/post.component';
import { CreateEventComponent } from '../create-event/create-event.component';

registerLocaleData(localeEsES, 'es-Es');

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CalendarPageRoutingModule,
    NgCalendarModule,
    PostComponent,
  ],
  declarations: [CalendarPage, CreateEventComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es-Es' }],
})
export class CalendarPageModule {}
