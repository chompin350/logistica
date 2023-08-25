import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseService } from '../services/base.service';
import { ExtrasService } from '../services/extras.service';

@Component({
  selector: 'app-listabultos',
  templateUrl: './listabultos.page.html',
  styleUrls: ['./listabultos.page.scss'],
})
export class ListabultosPage implements OnInit {

  ruta: [];
  bultos: [];
  idruta: any;
  pass='';
  fechacreacion: any;
  bultosflag= false;
  msgerr: any;
  receptor: any;

  constructor(
    private service: BaseService,
    private activatedRoute: ActivatedRoute,
    private extras: ExtrasService,
    private router: Router
  ) { }

  ngOnInit() {
    this.idruta = this.activatedRoute.snapshot.paramMap.get('idruta');
    this.cargarvista();
    this.service.showloading();
  }


  cargarvista(){
    const params = {
      idruta: this.idruta
    };
    this.service.listabultosentregados(params).subscribe(respuesta =>{
      const bultos = respuesta['bultos'];
      const ruta = respuesta['ruta'][0];
      this.bultos=bultos;
      if (bultos.length>0){
          this.bultosflag = true;
      }
      this.fechacreacion=this.extras.formatofecha(ruta.FechaCreacion);
      this.receptor=ruta.Receptor;
    });
  }


  validarecepcion(){
    const conductor = localStorage.getItem('idusuario');
    const params = {
      idconductor: conductor,
      idruta: this.idruta,
      pass: this.pass
    };
    this.service.validaruta(params).subscribe(res =>{
      if (res['reply']==='ok'){
        this.service.showAlert('Ruta','Ruta fue validada correctamente');
        this.router.navigate(['/inicio']);
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
}
