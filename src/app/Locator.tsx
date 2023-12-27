"use client";

import { useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { StationList, StationItem } from "@/components/Station";
import useGeoLocation from "@/hooks/useGeoLocation";
import { LatLng, Station } from "@/types/FuelPrices";
import Map from "@/components/Map";

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

const sortStationsByDistance = (
  coords: LatLng,
  stations: Station[]
): Station[] => {
  return stations.sort((a, b) => {
    const distanceA = distance(a.location, coords);
    const distanceB = distance(b.location, coords);

    return distanceA - distanceB;
  });
};

const Locator = ({ stations }: { stations: Station[] }) => {
  const coordinates = useGeoLocation();
  const [sortedStations, setSortedStations] = useState<Station[]>([]);

  useEffect(() => {
    if (coordinates) {
      const sorted = sortStationsByDistance(coordinates, stations);

      setSortedStations([...sorted]);
    }
  }, [coordinates, stations, setSortedStations]);
  return (
    <>
      <APIProvider apiKey={"AIzaSyCGeKMepz9n_KRbySuruogvLhrx78L9T38"}>
        <Map center={coordinates} stations={sortedStations} />
      </APIProvider>
      <h3>lat: {coordinates.lat}</h3>
      <h3>long: {coordinates.lng}</h3>
      <h2 className="text-4xl">Stations:</h2>
      <StationList stations={sortedStations.slice(0, 20)} />
    </>
  );
};

export default Locator;
