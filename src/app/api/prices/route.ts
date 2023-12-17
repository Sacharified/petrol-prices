import type {
  JSONData,
  PriceList,
  ProvidersJSON,
  ProvidersList,
  Station,
} from "../../../types/FuelPrices";
import ProviderData from "../../../providers.json";

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
    reqs.push(fetch(providerUrl).then((res) => res.json()));
  }

  const data = await Promise.all(reqs);

  return data.flatMap((item) => {
    return item.stations.map(
      (station: {
        location: { latitude: string; longitude: string };
        prices: PriceList;
      }) => {
        return {
          ...station,
          location: {
            lat: parseFloat(station.location.latitude),
            lng: parseFloat(station.location.longitude),
          },
          prices: normalisePrices(station.prices),
        };
      }
    );
  });
};

export async function GET() {
  const res = await getPriceData(ProviderData.providers as ProvidersList);

  return Response.json({ data: { stations: res } });
}
