import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { LoadingController, MenuController, ToastController } from '@ionic/angular';
import { Facebook } from '@ionic-native/facebook/ngx';
import { environment } from 'src/environments/environment';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root'
})
export class SocialService {
  user: any;
  isLoggedIn: boolean = false;
  url = environment.baseUrl;
  socialReqBody = {
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    postalCode: '',
    city: '',
    currentLat: 0,
    currentLng: 0,
    image: ''
  }
  constructor(
    private googlePlus: GooglePlus,
    public toastController: ToastController,
    public menuController: MenuController,
    public geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public transfer: FileTransfer,
    public file: File,
    public r: Router,
    public loadingController: LoadingController,
    private fb: Facebook,
    public alertController: AlertController,
    public authService: AuthService
  ) {
    fb.getLoginStatus()
      .then(res => {
        if (res.status === "connect") {
          this.isLoggedIn = true;
        } else {
          this.isLoggedIn = false;
        }
      })
    this.getLocation();
  }
  // facebook login
  getUserDetail(userid) {
    this.fb.api("/" + userid + "/?fields=id,email,name,picture,gender", ["public_profile"])
      .then(res => {
        localStorage.setItem('facebook', JSON.stringify(res));
        return true;
      })
      .catch(e => {
      });
  }
  fblog() {
    this.fb.login(['public_profile', 'email'])
      .then(res => {
        if (res.status === "connected") {
          this.isLoggedIn = true;
          this.getUserDetail(res.authResponse.userID);
        } else {
          this.isLoggedIn = false;
        }
      })
      .catch(e => { });
    return 0;
  }

  // google login
  gplog() {
    this.googlePlus.login({})
      .then(res => {
        if (res.accessToken) {
          localStorage.setItem('google', JSON.stringify(res));
          this.presentLoading();
          this.afterSocialLoginSuccess(res, 'Google');
        }
      })
      .catch(err => console.error(err));
    return 0;
  }
  afterSocialLoginSuccess(res, by) {
    if (by == 'Google') {
      this.socialReqBody.firstName = res.givenName;
      this.socialReqBody.lastName = res.familyName;
      this.socialReqBody.email = res.email;
      this.uploadFile(res.imageUrl);
    } else {
      // facebook do it later
    }
  }
  getLocation() {
    let currentlatitude;
    let currentlongitude;
    this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((resp: any) => {
      currentlatitude = resp.coords.latitude;
      currentlongitude = resp.coords.longitude;
      this.socialReqBody.currentLat = currentlatitude;
      this.socialReqBody.currentLng = currentlongitude;
      let opt: NativeGeocoderOptions = {
        useLocale: false,
        maxResults: 5
      };
      this.nativeGeocoder.reverseGeocode(currentlatitude, currentlongitude, opt)
        .then((result: NativeGeocoderResult[]) => {
          this.socialReqBody.city = result[0].locality;
          this.socialReqBody.address = result[0].subLocality + ' ' + result[0].thoroughfare;
          this.socialReqBody.postalCode = result[0].postalCode;
        })
    })
  }
  async presentToast(mes) {
    const toast = await this.toastController.create({
      message: mes,
      mode: 'ios',
      color: 'medium',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'loading-class',
      message: 'Please wait...',
      duration: 9000
    });
    await loading.present();
  }
  logOut() {
    this.menuController.close();
    this.menuController.enable(false);
    if (localStorage.getItem('google')) {
      this.googlePlus.logout();
    } else if (localStorage.getItem('facebook')) {
      this.fb.logout();
    }
    localStorage.clear();
    this.r.navigate(['/']);
  }
  // Upload Code
  uploadFile(link) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      httpMethod: 'POST'
    };
    fileTransfer.download(link, this.file.dataDirectory + 'socialAuthImageFara.png').then((entry: any) => {
      fileTransfer.upload(entry.toURL(), this.url + 'imageUpload', options)
        .then((data) => {
          let fileName = data.response.replace('"', '');
          fileName = fileName.replace('"', '');
          this.socialReqBody.image = fileName;
          this.callBackendApi_social_verifier();
        })
    }, err => {
      this.loadingController.dismiss();
    })
  }
  callBackendApi_social_verifier() {
    this.authService.socialVerifier(this.socialReqBody).subscribe((resp: any) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.passenger));
      this.r.navigate(['/booking-options'])
      this.loadingController.dismiss();
    })
  }
}
