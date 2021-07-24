import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  ApiUrl = environment.baseUrl;

  constructor(
    public http: HttpClient
  ) { }

  getContryCodeAndFlag(contryName) {
    return this.http.get('https://restcountries.eu/rest/v2/name/' + contryName + '?fields=callingCodes;flag');
  }
  getAlpha2Code(contryName) {
    return this.http.get('https://restcountries.eu/rest/v2/name/' + contryName + '?fields=alpha2Code');
  }
  createContactUs(data) {
    return this.http.post(this.ApiUrl + 'contact-us/create', data);
  }
  saved_location_create(data) {
    return this.http.post(this.ApiUrl + 'saved-location/create', data);
  }
  saved_location_get() {
    return this.http.get(this.ApiUrl + 'passenger/getall-saved-locations/' + JSON.parse(localStorage.getItem('user')).id);
  }
  saved_location_delete(id) {
    return this.http.post(this.ApiUrl + 'saved-location/delete/' + id, {});
  }
  getMyPreferences() {
    return this.http.get(this.ApiUrl + 'passenger-prefrence/get-by-passenger/' + JSON.parse(localStorage.getItem('user')).id);
  }
  getAvailabilityStatus() {
    return this.http.get(this.ApiUrl + 'passenger/get-availability-status/' + JSON.parse(localStorage.getItem('user')).id)
  }
  updatePrefernces(data) {
    return this.http.post(this.ApiUrl + 'passenger-prefrence/update-passengerpreference/' + JSON.parse(localStorage.getItem('user')).id, data);
  }
  createReserveBookingCondition = true;
  createReserveBooking(data) {
    if (this.createReserveBookingCondition) {
      this.createReserveBookingCondition = false;
      setTimeout(() => {
        this.createReserveBookingCondition = true;
      }, 1500);
      return this.http.post(this.ApiUrl + 'booking/reserve/', data);
    }
    else
      return this.http.get(this.ApiUrl);
  }
  passengerAvailablity(id, data) {
    return this.http.post(this.ApiUrl + 'passenger/change-passenger-availabiliy-status/' + id, data)
  }
  update_City(data) {
    return this.http.post(this.ApiUrl + 'passenger/update-city/' + JSON.parse(localStorage.getItem('user')).id, data);
  }
  update_Phone_Number_And_Is_Anonymous(data) {
    return this.http.post(this.ApiUrl + 'passenger/update-phone-isanonimous/' + JSON.parse(localStorage.getItem('user')).id, data);
  }
  update_Phone_Number_And_Is_AnonymousCity(data) {
    return this.http.post(this.ApiUrl + 'passenger/update-phone-city-isanonimous/' + JSON.parse(localStorage.getItem('user')).id, data);
  }
  getAllCatalogsByCity(city) {
    let data = {
      cityName: city
    }
    return this.http.post(this.ApiUrl + 'vehicle-type/getallvehicletypes-by-city', data);
  }
  getAllCities() {
    return this.http.get(this.ApiUrl + 'city/getall');
  }
  updatePrefferedVehicleType(data, id) {
    return this.http.post(this.ApiUrl + 'passenger/update-preffered-vehicletype/' + id, data);
  }
  getStatusPrefferedVehicleType(data, id) {
    return this.http.post(this.ApiUrl + 'passenger/preffered-vehicletype-status/' + id, data);
  }
  removeBookingLocalSaves() {
    localStorage.removeItem('tracking');
    localStorage.removeItem('findDriverObj');
    localStorage.removeItem('orderAtCurruntLocation');
    localStorage.removeItem('voiceOrder');
    localStorage.removeItem('tripStarted');
    localStorage.removeItem('driverFound');
    localStorage.removeItem('findDriverObject_OrderAtCurruntLocation');
    localStorage.removeItem('tripEnded');
    localStorage.removeItem('findDriverObjWithAllInfo');
    localStorage.removeItem('driverStartedReserveBooking');
  }
}
