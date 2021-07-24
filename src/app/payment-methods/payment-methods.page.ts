import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, MenuController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentService } from '../services/payment.service';
@Component({
  selector: 'app-payment-methods',
  templateUrl: './payment-methods.page.html',
  styleUrls: ['./payment-methods.page.scss'],
})
export class PaymentMethodsPage implements OnInit {


  constructor(
    public toastController: ToastController,
    public alertController: AlertController,
    public paymentService: PaymentService,
    public r: Router,
    private t: TranslateService,
  ) {

    t.get("paymentMethodsPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  respFromLanguage: any;

  addPaymentMethod() {
    this.r.navigate(['/add-payment-methods']);
  }
  ngOnInit() {
  }
  PaymentMethodFound = true;
  savedcards = [];
  ionViewWillEnter() {
    this.paymentService.GetPaymentMethodOfPassenger()
      .subscribe((resp: any) => {
        if (resp.length == 0) {
          this.PaymentMethodFound = false;
        } else {
          this.PaymentMethodFound = true;
          this.savedcards = resp;
        }
      })
  }
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'success',
      position: 'top',
      mode: 'ios',
      duration: 2000
    });
    toast.present();
  }
  getMyName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
  getBeautifyNumber(number) {
    let a = number.toString();
    return a.substr(-4)
  }
  async deleteCard(item) {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.respFromLanguage.remove,
      message: this.respFromLanguage.removeConfrim,
      buttons: [
        {
          text: this.respFromLanguage.cancel,
          role: 'cancel',
          handler: (blah) => {
          }
        }, {
          text: this.respFromLanguage.confirm,
          handler: () => {
            this.paymentService.deletePaymentMethod(item.id)
              .subscribe((resp: any) => {
                this.presentToast(this.respFromLanguage.removeSuccessfully);
                this.ionViewWillEnter();
              })
          }
        }
      ]
    });

    await alert.present();
  }
}
