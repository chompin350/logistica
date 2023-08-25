/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Subject } from 'rxjs';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.page.html',
  styleUrls: ['./bodega.page.scss'],
})
export class BodegaPage implements OnInit {

  idruta: any;
  nroguia: any;
  scancodigo: any;
  listado= [];
  codigo: any;
  total: any;
  bodega=0;

  private unsubscribe$= new Subject<void>();
  constructor(
    private activatedRoute: ActivatedRoute,
    private baseService: BaseService,
    private barcodeScanner: BarcodeScanner,
    private router: Router
  ) { }

  ngOnInit() {
    this.baseService.showloading();
    this.activatedRoute.params.subscribe(params => {
      this.idruta = params.idruta;
      const temp= this.baseService.cerosnumero(this.idruta,8);
      this.nroguia= this.baseService.cerosnumero(temp,8);
      this.buscacantidad();
    });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  buscacantidad(){
    const params ={
      idruta: this.idruta
    };
    this.baseService.cuentabultos(params).subscribe(res=>{
      this.total=res['total'];
      this.bodega=res['entregados'];
      const lista=res['listado'];
      lista.forEach(valor => {
          this.listado.push({
            id: valor.Id,
            codigo: valor.Codigo,
            guiaretiro: valor.NroGuiaretiro,
            nroocc: valor.NroOcc,
            descripcion: valor.Descripcion,
            idruta: valor.IdRuta,
            idoferta: valor.IdOferta
          });
      });
    });
  }

  validaitem(codigo){
    if (codigo!==null){
      const params ={
        idruta: this.idruta,
        codigo
      };
      this.baseService.validacodigosubido(params).subscribe(res =>{
        const respuesta = res['reply'];
        if (respuesta==='ok'){
          const valor=res['item'][0];
          const existe = this.listado.filter(x => x.codigo === valor.Codigo)[0];
          if (existe!==undefined || existe===''){
            this.baseService.showAlert('Error','Etiqueta scaneada ya fue ingresada al listado');
            return;
          }else{
            this.listado.push({
              id: valor.Id,
              codigo: valor.Codigo,
              guiaretiro: valor.NroGuiaretiro,
              nroocc: valor.NroOcc,
              descripcion: valor.Descripcion,
              idruta: valor.IdRuta,
              idoferta: valor.IdOferta
            });
            this.bodega++;
          }
          let documento;
          documento=document.getElementById('scancodigo');
          documento.value='';
        }else{
          // eslint-disable-next-line @typescript-eslint/dot-notation
          const error=res['errores'];
          this.baseService.showAlert('Error',error);
        }
      });
    }
  }

  scanBar() {
    this.barcodeScanner.scan().then(barcodeData => {
      this.scancodigo=barcodeData;
      const valor = barcodeData;
      document.getElementById('scancodigo').setAttribute('value',valor.text);
      if (valor){
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
    if (this.codigo.value==='' || this.codigo.value===null){
      this.baseService.showAlert('Advertencia','Debe digitar el número del bulto');
      return;
    }
    this.validaitem(this.codigo.value);
  }

  limpiarlistado(){
    const cantidad = this.listado.length;
    if (cantidad===0){
      this.baseService.showAlert('Advertencia','No existen bultos cargados');
    }
    this.listado=[];
    let documento;
    // eslint-disable-next-line prefer-const
    documento=document.getElementById('scancodigo');
    documento.value='';
    this.buscacantidad();
  }

  entregaequipos(){
    //this.baseService.showloading();
    if (this.bodega!==this.total){
      this.baseService.showAlert('Advertencia','Debe subir todos los bultos');
      return;
    }
    let temporal= true;
    const parametro = {
      idruta: this.listado[0].idruta
    };
    this.baseService.validaqparaentregabodega(parametro).subscribe(res =>{
      const respuesta = res['reply'];
      if (respuesta==='error'){
        this.baseService.mensajess('Ocurrio un error al procesar la solicitud','Advertencias');
          return;
      }else{
        const cantidad = this.listado.length;
        let contador = 0;
        let errores = 0;
        this.listado.forEach(element => {
          const params = {
            idruta: element.idruta,
            idoferta: element.idoferta,
            idbulto: element.id,
            codigo: element.codigo
          };
          this.baseService.entregabodega(params).subscribe(res =>{
            const respuesta = res['reply'];
            contador++;
            if (respuesta!=='ok'){
              temporal=false;
              errores++;
            }
            if (contador===cantidad && errores===0){
              this.actualizaruta();
            }
            if (contador===cantidad && errores>0){
              this.baseService.mensajess('Ocurrio un error al procesar la solicitud','Advertencia');
            }
            if (errores>0){
              this.baseService.mensajess('Ocurrio un error al procesar la solicitud','Advertencia');
              return;
            }
          });
        });
      }
    });
  }

  actualizaruta(){
    const params ={
      idruta: this.idruta
    };
    this.baseService.serviceactualizaruta(params).subscribe(res=>{
      if (res['reply']==='ok'){
        this.baseService.mensajess('Se ha entregado a bodega correctamente','Mensaje');
        this.router.navigate(['/inicio']);
      }
    });

  }

  limpiar(){
    document.getElementById('scancodigo').setAttribute('value','');
  }


}
