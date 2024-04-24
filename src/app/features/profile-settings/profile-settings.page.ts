import { Component, OnInit, WritableSignal } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { get } from 'cypress/types/lodash';
import { SignalsService } from 'src/app/core/services/signals/signals.service';
import { ToastService } from 'src/app/shared/utils/toast.service';
import { AlertController } from '@ionic/angular';
import { catchError, of } from 'rxjs';
import { UserService } from 'src/app/core/services/user/user.service';
import { User } from 'src/app/core/models/user';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.page.html',
  styleUrls: ['./profile-settings.page.scss'],
})
export class ProfileSettingsPage implements OnInit {
  username!: string;
  name!: string;
  surname!: string;
  pronouns!: string;
  bio!: string;
  private!: boolean;
  instagram_username!: string;
  twitter_username!: string;
  pinterest_username!: string;
  img!: string;

  userSignal: WritableSignal<any>;

  constructor(
    private navCtrl: NavController,
    private signalsService: SignalsService,
    private toastService: ToastService,
    private alertController: AlertController,
    private userService: UserService
  ) {
    this.userSignal = this.signalsService.getUserSignal();
  }

  ngOnInit() {
    console.log('entra en profile settings');
    console.warn('');
    console.log(this.userSignal());
    this.populateProfileSettings();
  }

  populateProfileSettings() {
    const user = this.userSignal();
    console.warn();
    console.log(user);
    console.warn();
    this.username = user.username;
    this.name = user.profile.firstName;
    this.surname = user.profile.lastName;
    this.pronouns = user.profile.pronouns;
    this.bio = user.profile.description;
    this.private = user.profile.private;
    this.instagram_username = user.profile.instagram
      ? user.profile.instagram
          .toString()
          .replace('https://www.instagram.com/', '')
      : '';
    this.twitter_username = user.profile.twitter
      ? user.profile.twitter.toString()
      : ''.replace('https://www.twitter.com/', '');
    this.pinterest_username = user.profile.pinterest
      ? user.profile.pinterest
          .toString()
          .replace('https://www.pinterest.es/', '')
      : '';
    const timestamp = new Date().getTime();
    this.img = user.profile.avatar;
    this.img += `?nocache=${timestamp}`;
    if (this.img !== '') {
      const avatar = document.getElementById('avatar') as HTMLImageElement;
      avatar.src = this.img;
    }
  }

  async createAlert(socialSiteName: string) {
    const alert = await this.alertController.create({
      header: 'Introduce tu nombre de usuario de ' + socialSiteName,
      inputs: [
        {
          name: 'input1',
          type: 'text',
          placeholder:
            socialSiteName == 'instagram'
              ? this.instagram_username
              : socialSiteName == 'twitter'
              ? this.twitter_username
              : socialSiteName == 'pinterest'
              ? this.pinterest_username
              : '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //Do nothing
          },
        },
        {
          text: 'Accept',
          handler: (alertData) => {
            console.log(alertData.input1);
            if (alertData.input1 !== '') {
              if (socialSiteName == 'instagram') {
                this.setInstagramUsername(alertData.input1);
              } else if (socialSiteName == 'twitter') {
                this.setTwitterUsername(alertData.input1);
              } else if (socialSiteName == 'pinterest') {
                this.setPinterestUsername(alertData.input1);
              }
            }
          },
        },
      ],
      cssClass: 'alertita',
    });
    await alert.present();
  }

  editUsername() {
    const usernameInput = document.getElementById(
      'username'
    ) as HTMLInputElement;
    const saveButton = document.getElementById(
      'edit-username'
    ) as HTMLIonIconElement;

    if (usernameInput.value.length < 3 || usernameInput.value.length > 15) {
      this.toastService.presentToast(
        'El nombre de usuario debe tener entre 3 y 15 caracteres'
      );
      this.username = this.userSignal().username;
      usernameInput.value = this.username;
      usernameInput.readOnly = true;
      saveButton.src = '../../../assets/icons/ic-edit.svg';
      return;
    }

    if (usernameInput.readOnly) {
      usernameInput.readOnly = false;
      saveButton.src = '../../../assets/icons/ic-save.svg';
    } else {
      usernameInput.readOnly = true;
      saveButton.src = '../../../assets/icons/ic-edit.svg';
      //realizar la llamada a la api para actualizar el nombre de usuario

      this.apiEditProfile(
        this.userSignal().id,
        usernameInput.value,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
    }
  }

  editName() {
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const saveButton = document.getElementById(
      'edit-name'
    ) as HTMLIonIconElement;

    if (nameInput.value.length < 2 || nameInput.value.length > 30) {
      this.toastService.presentToast(
        'El nombre debe tener entre 2 y 30 caracteres'
      );
      this.name = this.userSignal().firstName;
      nameInput.value = this.name;
      nameInput.readOnly = true;
      saveButton.src = '../../../assets/icons/ic-edit.svg';
      return;
    }

    if (nameInput.readOnly) {
      nameInput.readOnly = false;
      saveButton.src = '../../../assets/icons/ic-save.svg';
    } else {
      nameInput.readOnly = true;
      saveButton.src = '../../../assets/icons/ic-edit.svg';
      //realizar la llamada a la api para actualizar el nombre
      this.apiEditProfile(
        this.userSignal().id,
        null,
        null,
        null,
        nameInput.value,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
    }
  }

  editSurname() {
    const surnameInput = document.getElementById('surname') as HTMLInputElement;
    const saveButton = document.getElementById(
      'edit-surname'
    ) as HTMLIonIconElement;

    if (surnameInput.value.length > 50) {
      this.toastService.presentToast(
        'El apellido debe como máximo 50 caracteres'
      );
      this.surname = this.userSignal().lastName;
      surnameInput.value = this.surname;
      surnameInput.readOnly = true;
      saveButton.src = '../../../assets/icons/ic-edit.svg';
      return;
    }

    if (surnameInput.readOnly) {
      surnameInput.readOnly = false;
      saveButton.src = '../../../assets/icons/ic-save.svg';
    } else {
      surnameInput.readOnly = true;
      saveButton.src = '../../../assets/icons/ic-edit.svg';
      //realizar la llamada a la api para actualizar el nombre
      this.apiEditProfile(
        this.userSignal().id,
        null,
        null,
        null,
        null,
        surnameInput.value,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null
      );
    }
  }

  editBio() {
    const bioInput = document.getElementById(
      'biografy'
    ) as HTMLIonTextareaElement;
    const saveButton = document.getElementById(
      'edit-bio'
    ) as HTMLIonIconElement;

    if (bioInput.readonly == false && bioInput.value?.length == 0) {
      this.toastService.presentToast('La biografía no puede estar vacía');
      return;
    }

    if (bioInput.readonly !== undefined)
      if (bioInput.readonly) {
        bioInput.readonly = false;
        saveButton.src = '../../../assets/icons/ic-save.svg';
      } else {
        saveButton.src = '../../../assets/icons/ic-edit.svg';
        bioInput.readonly = true;
        //realizar la llamada a la api para actualizar la bio

        this.apiEditProfile(
          this.userSignal().id,
          null,
          null,
          null,
          null,
          null,
          null,
          bioInput.value?.toString(),
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null
        );
      }
  }

  async setNewProfilePicture() {
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

      //realizar la llamada a la api para actualizar la foto de perfil
      const result = this.apiEditProfile(
        this.userSignal().id,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        this.img.replace('data:image/jpeg;base64,', ''),
        null,
        null
      );

      if (result) {
        const avatar = document.getElementById('avatar') as HTMLImageElement;
        avatar.src = this.img;
      }
    } catch (_) {
      this.toastService.presentToast(
        'Parece que ha habido un problema al seleccionar la foto'
      );
    }
  }

  goToProfile() {
    this.navCtrl.navigateBack(['profile']);
  }

  goToLikedOutfits() {
    //redirigir a la página de outfits guardados
    this.navCtrl.navigateForward(['profile', 'likes']);
  }

  goToFollowing() {
    //redirigir a la página de usuarios seguidos
    this.navCtrl.navigateForward(['profile', 'following']);
  }

  setInstagramUsername(username: string) {
    //realizar la llamada a la api para actualizar el nombre de usuario de instagram
    this.instagram_username = username;

    this.apiEditProfile(
      this.userSignal().id,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      username,
      null,
      null,
      null,
      null,
      null,
      null
    );
  }

  setTwitterUsername(username: string) {
    //realizar la llamada a la api para actualizar el nombre de usuario de twitter
    this.twitter_username = username;

    this.apiEditProfile(
      this.userSignal().id,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      username,
      null,
      null,
      null,
      null,
      null
    );
  }

  setPinterestUsername(username: string) {
    //realizar la llamada a la api para actualizar el nombre de usuario de pinterest
    this.pinterest_username = username;

    this.apiEditProfile(
      this.userSignal().id,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      username,
      null,
      null,
      null,
      null
    );
  }

  apiEditProfile(
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
    return this.userService
      .updateUserProfile(
        id,
        username,
        email,
        password,
        firstName,
        lastName,
        pronouns,
        bio,
        isPrivate,
        instagram_username,
        twitter_username,
        pinterest_username,
        bornDate,
        avatar,
        height,
        weight
      )
      .pipe(
        catchError((error) => {
          return of(error);
        })
      )
      .subscribe((response: any) => {
        if (response.error)
          this.toastService.presentToast(response.error.message);
        else {
          console.log('SIGNAL ANTES: ', this.userSignal());
          console.log('RESPONSE: ', response);
          const newUserData = response;

          this.userSignal.set(newUserData);
        }
      });
  }
}
function getBase64Image(img: string) {
  throw new Error('Function not implemented.');
}
