import { Component, WritableSignal, signal } from '@angular/core';
import { SignalsService } from './core/services/signals/signals.service';
import { ToastService } from './shared/utils/toast.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public userSignal: WritableSignal<any> = signal({});
  constructor(
    private signalsService: SignalsService,
    private toastService: ToastService
  ) {
    this.signalsService.setUserSignal(this.userSignal);
    //this.toastService.presentToast(
    //  'Actualmente, la aplicación solo esta diseñada para dispositivos móviles en modo vertical.'
    //);
  }
}
