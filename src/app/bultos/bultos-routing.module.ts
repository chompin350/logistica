import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BultosPage } from './bultos.page';

const routes: Routes = [
  {
    path: '',
    component: BultosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BultosPageRoutingModule {}
