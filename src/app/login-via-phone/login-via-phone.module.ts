import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginViaPhonePageRoutingModule } from './login-via-phone-routing.module';

import { LoginViaPhonePage } from './login-via-phone.page';
import { TextMaskModule } from 'angular2-text-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    TextMaskModule,
    LoginViaPhonePageRoutingModule
  ],
  declarations: [LoginViaPhonePage]
})
export class LoginViaPhonePageModule {}
