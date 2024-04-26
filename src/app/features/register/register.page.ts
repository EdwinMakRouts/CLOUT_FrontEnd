import { Component, OnInit, WritableSignal } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import {
  LoadingController,
  AlertController,
  NavController,
} from '@ionic/angular';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { EncryptionService } from 'src/app/shared/utils/encryption.service';
import { ToastService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  termsRead = false;
  termsAgreed: boolean = false;
  userSignal: WritableSignal<any>;
  img: any;
  check = document.querySelector('#condition');
  loading = this.loadingCtrl.create({
    message: 'Registrando la cuenta...',
  });
  constructor(
    private readonly fb: FormBuilder,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private userService: UserService,
    private signalsService: SignalsService,
    private toastService: ToastService,
    private encryptionService: EncryptionService
  ) {
    this.checkForm();
    this.userSignal = this.signalsService.getUserSignal();
  }

  ngOnInit() {}

  async checkForm() {
    this.registerForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z0-9@\-_*#]+$/)],
      ],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bornDate: ['', Validators.required],
      height: [''],
      weight: [''],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      password: ['', Validators.required],
    });
  }

  async checkboxListener(value: any) {
    this.termsAgreed = value.detail.checked;
  }

  async showLoading() {
    (await this.loading).present();
  }

  async presentAlert() {
    const check = document.querySelector('#condition');
    const alert = await this.alertController.create({
      header: 'Términos y Condiciones de uso',
      buttons: [
        {
          text: 'Cancelar',
          handler: async () => {
            this.termsAgreed = false;
            (<any>check).checked = false;
            alert.dismiss();
          },
        },
        {
          text: 'Acepto',
          handler: async () => {
            this.termsRead = true;
            this.termsAgreed = true;
            alert.dismiss();
            (<any>check).checked = true;
          },
        },
      ],
      message: `Al registrarte, aceptas los términos y condiciones de uso de la aplicación. \n
        Los datos que nos proporciones serán tratados de forma confidencial y no serán compartidos con terceros. \n
        Solo usaremos tus datos para almacenarlos temporalmente en el almacenamiento local del navegador para permitir que sigas con la sesión iniciada al recargar la página \n`,
    });
    await alert.present();
  }

  onRegister() {
    if (this.img && this.img !== '') this.comprimirImagen();

    this.userService
      .register(
        this.registerForm.value.username,
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.bornDate,
        this.img && this.img !== ''
          ? this.img.replace('data:image/jpeg;base64,', '')
          : null,
        this.registerForm.value.height ?? null,
        this.registerForm.value.weight ?? null
      )
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response) => {
        if (response.error)
          this.toastService.presentToast(response.error.message);
        else {
          this.userSignal.set(response);
          this.userSignal.set(response);
          const encriptedId = this.encryptionService.encryptId(
            this.userSignal().id
          );
          localStorage.setItem('userId', encriptedId);
          this.navCtrl.navigateRoot('home');
        }
      });
  }

  goTo(dest: string, extras?: any) {
    this.navCtrl.navigateRoot(dest);
  }

  async takePicture() {
    try {
      const picture = await Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        saveToGallery: true,
        promptLabelHeader: 'Selecciona de donde quieres obtener la foto',
        promptLabelCancel: 'Cancelar',
        promptLabelPicture: 'Hacer foto',
        promptLabelPhoto: 'Seleccionar de la galería',
        source: CameraSource.Prompt,
      });
      this.img = picture.dataUrl || '';
    } catch (_) {
      this.toastService.presentToast(
        'Parece que ha habido un problema al seleccionar la foto'
      );
    }
  }

  comprimirImagen() {
    const img = new Image();
    img.src = this.img;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = img.width;
    canvas.height = img.height;
    ctx?.drawImage(img, 0, 0, img.width, img.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
    this.img = dataUrl;
  }
}
