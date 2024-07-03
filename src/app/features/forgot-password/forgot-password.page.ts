import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, NavController } from '@ionic/angular';
import { PasswordService } from 'src/app/core/services/password/password.service';
import { ToastService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  loading = false;
  state = 'initial';
  email = '';

  code1!: number;
  code2!: number;
  code3!: number;
  code4!: number;
  intentos = 0;

  password = '';
  confirmPassword = '';

  constructor(
    private readonly fb: FormBuilder,
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private toastService: ToastService,
    private passwordService: PasswordService
  ) {}

  ngOnInit() {}

  sendEmailValid() {
    const pattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$');
    return this.email !== '' && pattern.test(this.email);
  }

  forgetPassword() {
    this.loading = true;
    this.passwordService
      .forgotPassword(this.email)
      .subscribe((response: any) => {
        if (response.error) {
          this.toastService.presentToast('Error al enviar el correo');
          this.loading = false;
          return;
        }

        this.loading = false;
        this.state = 'code';
      });
  }

  sendCodeValid() {
    return (
      this.code1 !== undefined &&
      this.code2 !== undefined &&
      this.code3 !== undefined &&
      this.code4 !== undefined
    );
  }

  sendCode() {
    this.loading = true;
    const code = Number(`${this.code1}${this.code2}${this.code3}${this.code4}`);
    this.passwordService
      .isCodeCorrect(this.email, code)
      .subscribe((response: any) => {
        if (response.error) {
          this.intentos = this.intentos + 1;
          this.toastService.presentToast('Codigo incorrecto');
          this.loading = false;

          if (this.intentos === 3) {
            this.toastService.presentToast('Demasiados intentos');
            this.navCtrl.navigateRoot('/login');
          }
          return;
        }

        this.loading = false;
        this.state = 'final';
      });
  }

  validateSingleDigit($event: any) {
    let code: number = $event.target.value;
    // Asegurarse de que el valor solo sea un dígito
    if (code > 9) {
      const codeStr = code.toString();
      code = parseInt(codeStr.charAt(codeStr.length - 1), 10);
    } else if (code < 0) {
      code = 0;
    }
    $event.target.value = code;
  }

  passwordValid() {
    return (
      this.password !== '' &&
      this.confirmPassword !== '' &&
      this.password === this.confirmPassword &&
      this.password.length >= 6
    );
  }

  resetPassword() {
    this.loading = true;
    const code = Number(`${this.code1}${this.code2}${this.code3}${this.code4}`);

    this.passwordService
      .resetPassword(this.email, code, this.password)
      .subscribe((response: any) => {
        if (response.error) {
          this.toastService.presentToast('Error al cambiar la contraseña');
          this.loading = false;
          return;
        }

        this.toastService.presentToast('Contraseña cambiada correctamente');
        this.loading = false;
        this.navCtrl.navigateRoot('/login');
      });
  }

  goTo(dest: string, extras?: any) {
    this.navCtrl.navigateRoot(dest);
  }
}
