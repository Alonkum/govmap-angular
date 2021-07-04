export interface GovmapApiResponse {
  errorCode: number;
  status: number;
  message: string | null;
  data: any;
  active: boolean;
}


export interface GovmapLayers {
  LayerCategories: object;
  LayerOffices: object;
  AdditionalLayers: object;
  MunicipalAuthorities: object;

}

export interface DynamicLayer {
  id: number;
  name: string;
  source: { type: string, mapLayerId: number },
  minScale: number;
  maxScale: number;
}



