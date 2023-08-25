/* eslint-disable @typescript-eslint/naming-convention */
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { PathBase } from '../static/variables';

@Injectable({ providedIn: 'root' })

export class InterceptorService implements HttpInterceptor {

  constructor(private toastController: ToastController) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({Apikey: PathBase.token}); //define cabecera
    const reqClone = req.clone({ headers }); //clona Httprequest y agrega cabecera
    return next.handle(reqClone);
  }

}
