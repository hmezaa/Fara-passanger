import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { PaymentService } from '../services/payment.service';

@Component({
  selector: 'app-add-payment-methods',
  templateUrl: './add-payment-methods.page.html',
  styleUrls: ['./add-payment-methods.page.scss'],
})
export class AddPaymentMethodsPage implements OnInit {

  constructor(
    public toastController: ToastController,
    public paymentService: PaymentService,
    public nav: NavController,
    private t: TranslateService,
  ) {
    t.get("addPaymentMethod").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }

  respFromLanguage: any;

  ngOnInit() {
    this.allowedYears = [new Date().getFullYear()];
    var actualDate = new Date();
    var newDate;
    for (var i = 1; i <= 7; i++) {
      newDate = new Date(actualDate.getFullYear() + i, actualDate.getMonth(), actualDate.getDate());
      this.allowedYears.push(new Date(newDate).getFullYear())
    }
  }
  async presentToast(msg, color) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2500,
      mode: 'ios',
      color: color
    });
    toast.present();
  }
  card = {
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    holder_name: '',
  }
  allowedYears = [];
  valueOfDateAndTime(e) {
    this.card.expMonth = (new Date(e.detail.value).getMonth() + 1).toString();
    this.card.expYear = (new Date(e.detail.value).getFullYear()).toString();
  }
  save() {
    if (
      (
        this.card.number &&
        this.card.expMonth &&
        this.card.expYear &&
        this.card.cvc &&
        this.card.holder_name
      ) !== ''
    ) {
      // validate this card before saving
      this.paymentService.addPaymentMethodOfPassenger(this.card).subscribe((resp: any) => {
        this.presentToast(this.respFromLanguage.dear + this.getName() + this.respFromLanguage.paymentAdded, 'success')
        this.nav.back();
      })
    } else {
      this.presentToast(this.respFromLanguage.fillAllFields, 'danger')
    }
  }
  getName() {
    if (localStorage.getItem('user'))
      return JSON.parse(localStorage.getItem('user')).firstName + ' ' + JSON.parse(localStorage.getItem('user')).lastName;
  }
}
