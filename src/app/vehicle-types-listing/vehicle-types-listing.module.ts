import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VehicleTypesListingPageRoutingModule } from './vehicle-types-listing-routing.module';

import { VehicleTypesListingPage } from './vehicle-types-listing.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    VehicleTypesListingPageRoutingModule
  ],
  declarations: [VehicleTypesListingPage]
})
export class VehicleTypesListingPageModule {}
