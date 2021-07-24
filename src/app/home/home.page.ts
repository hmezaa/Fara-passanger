import { environment } from './../../environments/environment.prod';
import { Component, ViewChild } from '@angular/core';
import {
  AgmMap,
  MapsAPILoader,
} from "@agm/core";
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController, MenuController, ModalController, NavController, Platform, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataService } from '../services/data.service';
import { LocationService } from '../services/location.service';
import { Router } from '@angular/router';
import { SearchLocationPage } from '../search-location/search-location.page';
import { ReserveBookingConfirmationPage } from '../reserve-booking-confirmation/reserve-booking-confirmation.page';
import { AskPaymentWayPage } from '../ask-payment-way/ask-payment-way.page';
import { BookingService } from '../services/booking.service';
import { TranslateService } from '@ngx-translate/core';
declare var google: any;
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  url = environment.baseUrl;
  constructor(
    public loadingController: LoadingController,
    private mapsAPILoader: MapsAPILoader,
    public nativeGeocoder: NativeGeocoder,
    public platform: Platform,
    public menuController: MenuController,
    public toastController: ToastController,
    public dataservice: DataService,
    public modalController: ModalController,
    private geolocation: Geolocation,
    public locationservice: LocationService,
    public alertCtrl: AlertController,
    public bookingService: BookingService,
    public r: Router,
    private t: TranslateService,
  ) {
    t.get("homePage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;

  async showAlert(title, msg) {
    const alert = await this.alertCtrl.create({
      header: title,
      message: msg,
      buttons:
        [
          {
            text: this.respFromLanguage.ok,
            handler: () => {
            }
          }
        ]
    })
    alert.present();
  }
  latitude: number;
  longitude: number;
  currntLAT = 750;
  currntLONG = 700;
  private geoCoder;
  public origin = '';
  public destination = '';
  public renderOptions = {
    suppressMarkers: true,
    polylineOptions: { strokeColor: '#02353c', strokeWeight: 4 }
  }
  currentMarkerAnimation = 'BOUNCE';
  // animation: 'BOUNCE' | 'DROP';
  public currentMarker = {
    url: 'assets/currentMarkerGif.gif',
    scaledSize: {
      width: 50,
      height: 50
    }
  }
  public markerOptions = {
    origin: {
      icon: {
        url: 'assets/dot.png',
        scaledSize: {
          width: 20,
          height: 20
        }
      },
      infoWindow: 'My Location',
      draggable: true,
    },
    destination: {
      icon: {
        url: 'assets/destination.png',
        scaledSize: {
          width: 70,
          height: 50
        }
      },
      infoWindow: 'My Destination',
      draggable: true,
    },
    travelMode: "DRIVING",
  }
  currentLatitude = 0;
  currentLongitude = 0;
  passengerObj = {
    firstName: JSON.parse(localStorage.getItem('user'))?.firstName,
    lastName: JSON.parse(localStorage.getItem('user'))?.lastName,
    phoneNumber: JSON.parse(localStorage.getItem('user'))?.phoneNumber,
    id: JSON.parse(localStorage.getItem('user'))?.id,
    image: JSON.parse(localStorage.getItem('user'))?.image
  };
  totaldistance = '';
  totaltime = '';

  FindDriverObj = {
    currentLat: 0,
    currentLng: 0,
    reserveCode: '',
    vehicleName: "",
    paymentVia: 'cash',
    passenger: this.passengerObj,
    passengerId: JSON.parse(localStorage.getItem('user')).id,
    currentAddress: '',
    destination: '',
    estTime: '',
    isReserved: false,
    isFromAdmin: false,
    totalKM: 0,
    journeyCost: "",
    vehicleTypeId: 0,
    driverId: 0,
    date: '',
    time: '',
    isAmOrPm: '',
    city: JSON.parse(localStorage.getItem('user')).city
  }
  directionCondition = false;
  totaldistanceInNumeric = 0;
  zoom = 18;
  getPrice() {
    if (this.selectedValue.priceInCity && (this.totaldistanceInNumeric !== 0)) {
      let x = (this.totaldistanceInNumeric / 1000) * JSON.parse(this.selectedValue.priceInCity).toFixed(1);
      x = JSON.parse(x + this.selectedValue.supply);
      return x.toFixed(1).toString();
    }
    else
      return '0';
  }
  selectedValue = {
    cashBackPrecentage: "",
    image: null,
    priceByCity: "0",
    priceInCity: "0",
    priceLate1Minute: "",
    radius: "",
    supply: null,
    priceOutCity: "0",
    updatedAt: "",
    vehicle_type: {
      vehicleName: "",
      image: ''
    },
    id: 0
  }
  segmentChanged(event) {
    console.log('segmentChanged+event', event)
    this.selectedValue = event.detail.value;
    this.FindDriverObj.vehicleTypeId = this.selectedValue.id
    this.FindDriverObj.vehicleName = this.selectedValue.vehicle_type.vehicleName;
  }
  @ViewChild(AgmMap) agmMap: AgmMap;
  async presentToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      mode: 'ios',
      position: 'top',
      duration: 2000
    });
    toast.present();
  }
  VehiclesPackages = [];

  ionViewWillEnter() {
    // this.presentNewHomeModal();
    this.bookingService.getAllVehiclePackages().subscribe((resp: any) => {
      console.log(resp)
      this.VehiclesPackages = resp;
      this.selectedValue = resp[0];
      this.FindDriverObj.vehicleName = resp[0].vehicle_type.vehicleName
      this.FindDriverObj.vehicleTypeId = resp[0].id
    })
    this.zoom = 18;
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.setCurrentLocation();
    });
    let availabilityData = {
      isAvailable: true
    }
    let id = JSON.parse(localStorage.getItem('user')).id;
    this.dataservice.passengerAvailablity(id, availabilityData).subscribe((resp: any) => {
      console.log(resp)
    })
  }
  ShowDestinationCondition = false;
  ShowDestinationClick() {
    this.ShowDestinationCondition = true;
  }
  HideDestinationClick() {
    this.ShowDestinationCondition = false;
  }
  public getMapInstance(map: any): void {
    this.map = map;
  };
  map: any;
  locationClick() {
    this.map.setCenter({ lat: this.latitude, lng: this.longitude });
    this.map.zoom = 18;
    this.zoom = 18;
    setTimeout(() => {
      this.map.setCenter({ lat: this.latitude, lng: this.longitude });
      this.map.zoom = 18;
      this.zoom = 18;
    }, 300);
  }

  setCurrentLocation() {
    let options = {
      maximumAge: 3000,
      enableHighAccuracy: true
    };
    this.geolocation.getCurrentPosition(options).then
      ((position: any) => {
        this.latitude = parseFloat(position.coords.latitude);
        this.longitude = parseFloat(position.coords.longitude);
        this.FindDriverObj.currentLat = this.latitude;
        this.FindDriverObj.currentLng = this.longitude;
        this.currentLatitude = parseFloat(position.coords.latitude);
        this.currentLongitude = parseFloat(position.coords.longitude);
      });
    let watchPositionTrigger = 0;
    this.geolocation.watchPosition().subscribe((coords: any) => {
      watchPositionTrigger = watchPositionTrigger + 1;
      this.latitude = parseFloat(coords.coords.latitude);
      this.longitude = parseFloat(coords.coords.longitude);
      this.FindDriverObj.currentLat = this.latitude;
      this.FindDriverObj.currentLng = this.longitude;
      if (watchPositionTrigger == 7) {
        if (!this.directionCondition) {
          this.map.setCenter({ lat: this.latitude, lng: this.longitude });
        }
        this.currentLatitude = this.latitude;
        this.currentLongitude = this.longitude;
        watchPositionTrigger = 0;
      }
    });
  }
  public onResponse(event: any) {
    if (event.status == "NOT_FOUND") {
      this.directionCondition = false;
      this.loadingController.dismiss();
      this.presentToast(this.respFromLanguage.invalidRoute, 'danger');
    } else if (event.status == "ZERO_RESULTS") {
      this.directionCondition = false;
      this.loadingController.dismiss();
      this.presentToast(this.respFromLanguage.invalidRoute, 'danger');
    }
    else {
      this.totaldistance = event.routes[0]?.legs[0].distance.text;
      this.totaldistanceInNumeric = event.routes[0]?.legs[0].distance.value;
      this.totaltime = event.routes[0]?.legs[0].duration.text;
      let totalKm = event.routes[0]?.legs[0].distance.value;
      this.FindDriverObj.totalKM = totalKm / 1000;
      this.FindDriverObj.estTime = this.totaltime;
    }
  }
  markerDragEndDestination(event: any) {
    let coords = JSON.stringify(event);
    let coords3 = JSON.parse(coords);
    this.geoCoder.geocode({ 'location': { lat: coords3.lat, lng: coords3.lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18;
          this.destination = results[0].formatted_address;
          this.FindDriverObj.destination = results[0].formatted_address;
        } else {
        }
      }
    });
  }
  markerDragEndOrigin(event: any) {
    let coords = JSON.stringify(event);
    let coords3 = JSON.parse(coords);
    this.geoCoder.geocode({ 'location': { lat: coords3.lat, lng: coords3.lng } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 18;
          this.origin = results[0].formatted_address;
          this.FindDriverObj.currentAddress = results[0].formatted_address;
        } else {
        }
      }
    });
  }
  getDirection() {
    if ((this.destination !== '') && (this.origin !== '')) {
      setTimeout(() => {
        this.presentLoading();
        this.directionCondition = true;
        new google.maps.event.trigger(this.agmMap, 'resize');
      }, 900);
    } else {
      this.presentToast(this.respFromLanguage.enterDest, 'danger');
    }
  }

  CancelClick() {
    this.directionCondition = false;
    this.ShowDestinationCondition = false;
    this.destination = '';
    this.locationClick();
  }
  ionViewWillLeave() {
    this.directionCondition = false;
    this.FindDriverObj = {
      currentLat: 0,
      currentLng: 0,
      vehicleName: "",
      reserveCode: '',
      paymentVia: 'cash',
      passenger: this.passengerObj,
      passengerId: JSON.parse(localStorage.getItem('user')).id,
      currentAddress: '',
      destination: '',
      estTime: '',
      isReserved: false,
      isFromAdmin: false,
      totalKM: 0,
      journeyCost: "",
      vehicleTypeId: 0,
      driverId: 0,
      date: '',
      time: '',
      isAmOrPm: '',
      city: JSON.parse(localStorage.getItem('user')).city
    }
    this.destination = '';
    this.ShowDestinationCondition = false;
    this.locationClick();
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.respFromLanguage.pleaseWait,
      duration: 7000,
      spinner: 'dots',
    });
    await loading.present();
  }
  lightMode = [
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]
  async openSearchModal() {
    const modal = await this.modalController.create({
      component: SearchLocationPage,
      mode: 'ios',
      swipeToClose: true,
      cssClass: 'searchModal'
    });
    await modal.present();
    await modal.onDidDismiss().then((response: any) => {
      if (response.data) {
        this.origin = response.data.origin;
        this.destination = response.data.destination;
        this.FindDriverObj.currentAddress = response.data.origin;
        this.FindDriverObj.destination = response.data.destination;
        this.directionCondition = true;
      } else {
        if ((this.origin && this.destination) == '') {
          this.directionCondition = false;
        }
      }
    });
  }
  randomString(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+=-';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  async reserveNow() {
    const modal = await this.modalController.create({
      component: ReserveBookingConfirmationPage,
      mode: 'ios',
    });
    await modal.present();
    await modal.onDidDismiss().then(value => {
      if (value.data.isReserved) {
        this.FindDriverObj.reserveCode = 'FARA' + new Date().getTime().toString();
        this.FindDriverObj.isReserved = true;
        this.FindDriverObj.date = value.data.date;
        this.FindDriverObj.time = value.data.time;
        this.FindDriverObj.isAmOrPm = value.data.isAmOrPm;
        // go to tracking
        this.rideNow();
      } else if (value.data) {
        this.FindDriverObj.isReserved = false;
        this.FindDriverObj.date = '';
        this.FindDriverObj.time = '';
        this.FindDriverObj.isAmOrPm = '';
        // go to tracking
        this.rideNow();
      }
    })
  }
  async askPaymentWay() {
    const modal = await this.modalController.create({
      component: AskPaymentWayPage,
      componentProps: { way: 2 },
      cssClass: 'askpayway'
    });
    await modal.present();
    modal.onDidDismiss().then((resp: any) => {
      console.log(resp);
      if (resp.data) {
        this.FindDriverObj.paymentVia = resp.data.payVia;
      }
    })
  }
  rideNow() {
    this.FindDriverObj.journeyCost = this.getPrice();
    console.log('rideNow + vehicleTypeId', this.FindDriverObj.vehicleTypeId)
    let queueRequestObject = {
      vehicleTypeId: this.FindDriverObj.vehicleTypeId,
      cityName: JSON.parse(localStorage.getItem('user')).city,
      number: 1
    }

    this.bookingService.findDriverInQueue(queueRequestObject).subscribe((dId: any) => {
      this.FindDriverObj.driverId = dId;
      console.log(this.FindDriverObj, 'f o')
      localStorage.setItem('findDriverObjWithAllInfo', JSON.stringify(this.FindDriverObj));
      this.r.navigate(['/tracking2']);
    }, err => {
      this.loadingController.dismiss();
      this.presentToast(this.respFromLanguage.driverNotFound, 'danger');
    })
  }
}
