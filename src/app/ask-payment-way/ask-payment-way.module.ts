import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AskPaymentWayPageRoutingModule } from './ask-payment-way-routing.module';

import { AskPaymentWayPage } from './ask-payment-way.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    AskPaymentWayPageRoutingModule
  ],
  declarations: [AskPaymentWayPage]
})
export class AskPaymentWayPageModule {}
