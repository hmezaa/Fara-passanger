import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../services/booking.service';
@Component({
  selector: 'app-my-bookings',
  templateUrl: './my-bookings.page.html',
  styleUrls: ['./my-bookings.page.scss'],
})
export class MyBookingsPage implements OnInit {

  constructor(
    public bookingService: BookingService,
    public r: Router
  ) { }

  ngOnInit() {
  }
  myJourneys = [];
  ionViewWillEnter() {
    this.bookingService.getAllBookings(0)
      .subscribe((resp: any) => {
        this.myJourneys = resp.reverse();
      })
  }
  openJourney(item) {
    localStorage.setItem('myJourneyObject', JSON.stringify(item))
  }
  offset = 0;
  doInfinite(event) {
    console.log(event)
    this.offset = this.offset + 1;
    this.bookingService.getAllBookings(this.offset)
      .subscribe((resp: any) => {
        if (resp.length !== 0) {
          resp.forEach(element => {
            this.myJourneys.push(element)
          });
        }
        event.target.complete();
      })
  }
}
