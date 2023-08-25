import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { CabeceraGuiaComponent } from '../component/cabecera-guia/cabecera-guia.component';
import { DetalleGuiaComponent } from '../component/detalle-guia/detalle-guia.component';
import { ModalComponent } from '../component/modal/modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    HomePage,
    CabeceraGuiaComponent,
    DetalleGuiaComponent,
    ModalComponent
  ]
})
export class HomePageModule {}
