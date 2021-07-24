import { Component, OnInit } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ImageUploadService } from '../services/image-upload.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(
    private service: AuthService,
    private toastController: ToastController,
    private alertController: AlertController,
    private imageService: ImageUploadService,
    private t: TranslateService,
  ) {
    t.get("editProfilePage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  respFromLanguage: any;

  ngOnInit() {
  }

  url = environment.baseUrl;
  image: any;

  passengerData = {
    firstName: '',
    lastName: '',
    phoneNumber: 0
  }

  updateRequested = false;
  alertMessage = '';
  messageColor = '';

  isUpdateApprovedStatus = false;
  isUpdateDeclinedStatus = false;

  ionViewWillEnter() {
    this.updateRequested = false;

    let id = JSON.parse(localStorage.getItem('user')).id
    this.service.GetImage(id)
      .subscribe((resp: any) => {
        console.log(resp)
        this.image = resp.image;
      })


    this.service.GetPassengerToUpdateById(id)
      .subscribe((resp: any) => {
        console.log(resp)
        if (resp !== null) {
          this.passengerData = resp
          this.updateRequested = true;
          this.alertMessage = this.respFromLanguage.reqPending;
          this.messageColor = '#ffc107'
        } else {
          this.passengerData.firstName = JSON.parse(localStorage.getItem('user')).firstName;
          this.passengerData.lastName = JSON.parse(localStorage.getItem('user')).lastName;
          this.passengerData.phoneNumber = JSON.parse(localStorage.getItem('user')).phoneNumber;

          this.service.GetIsUpdateDeclineAndIsUpdateApproved(id)
            .subscribe((resp: any) => {
              console.log(resp)
              this.isUpdateApprovedStatus = resp.isUpdateApprovedStatus;
              this.isUpdateDeclinedStatus = resp.isUpdateDeclinedStatus;

              if (resp.isUpdateApprovedStatus) {
                this.updateRequested = true;
                this.alertMessage = this.respFromLanguage.reqApproved;
                this.messageColor = '#4BB543';
                // this.presentToast('Your Request of Update is Approved', 'success', 5000)
              }
              if (resp.isUpdateDeclinedStatus) {
                this.updateRequested = true;
                this.alertMessage = this.respFromLanguage.reqDeclined;
                this.messageColor = '#df4759';
                // this.presentToast('Your Request of Update is Approved', 'danger', null)
              }

            })
        }
      })
  }

  close() {
    this.alertMessage = "";
    this.messageColor = '';
  }

  getId() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).id;
  }
  update() {
    this.service.Update_Passenger(this.getId(), this.passengerData)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 'Requestto update is save and waiting for approval') {

          let local_data = JSON.parse(localStorage.getItem('user'));
          local_data.isToUpdate = true;
          localStorage.setItem('user', JSON.stringify(local_data));
          this.ionViewWillEnter();
        } else if (resp.message == 'Request to update is already recorded and pending for approval') {

          this.presentToast(this.respFromLanguage.alreadyOnPending, 'warning', 2100)
        }
      });

    this.updateimage();
  }

  updateUpdated() {
    let id = JSON.parse(localStorage.getItem('user')).id;
    this.service.UpdatePassengerToUpdate(id, this.passengerData)
      .subscribe((resp: any) => {
        console.log(resp)
        if (resp.message == "passengerToUpdate Updated Successfully") {

          this.updateRequested = true;
          this.alertMessage = this.respFromLanguage.reqPending;
          this.messageColor = '#ffc107'

          this.presentToast(this.respFromLanguage.reqUpdated, 'primary', 3000)
        }
      })

    this.updateimage();
  }

  cameraOrGallery() {
    this.imageService.cameraOrGallery();
  }

  uploadedImage() {
    if (this.imageService.imageUrl)
      this.image = this.imageService.imageUrl;
    return this.image;
  }

  updateimage() {
    let data = {
      image: this.image,
    }

    let localData = JSON.parse(localStorage.getItem("user"));
    localData.image = this.imageService.imageUrl;
    localStorage.setItem('user', JSON.stringify(localData))

    this.service.update_Passenger_Image(this.getId(), data)
      .subscribe((resp: any) => {
        console.log(resp)
      })
  }


  async presentToast(msg, color, time) {
    const toast = await this.toastController.create({
      message: msg,
      duration: time,
      mode: 'ios',
      color: color,
      position: 'bottom'
    });
    toast.present();
  }
}
