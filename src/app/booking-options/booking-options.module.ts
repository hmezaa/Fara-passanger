import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BookingOptionsPageRoutingModule } from './booking-options-routing.module';

import { BookingOptionsPage } from './booking-options.page';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    IonicModule,
    BookingOptionsPageRoutingModule
  ],
  declarations: [BookingOptionsPage]
})
export class BookingOptionsPageModule {}
