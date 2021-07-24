import { TranslateModule } from '@ngx-translate/core';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LoginSelectionPageRoutingModule } from './login-selection-routing.module';

import { LoginSelectionPage } from './login-selection.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxIntlTelInputModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    LoginSelectionPageRoutingModule
  ],
  declarations: [LoginSelectionPage]
})
export class LoginSelectionPageModule {}
