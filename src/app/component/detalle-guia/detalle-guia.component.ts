/* eslint-disable @typescript-eslint/member-ordering */
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-detalle-guia',
  templateUrl: './detalle-guia.component.html',
  styleUrls: ['./detalle-guia.component.scss'],
})

export class DetalleGuiaComponent implements OnInit {

  constructor(
    private service: BaseService,
    private modalService: NgbModal
    ) { }

  campos: any;
  // dtOptions: DataTables.Settings = {};
  dtTrigger: any;
  closeResult = '';

  ngOnInit() {
    this.service.$detalle.subscribe(data =>{
      this.campos=data;
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}
