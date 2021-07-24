import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(
    private toastController: ToastController,
    public r: Router,
    private service: DataService,
    private loadingController: LoadingController,
    private t: TranslateService,
  ) {
    t.get("contactUsPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  respFromLanguage: any;

  data = {
    passengerId: JSON.parse(localStorage.getItem('user')).id,
    driverId: null,
    subject: '',
    message: '',
    email: '',
  }
  ngOnInit() {
  }
  submit() {
    if ((this.data.subject && this.data.message && this.data.email) == '') {
      this.presentToast(this.respFromLanguage.fillAllFields, 2000, 'danger')
    } else {
      this.presentLoading()
      this.service.createContactUs(this.data).subscribe((resp: any) => {
        this.loadingController.dismiss()
        if (resp) {
          this.presentToast(this.respFromLanguage.dear + this.getName() + this.respFromLanguage.reqRecieved, 5000, 'success');
          this.r.navigate(['/booking-options']);
          this.data = {
            message: '',
            subject: '',
            email: '',
            passengerId: JSON.parse(localStorage.getItem('user')).id,
            driverId: null,
          }
        }
      })
    }
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: this.respFromLanguage.pleaseWait,
      duration: 3000,
    });
    await loading.present();
  }

  async presentToast(msg, duration, color) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      mode: 'ios',
      color: color,
    });
    toast.present();
  }
}
