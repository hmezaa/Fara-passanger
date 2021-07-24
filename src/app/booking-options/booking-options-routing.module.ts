import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BookingOptionsPage } from './booking-options.page';

const routes: Routes = [
  {
    path: '',
    component: BookingOptionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BookingOptionsPageRoutingModule {}
