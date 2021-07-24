import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPaymentMethodsPageRoutingModule } from './add-payment-methods-routing.module';

import { AddPaymentMethodsPage } from './add-payment-methods.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    AddPaymentMethodsPageRoutingModule
  ],
  declarations: [AddPaymentMethodsPage]
})
export class AddPaymentMethodsPageModule {}
