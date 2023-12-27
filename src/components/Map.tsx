import React, { useState } from "react";
import {
  Map as GoogleMap,
  InfoWindow,
  Marker,
  MarkerProps,
  useMarkerRef,
} from "@vis.gl/react-google-maps";
import { LatLng, PriceList, Station } from "@/types/FuelPrices";
import PriceListView from "./Prices";
import { getAveragePrice } from "@/utils/prices";
// https://visgl.github.io/react-google-maps/docs/api-reference/components/

interface TMap {
  center?: LatLng;
  // markers?: MarkerProps[];
  stations: Station[];
}

interface TCustomMarkerProps extends MarkerProps {
  prices: PriceList;
}

function CustomMarker(props: TCustomMarkerProps) {
  const [markerRef, marker] = useMarkerRef();
  const [showInfoWindow, setShowInfoWindow] = useState<Boolean>(false);
  const onClick = (e: google.maps.MapMouseEvent) => {
    setShowInfoWindow((state) => !state);
    props.onClick && props.onClick(e);
  };
  return (
    <>
      <Marker ref={markerRef} {...props} onClick={onClick} />
      {showInfoWindow && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setShowInfoWindow(false)}
        >
          <div style={{ color: "black" }}>
            <PriceListView prices={props.prices} />
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export default function Map({ center, stations = [] }: TMap) {
  const markers = stations.map((station, i) => ({
    position: station.location,
    label: getAveragePrice(station.prices).toFixed(0),
    prices: station.prices,
  }));
  return (
    <div
      className="container p-2 bg-slate-700"
      style={{
        minWidth: "100%",
        height: "500px",
      }}
    >
      <GoogleMap
        zoom={13}
        center={{ lat: center?.lat ?? 0, lng: center?.lng ?? 0 }}
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {markers.length > 0 &&
          markers.map((props) => (
            <Marker
              key={props.position.lat}
              position={props.position}
              // label={props.label}
            />
          ))}
      </GoogleMap>
    </div>
  );
}
