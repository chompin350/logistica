/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as L from 'leaflet';
import { BaseService } from '../services/base.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.page.html',
  styleUrls: ['./maps.page.scss'],
})
export class MapsPage implements OnInit {

  idproveedor: any;
  idguiretiro: any;
  latitud: any;
  longitud: any;
  latitudx: number;
  longitudx: number;
  proveedor: any;
  direccion: any;
  dataproveedor: any;
  texto: any;
  id: any;
  marca_clientes: any;
  LamMarker: any;
  basemaps: any;
  base: any;
  esri: any;
  funcion: any;
  loading: any;
  //funcion para ver si se mueve el movil
  TIME_IN_MS=10000;
  
  //Se inicia mapa
  map: L.Map;

  customIcon = new L.Icon({
    iconUrl: '../../assets/marker-icon.png',
    //iconSize: [50, 50],
    //iconAnchor: [25, 50]
  });
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private servicios: BaseService
  ) {}


  ngOnInit() {
    this.servicios.showloading();
    //this.presentLoading();
    if (!navigator.geolocation){
      console.log('No soportador');
    }
    this.idproveedor = this.activatedRoute.snapshot.paramMap.get('idproveedor');
    this.idguiretiro = this.activatedRoute.snapshot.paramMap.get('idguia');
    this.latitud = this.activatedRoute.snapshot.paramMap.get('lat');
    this.longitud = this.activatedRoute.snapshot.paramMap.get('lng');
  }

   //extrae la posicion del equipo
  watchPosition(){
    const desLat=0;
    const desLon=0;
    this.getPosition();
    this.id = navigator.geolocation.getCurrentPosition(
      (position)=>{
        this.latitudx = position.coords.latitude;
        this.longitudx= position.coords.longitude;
        if (position.coords.latitude===desLat){
          //navigator.geolocation.clearWatch(this.id);
          console.log('estas quieto');
        }else{
          console.log('hacer esto');
        }

      },(err) =>{
        console.log(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge:0
      }
    );
  }

  //carga mapa y cierra espera
  ionViewDidEnter(){
    this.loadmap();
    this.servicios.hideloading();
  }

  loadmap(){
    this.getPosition();
    const params = {
      idproveedor : this.activatedRoute.snapshot.paramMap.get('idproveedor'),
      idguiaretiro: this.activatedRoute.snapshot.paramMap.get('idguia')
    };
    this.servicios.getProveedor2(params).subscribe(data=>{
      this.dataproveedor=data['proveedor'];
      this.direccion= data['guia'][0].Direccion+' - '+data['guia'][0].Comuna+' - '+data['guia'][0].Ciudad;
      this.texto=`Nombre : <b> ${this.dataproveedor.NombreFantasia}</b><br>`;
      this.texto+=`Telefono : ${this.dataproveedor.Telefono1}<br>`;
      this.texto+=`Direccion : ${this.direccion}`;
      this.map = L.map('map',{
        center: [this.latitud,this.longitud],
        zoom: 13,
        renderer: L.canvas()
      });

      this.base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
        attribution: '&copy; contributors',
        maxZoom: 19,
        minZoom: 1
      }).addTo(this.map);
      this.esri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy 2022'
      });
      // eslint-disable-next-line @typescript-eslint/naming-convention
      this.basemaps = {Mapa: this.base,Satelital: this.esri};
      L.control.layers(this.basemaps,{}).addTo(this.map);
      this.map.locate({setView: true, maxZoom:13});
      L.marker([this.latitud, this.longitud],{ icon: this.customIcon }).bindPopup(`${this.texto}`).addTo(this.map).openPopup();
    });
  }

  getPosition(){
    this.id = navigator.geolocation.getCurrentPosition((position) => {
        const currentPos = position.coords;
        this.latitudx = currentPos.latitude;
        this.longitudx = currentPos.longitude;
        if (this.LamMarker !== null || this.LamMarker!==undefined) {
          this.map.removeLayer(this.LamMarker);
        }
        this.LamMarker=L.circle([this.latitudx, this.longitudx],{
          color: 'blue',
          //fillColor: '#f03',
          fillOpacity: 0.5,
          radius:50
        });
        //this.LamMarker= L.marker([this.latitudx, this.longitudx],{icon: this.customIcon});
        this.map.addLayer(this.LamMarker);
    },(err)=>{
        console.log('error : ' + err.message);
    });
  }

  //boton para ver donde va el vehiculo
  carga_vehiculo(){
    this.funcion= setInterval( ()=>{
      this.getPosition();
    }, this.TIME_IN_MS);
  }


}
