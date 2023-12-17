import { PriceList, Station } from "@/types/FuelPrices";
import { getAveragePrice } from "@/utils/prices";

export default function PriceListView({ prices = {} }: { prices: PriceList }) {
  const fuels = Object.keys(prices);
  const avgPrice = getAveragePrice(prices, fuels).toFixed(2);
  return (
    <ul>
      <li key="average">Avg : {avgPrice}</li>
      {fuels.map((key) => {
        const price = prices[key];
        return (
          <li key={key}>
            {key} : {price.toFixed(2)}
          </li>
        );
      })}
    </ul>
  );
}
