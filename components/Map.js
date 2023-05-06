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
  lat,
  lng,
  style,
  zoom = 16.5,
  nocircle,
  setLatLong,
}) {
  const [geoData, setGeoData] = useState({ lat: 35.683111, lng: 51.439189 });
  const [myCircle, setMyCircle] = useState(null);
  const [map, setMap] = useState(null);
  let DefaultIcon = L.icon({
    iconUrl: icon.src,
    shadowUrl: iconShadow.src,
  });

  L.Marker.prototype.options.icon = DefaultIcon;
  const center = [geoData.lat, geoData.lng];

  useEffect(() => {
    if (lat && lng) {
      setGeoData({ lat, lng });
    }
  }, [lat, lng]);
  useEffect(() => {
    if (map) {
      map.target.on("click", (e) => {
        console.log(e.latlng);
        setGeoData({ lat: e.latlng.lat, lng: e.latlng.lng });
        // remove previous circle
        if (myCircle) {
          map.target.removeLayer(myCircle);
        }

        const circle = L.circle([e.latlng.lat, e.latlng.lng], {
          fillOpacity: 0.5,
          radius: 100,
        }).addTo(map.target);
        if (setLatLong) {
          setLatLong({ lat: e.latlng.lat, lng: e.latlng.lng });
        }
        setMyCircle(circle);
      });
    }
  }, [map]);
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "200px", ...style }}
      whenReady={(map) => setMap(map)}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!nocircle && (
        <Circle radius={50} center={[geoData.lat, geoData.lng]}></Circle>
      )}

      {/* <Marker position={[geoData.lat, geoData.lng]}></Marker> */}
      <ChangeView coords={center} />
    </MapContainer>
  );
}
