/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DataTablesModule } from 'angular-datatables';
import { BaseService } from '../services/base.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bultos',
  templateUrl: './bultos.page.html',
  styleUrls: ['./bultos.page.scss'],
})
export class BultosPage implements OnInit {

  iditem: any;
  idguiaretiro: any;

  nroguia: any;
  nombre: any;
  vehiculo: any;
  nitem: any;
  producto: any;
  detalle: any;
  calidad: any;
  cantidad: any;
  estado: any;
  qbultos: any;
  bultos: any;
  idoferta: any;
  flagestado= true;
  myCustomIcon ='../../assets/camion.png';
  constructor(
    private activatedRoute: ActivatedRoute,
    private services: BaseService,
    private alertController: AlertController,
    private router: Router
  ) {

   }

  ngOnInit() {
    this.iditem = this.activatedRoute.snapshot.paramMap.get('iditem');
    this.idguiaretiro = this.activatedRoute.snapshot.paramMap.get('idretiro');
    this.services.showloading();
    this.cargardetalle(this.iditem,this.idguiaretiro);
  }

  cargardetalle(iditem,idguiaretiro){
    const params = {
      iditem ,
      idguiaretiro
    };
    this.services.getItemproveedor(params).subscribe(respuesta => {
      const ruta = respuesta['ruta'];
      if (ruta.IdEstado>=4){ //oculta barra inferior ya salio del proveedor
        this.flagestado=false;
      }

      const dato = respuesta['equipo'][0];
      this.nroguia=dato.NroGuiaretiro;
      this.nombre=dato.NombreFantasia;
      this.vehiculo=dato.Marca + ' - '+dato.Modelo+' - '+dato.Fabricacion;
      this.producto=dato.DescripcionItem;
      this.detalle=dato.Caracteristicas;
      this.calidad=dato.Calidad;
      this.cantidad=dato.Cantidad;
      this.estado=dato.EstadoBodegaje;
      this.qbultos=(!dato.Qbultos)? 0: dato.Qbultos;
      this.nitem=this.services.cerosnumero(dato.NItem,3);
      this.idoferta=dato.Id;
      this.cargarbultos(this.idoferta);
    });
  }

  cargarbultos(idoferta){
    const params ={
      idoferta
    };
    this.services.getBultos(params).subscribe(res =>{
      this.bultos=res['bultos'];
    });
  }

  cerosnumero(numero,cantidad){
    const cadenaNumerica = '0'.repeat(cantidad);
    let resultado = cadenaNumerica + numero;
    resultado = resultado.substring(resultado.length - cadenaNumerica.length);
    return resultado;
  }

  generaEtiqueta(){
    this.presentAlert();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      cssClass: 'alert-buttons',
      header: 'Esta seguro que desea agregar un bulto ?',
      message: `<img src="../../assets/barcode.jpg" width="100">`,
      backdropDismiss : false,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'modal-button-cancel',
          handler: (blah) => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Si',
          handler: () => {
            this.crearbulto();
          }
        }
      ]
    });

    await alert.present();
  }


 async alertRemove(idbulto){
  const alert = await this.alertController.create({
    cssClass: 'alert-buttons',
    header: 'Esta seguro que desea eliminar el  bulto ?',
    //message: `<div class='center'><img src="../../assets/prohibido.png" width="100px"></div>`,
    backdropDismiss : false,
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'modal-button-cancel',
        handler: (blah) => {
          //console.log('Confirm Cancel: blah');
        }
      }, {
        text: 'Si',
        handler: () => {
          this.deleteBulto(idbulto);
        }
      }
    ]
  });

  await alert.present();
 }

 crearbulto(){
    const params = {
      iditem : this.iditem,
      idguiaretiro: this.idguiaretiro,
      idusuario: localStorage.getItem('idusuario')
    };
    this.services.addBultos(params).subscribe(res =>{
      this.cargardetalle(this.iditem,this.idguiaretiro);
    });

  }

  deleteBulto(idbulto){
    const params = {
      idbulto
    };
    this.services.removeBultos(params).subscribe( res => {
      this.services.showAlert('Bulto','En bulto ha sido borrado correctamente');
      this.cargardetalle(this.iditem,this.idguiaretiro);
    });
  }

  //cuando vuelve el foco
  ionViewDidEnter(){
    this.cargarbultos(this.idoferta);
  }

}

