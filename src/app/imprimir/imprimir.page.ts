/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit, ElementRef, ViewChild, QueryList } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../services/base.service';
import * as JsBarcode from 'jsbarcode';
import * as moment from 'moment';
import { BarcodeScannerOptions, BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import { Platform } from '@ionic/angular';
import html2canvas from 'html2canvas';
import { BluetoothSerial } from '@awesome-cordova-plugins/bluetooth-serial/ngx';
import { PathBase } from '../static/variables';
import { ExtrasService } from '../services/extras.service';

@Component({
  selector: 'app-imprimir',
  templateUrl: './imprimir.page.html',
  styleUrls: ['./imprimir.page.scss']
})

export class ImprimirPage implements OnInit {

  pdfObj= null;
  letterObj = {
    to: '',
    from: '',
    text: ''
  };
  //formulario: FormGroup;
  iditem: any;
  idguiaretiro: any;
  image: string;
  datocodificado: any;
  bultos: any;
  descripcion: any;
  observacion: any;
  elemento: '';
  ventimp: any;
  printContents: any;
  originalContents: any;
  ventana: any;
  idruta: any;
  vcodigo: any;
  vfecha: any;
  vruta: any;
  findimpresora=false;
  flagseleccion=false;
  encodeData: any;
  scannedData= {};
  barcodeScannerOptions: BarcodeScannerOptions;
  resultado: any;

  bluetoothList: any=[];
  selectedPrinter: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private service: BaseService,
    private extras: ExtrasService,
    private barcodeScanner: BarcodeScanner,
    private plt: Platform,
    private file: File,
    private fileOpener: FileOpener,
    private bluetoothSerial: BluetoothSerial
    ) {
      this.barcodeScannerOptions = {
        showTorchButton: true,
        showFlipCameraButton: true,
      };
    }

  ngOnInit() {
      this.service.showloading();
      this.iditem = this.activatedRoute.snapshot.paramMap.get('iditem');
      this.idguiaretiro = this.activatedRoute.snapshot.paramMap.get('idguiaretiro');
      this.listabustos();
      this.validaimpresora();
  }

  //valida si existe una impresora
  validaimpresora(){
    if (localStorage.getItem('Printer') !== undefined && localStorage.getItem('Printer')){
      this.selectedPrinter=localStorage.getItem('Printer');
      this.findimpresora=true;
    }else{
      this.findimpresora=false;
      localStorage.removeItem('Printer');
    }
  }

  listabustos(){
    const params = {
      iditem: this.iditem,
      idguiaretiro: this.idguiaretiro
    };
    this.service.getListBultos(params).subscribe( res =>{
      this.bultos=res['bultos'];
      this.descripcion = res['pieza'][0].DescripcionItem;
      this.observacion = res['pieza'][0].Observacion;
      this.idruta=res['pieza'][0].IdRuta;
      this.bultos.forEach(elem =>{
        elem.Seleccionado=false;
      });
    });
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering

  validaImpresion(){
    // eslint-disable-next-line @typescript-eslint/no-shadow
    let contador = 0;
    // eslint-disable-next-line @typescript-eslint/no-shadow
    this.bultos.forEach((element) => {
      if (element.Seleccionado===true){
        contador++;
      }
    });
    if (contador===0){
      this.service.showAlert('Selección de impresion','No ha seleccionado ningun bulto para imprimir');
      return;
    }
    if (contador>1){
      this.service.showAlert('Selección de impresion','Solo puede imprimir de una Etiqueta');
      return;
    }
    this.creaCanvas();
    this.printLabel();
  }

  onSelectionChange(e, i) {
    const cantidad= this.bultos.length;
    const chequeado=e.target.checked;
    const nombre =Number(e.target.name);
    const elemento = this.bultos[i];
    const campo = document.getElementsByTagName('input');
    const largo = campo.length;
    for(let j=0;j<largo;j++){
      if (campo[j].type==='checkbox'){
        campo[j].checked=false;
      }
    }
    this.bultos.forEach(elem => {
      elem.Seleccionado=false;
    });
    this.bultos[i].Seleccionado=chequeado;
    this.bultos.forEach(valor => {
      this.removeRemove(valor);
    });
    if (chequeado){
      this.agregaCodigo(elemento);
    }
  }

  agregaCodigo(elemento){
    const padre = document.getElementById('contenido');
    this.vcodigo=elemento.Codigo;
    const dfecha= this.extras.formatofecha(elemento.FechaCreacion);
    this.vfecha= this.extras.formatofecha(elemento.FechaCreacion);
    this.encodeData=elemento.Codigo;
    const nroguiacero='R'+this.service.cerosnumero(this.idruta,9);
    this.vruta='R'+this.service.cerosnumero(this.idruta,9);
    let html='';
    html+='<div class="d-flex justify-content-around">';
    html+='<ion-label class="cabecera">MercadoPARTES Spa</ion-label>';
    html+=`<ion-label class="nroguia">${nroguiacero}</ion-label>`;
    html+=`<ion-label class="divfecha">${dfecha}</ion-label>`;
    html+='</div>';
    html+=`<div class="d-flex justify-content-center">`;
    html+=`<svg id="svg_${elemento.Id}" style="height:35px"></svg>`;
    html+=`</div>`;
    html+='</div>';
    const node = document.createElement('div');
    //node.classList.add('borde-linea');
   // node.setAttribute('class','borde-linea');
    node.setAttribute('style', 'border: 1px solid #000;padding:5px;margin-bottom:3px;width:130mm');
    //node.className ='borde-linea';
    node.setAttribute('id', `barra_${elemento.Id}`);
    node.innerHTML = html;
    document.getElementById('contenido').appendChild(node);
    const destino= document.getElementById(`svg_${elemento.Id}`);
    JsBarcode(destino, elemento.Codigo, {
      //lineColor: '#0aa',
      height:35
    });
  }

  removeRemove(elemento){
    const temporal = document.getElementById(`barra_${elemento.Id}`);
    if (temporal){
      temporal.remove();
    }
  }

  generateBar() {
    this.barcodeScanner
      .encode(this.barcodeScanner.Encode.TEXT_TYPE, this.encodeData)
      .then(
        encodedData => {
          this.encodeData = encodedData;
        },
        err => {
          console.log('Error occured : ' + err);
        }
      );
  }

  creaCanvas(){
    const elemento =document.getElementById('contenido');
    let codigo=0;
     this.bultos.forEach((element) => {
      if (element.Seleccionado===true){
        codigo = element.Codigo;
      }
    });
    html2canvas(elemento).then((canvas) => {
       const imgWidth = 200;
      // const pageHeight = 400;
      // const imgHeight = canvas.height * imgWidth / canvas.width;
      // const heightLeft = imgHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(canvas,0,0);
      const contentDataURL = canvas.toDataURL('image/jpg');
      this.resultado=contentDataURL;
     /*  const docDefinition = {
        pageSize: 'A4',
        pageOrientation: 'portrait', //landscape
        content: [
          {
            image: contentDataURL,
            width: 150
          }
        ]
      };
      this.pdfObj = pdfMake.createPdf(docDefinition);
      this.downloadPdf(codigo); */
      this.actualizaimpresiones();
      this.service.showAlert('Impresion','Impresion efectuada');
    });
  }

  downloadPdf(codigo) {
    if (this.plt.is('cordova')) {
      this.pdfObj.getBuffer((buffer) => {
        const blob = new Blob([buffer], { type: 'application/pdf' });
        this.file.writeFile(this.file.dataDirectory, codigo+'.pdf', blob, { replace: true }).then(fileEntry => {
          this.fileOpener.open(this.file.dataDirectory + codigo+'.pdf', 'application/pdf');
        });
      });
    } else {
      this.pdfObj.download();
    }
  }

  actualizaimpresiones(){
    let caso;
    this.bultos.forEach((element) => {
      if (element.Seleccionado===true){
        caso = element;
      }
    });
    const params = {
      idbulto: caso.Id,
      idsuario: localStorage.getItem('idusuario')
    };
    this.service.updateqimpresiones(params).subscribe( res =>{
      if (res['reply']==='ok'){
        this.bultos.forEach(elem =>{
          if (elem.Id===caso.Id){
            elem.Qprint=elem.Qprint+1;
            elem.Estado='Etiquetado';
            elem.IdItem=2;
          }
          elem.Seleccionado=false;
        });
      }
    });
  }

  //Servicio de Impresion
  listPrinter() {
    this.searchBluetoothPrinter()
     .then(resp=>{
      //List of bluetooth device list
      this.bluetoothList=resp;
    });
  }

  //This will store selected bluetooth device mac address
  selectPrinter(macAddress)
  {
    //Selected printer macAddress stored here
    this.selectedPrinter=macAddress;
    this.findimpresora=true;
    localStorage.setItem('Printer', macAddress);
  }

  searchBluetoothPrinter(){
    //This will return a list of bluetooth devices
    return this.bluetoothSerial.list();
  }

  connectToBluetoothPrinter(macAddress){
    //This will connect to bluetooth printer via the mac address provided
    this.findimpresora=true;
    return this.bluetoothSerial.connect(macAddress);
  }

  disconnectBluetoothPrinter(){
    //This will disconnect the current bluetooth connection
    return this.bluetoothSerial.disconnect();
    this.findimpresora=false;
  }

   //macAddress->the device's mac address
  //data_string-> string to be
  sendToBluetoothPrinter(macAddress,datastring){
    //1. Try connecting to bluetooth printer
    this.connectToBluetoothPrinter(macAddress)
    .subscribe(_=>{
      //2. Connected successfully
      this.bluetoothSerial.write(datastring)
      // eslint-disable-next-line @typescript-eslint/no-shadow
      .then(_=>{
        //3. Print successful
        //If you want to tell user print is successful,
        //handle it here

        //4. IMPORTANT! Disconnect bluetooth after printing
        this.disconnectBluetoothPrinter();
      },err=>{
        //If there is an error printing to bluetooth printer
          //handle it here
      });
    },err=>{
       //If there is an error connecting to bluetooth printer
       //handle it here
    });
  }

  //This will print
  printLabel(){
    //The text that you want to print
    //const myText='Hello hello hello \n\n\n This is a test \n\n\n';
    // eslint-disable-next-line max-len
    const titulo=PathBase.tituloApp;
    let texto='';
    texto+='! 0 200 200 345 1\n';
    texto+='PW 807\n';
    texto+='TONE 0\n';
    texto+='SPEED 5\n';
    texto+='ON-FEED IGNORE\n';
    texto+='NO-PACE\n';
    texto+='BAR-SENSE\n';
    texto+='BT 7 0 3\n';
    texto+=`B 128 2 30 110 170 137 ${this.vcodigo}\n`;
    texto+=`T 0 5 49 58 ${titulo}\n`;
    texto+=`T 0 5 319 58 ${this.vruta}\n`;
    texto+=`T 0 5 521 61 ${this.vfecha}\n`;
    texto+='PRINT\n';
    this.sendToBluetoothPrinter(this.selectedPrinter,texto);
  }
}
