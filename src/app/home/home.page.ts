/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/member-ordering */
import { Component, Input, OnInit  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonicModule, LoadingController } from '@ionic/angular';
import { modalController } from '@ionic/core';
import { throwIfEmpty } from 'rxjs/operators';
import { BaseService } from '../services/base.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],


})
export class HomePage implements OnInit {


  switchModal: boolean;
  private loading: boolean;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @Input()
  idruta: any;
  // eslint-disable-next-line @typescript-eslint/member-ordering
  sub: any;
  nroguia: any;
  inicio=false;
  otro=false;
  valores: any;

  constructor(
    private router: Router,
    private baseService: BaseService,
    public loadingController: LoadingController,
    private activatedRoute: ActivatedRoute)
    {
      this.loading=true;
   }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.idruta = params.idguia;
      this.nroguia= params.idguia;
    });
    this.iniciobotones();
    this.baseService.showloading();

  }

  iniciobotones(){
    const params = {
      nroguia: this.idruta,
      idusuario: localStorage.getItem('idusuario')
    };
    this.baseService.getNroGuia(params).subscribe(res=>{
      const valores = res['guia'][0];
      switch (valores.IdEstado){
        case 1:
        case 2:
          this.inicio=true;
          this.otro=false;
          break;
        case 3:
        case 4:
          this.inicio=false;
          this.otro=true;
          break;
        case 5:
          this.inicio=false;
          this.otro=false;
          break;
      }
    });
  }

  volver(){
    const data = [{
      nombrecorto : '',
      tipo : 0}];
    this.baseService.miEvento.emit(data);
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  cerrarruta(){
    const params = {
      idruta: this.idruta
    };
    this.baseService.validaqparaentregabodega(params).subscribe(resp=>{
      const respuesta = resp['reply'];
      if (respuesta==='error'){
        const errores=resp['errores'];
        let html='';
        errores.forEach(element => {
          html=html+'- '+element +'<br>';
        });
        this.baseService.mensajess(html,'Advertencias');
        return;
      }else{
        this.baseService.cierrarutaactiva(params).subscribe(res =>{
          if (res['reply']==='ok'){
            this.baseService.showAlert('Informacion','Bultos subidos correctamente');
            this.router.navigate(['/inicio']);
          }else{
            const errores=res['errores'];
            let html='';
            errores.forEach(element => {
              html=html+'- '+element +'<br>';
            });
            this.baseService.mensajess(html,'Advertencias');
            return;
          }
        });
      }
    });
  }

  entregabodega(){
    this.router.navigate(['/bodega', this.idruta]);
  }

}
