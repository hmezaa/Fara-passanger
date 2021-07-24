import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { File } from '@ionic-native/file/ngx'
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { TranslateConfigService } from './translate-config.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  url = environment.baseUrl;
  imageUrl = '';

  constructor(
    private camera: Camera,
    private transfer: FileTransfer,
    private androidPermissions: AndroidPermissions,
    private file: File,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private alertController: AlertController,
    private t: TranslateService,
    private translateService: TranslateConfigService,
  ) {
    if (this.translateService.selectedLanguage() == undefined) {
      if (localStorage.getItem('defaultLng')) {
        this.translateService.setLanguage(localStorage.getItem('defaultLng'));
      } else {
        this.translateService.setLanguage('ru');
      }
      t.get("imageService").subscribe((resp: any) => {
        this.respFromLanguage = resp;
      })
    }

  }

  respFromLanguage: any;


  async cameraOrGallery() {
    const alert = await this.alertController.create({
      header: this.respFromLanguage.chooseOne,
      message: this.respFromLanguage.msg,
      mode: 'ios',
      buttons: [
        {
          text: this.respFromLanguage.gallery,
          handler: () => {
            this.Image('gallery')
          }
        },
        {
          text: this.respFromLanguage.camera,
          handler: () => {
            this.Image('camera')
          }
        },
      ]
    });

    await alert.present();
  }

  Image(cameraOrGallery) {

    this.presentLoading(this.respFromLanguage.pleaseWait)
    const options: CameraOptions = {
      quality: 50,
      encodingType: this.camera.EncodingType.JPEG,
      saveToPhotoAlbum: false,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetWidth: 600,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      cameraDirection: this.camera.Direction.FRONT,
    }

    if (cameraOrGallery == 'gallery') {
      options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY
    } else if (cameraOrGallery == 'camera') {
      options.sourceType = this.camera.PictureSourceType.CAMERA;
    }

    this.camera.getPicture(options).then((imageData) => {
      if (cameraOrGallery == 'gallery') {
        this.askPermission(imageData, 'image/jpeg', 'jpeg')
      }
      else {
        this.uploadFile(imageData, 'image/jpeg', 'jpeg')
      }
    }, (err) => {
      this.loadingController.dismiss();
      // Handle error
    });

  }

  uploadFile(fPath, type, name) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    const options: FileUploadOptions = {
      fileKey: 'image',
      mimeType: type,
      fileName: name,
      httpMethod: 'POST'
    };

    fileTransfer.upload(fPath, this.url + 'image/saveimage', options, true)
      .then((data) => {

        let fname = data.response.replace('"', '');
        fname = fname.replace('"', '');

        this.imageUrl = fname;
        console.log(this.imageUrl);
        localStorage.setItem('imageUrl', this.imageUrl);
        // this.userService.UpdateProfileImage(id, obj)
        //   .subscribe((resp: any) => {
        //     this.presentToast(resp.message)
        //   })
        this.loadingController.dismiss()



        // this.imagesArray.push({ image: fname, lectureId: this.LectureId })


      }, (err) => {
        this.loadingController.dismiss()
        this.presentToast(this.respFromLanguage.error)
      });
  }


  askPermission(fPath, type, name) {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(
      result => {
        if (result.hasPermission) {
          // code
          this.uploadFile(fPath, type, name)
        } else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(result => {
            if (result.hasPermission) {
              // code
              this.uploadFile(fPath, type, name)
            }
          });
        }
      },
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
    );
  }


  async presentLoading(msg) {
    const loading = await this.loadingController.create({
      message: msg,
      duration: 13000,
      mode: 'ios',
    });
    await loading.present();
  }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      position: 'top',
      mode: 'ios',
      color: 'light'
    });
    toast.present();
  }
}
