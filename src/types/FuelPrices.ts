export type LatLng = {
  lat: number;
  lng: number;
};

export type PriceList = Record<string, number>;

export type Station = {
  site_id: string;
  brand: string;
  address: string;
  postcode: string;
  location: LatLng;
  prices: PriceList;
  distanceMetres: number;
};

export type JSONData = {
  last_updated: string;
  stations: Station[];
};

export type ProvidersList = Record<string, string>;
export type ProvidersJSON = {
  providers: ProvidersList;
};
