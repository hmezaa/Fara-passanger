import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  Api_Url = environment.baseUrl;
  constructor(public http: HttpClient) { }

  signUpWithoutData(data) {
    return this.http.post(this.Api_Url + 'passenger/signup-with-out-data', data);
  }

  signInWithPhoneNumber(data) {
    return this.http.post(this.Api_Url + 'passenger/signin-with-phone-number', data);
  }

  signUpWithPhoneNumber(data) {
    return this.http.post(this.Api_Url + 'passenger/signup-with-phone-number', data);
  }

  updateProfile(data) {
    return this.http.post(this.Api_Url + 'passenger/update-first-last-phone-image/' + JSON.parse(localStorage.getItem('user')).id, data);
  }

  Rate_Driver(driverId, data) {
    return this.http.post(this.Api_Url + 'driver/rating/' + driverId, data)
  }

  socialVerifier(data) {
    return this.http.post(this.Api_Url + 'passenger/social-verifier', data);
  }

  getContryCode(contryName) {
    return this.http.get('https://restcountries.eu/rest/v2/name/' + contryName + '?fields=callingCodes');
  }

  GetImage(passengerId) {
    return this.http.get(this.Api_Url + 'passenger/get-passenger-image/' + passengerId)
  }

  update_Passenger_Image(passengerId, data) {
    return this.http.post(this.Api_Url + 'passenger/update-image/' + passengerId, data)
  }

  Update_Passenger(passengerId, data) {
    return this.http.post(this.Api_Url + 'passenger/update/' + passengerId, data)
  }


  // ============ Passenger to update ==================

  GetPassengerToUpdateById(passengerId) {
    return this.http.get(this.Api_Url + 'passenger-to-update/get/' + passengerId)
  }

  UpdatePassengerToUpdate(passengerId, data) {
    return this.http.post(this.Api_Url + 'passenger-to-update/update/' + passengerId, data)
  }

  GetIsUpdateDeclineAndIsUpdateApproved(id) {
    return this.http.get(this.Api_Url + 'passenger/approve-decline-status/' + id)
  }
}
