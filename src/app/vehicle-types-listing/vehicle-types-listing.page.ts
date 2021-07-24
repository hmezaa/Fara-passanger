import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BookingService } from '../services/booking.service';

@Component({
  selector: 'app-vehicle-types-listing',
  templateUrl: './vehicle-types-listing.page.html',
  styleUrls: ['./vehicle-types-listing.page.scss'],
})
export class VehicleTypesListingPage implements OnInit {

  constructor(
    public bookingService: BookingService,
    private modalController: ModalController,
  ) { }

  VehiclesPackages = [];
  selectedValue = {
    vehicleTypeId: 0,
    vehicle_type: {
      vehicleName: ''
    },
    priceInCity: 0
  };
  ngOnInit() {
    let prefferedVehivleTypeId = JSON.parse(localStorage.getItem('user'))?.prefferedVehivleTypeId;
    this.bookingService.getAllVehiclePackages().subscribe((resp: any) => {
      this.VehiclesPackages = resp;
      resp.forEach(element => {
        if (element.id == prefferedVehivleTypeId) {
          this.selectedValue = element;
        }
      });
    })
  }
  getPrice() {
    return this.selectedValue.priceInCity;
  }
  segmentChanged(event) {
    this.selectedValue = event.detail.value;
  }
  CancelClick() {
    this.modalController.dismiss(false)
  }
  Continue() {
    this.modalController.dismiss(this.selectedValue.vehicleTypeId);
  }
}
