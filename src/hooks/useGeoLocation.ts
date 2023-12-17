import { LatLng } from "@/types/FuelPrices";
import { useEffect, useState } from "react";
const geoLocationToLatLng = ({
  longitude = 0,
  latitude = 0,
}: GeolocationCoordinates): LatLng => {
  return { lng: longitude, lat: latitude };
};

function useGeoLocation() {
  const [geoLocation, setGeoLocation] = useState<LatLng>({
    lng: 0,
    lat: 0,
  });

  const getLocation = () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if (window?.navigator) {
        const geo = window.navigator.geolocation;

        geo.getCurrentPosition(
          (res: GeolocationPosition) => {
            //  success
            console.log(res);
            resolve(res);
          },
          (err: GeolocationPositionError) => {
            // fail
            reject(err);
          }
        );
      }
    });
  };

  useEffect(() => {
    getLocation().then((geo) =>
      setGeoLocation(geoLocationToLatLng(geo.coords))
    );
  }, [setGeoLocation]);

  return geoLocation;
}

export default useGeoLocation;
