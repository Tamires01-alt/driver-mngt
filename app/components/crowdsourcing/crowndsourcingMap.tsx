"use client";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  Polygon,
  useMap,
} from "react-leaflet";
import { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import { useEffect } from "react";
import { useCrowdSourcing } from "@/hooks/useCrowdSourcing";


interface Cluster {
  zone_id: number; 
  zone_detail: {
    coordinates: [number, number][][];
  };
}

interface ClustersProps {
  clusters: Cluster[];
  bonds: [number, number][];
  disableSelection: boolean;
}

interface MyMapProps {
  serverSession: boolean | null;
  closed?: boolean;
  bonds: [number, number][];
  clusters: Cluster[];
  center: [number, number];
  zoom: number;
  disableSelection: boolean;
  defaultClusters?: Cluster[];
  style?: React.CSSProperties;
}

const defaultStyle = {
    fillColor: "red",
    fillOpacity: 0.5,
    weight: 2,
    opacity: 1,
    dashArray: [3, 3],
    color: "white",
};

const selectedStyle = {
  dashArray: [], 
  fillColor: "green",
  fillOpacity: 0.7,
  weight: 3,
  opacity: 1,
  color: "white",
};

const hubIcon = new Icon({
  iconUrl: "/SHOPIN.png",
  iconSize: [48, 48],
  iconAnchor: [16, 48],
  popupAnchor: [0, -32],
});

const Clusters: React.FC<ClustersProps> = ({ clusters, bonds, disableSelection }) => {
  const map = useMap();
  const { selected, setSelected } = useCrowdSourcing();

  useEffect(() => {
    setSelected([]);


    if (bonds.length > 0) {
      map.fitBounds(bonds);
    }
  }, [bonds, map, setSelected]);



  return (
    <>
      {clusters.map((cluster) => {
        const positions = cluster.zone_detail.coordinates.map((tuple) =>
            tuple.map((x) => [x[1], x[0]] as [number, number])
        );

        return (
          <Polygon
            eventHandlers={{
              mouseover: (e) => {
                if (disableSelection) return;
                const layer = e.target;
                layer.setStyle(selectedStyle);
              },
              mouseout: (e) => {
                if (disableSelection) return;
                if (!selected.includes(cluster.zone_id)) {
                  const layer = e.target;
                  layer.setStyle(defaultStyle);
                }
              },
              click: (e) => {
                if (disableSelection) return;
                const layer = e.target;
                layer.setStyle(
                  selected.includes(cluster.zone_id) ? defaultStyle : selectedStyle
                );
                setSelected(cluster.zone_id);
              },
            }}
            key={cluster.zone_id}
            positions={positions}
            pathOptions={
              disableSelection
                ? defaultStyle
                : selected.includes(cluster.zone_id)
                ? selectedStyle
                : defaultStyle
            }
          />
        );
      })}
    </>
  );
};

export default function MyMap({
  serverSession,
  closed,
  bonds,
  clusters,
  center,
  zoom,
  disableSelection,
  defaultClusters,
  style = { width: "100vw" },
}: MyMapProps) {
  return (
    <MapContainer
      style={{ height: "70vh", borderRadius: "0 0 0.8rem 0.8rem" }}
      center={center}
      zoom={zoom}
      zoomControl={false}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={center} icon={hubIcon}>
        <Popup>Este é seu ponto de coleta.</Popup>
      </Marker>

      <Clusters clusters={clusters} bonds={bonds} disableSelection={disableSelection} />
    </MapContainer>
  );
}
