import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-otp-confirmation',
  templateUrl: './otp-confirmation.page.html',
  styleUrls: ['./otp-confirmation.page.scss'],
})
export class OtpConfirmationPage implements OnInit {
  delay = 1000;
  lastExecution = 0;
  constructor(
    public nav: NavController,
    public activerouter: ActivatedRoute,
    public authService: AuthService,
    private loadingController: LoadingController,
    public r: Router,
    public toastController: ToastController,
    private t: TranslateService,
  ) {
    t.get("editProfilePage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;

  windowRef: any;
  verifCode: any;
  numberData = {
    phoneNumber: ''
  }
  code = '';


  async ngOnInit() {
    this.windowRef = await window;
    this.windowRef.recaptchaVerifier = await new firebase.auth
      .RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
      });
  }
  goback() {
    this.nav.back()
  }
  async presentToast(mes) {
    const toast = await this.toastController.create({
      message: mes,
      mode: "ios",
      duration: 3000
    });
    toast.present();
  }
  ionViewWillEnter() {
    this.activerouter.params.subscribe((resp: any) => {
      this.numberData.phoneNumber = resp.phoneNumber;
    })
  }
  async onCodeCompleted(e) {
    if ((this.lastExecution + this.delay) < Date.now()) {
      this.presentLoading();
      this.verifCode = e;
      await this.windowRef.confirmationResult.confirm(this.verifCode)
        .then(async result => {
          this.signInChecker();
        })
        .catch(err => {
          this.loadingController.dismiss();
          this.presentToast(err);
        });
      this.lastExecution = Date.now()
    }
  }
  onCodeChanged(e) {
    this.code = e;
  }
  continueBtn() {
    if (this.code.length < 6) {
      this.presentToast(this.respFromLanguage.enterOtpCode);
    } else {
      this.onCodeCompleted(this.code);
    }
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.respFromLanguage.pleaseWait,
      duration: 7000,
    });
    await loading.present();
  }
  signInChecker() {
    this.authService.signInWithPhoneNumber(this.numberData)
      .subscribe((resp: any) => {
        localStorage.setItem('user', JSON.stringify(resp.pessenger))
        this.loadingController.dismiss();
        this.r.navigate(['/booking-options']);
      }, err => {
        this.loadingController.dismiss();
        this.r.navigate(['/register/' + this.numberData.phoneNumber])
      })
  }
}
