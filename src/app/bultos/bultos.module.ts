import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BultosPageRoutingModule } from './bultos-routing.module';

import { BultosPage } from './bultos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BultosPageRoutingModule
  ],
  declarations: [BultosPage]
})
export class BultosPageModule {}
