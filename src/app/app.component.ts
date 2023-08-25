import { Component } from '@angular/core';
import { BaseService } from './services/base.service';
import { PathBase } from '../app/static/variables';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public usuario='';
  public titulo='';

  constructor(private service: BaseService) {}

  // eslint-disable-next-line @typescript-eslint/naming-convention
  OnInit() {
    this.titulo=PathBase.tituloApp;
    this.service.miEvento.subscribe(data=>
      {
        if (data[0].tipo===1){
          this.usuario='Usuario : '+data[0].nombrecorto;
        }else{
          this.usuario='';
        }
      });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterContentInit(){
    this.titulo=PathBase.tituloApp;
    this.service.miEvento.subscribe(data=>
      {
        if (data[0].tipo===1){
          this.usuario='Usuario : '+data[0].nombrecorto;
        }else{
          this.usuario='';
        }
      });
  }

}
