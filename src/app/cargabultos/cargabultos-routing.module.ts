import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CargabultosPage } from './cargabultos.page';

const routes: Routes = [
  {
    path: '',
    component: CargabultosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CargabultosPageRoutingModule {}
