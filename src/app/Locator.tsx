"use client";

import { useEffect, useState } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { StationList, StationItem } from "@/components/Station";
import useGeoLocation from "@/hooks/useGeoLocation";
import { Station } from "@/types/FuelPrices";
import Map from "@/components/Map";
import { sortStationsByDistance } from "@/utils/geolocation";

const Locator = ({ stations }: { stations: Station[] }) => {
  const coordinates = useGeoLocation();
  const [sortedStations, setSortedStations] = useState<Station[]>([]);

  useEffect(() => {
    if (coordinates) {
      console.log("Coordinates:", coordinates);
      const sorted = sortStationsByDistance(coordinates, stations);

      setSortedStations([...sorted]);
    }
  }, [coordinates, stations, setSortedStations]);
  return (
    <>
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}>
        <Map center={coordinates} stations={sortedStations} />
      </APIProvider>
      <h3>
        lat: {coordinates.lat} long: {coordinates.lng}
      </h3>
      <h2 className="text-4xl">Stations nearby:</h2>
      <StationList
        stations={sortedStations.slice(0, 5)}
        coordinates={coordinates}
      />
    </>
  );
};

export default Locator;
