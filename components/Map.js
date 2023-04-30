import { useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, useMap, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export function ChangeView({ coords }) {
  const map = useMap();
  map.setView(coords, 16.5);
  return null;
}

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

export default function Map({ lat, lng }) {
  const [geoData, setGeoData] = useState({ lat: 35.683111, lng: 51.439189 });

  let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
  });

  L.Marker.prototype.options.icon = DefaultIcon;
  const center = [geoData.lat, geoData.lng];

  useEffect(() => {
    if (lat && lng) {
      setGeoData({ lat, lng });
      console.log();
    }
  }, []);
  return (
    <MapContainer center={center} zoom={16.5} style={{ height: "200px" }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle radius={50} center={[geoData.lat, geoData.lng]}></Circle>
      {/* <Marker position={[geoData.lat, geoData.lng]}></Marker> */}
      <ChangeView coords={center} />
    </MapContainer>
  );
}
