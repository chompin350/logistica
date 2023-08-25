import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CargabultosPageRoutingModule } from './cargabultos-routing.module';

import { CargabultosPage } from './cargabultos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CargabultosPageRoutingModule
  ],
  declarations: [CargabultosPage]
})
export class CargabultosPageModule {}
