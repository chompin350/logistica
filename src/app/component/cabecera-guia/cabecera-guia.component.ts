import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { BaseService } from 'src/app/services/base.service';
import { ExtrasService } from 'src/app/services/extras.service';
import { DetalleGuiaComponent } from '../detalle-guia/detalle-guia.component';

@Component({
  selector: 'app-cabecera-guia',
  templateUrl: './cabecera-guia.component.html',
  styleUrls: ['./cabecera-guia.component.scss'],
})
export class CabeceraGuiaComponent implements OnInit {

  @Input() pasaguia: any;

  formulario: FormGroup;
  constructor(
    private fb: FormBuilder,
    private baseService: BaseService,
    public alertController: AlertController,
    public extras: ExtrasService) {
    this.formulario = this.fb.group({
      nroguia: ['',[Validators.required, Validators.maxLength(10)]],
      idusuario: [''],
      fcreacion: [''],
      fapertura: [''],
      fcierre: [''],
      encargado: [''],
      vehiculo: ['']
    });
   }

  ngOnInit() {
    this.asignausuario();
    this.formulario.patchValue({
      nroguia: this.baseService.cerosnumero(this.pasaguia,9)
    });
    this.validaguia();
  }

  validaRango(valor){
    if (isNaN(valor)){
      alert('Ingrese solo números.');
      this.formulario.controls.nroguia.value('');
      this.formulario.reset();
      return;
    }
    if (valor>999999999){
      alert('Debe ingresar valores correctos.');
      this.formulario.reset();
      return;
    }
  }

  validaguia(){
    const nroguia = this.formulario.value.nroguia;
    const idusuario = this.formulario.value.idusuario;
    const params = {
      nroguia,
      idusuario
    };
    this.baseService.getNroGuia(params)
    .subscribe( respuesta =>{
      // eslint-disable-next-line @typescript-eslint/dot-notation
      if (respuesta['reply']==='ok'){
        this.cargaDatos(respuesta);
      }else{
        this.presentError(respuesta);
        this.limpiartodo();
      }
    },(err)=>{
      this.presentError('Ha ocurrido algo inesperado');
    });
  }

  cargaDatos(data){
    if (data.reply==='ok'){
      const guia = data.guia[0];
      if (guia===null){
        this.presentError('Ruta no existe');
      }
      const detalle = data.detalle;
      this.formulario.patchValue({
        fcreacion: this.extras.formatofecha(guia.FechaCreacion),
        fapertura: this.extras.formatofecha(guia.FechaApertura),
        fcierre: this.extras.formatofecha(guia.FechaCierre),
        encargado: guia.NombreCorto,
        vehiculo: guia.Patente
      });
      this.baseService.$detalle.emit(detalle);
      if (guia.IdEstado===1){
        this.baseService.$flag.emit(true);
      }
    }else{
      const detalle='';
      this.baseService.$detalle.emit(detalle);
      let html='';
      for (const element of data.errores){
          html+=element+'<br>';
      }
      this.presentAlertUno(html);
      this.limpiartodo();
      this.formulario.patchValue({
        idusuario: localStorage.getItem('idusuario')
      });
    }
  }

  async presentAlertUno(texto) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Error!',
      message: texto,
      buttons: [
        {
          text: 'Cerrar',
          role: 'No',
          cssClass: 'btno',
          handler: (blah) => {
            console.log('Cancelo');
          },
        }
      ],
    });

    await alert.present();
  }

  async presentError(texto) {
    let html='';
    for (const element of texto){
        html+=element+'<br>';
    }
    this.baseService.showAlert('Error',html);
  }

  limpiartodo(){
    this.formulario.reset();
    this.baseService.$detalle.emit();
    this.asignausuario();
  }

  asignausuario(){
    this.formulario.patchValue({
      idusuario: localStorage.getItem('idusuario')
    });
  }
}
