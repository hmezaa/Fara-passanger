import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpConfirmationPageRoutingModule } from './otp-confirmation-routing.module';
import { CodeInputModule } from 'angular-code-input';

import { OtpConfirmationPage } from './otp-confirmation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CodeInputModule,
    TranslateModule,
    IonicModule,
    OtpConfirmationPageRoutingModule
  ],
  declarations: [OtpConfirmationPage]
})
export class OtpConfirmationPageModule { }
