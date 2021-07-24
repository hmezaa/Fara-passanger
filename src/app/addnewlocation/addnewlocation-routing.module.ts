import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddnewlocationPage } from './addnewlocation.page';

const routes: Routes = [
  {
    path: '',
    component: AddnewlocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddnewlocationPageRoutingModule {}
