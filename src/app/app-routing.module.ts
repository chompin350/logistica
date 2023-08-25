import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { VigilanteGuard } from './guard/vigilante.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'home/:idguia',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'modal',
    loadChildren: () => import('../app/component/modal/modal.component').then( m => m.ModalComponent), canActivate:[VigilanteGuard]
  },
  {
    path: 'maps/:idproveedor/:idguia/:lat/:lng',
    loadChildren: () => import('./maps/maps.module').then( m => m.MapsPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'proveedor/:idproveedor/:iddireccion/:idruta',
    loadChildren: () => import('./proveedor/proveedor.module').then( m => m.ProveedorPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'guia/:idguia/:nroguia',
    loadChildren: () => import('./guia/guia.module').then( m => m.GuiaPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'detallekit/:iditem/:idretiro',
    loadChildren: () => import('./detallekit/detallekit.module').then( m => m.DetallekitPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'bultos/:iditem/:idretiro',
    loadChildren: () => import('./bultos/bultos.module').then( m => m.BultosPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'imprimir/:iditem/:idguiaretiro',
    loadChildren: () => import('./imprimir/imprimir.module').then( m => m.ImprimirPageModule),canActivate:[VigilanteGuard]
  },
  {
    path: 'cargabultos/:iditem/:idguiaretiro',
    loadChildren: () => import('./cargabultos/cargabultos.module').then( m => m.CargabultosPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'inicio',
    loadChildren: () => import('./inicio/inicio.module').then( m => m.InicioPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'bodega/:idruta',
    loadChildren: () => import('./bodega/bodega.module').then( m => m.BodegaPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: 'listabultos/:idruta',
    loadChildren: () => import('./listabultos/listabultos.module').then( m => m.ListabultosPageModule), canActivate:[VigilanteGuard]
  },
  {
    path: '*',
    redirectTo: 'login'
    //pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
