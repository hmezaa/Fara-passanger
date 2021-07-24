import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  Api_Url = environment.baseUrl;
  constructor(public http: HttpClient) { }

  getAllVehiclePackages() {
    let data = {
      cityName: JSON.parse(localStorage.getItem('user')).city
    }
    return this.http.post(this.Api_Url + 'vehicle-type/getallvehicletypes-by-city', data);
  }
  getAllBookings(offset) {
    return this.http.get(this.Api_Url + 'booking/getall-customer-bookings/' + JSON.parse(localStorage.getItem('user')).id + '/' + offset);
  }
  deleteReserveBooking(id) {
    return this.http.post(this.Api_Url + 'booking/delete/' + id, null);
  }
  getAllReservedBookings() {
    return this.http.get(this.Api_Url + 'booking/getall-customer-reserved-bookings/' + JSON.parse(localStorage.getItem('user')).id);
  }
  getUniqeDriverByCityName(data) {
    return this.http.post(this.Api_Url + 'city/get-random-phone-number-by-city', data);
  }
  findDriverInQueue(data) {
    return this.http.post(this.Api_Url + 'queue/get-driver-from-queue', data);
  }
  findDriverInQueueWithoutVehicleType(data) {
    return this.http.post(this.Api_Url + 'queue/get-driver-from-queue-without-vehicleType', data);
  }
  isAnyReserveBookingStarted() {
    let a = new Date().toLocaleDateString();
    let data = { date: a }
    return this.http.post(this.Api_Url + 'booking/get-started-reserved-by-passenger/' + JSON.parse(localStorage.getItem('user')).id, data);
  }
}
