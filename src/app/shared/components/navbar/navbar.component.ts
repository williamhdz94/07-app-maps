import { Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [ AsyncPipe, RouterLink ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {

  router = inject(Router);

  routes = routes.map((route) => ({
    path: route.path,
    title: `${ route.title ?? 'Maps en Angular' }`
  })).filter( (route) => route.path !== '**' );

  pageTitle$ = this.router.events.pipe(
    filter( (event) => event instanceof NavigationEnd ),
    map( (event) => event.url ),
    map( (url) => routes.find((route) => `/${ route.path }` === url )?.title ?? 'Mapas' )
  );

}
