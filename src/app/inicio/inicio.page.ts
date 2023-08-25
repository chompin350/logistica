/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  operativa=false;
  lista= [];
  pendientes=[];
  ruta=0;
  rutastring='';
  isModalOpen = false;
  receptor='';
  pass='';
  indice=0;
  msgerr='';
  existependientes=false;
  existenrutas=false;
  dato = {
    id: 0,
    fecha: ''
  };
  vistabultos=[];
  constructor(
    private service: BaseService,
    private router: Router,
    private alertController: AlertController,
    ) { }

  ngOnInit() {
    this.cargarutas();
    this.service.showloading();
  }

  cargarutas(){
    const conductor = localStorage.getItem('idusuario');
    const params = {
      idconductor: conductor
    };
    this.service.listarutasasignadas(params).subscribe(res =>{
      const valores= res['lista'];
      this.lista=[];
      if (valores==='' || valores===undefined){return false;}
      if (valores.length>0) {
        this.existenrutas=true;
        valores.forEach(elem => {
          this.lista.push({
            id: elem.Id,
            nro: this.service.cerosnumero(elem.Id, 8),
            idestado: elem.IdEstado,
            estado: elem.Descripcion,
            entregaConfirmacion: elem.EntregaConfirmacion
          });
        });
      }else{
        this.existenrutas=false;
      }
    });
    this.service.listasinvalidar(params).subscribe(res =>{
      const listado= res['lista'];
      if (listado.length>0) {
        this.existependientes=true;
        this.pendientes = [];
        listado.forEach(elem => {
          this.pendientes.push({
            id: elem.Id,
            nro: this.service.cerosnumero(elem.Id, 8),
            idestado: elem.IdEstado,
            estado: elem.Descripcion,
            entregaConfirmacion: elem.EntregaConfirmacion,
            receptor: elem.Receptor,
            fcreacion: elem.FechaCreacion

          });
        });
      }else{
        this.pendientes = [];
        this.existependientes=false;
      }

    });
  }

  abrirruta(idguia,index){
    const largo=this.lista.length;
    if (this.lista[index].idestado===1){
      this.presentAlert(idguia);
    }else{
      this.router.navigate(['/home', idguia]);
    }
  }


  async presentAlert(idruta) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirmacion!',
      message: '<strong>Esta seguro de comenzar la ruta </strong>!!!',
      buttons: [
        {
          text: 'No',
          role: 'No',
          cssClass: 'btno',
          handler: (blah) => {
            console.log('Cancelo');
          },
        },
        {
          text: 'Si',
          cssClass: 'btsi',
          handler: () => {
            const params ={
              idruta
            };
            this.service.putiniciaruta(params).subscribe(res=>{
              if (res['reply']==='ok'){
                this.router.navigate(['/home', idruta]);
              }else{
                this.service.showAlert('Error','Ocurrio un error en la transacción, informe a Backoffice');
              }
            });
          },
        },
      ],
    });

    await alert.present();
  }

  volver(){
    const data = [{
      nombrecorto : '',
      tipo : 0}];
    this.service.miEvento.emit(data);
    localStorage.clear();
    this.router.navigate(['/login']);
  }


  ionViewDidEnter(){
    this.lista=[];
    this.cargarutas();
  }

  setOpen(ruta, isOpen: boolean,indice){

    if (ruta!==0){
      this.ruta=ruta.id;
      this.rutastring = this.service.cerosnumero(this.ruta,8);
      this.isModalOpen = isOpen;
      this.receptor=ruta.receptor;
      this.indice=indice;
    }else {
      this.pass='';
      this.ruta = 0;
      this.rutastring = this.service.cerosnumero(this.ruta, 8);
      this.isModalOpen = false;
      this.receptor = 'No informado';
    }
  }

  validarecepcion(){
    const conductor = localStorage.getItem('idusuario');
    const params = {
      idconductor: conductor,
      idruta: this.ruta,
      pass: this.pass
    };
    this.service.validaruta(params).subscribe(res =>{
      if (res['reply']==='ok'){
        this.service.showAlert('Ruta','Ruta fue validada correctamente');
        this.pendientes[this.indice].entregaConfirmacion=1;
        this.setOpen(0, false,0);
        this.existependientes=false;
        this.pendientes.forEach((elem)=>{
          if (elem.entregaConfirmacion===0){
            this.existependientes=true;
          }
        });
      }else{
        this.msgerr='<ul>';
        const errores = res['errores'];
        errores.forEach((err)=> {
          this.msgerr+='<li>'+err+'</li>';
        }, this);
        this.msgerr+='</ul>';
        this.service.showAlert('Errores',this.msgerr);
      }
    });
  }

  reload(){
    window.location.assign('/inicio');
  }

  vistaruta(dato){
    const idguia = dato.id;
    this.router.navigate(['/listabultos', idguia]);
  }

}
