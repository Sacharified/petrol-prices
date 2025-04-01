"use client";

import { LatLng, Station } from "@/types/FuelPrices";
import { getAveragePrice } from "@/utils/prices";
import { useEffect, useState } from "react";
import { ColumnHeader, TableCell } from "./Table";
import { sortStationsByDistance } from "@/utils/geolocation";

const sortStationsByOptimalPriceAndDistance = (
  coordinates: LatLng,
  stations: Station[]
): Station[] => {
  const priceSorted = sortByAveragePrice(stations);
  const distanceSorted = sortStationsByDistance(coordinates, stations);
  return stations.sort(
    (
      { distanceMetres: distanceMetresA, prices: pricesA, site_id: siteIdA },
      { distanceMetres: distanceMetresB, prices: pricesB, site_id: siteIdB }
    ) => {
      const fuels = Object.keys(pricesA).filter((price) => price in pricesB);

      const avgPriceA = getAveragePrice(pricesA, fuels);
      const avgPriceB = getAveragePrice(pricesB, fuels);
      const distanceA = distanceMetresA ?? 0;
      const distanceB = distanceMetresB ?? 0;
      // heuristic to sort by distance and price
      const heuristicA =
        priceSorted.findIndex(({ site_id }) => site_id === siteIdA) / 0.8 -
        distanceSorted.findIndex(({ site_id }) => site_id === siteIdA) * 1.2;
      const heuristicB =
        priceSorted.findIndex(({ site_id }) => site_id === siteIdB) / 0.8 -
        distanceSorted.findIndex(({ site_id }) => site_id === siteIdB) * 1.2;
      console.table([
        { avgPrice: avgPriceA, distance: distanceA, heuristic: heuristicA },
        { avgPrice: avgPriceB, distance: distanceB, heuristic: heuristicB },
      ]);
      if (heuristicA < heuristicB) {
        return -1;
      }
      if (heuristicA > heuristicB) {
        return 1;
      }
      return avgPriceA - avgPriceB;
    }
  );
};

const sortStationsByBrandName = (stations: Station[]): Station[] =>
  stations.sort((a, b) => {
    if (a.brand < b.brand) {
      return -1;
    }
    if (a.brand > b.brand) {
      return 1;
    }
    return 0;
  });

const sortByAveragePrice = (stations: Station[]): Station[] => {
  return stations.sort(({ prices: pricesA }, { prices: pricesB }) => {
    const fuels = Object.keys(pricesA).filter((price) => price in pricesB);

    const avgPriceA = getAveragePrice(pricesA, fuels);
    const avgPriceB = getAveragePrice(pricesB, fuels);
    return avgPriceA - avgPriceB;
  });
};

export const sortByFuelPrice = (
  stations: Station[],
  fuel: string
): Station[] => {
  return stations.sort(({ prices: pricesA }, { prices: pricesB }) => {
    if (fuel in pricesA && fuel in pricesB) {
      return pricesA[fuel] - pricesB[fuel];
    }

    return fuel in pricesA ? -1 : 1;
  });
};

export const StationItem = ({
  site_id,
  address,
  brand,
  prices,
  distanceMetres,
  sortKey,
}: Station & { sortKey?: SortKey }) => {
  return (
    <tr key={site_id + address} className="my-2 p-2 container mx-auto">
      <TableCell active={sortKey === "brand"}>{brand}</TableCell>
      <TableCell active={sortKey === "address"}>{address}</TableCell>
      <TableCell active={sortKey === "distance"}>
        {distanceMetres?.toFixed(2) ?? 0}km
      </TableCell>

      <TableCell active={sortKey === "E5"}>
        {prices["E5"]?.toFixed(2)}
      </TableCell>
      <TableCell active={sortKey === "E10"}>
        {prices["E10"]?.toFixed(2)}
      </TableCell>
      <TableCell active={sortKey === "B7"}>
        {prices["B7"]?.toFixed(2)}
      </TableCell>
      <TableCell active={sortKey === "SDV"}>
        {prices["SDV"]?.toFixed(2)}
      </TableCell>
    </tr>
  );
};

type FuelTypes = "E5" | "E10" | "B7" | "SDV";

type SortKey = FuelTypes | "distance" | "brand" | "address";

export const StationList = ({
  stations,
  coordinates,
}: {
  stations: Station[];
  coordinates: LatLng;
}) => {
  const [sorted, setSorted] = useState<Station[]>(stations);
  const [sortParam, setSortParam] = useState<SortKey>();
  console.log(coordinates);
  useEffect(() => {
    if (sortParam !== null) {
      switch (sortParam) {
        case "E5":
        case "E10":
        case "B7":
        case "SDV":
          const filtered = stations.filter(({ prices }) => sortParam in prices);
          const priceSorted = sortByFuelPrice(filtered, sortParam);
          setSorted([...priceSorted]);
          break;
        case "distance":
          setSorted(sortStationsByDistance(coordinates, stations));
          break;
        case "brand":
          setSorted(sortStationsByBrandName(stations));
          break;
        case "address":
        default:
          // setSorted([...sortByAveragePrice(stations)]);
          setSorted([
            ...sortStationsByOptimalPriceAndDistance(coordinates, stations),
          ]);
      }
    }
  }, [sortParam, setSorted, stations, coordinates]);

  const handleSortClick = (sortKey: SortKey) => {
    if (sortParam === sortKey) {
      setSorted([...sorted.reverse()]);
    } else {
      setSortParam(sortKey);
    }
  };
  return (
    <table width={"100%"}>
      <thead>
        <tr>
          <ColumnHeader
            key="brand"
            onClick={() => handleSortClick("brand")}
            active={sortParam === "brand"}
          >
            Brand
          </ColumnHeader>
          <ColumnHeader key="address">Address</ColumnHeader>

          <ColumnHeader
            key="distance"
            onClick={() => handleSortClick("distance")}
            active={sortParam === "distance"}
          >
            Distance (km)
          </ColumnHeader>
          <ColumnHeader
            key="E5"
            onClick={() => handleSortClick("E5")}
            active={sortParam === "E5"}
          >
            E5
          </ColumnHeader>
          <ColumnHeader
            key="E10"
            onClick={() => handleSortClick("E10")}
            active={sortParam === "E10"}
          >
            E10
          </ColumnHeader>
          <ColumnHeader
            key="B7"
            onClick={() => handleSortClick("B7")}
            active={sortParam === "B7"}
          >
            B7
          </ColumnHeader>
          <ColumnHeader
            key="SDV"
            onClick={() => handleSortClick("SDV")}
            active={sortParam === "SDV"}
          >
            SDV
          </ColumnHeader>
        </tr>
      </thead>
      <tbody>
        {sorted.map((station) => (
          <StationItem {...station} sortKey={sortParam} key={station.address} />
        ))}
      </tbody>
    </table>
  );
};
