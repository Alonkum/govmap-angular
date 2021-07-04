import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { DynamicLayer, GovmapApiResponse } from '../api.model';

@Injectable({
  providedIn: 'root'
})
export class GovmapService {

  apiToken: string;
  baseUrl: string;
  restBaseUrl: string;
  $layersChange: Subject<{ action: "add" | "remove", layer: any }> = new Subject();
  dynamicLayers: Array<DynamicLayer> = [];
  layersIDs: Array<number> = [];
  constructor(private httpClient: HttpClient) {
    this.apiToken = '5a4b8472-b95b-4687-8179-0ccb621c7990';
    this.baseUrl = 'https://ags.govmap.gov.il/';
    this.restBaseUrl = 'https://ags.govmap.gov.il/proxy/proxy.ashx?http://govmap/arcgis/rest/services/AdditionalData/MapServer/export?';
  }

  getLayers(): Observable<any>  {
    return this.post('Layers/GetTocLayers', {})
      .pipe(map(res => {
        const layers = Object.values(res.data[Object.keys(res.data)[0]].layers);
        layers.map((layer: any) => layer.caption.toString());

        return layers;
      }));

  }




  identifyByXY(layers: any, x: number, y: number, mapTolerance: any): Observable<any>  {

    const body = JSON.stringify({ layers, x, y, mapTolerance });
    return this.post('Identify/IdentifyByXY', body)
      .pipe(map(res => {
        const layers = Object.values(res.data[Object.keys(res.data)[0]].layers);
        layers.map((layer: any) => layer.caption.toString());

        return layers;
      }));

  }


    private post(endpoint: string, body: any, baseUrl?: string): Observable<any> {
      const headers: HttpHeaders = new HttpHeaders({ api_token: this.apiToken });
      return this.httpClient.post( (baseUrl ?? this.baseUrl) + endpoint, body, {headers, responseType: 'json'});
    }

    changeLayers(queryString: string):  Observable<any> {
      return this.post(queryString, {}, this.restBaseUrl);
      // if (e.checked) {
      //   const layer: DynamicLayer = {
      //     id: item?.layerID,
      //     minScale: item?.minScale,
      //     maxScale: item?.maxScale,
      //     name: item?.caption,
      //     source: { type: "mapLayer", mapLayerId: item?.layerID }
      //   };
      //   this.govmap.dynamicLayers.push(layer);
      //   this.govmap.layersIDs.push(layer.id);
      // } else {
      //   this.govmap.dynamicLayers.filter(layer => layer?.id === item?.layerID);
      // }
    }
}
