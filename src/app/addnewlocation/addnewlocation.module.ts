import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddnewlocationPageRoutingModule } from './addnewlocation-routing.module';

import { AddnewlocationPage } from './addnewlocation.page';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    GooglePlaceModule,
    AddnewlocationPageRoutingModule
  ],
  declarations: [AddnewlocationPage]
})
export class AddnewlocationPageModule {}
