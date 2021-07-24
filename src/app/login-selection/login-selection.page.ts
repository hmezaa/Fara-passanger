import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { SocialService } from '../services/social.service';
import * as firebase from 'firebase';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-login-selection',
  templateUrl: './login-selection.page.html',
  styleUrls: ['./login-selection.page.scss'],
})
export class LoginSelectionPage implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.Pakistan, CountryISO.Ukraine];
  phoneForm: FormGroup;
  constructor(
    public authService: AuthService,
    public router: Router,
    public loadingController: LoadingController,
    public geolocation: Geolocation,
    public formBuilder: FormBuilder,
    public socialSerive: SocialService,
    public nativeGeocoder: NativeGeocoder,
    public menu: MenuController,
    public toastController: ToastController,
    private t: TranslateService,
  ) {

    t.get("loginSelectionPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });

    this.phoneForm = new FormGroup({
      phone: new FormControl(undefined, [Validators.required])
    });
    this.phoneForm.valueChanges.subscribe(x => {
      if (this.phoneForm.valid) {
        this.next(x.phone.e164Number);
      }
    })
  }

  respFromLanguage: any;

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.respFromLanguage.pleaseWait,
      duration: 9000
    });
    await loading.present();
  }
  async ngOnInit() {
    this.windowRef = await window;
    this.windowRef.recaptchaVerifier = await new firebase.auth
      .RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
      });
    await this.windowRef.recaptchaVerifier.render();
    this.menu.enable(false);
  }
  asGuestLogin() {
    this.presentLoading()
    let data = {
      city: '',
      address: '',
      postalCode: '',
      currentLat: 0,
      currentLng: 0
    }
    this.geolocation.getCurrentPosition().then((resp: any) => {
      data.currentLat = resp.coords.latitude;
      data.currentLng = resp.coords.longitude;
      this.nativeGeocoder.reverseGeocode(data.currentLat, data.currentLng)
        .then((reversecoder: NativeGeocoderResult[]) => {
          data.city = reversecoder[0].locality;
          data.address = reversecoder[0].subLocality + ' ' + reversecoder[0].thoroughfare;
          data.postalCode = reversecoder[0].postalCode;
          // Sign Up With All Data
          this.signUp(data);
        }, err => {
          // Sign Up With Only Lat Lng
          this.signUp(data);
        })
    }, err => {
      // Sign Up With Out Data
      this.signUp(data);
    })
  }
  currentLat = 0;
  currentLng = 0;

  ionViewWillEnter() {
  }
  signUp(data) {
    this.authService.signUpWithoutData(data)
      .subscribe((resp: any) => {
        localStorage.setItem('user', JSON.stringify(resp.passenger))
        this.loadingController.dismiss();
        this.router.navigate(['/booking-options']);
      }, err => {
        this.loadingController.dismiss();
      })
  }
  fblog() { }
  gplog() {
    this.socialSerive.gplog();
  }
  windowRef: any;
  errMessage = "";
  async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      duration: 5000,
      message: this.respFromLanguage.pleaseWait,
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
  next(e164Number) {
    let pNumber = e164Number;
    pNumber = pNumber.substr(1, pNumber.length);
    this.presentLoadingWithOptions()
    const appVerifier = this.windowRef.recaptchaVerifier;
    firebase.auth().signInWithPhoneNumber(e164Number, appVerifier)
      .then(result => {
        this.loadingController.dismiss()
        this.windowRef.confirmationResult = result;
        this.router.navigate(['/otp-confirmation/' + pNumber])
      }).catch(err => {
        this.loadingController.dismiss()
        this.presentToast(this.respFromLanguage.somethingWentsWrong)
      })
  }
}
