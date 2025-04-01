import { Station } from "./FuelPrices";

export type GetPricesResponse = {
  data: {
    stations: Station[];
  };
};
