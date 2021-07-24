import { RatingPage } from './../rating/rating.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { PaymentService } from '../services/payment.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ask-payment-way',
  templateUrl: './ask-payment-way.page.html',
  styleUrls: ['./ask-payment-way.page.scss'],
})
export class AskPaymentWayPage implements OnInit {

  constructor(
    public modalController: ModalController,
    public toastController: ToastController,
    public r: Router,
    public paymentService: PaymentService,
    private t: TranslateService,
  ) {
    t.get("askPayWayPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  respFromLanguage: any;

  ngOnInit() {
    // this.paymentService.GetPaymentMethodOfPassenger().subscribe((resp: any) => {
    //   this.paymentMethodsLength = resp.length;
    // });
  }
  // paymentMethodsLength = 0;
  way;
  price = JSON.parse(localStorage.getItem('tripEnded'))?.journeyCost.toFixed(2);
  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      color: 'danger',
      position: 'top',
      mode: 'ios',
      duration: 3000
    });
    toast.present();
  }
  onSelect(i) {
    if (i == 1) {
      if (this.way == 1) {
        // this.goToRatingModal('card');
        // this.modalController.dismiss({ payVia: 'card' });
        this.presentToast(this.respFromLanguage.availableSoon);
      } else {
        this.modalController.dismiss({ payVia: 'card' });
      }
    } else if (i == 2) {
      this.modalController.dismiss({ payVia: 'cash' });
      if (this.way == 1) {
        this.goToRatingModal('cash');
      }
    } else if (i == 3) {
      if (this.way == 1) {
        // this.goToRatingModal('bonus');
        // this.modalController.dismiss({ payVia: 'bonus' });
        this.presentToast(this.respFromLanguage.availableSoon);
      } else {
        this.modalController.dismiss({ payVia: 'bonus' });
      }
    }
  }
  async goToRatingModal(payVia) {
    const rmodal = await this.modalController.create({
      component: RatingPage,
      componentProps: {
        payVia: payVia
      }
    });
    await rmodal.present();
  }
}
