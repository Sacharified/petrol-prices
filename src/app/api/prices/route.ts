import type {
  JSONData,
  PriceList,
  ProvidersJSON,
  ProvidersList,
  ProviderStation,
  Station,
} from "@/types/FuelPrices";
import ProviderDataJSON from "@/data/providers.json";

const ProviderData = ProviderDataJSON as ProvidersJSON;

const normalisePrices = (prices: PriceList): PriceList => {
  return Object.keys(prices).reduce((memo, key) => {
    let value = prices[key];
    if (value < 100) {
      value = value * 100;
    }
    return {
      ...memo,
      [key]: value,
    };
  }, {});
};

const getPriceData = async (providers: ProvidersList) => {
  console.log(providers);
  const reqs = [];
  for (const key in providers) {
    const providerUrl = providers[key];
    reqs.push(fetch(providerUrl).then<JSONData>((res) => res.json()));
  }

  const data = await Promise.all(reqs);

  return data.flatMap<Station>((item) => {
    return item.stations.map((station) => {
      const partialStation = {
        ...station,
        location: {
          lat: parseFloat(station.location.latitude),
          lng: parseFloat(station.location.longitude),
        },
        prices: normalisePrices(station.prices),
      };
      return partialStation;
    });
  });
};

export async function GET() {
  const res = await getPriceData(ProviderData.providers as ProvidersList);

  return Response.json({ data: { stations: res } });
}
