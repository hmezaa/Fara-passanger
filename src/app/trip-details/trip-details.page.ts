import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-trip-details',
  templateUrl: './trip-details.page.html',
  styleUrls: ['./trip-details.page.scss'],
})
export class TripDetailsPage implements OnInit {
  constructor(
    public nav: NavController
  ) { }
  back() {
    this.nav.back();
  }
  ionViewWillLeave() {
    localStorage.removeItem('myJourneyObject');
  }
  ngOnInit() {
    this.journeyObject = JSON.parse(localStorage.getItem('myJourneyObject'));
    setTimeout(() => {
      document.getElementById('map-parent').style.width = "93%";
    }, 100);
  }
  journeyObject = {
    cancellReason: null,
    createdAt: new Date(),
    destination: " ",
    pickup: "",
    driverId: 0,
    id: 0,
    passengerId: 0,
    paymentVia: "",
    status: "",
    totalCost: "",
    bookingUniqueId: 0,
    updatedAt: new Date(),
    driver: {
      email: "",
      firstName: "",
      driverPhoto: "",
      lastName: ""
    }
  }
}
