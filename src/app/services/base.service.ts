/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/dot-notation */
import { EventEmitter, Injectable, Output  } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, map  } from 'rxjs/operators';
import { AlertController, LoadingController, ModalController, ToastController } from '@ionic/angular';
//import { Observable, ReplaySubject, throwError } from 'rxjs';
import { PathBase } from '../static/variables';
import { setOptions, Notifications } from '@mobiscroll/angular';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class BaseService {

  @Output() miEvento: EventEmitter<any> = new EventEmitter<any>();
  $modal = new EventEmitter<any>();
  $detalle = new EventEmitter<any>();
  $tabladetalle= new EventEmitter<any>();
  $limpiardetalle= new EventEmitter<any>();
  $flag=new EventEmitter<any>();

  private direccion: string;
  private params = new HttpParams();
  public temp1: string;
  cargaloading: any;
  msgerr: any;

  constructor(
    private http: HttpClient,
    private loadingcontroller: LoadingController,
    private alertController: AlertController,
    public notify: Notifications,
    public modalCtrl: ModalController,
    public toastController: ToastController
  ) {
  }

  buscar2(){
    return this.http.get(PathBase.urlComunas)
    .pipe(
      map( res => res ),
      catchError( err => this.handleError(err))
    );

  }

  logueoUsuario(params){
    return this.http.get(PathBase.urlLogueo,{params})
    .pipe(
      map( res => res),
      catchError( err => this.handleError(err))
    );
  }

  getUrl(url: string) {
    return this.http.get(PathBase.urlComunas)
          .pipe(
            map( res => res),
            catchError( err => this.handleError(err))
          );
  }

  private handleError(error: HttpErrorResponse) {
    //return 'Hubo un error interno';
    return this.presentAlerta(error.message);
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getNroGuia(params){
    return this.http.get(PathBase.urlnroguia,{ params })
    .pipe(
      map(respuesta => {
        if (respuesta['reply']==='error'){
          return respuesta['errores'];
        }else{
          return respuesta;
        }
      }),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getProveedor(params){
    return this.http.get(PathBase.urlproveedor, { params })
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getProveedor2(params){
    return this.http.get(PathBase.urlproveedor2, { params })
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getGuiaRetiro(params){
    return this.http.get(PathBase.urlguiaretiro,{params})
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getKit(params){
    return this.http.get(PathBase.urlkit,{params})
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getListBultos(params){
    return this.http.get(PathBase.urlListBultos,{params})
    .pipe(
      map(res => res),
      catchError(err => this.handleError(err))
    );
  }

  putiniciaruta(params){
    return this.http.get(PathBase.urliniciaruta,{params})
    .pipe(
      map(res => res),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async showloading(){
    const cargaloading = await this.loadingcontroller.create({
      message: 'Por favor espere..',
      duration: 2000,
    });
    return cargaloading.present();
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async hideloading(){
    if (this.cargaloading){
      this.cargaloading.dismiss();
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getItem(params){
    return this.http.get(PathBase.urlItem,{params})
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getItemproveedor(params){
    return this.http.get(PathBase.urlItemDatos,{params})
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  getBultos(params){
    return this.http.get(PathBase.urlIdBulto,{params})
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  addBultos(params){
    return this.http.get(PathBase.urlAddBulto,{params})
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  removeBultos(params){
    return this.http.get(PathBase.urlRemoveBulto,{params})
    .pipe(
      map(respuesta =>respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  updateqimpresiones(params){
    return this.http.get(PathBase.urlUpdBulto,{params})
    .pipe(
      map(respuesta => respuesta),
      catchError(err => this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  validacodigo(params){
    return this.http.get(PathBase.urlValCodigo,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  cargabulto(params){
    return this.http.get(PathBase.urlcargabulto,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  listacargados(params){
    return this.http.get(PathBase.urllistacargados,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  listarutasasignadas(params){
    return this.http.get(PathBase.urlrutasAsignadas,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  listasinvalidar(params){
    return this.http.get(PathBase.urlrutassinvalidar,{params})
      .pipe(
        map(res => res),
        catchError(err=>this.handleError(err))
      );
  }

  validaruta(params){
    return this.http.get(PathBase.urlactualizarutaconductor,{params})
      .pipe(
        map(res => res),
        catchError(err=>this.handleError(err))
      );
  }

  //CIERRA RUTA ACTIVA AUN
  cierrarutaactiva(params){
    return this.http.get(PathBase.urlcierreruta,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  validacodigosubido(params){
    return this.http.get(PathBase.urlvalidacarga,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  cuentabultos(params){
    return this.http.get(PathBase.urlqbultos,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  entregabodega(params){
    return this.http.get(PathBase.urlentregabodega,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  serviceactualizaruta(params){
    return this.http.get(PathBase.urlactualizaruta,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  async presentAlerta(texto) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      //header: 'Mensaje',
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

  // eslint-disable-next-line @typescript-eslint/member-ordering
  cerosnumero(numero,cantidad){
    const cadenaNumerica = '0'.repeat(cantidad);
    let resultado = cadenaNumerica + numero;
    resultado = resultado.substring(resultado.length - cadenaNumerica.length);
    return resultado;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  showAlert(titulo,texto): void {
    if (typeof texto === 'object'){
      this.msgerr ='<ul>';
      texto.forEach((err)=> {
        this.msgerr+='<li>'+err+'</li>';
      }, this);
      this.msgerr+='</ul>';
      texto=this.msgerr;
    }
    this.notify.alert({
        title: titulo,
        message: texto
    });
  }

  async mensajess(texto,titulo) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: titulo,
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

  async mensajeToastVar(texto) {
    const toast = await this.toastController.create({
      message: texto,
      position: 'bottom',
      duration: 1000,
      color: 'primary'
    });
    toast.present();
  }

  validaqparaentregabodega(params){
    return this.http.get(PathBase.urlvalidaqentrega,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

  listabultosentregados(params){
    return this.http.get(PathBase.vistalistabultos,{params})
    .pipe(
      map(res => res),
      catchError(err=>this.handleError(err))
    );
  }

}

