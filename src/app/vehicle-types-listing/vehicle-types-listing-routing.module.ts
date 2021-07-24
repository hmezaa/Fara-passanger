import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VehicleTypesListingPage } from './vehicle-types-listing.page';

const routes: Routes = [
  {
    path: '',
    component: VehicleTypesListingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VehicleTypesListingPageRoutingModule {}
