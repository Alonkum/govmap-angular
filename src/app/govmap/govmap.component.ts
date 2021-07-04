import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, ComponentRef, ElementRef, HostListener, Inject, Input, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { GoogleMap, MapGroundOverlay } from '@angular/google-maps';
import { GovmapService } from '../services/govmap.service';
import { DynamicLayer } from '../api.model';

@Component({
  selector: 'app-govmap',
  templateUrl: './govmap.component.html',
  styleUrls: ['./govmap.component.scss']
})
export class GovmapComponent implements OnInit {

  @ViewChild('googleMap', { static: false })
  vcRef!: GoogleMap;
  @ViewChild('googleMapOverlay', { static: false })
  googleMapOverlay!: MapGroundOverlay;

  display: any;
  apiLoaded: boolean = false;
  layers = { show: [33] };
  dynamicLayers = [];
  zoom: number = 14.5;
  previousPoint!: google.maps.LatLngLiteral;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true
  }
  @Input() changeLayer!: { action: "add" | "remove", layer: any };
  groundOverlayImageUrl: any = "";
  groundOverlayImageBaseUrl = 'https://ags.govmap.gov.il/proxy/proxy.ashx?http://govmap/arcgis/rest/services/AdditionalData/MapServer/export?';
  imageUrlQueryParams: any = {
    dpi: 96,
    bboxSR: 2039,
    imageSR: 2039,
    transparent: true,
    format: 'png32',
    f: 'image',
    layers: '' as string,
    dynamicLayers: [] as Array<any>,
    bbox: [174982.23054779443,661832.9385742105,184017.76945220557,665967.0614257895],
    size: [1366,625],
  };

  boundsBox: google.maps.LatLngBoundsLiteral = {
    east: 10,
    north: 10,
    south: -10,
    west: -10,
  }
  imageBounds: google.maps.LatLngBoundsLiteral = {
    north: 34,
    east: 32,
    south: -32,
    west: -34,
  };

  constructor(private govmap: GovmapService, private cd: ChangeDetectorRef) {
    // this.groundOverlayImageUrl = "https://ags.govmap.gov.il/proxy/proxy.ashx?http://govmap/arcgis/rest/services/AdditionalData/MapServer/export?dynamicLayers=%5B%7B%22id%22%3A74%2C%22name%22%3A%22%D7%90%D7%A0%D7%98%D7%A0%D7%95%D7%AA%20%D7%A1%D7%9C%D7%95%D7%9C%D7%A8%D7%99%D7%95%D7%AA%20%D7%A4%D7%A2%D7%99%D7%9C%D7%95%D7%AA%22%2C%22source%22%3A%7B%22type%22%3A%22mapLayer%22%2C%22mapLayerId%22%3A74%7D%2C%22minScale%22%3A26000%2C%22maxScale%22%3A0%7D%5D&dpi=96&transparent=true&format=png32&layers=show%3A74&bbox=174982.23054779443%2C661832.9385742105%2C184017.76945220557%2C665967.0614257895&bboxSR=2039&imageSR=2039&size=1366%2C625&f=image";
  }

  ngOnInit(): void {
    this.center = { lat: 32.06777253678647, lng: 34.77784472207902 };
    this.govmap.$layersChange.subscribe(change => this.changeLayers(change));


    // Had an issue matching the coordinates of govmap and google maps the center and bounds in order to show the overlay in the right position
    //  lat and lng are different sorry
    // navigator.geolocation.getCurrentPosition((position) => {
      // this.center = {
      //   lat: position.coords.latitude,
      //   lng: position.coords.longitude,
      // }

    // })
  }

  ngAfterViewInit() {

  }

  moveMap(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent | null) {
    this.previousPoint = this.center;
    this.center = this.vcRef?.googleMap?.getCenter()?.toJSON() ?? this.center;
    // const bounds: any = this.vcRef?.googleMap?.getBounds()?.toJSON();
    // this.imageUrlQueryParams.bbox = Object.values(bounds);
    // const queryString = new URLSearchParams(this.imageUrlQueryParams).toString();
    // this.groundOverlayImageUrl = this.groundOverlayImageBaseUrl + queryString;


    // this.govmap.post()
  }

  move(event: google.maps.MapMouseEvent) {
    // this.imageUrlQueryParams.bbox = [...this.display, event.latLng.toJSON]
    this.display = event.latLng.toJSON();
  }

  onIdle(e: any) {
    // this.groundOverlayImageUrl = "https://ags.govmap.gov.il/proxy/proxy.ashx?http://govmap/arcgis/rest/services/AdditionalData/MapServer?f=json&dpi=96&transparent=true&format=png32"
    // this.boundsBox = this.vcRef.googleMap?.getBounds()?.toJSON();
    this.imageBounds = {
      north:  this.vcRef.googleMap?.getBounds()?.getNorthEast().toJSON().lat as number,
      east:  this.vcRef.googleMap?.getBounds()?.getNorthEast().toJSON().lng as number,
      south:  this.vcRef.googleMap?.getBounds()?.getSouthWest().toJSON().lat as number,
      west:  this.vcRef.googleMap?.getBounds()?.getSouthWest().toJSON().lng as number,
    }
    // this.imageUrlQueryParams.bbox = Object.values(this.imageBounds);
    // this.imageUrlQueryParams.size[0] = this.vcRef['_mapEl'].clientWidth;
    // this.imageUrlQueryParams.size[1] = this.vcRef['_mapEl'].clientHeight;
  }

  changeLayers(change: any) {
    if (change.action === "add") {
      const layer: DynamicLayer = {
        id: change?.layer?.layerID,
        minScale: change?.layer?.minScale,
        maxScale: change?.layer?.maxScale,
        name: change?.layer?.caption,
        source: { type: "mapLayer", mapLayerId: change?.layer?.layerID }
      };
      this.imageUrlQueryParams.dynamicLayers.push(layer);

    } else if (change.action === "remove") {
      this.imageUrlQueryParams.dynamicLayers = this.imageUrlQueryParams.dynamicLayers
        .filter((layer: DynamicLayer) => layer?.id !== change.layer?.layerID);
    }
    const layers = (Object.values(this.imageUrlQueryParams.dynamicLayers) as Array<DynamicLayer>).map((layer: DynamicLayer) => layer.id);
    this.imageUrlQueryParams.layers = 'show:'+layers.toString();
    this.imageUrlQueryParams.dynamicLayers = JSON.stringify(this.imageUrlQueryParams.dynamicLayers);
    const queryString = new URLSearchParams(this.imageUrlQueryParams).toString();
    this.imageUrlQueryParams.dynamicLayers = JSON.parse(this.imageUrlQueryParams.dynamicLayers);
    this.groundOverlayImageUrl = this.groundOverlayImageBaseUrl + queryString;
  }



}


