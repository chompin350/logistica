/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable quote-props */
import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { BaseService } from '../services/base.service';
import { PathBase } from '../static/variables';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formulario: FormGroup;
  // eslint-disable-next-line max-len
  reLargo: any = /^(([^<>()\[\]\\.,;:\s@\"]+(\.[^<>()\[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}\.[0–9]{1,3}])|(([a-zA-Z\-0–9]+\.)+[a-zA-Z]{2,}))$/;
  mensaje: any =[];
  status=false;
  msjErrores: '';
  errorStatus= false;
  nombreCorto='';
  titulo='';

  constructor(
    private fb: FormBuilder,
    private baseService: BaseService,
    public alertController: AlertController,
    public router: Router) {
      this.formulario = this.fb.group({
        usuario: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(25)]],
        password: ['',[Validators.required, Validators.minLength(5), Validators.maxLength(25)]]
      });

   }

  ngOnInit() {
    this.iniciaLocalStorage();
    this.titulo=PathBase.tituloApp;
  }

  validacionUsuario(){
    this.baseService.logueoUsuario(this.formulario.value)
    .subscribe(respuesta =>{
      // eslint-disable-next-line @typescript-eslint/dot-notation
      //console.log(respuesta);
      if (respuesta===undefined){
        this.baseService.showAlert('Error','Existe un error en la conexion..!');
        this.errorStatus=true;
        return false;
      }
      if (respuesta['reply']==='OK'){
        localStorage.setItem('nombrecorto',respuesta['username'].NombreCorto);
        localStorage.setItem('idusuario', respuesta['username'].Id);
        localStorage.setItem('status','true');
        this.nombreCorto= respuesta['username'].NombreCorto;
        this.formulario.reset();
        const data = [{
          'nombrecorto' : this.nombreCorto,
          'tipo' : 1}];
        this.baseService.mensajeToastVar(`Bienvendido : ${this.nombreCorto}`);
        this.errorStatus=false;
        this.baseService.miEvento.emit(data);
        this.router.navigate(['/inicio']);
      }else{
        this.baseService.showAlert('Error','Revise sus credenciales para conectarse..!');
        this.errorStatus=true;
      }
    },(err)=>{
      //err=err.string;
      this.baseService.showAlert('Error',err.message);
    });
  }

  iniciaLocalStorage(){
    localStorage.clear();
    localStorage.setItem('status','false');
  }

}





