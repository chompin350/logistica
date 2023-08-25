import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallekitPageRoutingModule } from './detallekit-routing.module';

import { DetallekitPage } from './detallekit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallekitPageRoutingModule
  ],
  declarations: [DetallekitPage]
})
export class DetallekitPageModule {}
