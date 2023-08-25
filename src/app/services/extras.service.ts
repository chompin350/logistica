import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExtrasService {

  constructor() { }

  formatofecha(fecha){
    return (fecha!=null)? moment(fecha).format('DD-MM-YYYY HH:MM'):'';
  }
}
