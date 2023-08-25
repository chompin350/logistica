/* eslint-disable quote-props */
/* eslint-disable @typescript-eslint/naming-convention */
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  @Input() campo1: any;

  contenido: any;
    constructor(
    public baseService: BaseService,
    public navCtrl: NavController,
    public modCtrl: ModalController,
    public service: BaseService) { }

  ngOnInit() {
    this.service.showloading();
    this.contenido=this.campo1;
  }

  ionViewDidEnter(){
    const pageEl = document.querySelector('.contenido');
    pageEl.innerHTML=this.contenido;
    this.service.hideloading();
  }
  volver(){
    this.navCtrl.back();
  }

   closeModal(){
    this.baseService.$modal.emit(false);
  }

  dismissModal(){
    this.modCtrl.dismiss();
  }


}

