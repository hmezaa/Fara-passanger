import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginSelectionPage } from './login-selection.page';

const routes: Routes = [
  {
    path: '',
    component: LoginSelectionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginSelectionPageRoutingModule {}
