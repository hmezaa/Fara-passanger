import { TranslateService } from '@ngx-translate/core';
import { BookingService } from './services/booking.service';
import { DataService } from './services/data.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { MenuController, Platform, ModalController, NavController, AlertController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { LocationService } from './services/location.service';
import { SocialService } from './services/social.service';
import { TranslateConfigService } from './services/translate-config.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  socket = io(environment.baseUrl);
  url = environment.baseUrl;
  constructor(
    public menuController: MenuController,
    public r: Router,
    private socialSharing: SocialSharing,
    public locationService: LocationService,
    public platform: Platform,
    public translateService: TranslateConfigService,
    public socialserive: SocialService,
    public modalController: ModalController,
    public nav: NavController,
    public t: TranslateService,
    public alertController: AlertController,
    public dataService: DataService,
    public bookingService: BookingService
  ) {
    if (this.translateService.selectedLanguage() == undefined) {
      if (localStorage.getItem('defaultLng')) {
        this.translateService.setLanguage(localStorage.getItem('defaultLng'));
      } else {
        this.translateService.setLanguage('ru');
      }
    }
    if (!platform.is("cordova")) {
      locationService.TrackPassengerLocation();
    } else {
      locationService.checkGPSPermission();
    }
    this.closeApp();
    this.runSocket();
    if (localStorage.getItem('user')) {
      this.dataService.getAvailabilityStatus().subscribe((resp: any) => {
        console.log(resp)
        if (resp.isPassengerAvailable) {
          this.dataService.removeBookingLocalSaves();
        } else {
          if (localStorage.getItem('tracking2')) {
            this.r.navigate(['/tracking2']);
          }
        }
      })
      if (!localStorage.getItem('tracking2')) {
        this.bookingService.isAnyReserveBookingStarted().subscribe((resp: any) => {
          if (resp !== null) {
            let data = {
              driverObj: resp.driver,
              passengerId: resp.passengerId,
              vehicleObj: {
                vehicleByDriver: resp.driver.vehicles[0]
              }
            }
            localStorage.setItem('tracking', JSON.stringify(data));
            localStorage.setItem('findDriverObjWithAllInfo', JSON.stringify(resp));
            localStorage.setItem('driverStartedReserveBooking', 'true');
            this.r.navigate(['/tracking2']);
          }
        })
      }
    }
  }

  navlist = [
    { title: 'Home', icon: 'home-outline', route: '/booking-options', },
    { title: 'MyTrips', icon: 'car-outline', route: '/my-bookings', },
    { title: 'ReserverdTrips', icon: 'calendar-outline', route: '/reserved-bookings', },
    { title: 'PaymentMethods', icon: 'cash-outline', route: '/payment-methods', },
    { title: 'Profile', icon: 'person-outline', route: '/profile', },
    { title: 'News', icon: 'newspaper-outline', route: '/news', },
    { title: 'ChangeLanguage', icon: 'language-outline', route: '/lang', },
    { title: 'InviteFriend', icon: 'person-add-outline', route: '/invite-friends', },
    { title: 'HelpAndSupport', icon: 'help-circle-outline', route: '/help-and-support', }
  ]

  sendInvitation() {
    let url = 'https://play.google.com/store/apps/details?id=com.fara.passenger';
    let message = this.getName() + " has invited you to join FARA TAXI App.";
    this.socialSharing.share(message, 'Fara Taxi', null, url)
  }

  route(r) {
    this.menuController.close();
    if (r == '/lang') {
      this.changeLanguage();
    } else if (r == '/invite-friends') {
      this.sendInvitation();
    } else {
      this.r.navigate([r])
    }
  }

  async changeLanguage() {
    let respFromLanguage;
    let selectedLang = this.translateService.selectedLanguage();
    this.t.get("sideMenu").subscribe((resp: any) => {
      respFromLanguage = resp;
    });
    let isEn = false;
    let isRu = false;
    let isUa = false;
    if (selectedLang == 'en') {
      isEn = true;
    } else if (selectedLang == 'ua') {
      isUa = true;
    } else {
      isRu = true;
    }
    const alert = await this.alertController.create({
      header: respFromLanguage.changeLanguage,
      inputs: [
        {
          name: 'English',
          type: 'radio',
          label: 'English',
          value: 'en',
          checked: isEn
        },
        {
          name: 'Ukraine',
          type: 'radio',
          label: 'Ukraine',
          value: 'ua',
          checked: isUa
        },
        {
          name: 'Russian',
          type: 'radio',
          label: 'Russian',
          value: 'ru',
          checked: isRu
        }
      ],
      buttons: [
        {
          text: respFromLanguage.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          }
        }, {
          text: respFromLanguage.change,
          handler: (val) => {
            localStorage.setItem('defaultLng', val)
            this.translateService.setLanguage(val);
          }
        }
      ]
    });

    await alert.present();
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  getPhone() {
    if (localStorage.getItem('user'))
      if (JSON.parse(localStorage.getItem('user')).phoneNumber) {
        return "+" + JSON.parse(localStorage.getItem('user')).phoneNumber;
      }
  }
  getImg() {
    if (localStorage.getItem('user'))
      if (JSON.parse(localStorage.getItem('user')).image) {
        return this.url + JSON.parse(localStorage.getItem('user')).image;
      } else {
        return 'assets/noimg.png';
      }
  }
  logOut() {
    this.socialserive.logOut()
  }
  closeApp() {
    this.platform.backButton.subscribeWithPriority(999999, () => {
      this.modalController.getTop().then(resp => {
        if (resp == undefined) {
          if (this.r.url == '/home') {
            navigator['app'].exitApp();
          } else if (this.r.url == '/tracking2') {
            // Nothing to do here
          }
          else {
            this.nav.back();
          }
        } else {
          this.modalController.dismiss();
        }
      })
    })
  }
  cancelRideReturner() {
    if (localStorage.getItem('user'))
      return 'canceled-reserved' + JSON.parse(localStorage.getItem('user')).id;
    else
      return false;
  }
  acceptRideReturner() {
    if (localStorage.getItem('user'))
      return 'informpassenger-reservedstatuschanged' + JSON.parse(localStorage.getItem('user')).id;
    else
      return false;
  }
  runSocket() {
    console.log('socket runging')
    this.socket.on(this.cancelRideReturner(), (data) => {
      this.rideCancelledAlert();
    })
    this.socket.on(this.acceptRideReturner(), (data) => {
      console.log(data);
      localStorage.setItem('tracking', JSON.stringify(data.tracking));
      localStorage.setItem('findDriverObjWithAllInfo', JSON.stringify(data.findDriverObj));
      localStorage.setItem('driverStartedReserveBooking', 'true');
      this.r.navigate(['/tracking2']);
    })
  }
  async rideCancelledAlert() {
    const alert = await this.alertController.create({
      header: 'Reserve Booking Canceled',
      message: 'Your reserve booking is canceled.',
      buttons: ['OK']
    });

    await alert.present();
  }
}
