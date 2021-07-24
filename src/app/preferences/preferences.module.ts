import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PreferencesPageRoutingModule } from './preferences-routing.module';

import { PreferencesPage } from './preferences.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    IonicModule,
    PreferencesPageRoutingModule
  ],
  declarations: [PreferencesPage]
})
export class PreferencesPageModule {}
