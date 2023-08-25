import { environment } from 'src/environments/environment.prod';

export class PathBase {
  static readonly urlComunas    = environment.urlbase+'/api/listacomunas';
  static readonly urlLogueo     = environment.urlbase+'/api/login';
  static readonly urlnroguia    = environment.urlbase+'/api/searchguia';
  static readonly urlproveedor  = environment.urlbase+'/api/idproveedor';
  static readonly urlproveedor2 = environment.urlbase+'/api/idxproveedor';
  static readonly urlguiaretiro = environment.urlbase+ '/api/idguiaretiro';
  static readonly urlkit        = environment.urlbase+ '/api/idkit';
  static readonly urlItem       = environment.urlbase+'/api/IdItem';
  static readonly urlItemDatos  = environment.urlbase+'/api/IdItemProveedor';
  static readonly urlIdBulto    = environment.urlbase+'/api/IdItemBulto';
  static readonly urlAddBulto   = environment.urlbase+'/api/AddBulto';
  static readonly urlRemoveBulto   = environment.urlbase+'/api/RomoveBulto';
  static readonly urlListBultos = environment.urlbase+'/api/ListBustos';
  static readonly urlUpdBulto   = environment.urlbase+'/api/UpdateQImpresiones';
  static readonly urlValCodigo = environment.urlbase+'/api/validacodigobar';
  static readonly urlcargabulto = environment.urlbase+'/api/cargabulto';
  static readonly urllistacargados = environment.urlbase+'/api/listacargados';
  static readonly urlrutasAsignadas = environment.urlbase+'/api/listarutas';
  static readonly urliniciaruta   = environment.urlbase+'/api/iniciaruta';
  static readonly urlcierreruta   = environment.urlbase+'/api/cierraruta';
  static readonly urlvalidacarga = environment.urlbase+'/api/validacodigobaruta';
  static readonly urlqbultos = environment.urlbase+'/api/countbultosidruta';
  static readonly urlentregabodega = environment.urlbase+'/api/entregabodega';
  static readonly urlvalidaqentrega = environment.urlbase+'/api/validaqentrega';
  static readonly urlactualizaruta = environment.urlbase+'/api/actualizaruta';
  static readonly urlrutassinvalidar = environment.urlbase+'/api/rutasinvalidar';
  static readonly urlactualizarutaconductor = environment.urlbase+'/api/actualizarutaConductor';
  static readonly vistalistabultos = environment.urlbase+'/api/listabultos';

  static readonly token='bd7beb06c4c4d11c3827cbc71118f017';
  static readonly tituloApp='Mercado-Partes';
  static readonly keygoogle='AIzaSyAV8zOQat6MicfSYjYqZ4lL0UE9XNS2bvw';
}
