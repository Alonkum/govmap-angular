import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-govmap',
  templateUrl: './govmap.component.html',
  styleUrls: ['./govmap.component.scss']
})
export class GovmapComponent implements OnInit {

  display: any;
  apiLoaded: boolean = false;
  zoom: number = 12;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true
  }
  constructor(httpClient: HttpClient) {
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
    })
  }

  zoomInOut(e: WheelEvent): void {
    // e.deltaY < 0 ? this.zoom++ : this.zoom--;
  }




  moveMap(event: google.maps.MapMouseEvent) {
    this.center = (event.latLng.toJSON());
  }

  move(event: google.maps.MapMouseEvent) {
    this.display = event.latLng.toJSON();
  }

}
