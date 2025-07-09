import { Component, ElementRef, signal, viewChild, AfterViewInit, effect } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment';
import { IMarker } from '../../Data/interfaces/IMarker';
import { v4 as UUIDV4 } from 'uuid'

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
  markers = signal<IMarker[]>([]);

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

    // const maker = new mapboxgl.Marker({
    //   draggable: false,
    //   color: 'blue'
    // })
    // .setLngLat([lng, lat])
    // .addTo(map);

    // maker.on('dragend', (event) => {
    //   console.log(event);
    // })

    this.mapListener(map);

  }

  mapListener(map: mapboxgl.Map) {
    map.on('click', (event) => this.mapClick(event));

    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent) {
    if( !this.map ) return;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
    ((Math.random() * 16) | 0).toString(16)
    );

    console.log(event.lngLat);

    const coords = event.lngLat;

    const mapboxMarker = new mapboxgl.Marker({
      color: color,
    }).setLngLat(coords)
    .addTo(this.map()!);

    const newMarker: IMarker = {
      id: UUIDV4(),
      mapboxMarker: mapboxMarker
    }

    // this.markers.set([newMarker, ...this.markers()]);
    this.markers.update((markers) => [newMarker, ...markers]);

  }

}
