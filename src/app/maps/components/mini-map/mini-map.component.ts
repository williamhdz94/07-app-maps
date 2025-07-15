import { AfterViewInit, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { environment } from '../../../../environments/environment';

mapboxgl.accessToken = environment.mapboxkey;

@Component({
  selector: 'app-mini-map',
  imports: [],
  templateUrl: './mini-map.component.html',
  styleUrl: './mini-map.component.scss',
})
export class MiniMapComponent implements AfterViewInit{

  lngLat = input.required<{ lng: number, lat: number }>();
  zoom = input<number>(14);
  divElement = viewChild<ElementRef>('map');

  map = signal<mapboxgl.Map | null>(null);

  ngAfterViewInit(): void {
    if ( !this.divElement ) return;

    const element = this.divElement()?.nativeElement;

    const map = new mapboxgl.Map({
      container: element,
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat(), // starting position [lng, lat]
      zoom: this.zoom(),
      interactive: false,
      pitch: 30,
    });

    new mapboxgl.Marker().setLngLat(this.lngLat()).addTo(map);
  }

}
