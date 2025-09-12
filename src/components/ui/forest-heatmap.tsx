import React, { useEffect, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export type ForestPoint = {
  lat: number;
  lng: number;
  deforestation: number; // 0-100
  reforestation: number; // 0-100
  type: 'deforestation' | 'reforestation';
};

export interface ForestHeatmapProps {
  center?: [number, number];
  zoom?: number;
  points?: ForestPoint[];
}

// Convert our domain points into heatmap tuples with intensity
function toHeatTuples(points: ForestPoint[]): [number, number, number][] {
  return points.map((p) => {
    const intensity = p.type === 'deforestation' ? p.deforestation : p.reforestation;
    // normalize 0..100 to 0..1, add small floor so circles are visible
    const weight = Math.max(0.05, Math.min(1, intensity / 100));
    return [p.lat, p.lng, weight];
  });
}

const HeatLayer: React.FC<{ data: ForestPoint[] }> = ({ data }) => {
  const map = useMap();
  const tuples = useMemo(() => toHeatTuples(data), [data]);

  useEffect(() => {
    // color gradient: red for deforestation, green for reforestation
    const gradient = {
      0.0: '#1a1a1a',
      0.2: '#2e7d32',
      0.4: '#43a047',
      0.6: '#f57f17',
      0.8: '#ef6c00',
      1.0: '#d32f2f',
    } as Record<number, string>;

    const layer = (L as any).heatLayer(tuples, {
      radius: 25,
      blur: 15,
      maxZoom: 8,
      gradient,
    });

    layer.addTo(map);
    return () => {
      map.removeLayer(layer);
    };
  }, [map, tuples]);

  return null;
};

// Simple buoy marker layer using a blue circle marker at a random ocean coordinate
const BuoyLayer: React.FC = () => {
  const map = useMap();

  // Some known ocean coordinates
  const candidates: [number, number][] = [
    [0, -30], // Atlantic
    [15, -45], // Atlantic
    [-20, -110], // South Pacific
    [10, -140], // North Pacific
    [-30, 80], // Indian Ocean
    [-20, 50], // Indian Ocean
    [40, -20], // North Atlantic
  ];
  const pick = useMemo(() => candidates[Math.floor(Math.random() * candidates.length)], []);

  useEffect(() => {
    const circle = L.circleMarker(pick, {
      radius: 8,
      color: '#1e90ff',
      fillColor: '#1e90ff',
      fillOpacity: 0.9,
      weight: 2,
    }).addTo(map);

    circle.bindTooltip('Buoy');

    return () => {
      map.removeLayer(circle);
    };
  }, [map, pick]);

  return null;
};

const defaultPoints: ForestPoint[] = [
  { lat: -3.4653, lng: -62.2159, deforestation: 85, reforestation: 15, type: 'deforestation' },
  { lat: -8.7832, lng: -63.0235, deforestation: 92, reforestation: 8, type: 'deforestation' },
  { lat: -5.2345, lng: -60.1234, deforestation: 78, reforestation: 22, type: 'deforestation' },
  { lat: 0.2284, lng: 15.8277, deforestation: 45, reforestation: 55, type: 'reforestation' },
  { lat: -4.0383, lng: 21.7587, deforestation: 35, reforestation: 65, type: 'reforestation' },
  { lat: 1.3521, lng: 103.8198, deforestation: 88, reforestation: 12, type: 'deforestation' },
  { lat: -0.7893, lng: 113.9213, deforestation: 91, reforestation: 9, type: 'deforestation' },
  { lat: 49.2827, lng: -123.1207, deforestation: 25, reforestation: 75, type: 'reforestation' },
  { lat: 45.5152, lng: -122.6784, deforestation: 30, reforestation: 70, type: 'reforestation' },
  { lat: 60.1699, lng: 24.9384, deforestation: 20, reforestation: 80, type: 'reforestation' },
  { lat: 59.3293, lng: 18.0686, deforestation: 15, reforestation: 85, type: 'reforestation' },
  { lat: -23.5505, lng: -46.6333, deforestation: 67, reforestation: 33, type: 'deforestation' },
  { lat: 19.4326, lng: -99.1332, deforestation: 55, reforestation: 45, type: 'deforestation' },
  { lat: 28.6139, lng: 77.209, deforestation: 72, reforestation: 28, type: 'deforestation' },
  { lat: 35.6762, lng: 139.6503, deforestation: 18, reforestation: 82, type: 'reforestation' },
];

const ForestHeatmap: React.FC<ForestHeatmapProps> = ({
  center = [0, 0],
  zoom = 2,
  points = defaultPoints,
}) => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ width: '100%', height: '100%' }}
        preferCanvas
        worldCopyJump
      >
        {/* OpenStreetMap tiles (open-source). If you meant OpenWeatherMap, we can add their tile layer with an API key. */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatLayer data={points} />
        <BuoyLayer />
      </MapContainer>
    </div>
  );
};

export default ForestHeatmap;
