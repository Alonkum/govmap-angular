import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GovmapApiResponse } from '../api.model';

@Injectable({
  providedIn: 'root'
})
export class GovmapService {

  apiToken: string;
  baseUrl: string;

  constructor(private httpClient: HttpClient) {
    this.apiToken = '5a4b8472-b95b-4687-8179-0ccb621c7990';
    this.baseUrl = 'https://ags.govmap.gov.il/';
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


  private post(endpoint: string, body: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ api_token: this.apiToken });
    return this.httpClient.post(this.baseUrl + endpoint, body, {headers, responseType: 'json'});
  }
}
