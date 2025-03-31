export type LatLng = {
  lat: number;
  lng: number;
};

export type PriceList = Record<string, number>;

export type LatitudeLongitude = {
  latitude: string;
  longitude: string;
};

export type ProviderStation = {
  location: LatitudeLongitude;
  prices: PriceList;
  site_id: string;
  brand: string;
  address: string;
  postcode: string;
};

export type Station = {
  site_id: ProviderStation["site_id"];
  brand: ProviderStation["brand"];
  address: ProviderStation["address"];
  postcode: ProviderStation["postcode"];
  prices: PriceList;
  location: LatLng;
  distanceMetres?: number;
};

export type JSONData = {
  last_updated: string;
  stations: ProviderStation[];
};

export type ProvidersList = Record<string, string>;
export type ProvidersJSON = {
  providers: ProvidersList;
};
