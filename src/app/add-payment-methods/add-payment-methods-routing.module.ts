import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddPaymentMethodsPage } from './add-payment-methods.page';

const routes: Routes = [
  {
    path: '',
    component: AddPaymentMethodsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddPaymentMethodsPageRoutingModule {}
