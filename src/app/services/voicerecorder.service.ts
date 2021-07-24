import { Router } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { BookingService } from './booking.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { environment } from './../../environments/environment';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { MediaCapture } from '@ionic-native/media-capture/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Injectable, NgZone } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media/ngx';
import { File } from '@ionic-native/file/ngx';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from './translate-config.service';
declare var google: any;

@Injectable({
  providedIn: 'root'
})
export class VoicerecorderService {
  private geoCoder;
  url = environment.baseUrl;
  constructor(
    public mediaCapture: MediaCapture,
    public transfer: FileTransfer,
    private loadingController: LoadingController,
    private toastController: ToastController,
    public geolocation: Geolocation,
    public bookingService: BookingService,
    private router: Router,
    public androidPermissions: AndroidPermissions,
    public platform: Platform,
    public file: File,
    private media: Media,
    public zone: NgZone,
    private t: TranslateService,
    private translateService: TranslateConfigService,
  ) {
    if (this.translateService.selectedLanguage() == undefined) {
      if (localStorage.getItem('defaultLng')) {
        this.translateService.setLanguage(localStorage.getItem('defaultLng'));
      } else {
        this.translateService.setLanguage('ru');
      }
      t.get("voiceOrderService").subscribe((resp: any) => {
        this.respFromLanguage = resp;
      })
    }

    this.geoCoder = new google.maps.Geocoder;
  }
  respFromLanguage: any;

  audioPath;
  audio;
  isAudioRecordingStarted;
  isAudioRecordingEnded;
  fileName;
  anyVal: any;
  retake() {
    this.audioPath = this.anyVal;
    this.audio = this.anyVal;
    this.isAudioRecordingStarted = this.anyVal;
    this.isAudioRecordingEnded = this.anyVal;
    this.fileName = this.anyVal;
  }
  captureAudio() {
    try {
      this.audioPath = '';;
      this.fileName =
        'record' +
        new Date().getDate() +
        new Date().getMonth() +
        new Date().getFullYear() +
        new Date().getHours() +
        new Date().getMinutes() +
        new Date().getSeconds();
      // let filePath = '';
      if (this.platform.is('ios')) {
        this.fileName = this.fileName + '.m4a';
        this.audioPath = this.file.documentsDirectory + this.fileName;
        this.audio = this.media.create(this.audioPath.replace(/file:\/\//g, ''));
      } else if (this.platform.is('android')) {
        this.fileName = this.fileName + '.mp3';
        this.audioPath = this.file.externalDataDirectory + this.fileName;
        this.audio = this.media.create(this.audioPath.replace(/file:\/\//g, ''));
      }
      this.audio.startRecord();
      this.isAudioRecordingStarted = true;
      this.isAudioRecordingEnded = false;
    } catch (error) {
      console.log(error);
    }
  }
  stopAudio() {
    this.audio.stopRecord();
    this.isAudioRecordingStarted = false;
    this.isAudioRecordingEnded = true;
  }
  mediaTimer;
  message;
  isPlaying = false;
  returnerIsPlaying() {
    return this.isPlaying;
  }
  playAudio() {
    try {
      this.isPlaying = true;
      this.audio.play();
      this.audio.setVolume(0.8);
      this.audio.onStatusUpdate.subscribe(status => {
        if (status == 4) {
          this.zone.run(() => {
            this.isPlaying = false;
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
  stopAudioPlaying() {
    try {
      this.audio.pause();
      this.isPlaying = false;
    } catch (error) {
      console.log(error);
    }
  }
  async presentToast(mes, color) {
    const toast = await this.toastController.create({
      message: mes,
      mode: 'ios',
      color: color,
      position: 'bottom',
      duration: 2100
    });
    toast.present();
  }

  uploadFile() {
    this.loader(this.respFromLanguage.pleaseWait);
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'file',
      fileName: this.fileName,
      httpMethod: 'POST'
    };
    fileTransfer.upload(this.audioPath, this.url + 'imageUpload', options, true)
      .then((data) => {
        let fname = data.response.replace('"', '');
        fname = fname.replace('"', '');
        this.loadingController.dismiss()
        this.SendVoiceToServer(fname);
        this.loadingController.dismiss();
      }, (err) => {
        this.presentToast(JSON.stringify(err), 'danger');
        console.log('error', err);
        this.loadingController.dismiss();
      });
  }
  SendVoiceToServer(fileName) {
    this.loader(this.respFromLanguage.confirmingOrder);
    let queueRequestObject = {
      cityName: JSON.parse(localStorage.getItem('user')).city,
      number: 1
    }
    this.bookingService.findDriverInQueueWithoutVehicleType(queueRequestObject).subscribe((resp: any) => {
      let geolocation = this.geolocation.getCurrentPosition();
      geolocation.then((coords: any) => {
        this.geoCoder.geocode({ location: { lat: coords.coords.latitude, lng: coords.coords.longitude, } }, (results, status) => {
          let passengerObj = {
            firstName: JSON.parse(localStorage.getItem('user')).firstName,
            lastName: JSON.parse(localStorage.getItem('user')).lastName,
            id: JSON.parse(localStorage.getItem('user')).id,
            image: JSON.parse(localStorage.getItem('user')).image
          }
          if (status === 'OK' && results[0]) {
            let data = {
              currentAddress: results[0].formatted_address,
              currentLat: coords.coords.latitude,
              currentLng: coords.coords.longitude,
              driverId: resp,
              passengerId: JSON.parse(localStorage.getItem('user')).id,
              passenger: passengerObj,
              number: 1,
              cityName: JSON.parse(localStorage.getItem('user')).city,
              voiceOrder: true,
              recording: fileName
            }
            localStorage.setItem('voiceOrder', 'true');
            localStorage.setItem('findDriverObject_VoiceOrder', JSON.stringify(data));
            this.loadingController.dismiss();
            this.router.navigate(['/tracking2']);
          }
        }, err => { this.loadingController.dismiss(); })
      }, err => { this.loadingController.dismiss(); });
    }, err => {
      this.loadingController.dismiss();
      this.presentToast(this.respFromLanguage.notFound, 'danger');
    })
  }
  async loader(mes) {
    const loading = await this.loadingController.create({
      message: mes,
      duration: 9000,
    });
    await loading.present();
  }
}
