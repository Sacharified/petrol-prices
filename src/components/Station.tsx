import { Station } from "@/types/FuelPrices";
import { getAveragePrice } from "@/utils/prices";
import PriceListView from "./Prices";

const sortByAveragePrice = (stations: Station[]): Station[] => {
  return stations.sort(({ prices: pricesA }, { prices: pricesB }) => {
    const fuels = Object.keys(pricesA).filter((price) => price in pricesB);

    const avgPriceA = getAveragePrice(pricesA, fuels);
    const avgPriceB = getAveragePrice(pricesB, fuels);
    return avgPriceA - avgPriceB;
  });
};

const StationItem = (props: Station) => {
  return (
    <li key={props.site_id} className="my-2 p-2 container mx-auto">
      <h3>{props.brand}</h3>
      <h4>{props.address}</h4>

      <PriceListView prices={props.prices} />
    </li>
  );
};

export const StationList = ({ stations }: { stations: Station[] }) => {
  return <ul>{sortByAveragePrice(stations.slice(0, 20)).map(StationItem)}</ul>;
};
