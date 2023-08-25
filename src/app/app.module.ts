import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule,ReactiveFormsModule  } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { DataTablesModule } from 'angular-datatables';
import { MbscModule } from '@mobiscroll/angular';
import { NgxPrintModule  } from 'ngx-print';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { NgbModule }  from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent
    ],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule ,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    DataTablesModule,
    MbscModule,
    NgxPrintModule,
    NgbModule
  ],
  providers: [
    BarcodeScanner,
    File,
    FileOpener,
    BluetoothSerial,
    {provide: RouteReuseStrategy,useClass: IonicRouteStrategy},
    {provide: HTTP_INTERCEPTORS,useClass:InterceptorService, multi: true}
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
