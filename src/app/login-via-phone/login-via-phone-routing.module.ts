import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginViaPhonePage } from './login-via-phone.page';

const routes: Routes = [
  {
    path: '',
    component: LoginViaPhonePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginViaPhonePageRoutingModule {}
