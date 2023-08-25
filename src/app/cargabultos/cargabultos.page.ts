/* eslint-disable @typescript-eslint/dot-notation */
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { isDefined } from '@ng-bootstrap/ng-bootstrap/util/util';
import { empty } from 'rxjs';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-cargabultos',
  templateUrl: './cargabultos.page.html',
  styleUrls: ['./cargabultos.page.scss'],
})
export class CargabultosPage implements OnInit {
  [x: string]: any;

  iditem: any;
  idguiaretiro: any;
  codigo: any;
  scannedData= {};
  listado= [];
  limpiar=false;
  documento: any;
  msgerr='';
  result= null;
  scanActive= false;
  myCustomIcon ='../../assets/camionamarillo.png';
  myCustomIconOk ='../../assets/amarillook.png';
  constructor(
    private activatedRoute: ActivatedRoute,
    private service: BaseService,
    private barcodeScanner: BarcodeScanner
  ) {
    this.barcodeScannerOptions = {
      showTorchButton: true,
      showFlipCameraButton: true
    };
  }

  ngOnInit() {
    this.service.showloading();
    this.iditem = this.activatedRoute.snapshot.paramMap.get('iditem');
    this.idguiaretiro = this.activatedRoute.snapshot.paramMap.get('idguiaretiro');
    this.listabultoscargados();
  }


  scanBar() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scancodigo=barcodeData;
      const valor = barcodeData;
      const elemento = document.getElementById('scancodigo');
      elemento.setAttribute('value',valor.text);
      if (valor.text){
        this.validaitem(valor.text);
      }else{
        console.log('no hice nada');
      }
     }).catch(err => {
         console.log('Error', err);
     });
  }

  btnvalidacarga(){
    this.codigo=document.getElementById('scancodigo');

    this.validaitem(this.codigo.value);
  }

  validaitem(codigo){
    codigo=codigo.replace(/\s{2,}/g, ' ').trim();
    console.log(codigo);
    if (isNaN(codigo)){
      this.service.showAlert('Error','El codigo ingresado no es un codigo válido');
      return false;
    }
    if (codigo==='' || codigo===0 || codigo===null){
      this.service.showAlert('Error','El codigo ingresado no es un codigo válido');
      return false;
    }
    const params ={
      iditem: this.iditem,
      codigo
    };
    this.service.validacodigo(params).subscribe(res =>{
        // eslint-disable-next-line @typescript-eslint/dot-notation
        const respuesta = res['reply'];
        if (respuesta==='ok'){
          // eslint-disable-next-line @typescript-eslint/dot-notation
          const valor=res['item'][0];
          const existe = this.listado.filter(x => x.codigo === valor.Codigo)[0];
          if (existe!==undefined){
            this.service.showAlert('Error','Etiqueta scaneada ya fue ingresada al listado');
            return;
          }else{
            this.listado.push({
              id: valor.Id,
              codigo: valor.Codigo,
              estado: valor.Estado,
              idestado: valor.IdEstado,
              idretiro: this.idguiaretiro,
              iditem: this.iditem,
              cargado: valor.Cargado
            });
            this.documento=document.getElementById('scancodigo');
            this.documento.value='0';
          }
        }else{
          // eslint-disable-next-line @typescript-eslint/dot-notation
          const error=res['errores'];
          this.service.showAlert('Error',error);
        }
    });
  }

  listabultoscargados(){
    const params ={
      iditem: this.iditem
    };
    this.service.listacargados(params).subscribe(res =>{
      const listado = res['item'];
      if (listado!==undefined){
        listado.forEach(valor => {
          this.listado.push({
            id: valor.Id,
            codigo: valor.Codigo,
            estado: valor.Estado,
            idestado: valor.IdEstado,
            idretiro: this.idguiaretiro,
            iditem: this.iditem,
            cargado: valor.Cargado
          });
        });
      }
    });
  }

  subirbulto(bulto){
    const params = {
      id: bulto.id,
      idusuario: localStorage.getItem('idusuario')
    };
    this.service.cargabulto(params).subscribe(res =>{
      // eslint-disable-next-line @typescript-eslint/dot-notation
      const respuesta = res['reply'];
      if (respuesta==='ok'){
        this.service.showAlert('Confirmación','Se a subido correctamente el Bulto');
        this.listado.forEach(element => {
          if (element.id===bulto.id){
            element.estado= 'Cargado';
            element.idestado=3;
            element.cargado=1;
          }
        });
      }
    });



  }

  limpiarlistado(){
    const cantidad = this.listado.length;
    if (cantidad===0){
      this.service.showAlert('Advertencia','Debe subir al menos un bulto');
    }
    this.listado=[];
    this.documento=document.getElementById('scancodigo');
    this.documento.setAttribute('value','');
    this.listabultoscargados();
  }

  limpiarcodigo(){
    document.getElementById('scancodigo').setAttribute('value','');
  }
}
