import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListabultosPage } from './listabultos.page';

const routes: Routes = [
  {
    path: '',
    component: ListabultosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListabultosPageRoutingModule {}
