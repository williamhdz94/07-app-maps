import { Component, ElementRef, signal, viewChild, AfterViewInit, effect } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';

mapboxgl.accessToken = environment.mapboxkey;

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
  styleUrl: './markers-page.component.scss',
})
export class MarkersPageComponent implements AfterViewInit {

  divElement = viewChild<ElementRef>('map');
  zoom = signal(14);
  map = signal<mapboxgl.Map | null>(null);

  coordinates = signal({
    lng: -74.5,
    lat: 40,
  })

  zoomEffect = effect(() => {
    if( !this.map ) return;

    this.map()?.setZoom(this.zoom());
  })

   ngAfterViewInit() {

    if ( !this.divElement ) return;

    const element = this.divElement()?.nativeElement;
    const { lat, lng } = this.coordinates();

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lng, lat], // starting position [lng, lat]
      zoom: 14,
    });

    const maker = new mapboxgl.Marker({
      draggable: false,
      color: 'blue'
    })
    .setLngLat([lng, lat])
    .addTo(map);

    maker.on('dragend', (event) => {
      console.log(event);
    })

    this.mapListener(map);

  }

  mapListener(map: mapboxgl.Map) {
    console.log('listener')
  }

}
