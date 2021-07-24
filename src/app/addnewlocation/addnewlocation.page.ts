import { MapsAPILoader } from '@agm/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { AlertController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-addnewlocation',
  templateUrl: './addnewlocation.page.html',
  styleUrls: ['./addnewlocation.page.scss'],
})
export class AddnewlocationPage implements OnInit {

  constructor(
    private mapsAPILoader: MapsAPILoader,
    public dataservice: DataService,
    private geolocation: Geolocation,
    public nativeGeocoder: NativeGeocoder,
    public toastController: ToastController,
    public alertController: AlertController,
    private t: TranslateService,
  ) {
    t.get("favDestinationPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  respFromLanguage: any;

  ngOnInit() {
  }
  destinations = [];
  @ViewChild("placesRef") placesRef: GooglePlaceDirective;
  public handleAddressChange(address: Address) {
    this.presentAlertConfirm(address.formatted_address);
  }
  destinationValue = '';
  options = {
    types: [],
    componentRestrictions: {
      country: ['UA', 'PK']
    }
  }
  ionViewWillEnter() {
    this.mapsAPILoader.load().then(() => {
      this.geolocation.getCurrentPosition().then((resp: any) => {
        this.nativeGeocoder.reverseGeocode(resp.coords.latitude, resp.coords.longitude)
          .then((result: NativeGeocoderResult[]) => {
            this.dataservice.getContryCodeAndFlag(result[0].countryName).subscribe((innerResp: any) => {
              this.options.componentRestrictions = { country: innerResp[0].alpha2Code };
            })
          }, err => {
            this.options.componentRestrictions = {
              country: ['UA', 'PK']
            };
          })
      })
    });
    this.dataservice.saved_location_get().subscribe((resp: any) => {
      this.destinations = resp;
    })
  }
  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2100,
      mode: 'ios',
      color: color
    });
    toast.present();
  }
  async presentAlertConfirm(destination) {
    const alert = await this.alertController.create({
      header: this.respFromLanguage.addFavDest,
      message: this.respFromLanguage.addFavConfirm,
      inputs: [{
        name: 'title',
        type: 'text',
        placeholder: "Title"
      }],
      buttons: [
        {
          text: this.respFromLanguage.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            this.destinationValue = null;
          }
        }, {
          text: this.respFromLanguage.add,
          handler: (value) => {
            if (value.title == '') {
              return false;
            } else {
              let data = {
                routePath: destination,
                routeTitle: value.title,
                passengerId: JSON.parse(localStorage.getItem('user')).id
              }
              console.log(data)
              this.dataservice.saved_location_create(data).subscribe((resp: any) => {
                this.ionViewWillEnter();
                this.destinationValue = null;
                this.presentToast(this.respFromLanguage.locationAdded, 'success')
              })
            }
          }
        }
      ]
    });
    await alert.present();
    await alert.onDidDismiss().then(() => {
      this.destinationValue = null;
    })
  }
  removeLocation(item) {
    this.dataservice.saved_location_delete(item.id).subscribe((resp: any) => {
      this.ionViewWillEnter();
      this.presentToast(this.respFromLanguage.locationDeleted, 'danger')
    })
  }
}
