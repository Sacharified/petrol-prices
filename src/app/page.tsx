import Locator from "./Locator";
import { APIProvider } from "@vis.gl/react-google-maps";

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/prices").then((res) =>
    res.json()
  );
  return <main>{<Locator stations={res.data.stations} />}</main>;
}
