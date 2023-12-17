import { PriceList } from "@/types/FuelPrices";

export function getAveragePrice(prices: PriceList, fuels?: string[]): number {
  if (fuels === undefined) {
    fuels = Array.from(Object.keys(prices));
  }
  return (
    fuels.map((fuel) => prices[fuel]).reduce((memo, val) => memo + val, 0) /
    fuels.length
  );
}
