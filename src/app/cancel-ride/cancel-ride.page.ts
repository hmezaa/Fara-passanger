import { DataService } from './../services/data.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment.prod';
import { DriverService } from '../services/driver.service';

@Component({
  selector: 'app-cancel-ride',
  templateUrl: './cancel-ride.page.html',
  styleUrls: ['./cancel-ride.page.scss'],
})
export class CancelRidePage implements OnInit {
  socket = io(environment.baseUrl);

  constructor(
    public m: ModalController,
    public alertController: AlertController,
    public driverService: DriverService,
    public dataService:DataService,
    public r: Router,
    public t: TranslateService
  ) {
    t.get("cancelReasonPage").subscribe((resp: any) => {
      this.respFromLanguage = resp;
    });
  }
  respFromLanguage: any;
  ngOnInit() {
  }
  close() {
    this.m.dismiss();
  }
  cancel(val) {
    let data = {
      reason: '',
      receiverId: JSON.parse(localStorage.getItem('tracking')).driverObj.id
    }
    if (val == 1) {
      data.reason = "It took a long time to pick me up"
    } else if (val == 2) {
      data.reason = "My pickup address is wrong"
    } else if (val == 3) {
      data.reason = "The taxi driver has not moved"
    } else if (val == 4) {
      data.reason = "Another reason"
    } else if (val == 5) {
      data.reason = "I need to change destiny"
    }
    this.socket.emit('cancelRide', data);
    this.m.dismiss();
    this.presentAlert(data.reason);
    this.r.navigate(['/booking-options']);
  }
  async presentAlert(reason) {
    let user = JSON.parse(localStorage.getItem('user'));
    let name = user.firstName + ' ' + user.lastName;
    this.dataService.removeBookingLocalSaves();
    const alert = await this.alertController.create({
      header: this.respFromLanguage.rideCancelTitle,
      message: this.respFromLanguage.dear + ' ' + name + ' ' + this.respFromLanguage.rideCancelMessage + '<br>"' + reason + '"',
      buttons: [{
        text: this.respFromLanguage.Okay,
        handler: () => {
          
        }
      }]
    });
    await alert.present();
  }

}
