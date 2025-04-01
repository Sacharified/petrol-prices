"use client";
import { GetPricesResponse } from "@/types/api";
import Locator from "./Locator";
import { APIProvider } from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";
import { Station } from "@/types/FuelPrices";

export default function Home() {
  const [stations, setStations] = useState<Station[]>([]);
  useEffect(() => {
    fetch("http://localhost:3000/api/prices")
      .then<GetPricesResponse>((res) => res.json())
      .then((res) => setStations(res.data.stations));
  }, [setStations]);
  return <main>{<Locator stations={stations} />}</main>;
}
