/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../services/base.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Proveedor } from '../proveedor/proveedor.interface';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.page.html',
  styleUrls: ['./proveedor.page.scss'],
})
export class ProveedorPage implements OnInit {

  idproveedor: any;
  iddireccion: any;
  idruta: any;
  proveedor: Proveedor;
  razonsocial: string;
  fantasia: string;
  logo: any;
  direccion: any;
  contacto: any;
  telefono: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private baseService: BaseService
  ) { }

  ngOnInit() {
    this.baseService.showloading();
    this.idproveedor = this.activatedRoute.snapshot.paramMap.get('idproveedor');
    this.iddireccion = this.activatedRoute.snapshot.paramMap.get('iddireccion');
    this.idruta = this.activatedRoute.snapshot.paramMap.get('idruta');
    this.initProveedor();
  }

  ionViewDidEnter(){
    this.baseService.hideloading();
  }
  initProveedor(){
    const params = {
      idproveedor: this.idproveedor,
      iddireccion: this.iddireccion,
      idruta: this.idruta
    };
    this.baseService.getProveedor(params)
    .subscribe( respuesta =>{
      if (respuesta['reply']==='ok'){
        const prov = (respuesta['proveedor']);
        this.razonsocial =prov.RazonSocial;
        this.fantasia = prov.NombreFantasia;
        this.logo= prov.Logo;
        this.direccion =respuesta['direccion'];
        this.contacto= respuesta['contacto'];
        this.telefono=respuesta['telefono'];
        //this.cargaDatos(respuesta);
      }else{
        //this.baseService.$tabladetalle.emit();
      }
    },(err)=>{
      alert('Ha ocurrido algo inesperado');
    });
  }

}
