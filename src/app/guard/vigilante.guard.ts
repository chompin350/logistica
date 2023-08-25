import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VigilanteGuard implements CanActivate {

  constructor(private router: Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const estado = localStorage.getItem('status');
    // eslint-disable-next-line eqeqeq
    if (estado=='true'){
      this.redirect(true);
    }else{
      this.redirect(false);
    }
    return true;
  }

  redirect(flag: boolean): any {
    if (!flag){
      this.router.navigate(['/','login']);
    }
  }

}
