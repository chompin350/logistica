/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-detallekit',
  templateUrl: './detallekit.page.html',
  styleUrls: ['./detallekit.page.scss'],
})
export class DetallekitPage implements OnInit {

  iditemproveedor: any;
  idguiaretiro: any;
  kits: any;
  item: any;
  descripcionitem: any;
  caracteristica: any;
  codigo: any;
  cantidad: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: BaseService) { }

  ngOnInit() {
    this.service.showloading();
    this.iditemproveedor = this.activatedRoute.snapshot.paramMap.get('iditem');
    this.idguiaretiro = this.activatedRoute.snapshot.paramMap.get('idretiro');
    this.cargakit();
  }

  cargakit(){
    const params = {
      iditem: this.iditemproveedor,
      idguia: this.idguiaretiro
    };
    this.service.getKit(params)
    .subscribe(
      respuesta => {
        this.kits= respuesta['kits'];
        this.item= respuesta['equipo'][0];
        this.descripcionitem=this.item.DescripcionItem;
        this.caracteristica=this.item.Caracteristicas;
        this.codigo=this.item.Codigo;
        this.cantidad=this.item.Cantidad;
      }
    );
  }

}
