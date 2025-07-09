import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { environment } from '../../../environments/environment';
import { DecimalPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxkey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [ DecimalPipe ],
  templateUrl: './fullscreen-map-page.component.html',
  styleUrl: './fullscreen-map-page.component.scss',
})
export class FullscreenMapPageComponent implements AfterViewInit {

  divElement = viewChild<ElementRef>('map');
  zoom = signal(14);
  map = signal<mapboxgl.Map | null>(null);

  zoomEffect = effect(() => {
    if( !this.map ) return;

    this.map()?.setZoom(this.zoom());
  })

   ngAfterViewInit() {

    if ( !this.divElement ) return;

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: this.zoom(),
    });

    this.mapListener(map);

  }

  mapListener(map: mapboxgl.Map) {

    map.on('zoom', (event) => {
      const newZoom = event.target.getZoom();

      this.zoom.set(newZoom);
    })

    this.map.set(map);
  }

}
