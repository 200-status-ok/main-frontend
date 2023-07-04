import { useState, useEffect } from "react";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Circle,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function ChangeView({ coords, zoom }) {
  const map = useMap();
  map.setView(coords, zoom);
  return null;
}

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

export default function Map({
  style,
  zoom = 16.5,
  setLatLong,
  latLong,
  radius = 50,
  noDrawCircle,
  firstCircle,
  className = "",
}) {
  const [map, setMap] = useState(null);
  const [firstCircleState, setFirstCircleState] = useState(firstCircle);

  let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
  });

  L.Marker.prototype.options.icon = DefaultIcon;
  const center = [latLong.lat, latLong.lng];

  useEffect(() => {
    if (map) {
      map.target.on("click", (e) => {
        setFirstCircleState(true);
        console.log(e.latlng);
        // remove previous circle
        if (noDrawCircle) {
          return;
        } else {
          setLatLong({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
      });
    }
  }, [map]);

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "200px", ...style }}
      whenReady={(map) => setMap(map)}
      className={className}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {firstCircleState && (
        <Circle radius={radius} center={[latLong?.lat, latLong?.lng]}></Circle>
      )}

      {/* <Marker position={[geoData.lat, geoData.lng]}></Marker> */}
      <ChangeView coords={center} />
    </MapContainer>
  );
}
