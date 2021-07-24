import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-via-phone',
  templateUrl: './login-via-phone.page.html',
  styleUrls: ['./login-via-phone.page.scss'],
})
export class LoginViaPhonePage implements OnInit {

  constructor(
    public nav: NavController,
    public loadingController: LoadingController,
    public authservice: AuthService,
    public router: Router,
    public toastController: ToastController
  ) {
  }
  windowRef: any;
  data = {
    phoneNumber: ''
  }
  onClickInput() {
    if (!this.data.phoneNumber) {
      this.data.phoneNumber = '+38';;
    }
  }
  errMessage = "";
  onKeyUpInput() {
    if (this.data.phoneNumber) {
      if ((this.data.phoneNumber.substr(0, 1)) == '+') {
        if (this.data.phoneNumber.length > 1) {
          if (/^\d+$/.test(this.data.phoneNumber.slice(1))) {
            this.errMessage = '';
            if(this.data.phoneNumber.length == 13){
              this.next();
            }
          } else {
            this.errMessage = 'Invalid Format';
          }
        }
      } else {
        this.errMessage = 'Must enter country code: (+38) ###-##-##';
      }
    } else {
      this.errMessage = '';
    }
  }
  async ngOnInit() {
    this.windowRef = await window;
    this.windowRef.recaptchaVerifier = await new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
    });
    await this.windowRef.recaptchaVerifier.render();
  }
  goback() {
    this.nav.back()
  }
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      duration: 5000,
      message: 'Please Wait',
    });
    await loading.present();
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top',
      mode: 'ios',
      color: 'medium'
    });
    toast.present();
  }
  next() {
    this.presentLoadingWithOptions()
    let a = '';
    if (this.data.phoneNumber.toString().substr(0, 1) == '+') {
      a = this.data.phoneNumber
    } else {
      a = '+' + this.data.phoneNumber
    }
    const appVerifier = this.windowRef.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(a, appVerifier)
      .then(result => {
        this.loadingController.dismiss()
        this.windowRef.confirmationResult = result;
        this.router.navigate(['/otp-confirmation/' + this.data.phoneNumber.slice(1)])
      }).catch(err => {
        this.loadingController.dismiss()
        this.presentToast('Something wents wrong')
      })
  }
}
