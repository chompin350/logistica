/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../component/modal/modal.component';
import { BaseService } from '../services/base.service';
import * as moment from 'moment';

@Component({
  selector: 'app-guia',
  templateUrl: './guia.page.html',
  styleUrls: ['./guia.page.scss'],
})
export class GuiaPage implements OnInit {

  idguia: any;
  nroguia: any;
  estado: any;
  proveedor: any;
  detalles: any;
  grupo: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: BaseService,
    private modalCtrl: ModalController) { }

  ngOnInit() {
    this.idguia = this.activatedRoute.snapshot.paramMap.get('idguia');
    this.nroguia = this.activatedRoute.snapshot.paramMap.get('nroguia');
    this.service.showloading();
    this.cargardatos();
  }

  cargardatos(){
    const params = {
      idguia: this.idguia
    };
    this.service.getGuiaRetiro(params).subscribe(respuesta =>{
      const pv = respuesta['proveedor'];
      const et = respuesta['estado'];
      const dt = respuesta['detalle'];
      const gr = respuesta['grupo'];
      const rp = respuesta['reply'];
      const er = respuesta['errores'];
      if (rp==='ok'){
        this.proveedor= pv.NombreFantasia;
        this.estado= et.Descripcion;
        this.detalles= dt;
        this.grupo= gr;
      }else{
        this.service.showAlert('Error',er);
      }
    });
  }

  getDatoItem(iditem){
    const params = {
      iditem
    };
    let html='';
    this.service.getItem(params)
    .subscribe( respuesta => {
      const dato=respuesta['equipo'][0];
      const orden=respuesta['orden'];
      const numero=this.service.cerosnumero(dato.NItem,3);
      const fecha= moment(orden.FechaAprobacion).format('DD-MM-YYYY HH:MM');
      html+='<ion-card><ion-card-header><ion-card-title>';
      html+=`Nro OCP : <b>${dato.NroOcp}</b>`;
      html+='</ion-card-title></ion-card-header>';
      html+='<ion-card-content><ion-list>';
      html+=`<ion-item>Id Item : </ion-item>`;
      html+=`<ion-item><b>${numero}</b></ion-item>`;
      html+=`<ion-item>Nro.OC : </ion-item>`;
      html+=`<ion-item><b>${dato.NroOcp}</b></ion-item>`;
      html+=`<ion-item>Fecha Confirmacion : </ion-item>`;
      html+=`<ion-item><b>${fecha}</b></ion-item>`;
      html+='</ion-list></ion-card-content</ion-card>';
      this.openModal(html);
    });
  }

  async openModal(datos){
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: { campo1: datos }
    });
    await modal.present();
  }

  beforeEnter(){
    this.cargardatos();
  }

}
