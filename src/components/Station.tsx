"use client";

import { Station } from "@/types/FuelPrices";
import { getAveragePrice } from "@/utils/prices";
import PriceListView from "./Prices";
import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { ColumnHeader, TableCell } from "./Table";

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

export const StationItem = ({ site_id, address, brand, prices }: Station) => {
  return (
    <tr key={site_id + address} className="my-2 p-2 container mx-auto">
      <TableCell>{brand}</TableCell>
      <TableCell>{address}</TableCell>

      <TableCell>{prices["E5"]?.toFixed(2)}</TableCell>
      <TableCell>{prices["E10"]?.toFixed(2)}</TableCell>
      <TableCell>{prices["B7"]?.toFixed(2)}</TableCell>
      <TableCell>{prices["SDV"]?.toFixed(2)}</TableCell>
    </tr>
  );
};

export const StationList = ({ stations }: { stations: Station[] }) => {
  const [sorted, setSorted] = useState<Station[]>(stations);
  const [sortParam, setSortParam] = useState<string | null>();

  useEffect(() => {
    if (sortParam !== null) {
      switch (sortParam) {
        case "E5":
        case "E10":
        case "B5":
        case "SDV":
          const filtered = stations.filter(({ prices }) => sortParam in prices);
          const priceSorted = sortByFuelPrice(filtered, sortParam);
          setSorted([...priceSorted]);
          break;
        case "brand":
        case "address":
        default:
          setSorted([...sortByAveragePrice(stations)]);
      }
    }
  }, [sortParam, setSorted, stations]);

  const handleSortClick = (sortKey: string) => {
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
          <ColumnHeader key="brand">Brand</ColumnHeader>
          <ColumnHeader key="address">Address</ColumnHeader>

          <ColumnHeader key="E5" onClick={() => handleSortClick("E5")}>
            E5
          </ColumnHeader>
          <ColumnHeader key="E10" onClick={() => handleSortClick("E10")}>
            E10
          </ColumnHeader>
          <ColumnHeader key="B7" onClick={() => handleSortClick("B7")}>
            B7
          </ColumnHeader>
          <ColumnHeader key="SDV" onClick={() => handleSortClick("SDV")}>
            SDV
          </ColumnHeader>
        </tr>
      </thead>
      <tbody>{sorted.map(StationItem)}</tbody>
    </table>
  );
};
