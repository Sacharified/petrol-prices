import { LatLng, Station } from "@/types/FuelPrices";

const distance = (a: LatLng, b: LatLng) => {
  const radlat1 = (Math.PI * a.lat) / 180;
  const radlat2 = (Math.PI * b.lat) / 180;

  const theta = a.lng - b.lng;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
};

export const sortStationsByDistance = (
  coords: LatLng,
  stations: Station[]
): Station[] => {
  return stations
    .map((station) => ({
      ...station,
      distanceMetres: distance(station.location, coords),
    }))
    .sort(({ distanceMetres: dA }, { distanceMetres: dB }) => {
      return dA - dB;
    })
    .filter(({ brand }) => !!brand);
};
