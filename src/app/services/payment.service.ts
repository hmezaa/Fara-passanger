import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  ApiUrl = environment.baseUrl;

  constructor(
    public http: HttpClient
  ) {
  }
  addPaymentMethodOfPassenger(data) {
    let id = JSON.parse(localStorage.getItem('user')).id;
    return this.http.post(this.ApiUrl + 'passenger-payment/create/' + id, data);
  }
  GetPaymentMethodOfPassenger() {
    let id = JSON.parse(localStorage.getItem('user')).id;
    return this.http.get(this.ApiUrl + 'passenger-payment/getall-by-passenger/' + id);
  }
  deletePaymentMethod(id) {
    return this.http.post(this.ApiUrl + 'passenger-payment/delete/' + id, {});
  }
}
