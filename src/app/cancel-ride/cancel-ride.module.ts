import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CancelRidePageRoutingModule } from './cancel-ride-routing.module';

import { CancelRidePage } from './cancel-ride.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    CancelRidePageRoutingModule
  ],
  declarations: [CancelRidePage]
})
export class CancelRidePageModule {}
