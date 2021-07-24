import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpConfirmationPage } from './otp-confirmation.page';

const routes: Routes = [
  {
    path: '',
    component: OtpConfirmationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpConfirmationPageRoutingModule {}
