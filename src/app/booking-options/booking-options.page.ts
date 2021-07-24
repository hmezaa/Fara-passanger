import { VoiceModalPage } from './../voice-modal/voice-modal.page';
import { VoicerecorderService } from './../services/voicerecorder.service';
import { Component, ViewChild } from '@angular/core';
import { AlertController, LoadingController, MenuController, ToastController, Platform, ModalController } from '@ionic/angular';
import { DataService } from '../services/data.service';
import { DriverService } from '../services/driver.service';
import { LocationService } from '../services/location.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { IonSlides } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-booking-options',
  templateUrl: './booking-options.page.html',
  styleUrls: ['./booking-options.page.scss'],
})
export class BookingOptionsPage {
  socket = io(environment.baseUrl);
  constructor(
    public router: Router,
    private alertController: AlertController,
    public dataService: DataService,
    public driverService: DriverService,
    private toastController: ToastController,
    public bookingService: BookingService,
    public locationService: LocationService,
    public menuController: MenuController,
    public modalController: ModalController,
    public loadingController: LoadingController,
    public geolocation: Geolocation,
    public callNumber: CallNumber,
    public voiceRecorderService: VoicerecorderService,
    private t: TranslateService,
  ) {

    t.get("bookingOptionsPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });

    this.menuController.enable(true);
  }

  respFromLanguage: any;

  @ViewChild('mySlider') slides: IonSlides;

  isCityAvailable() {
    return JSON.parse(localStorage.getItem('user')).city
  }
  changeCity() {
    if (JSON.parse(localStorage.getItem('user')).city) {
      this.askCity(this.respFromLanguage.switchCity, 'OnlyChangeCity');
    } else {
      this.askCity(this.respFromLanguage.chooseCity, 'OnlyChangeCity');
    }
  }
  async voiceOrder() {
    if (JSON.parse(localStorage.getItem('user')).city) {
      if (localStorage.getItem('voiceOrderInstructions')) {
        this.presentAudioModal()
      } else {
        this.voiceOrderConfirmed_with_instructions();
      }
    } else {
      this.askCity(this.respFromLanguage.chooseCity, 'voiceOrder');
    }
  }
  async voiceOrderConfirmed_with_instructions() {
    const alert = await this.alertController.create({
      header: 'How to use?',
      cssClass: 'voiceorderAlert',
      message: this.respFromLanguage.voiceOrderMsg,
      buttons: [{
        text: this.respFromLanguage.letsGo,
        handler: () => {
          localStorage.setItem('voiceOrderInstructions', '-');
          this.presentAudioModal();
        }
      }]
    });
    await alert.present();
  }
  async presentAudioModal() {
    const modal = await this.modalController.create({
      component: VoiceModalPage,
      cssClass: 'askpayway'
    });
    await modal.present();
  }
  noOfReservedBookings = 0;
  allCatalogsArray = [];

  citesByAdmin = [];
  selectedValue = {
    vehicleTypeId: 0,
    vehicle_type: {
      vehicleName: ''
    },
    priceInCity: 0
  };
  curruntIndexOfSlider = 0;
  slideChanged() {
    this.slides.getActiveIndex().then((index: number) => {
      this.curruntIndexOfSlider = index;
    });
  }
  slidePrev() {
    this.slides.slidePrev();
  }

  slideNext() {
    this.slides.slideNext();
  }

  openMenu() {
    this.menuController.open();
  }
  ionViewWillEnter() {
    if (JSON.parse(localStorage.getItem('user')).city) {
      this.dataService.getAllCatalogsByCity(JSON.parse(localStorage.getItem('user'))?.city)
        .subscribe((resp: any) => {
          this.allCatalogsArray = resp;
        });
    }
    this.dataService.getAllCities().subscribe((resp: any) => {
      this.citesByAdmin = resp;
    });
    this.locationService.updateLocationInstantly();
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName
        + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }

  selectOnMap() {
    this.router.navigate(['/home'])
  }
  OrderAtCurruntLocationValidation() {
    if (JSON.parse(localStorage.getItem('user')).city) {
      if (this.allCatalogsArray[this.curruntIndexOfSlider].vehicleTypeId) {
        this.dataService.getAllCatalogsByCity(JSON.parse(localStorage.getItem('user'))?.city)
          .subscribe((resp: any) => {
            this.allCatalogsArray = resp;
            this.confirmOrderAtConfirmLocationFinalStep
              (this.allCatalogsArray[this.curruntIndexOfSlider].vehicleTypeId);
          });
      } else {
        this.confirmOrderAtConfirmLocationFinalStep
          (this.allCatalogsArray[this.curruntIndexOfSlider].vehicleTypeId);
      }
    } else {
      this.askCity(this.respFromLanguage.chooseCity, 'orderAtCurrentLocation');
    }
  }
  confirmOrderAtConfirmLocationFinalStep(vehicleTypeId) {
    this.loader(this.respFromLanguage.confirming);
    let queueRequestObject = {
      vehicleTypeId: vehicleTypeId,
      cityName: JSON.parse(localStorage.getItem('user')).city,
      number: 1
    }
    this.bookingService.findDriverInQueue(queueRequestObject)
      .subscribe((resp: any) => {

        let passengerObj = {
          firstName: JSON.parse(localStorage.getItem('user')).firstName,
          lastName: JSON.parse(localStorage.getItem('user')).lastName,
          id: JSON.parse(localStorage.getItem('user')).id,
          image: JSON.parse(localStorage.getItem('user')).image
        }
        let data = {
          currentAddress: "",
          currentLat: 0,
          currentLng: 0,
          driverId: resp,
          passengerId: JSON.parse(localStorage.getItem('user')).id,
          passenger: passengerObj,
          number: 1,
          vehicleTypeId: vehicleTypeId,
          cityName: JSON.parse(localStorage.getItem('user')).city,
        }
        localStorage.setItem('orderAtCurruntLocation', 'true');
        localStorage.setItem('findDriverObject_OrderAtCurruntLocation', JSON.stringify(data));
        this.loadingController.dismiss();
        this.router.navigate(['/tracking2']);

      }, err => {
        this.loadingController.dismiss();
        this.presentToast(this.respFromLanguage.driverNotFound, 'danger');
      })
  }
  call() {
    if (JSON.parse(localStorage.getItem('user')).phoneNumber) {
      if (JSON.parse(localStorage.getItem('user')).city) {
        // yes or no
        this.areYouInCity('orderByDirectCall');
      } else {
        // please enter you city name
        this.askCity(this.respFromLanguage.switchCity, 'orderByDirectCall');
      }
    } else {
      if (JSON.parse(localStorage.getItem('user')).city) {
        // yes or no
        this.askPhone('orderByDirectCall');
      } else {
        // ask phone number
        this.askPhoneAndCity('orderByDirectCall');
      }
    }
  }

  // Order And Driver will call you functionality start from here
  orderAndWillDriveCallObject = {
    phoneNumber: JSON.parse(localStorage.getItem('user')).phoneNumber,
    city: JSON.parse(localStorage.getItem('user')).city
  }
  orderAndWillDriveCall() {
    if (JSON.parse(localStorage.getItem('user')).phoneNumber) {
      if (JSON.parse(localStorage.getItem('user')).city) {
        // yes or no
        this.areYouInCity('driverWillCallYou');
      } else {
        // please enter you city name
        this.askCity(this.respFromLanguage.switchCity, 'driverWillCallYou');
      }
    } else {
      if (JSON.parse(localStorage.getItem('user')).city) {
        // yes or no
        this.askPhone('driverWillCallYou');
      } else {
        // ask phone number
        this.askPhoneAndCity('driverWillCallYou');
      }
    }
  }
  async areYouInCity(method) {
    if (method == 'orderByDirectCall') {
      this.directCall();
    } else {
      this.Confirmed_OrderAndDriverWillCallYou();
    }
  }
  directCall() {
    let data = {
      cityName: JSON.parse(localStorage.getItem('user'))?.city
    }
    this.bookingService.getUniqeDriverByCityName(data)
      .subscribe((resp: any) => {
        if (resp) {
          if (resp.phone_numbers.length !== 0) {
            // show call dialog
            console.log(resp.phone_numbers[0].number)
            this.callNumber.callNumber(resp.phone_numbers[0].number, true)
              .then(res => {
              });
          } else {
            this.presentToast(this.respFromLanguage.serviceNotAvailable + resp.cityName, 'danger')
          }
        } else {
          this.presentToast(this.respFromLanguage.serviceNotAvailable + resp.cityName, 'danger')
        }
      })
  }
  async askCity(head, orderWay) {
    let radio_options = [];
    this.citesByAdmin.forEach((element, i) => {
      radio_options.push({
        type: 'radio',
        label: element.cityName,
        value: element.cityName,
        checked: element.cityName == JSON.parse(localStorage.getItem('user')).city
      });
    });
    const alert = await this.alertController.create({
      header: head,
      inputs: radio_options,
      mode: 'ios',
      buttons: [{
        text: this.respFromLanguage.ok,
        handler: (city) => {
          if (city) {
            this.orderAndWillDriveCallObject.city = city;
            let passenger_Local_Object = JSON.parse(localStorage.getItem('user'));
            passenger_Local_Object.city = this.orderAndWillDriveCallObject.city;
            localStorage.setItem('user', JSON.stringify(passenger_Local_Object));
            this.dataService.update_City(this.orderAndWillDriveCallObject).subscribe((resp: any) => { })
            if (orderWay == 'driverWillCallYou') {
              this.Confirmed_OrderAndDriverWillCallYou();
            } else if (orderWay == 'orderByDirectCall') {
              this.directCall();
            } else if (orderWay == 'orderAtCurrentLocation') {
              this.confirmOrderAtConfirmLocationFinalStep(this.allCatalogsArray[this.curruntIndexOfSlider].vehicleTypeId);
            } else if (orderWay == 'voiceOrder') {
              this.voiceOrderConfirmed_with_instructions();
            }
            else if (orderWay == 'OnlyChangeCity') {
              // Nothing To Do
            }
          } else {
            return false;
          }
        }
      }
      ]
    });

    await alert.present();
  }

  async askPhone(method) {
    const alert = await this.alertController.create({
      header: this.respFromLanguage.phoneConfirmation,
      inputs: [
        {
          type: 'number',
          placeholder: this.respFromLanguage.enterPhone,
          name: 'phoneNumber'
        }
      ],
      buttons: [{
        text: 'Okay',
        handler: (data) => {
          if (data.phoneNumber) {
            // update phone Number in database and confirm order
            this.orderAndWillDriveCallObject.phoneNumber = data.phoneNumber;
            let passenger_Local_Object = JSON.parse(localStorage.getItem('user'));
            passenger_Local_Object.phoneNumber = this.orderAndWillDriveCallObject.phoneNumber;
            localStorage.setItem('user', JSON.stringify(passenger_Local_Object));
            this.dataService.update_Phone_Number_And_Is_Anonymous(this.orderAndWillDriveCallObject)
              .subscribe((resp: any) => { })
            this.areYouInCity(method);
          } else {
            return false;
          }
        }
      }
      ]
    });

    await alert.present();
  }
  async askPhoneAndCity(method) {
    const alert = await this.alertController.create({
      header: this.respFromLanguage.cityAndPhoneRequired,
      inputs: [
        {
          type: 'number',
          placeholder: this.respFromLanguage.enterPhone,
          name: 'phoneNumber'
        }
      ],
      buttons: [{
        text: 'Next',
        handler: (data) => {
          if (data.phoneNumber) {
            this.orderAndWillDriveCallObject.phoneNumber = data.phoneNumber;
            let passenger_Local_Object = JSON.parse(localStorage.getItem('user'));
            passenger_Local_Object.phoneNumber = this.orderAndWillDriveCallObject.phoneNumber;
            localStorage.setItem('user', JSON.stringify(passenger_Local_Object));
            this.dataService.update_Phone_Number_And_Is_Anonymous(this.orderAndWillDriveCallObject)
              .subscribe((resp: any) => { })
            if (method == 'orderByDirectCall') {
              this.askCity(this.respFromLanguage.chooseCity, 'orderByDirectCall');
            } else {
              this.askCity(this.respFromLanguage.chooseCity, 'driverWillCallYou');
            }
          } else {
            return false;
          }
        }
      }
      ]
    });

    await alert.present();
  }
  Confirmed_OrderAndDriverWillCallYou() {
    this.driverService.find_driver_by_city(this.orderAndWillDriveCallObject)
      .subscribe((resp: any) => {
        if (resp !== 'Driver Not Found') {
          const params = {
            driverId: resp.driverId,
            declineDriversIdArray: null,
            city: this.orderAndWillDriveCallObject.city,
            phoneNumber: this.orderAndWillDriveCallObject.phoneNumber
          };
          console.log(params)
          this.socket.emit('order-and-driver-will-call-you-by-city', params);
          this.presentToast(this.respFromLanguage.dear + this.getName() + this.respFromLanguage.willRecieveCall, 'success');
        } else {
          this.presentToast(this.respFromLanguage.dear + this.getName() + this.respFromLanguage.driverNotFoundIn + this.orderAndWillDriveCallObject.city, 'danger');
        }
      })
  }
  // Order And Driver will call you functionality ended from here
  async presentToast(mes, color) {
    const toast = await this.toastController.create({
      message: mes,
      mode: 'ios',
      color: color,
      position: 'bottom',
      duration: 2500
    });
    toast.present();
  }
  async loader(mes) {
    const loading = await this.loadingController.create({
      message: mes,
      duration: 9000,
    });
    await loading.present();
  }

}
