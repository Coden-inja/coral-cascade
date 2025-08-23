import React, { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';

interface ForestData {
  lat: number;
  lng: number;
  deforestation: number;
  reforestation: number;
  type: 'deforestation' | 'reforestation';
}

const forestData: ForestData[] = [
  // Amazon Basin
  { lat: -3.4653, lng: -62.2159, deforestation: 85, reforestation: 15, type: 'deforestation' },
  { lat: -8.7832, lng: -63.0235, deforestation: 92, reforestation: 8, type: 'deforestation' },
  { lat: -5.2345, lng: -60.1234, deforestation: 78, reforestation: 22, type: 'deforestation' },
  
  // Congo Basin
  { lat: 0.2284, lng: 15.8277, deforestation: 45, reforestation: 55, type: 'reforestation' },
  { lat: -4.0383, lng: 21.7587, deforestation: 35, reforestation: 65, type: 'reforestation' },
  
  // Southeast Asia
  { lat: 1.3521, lng: 103.8198, deforestation: 88, reforestation: 12, type: 'deforestation' },
  { lat: -0.7893, lng: 113.9213, deforestation: 91, reforestation: 9, type: 'deforestation' },
  
  // North America
  { lat: 49.2827, lng: -123.1207, deforestation: 25, reforestation: 75, type: 'reforestation' },
  { lat: 45.5152, lng: -122.6784, deforestation: 30, reforestation: 70, type: 'reforestation' },
  
  // Europe
  { lat: 60.1699, lng: 24.9384, deforestation: 20, reforestation: 80, type: 'reforestation' },
  { lat: 59.3293, lng: 18.0686, deforestation: 15, reforestation: 85, type: 'reforestation' },
  
  // Additional global points
  { lat: -23.5505, lng: -46.6333, deforestation: 67, reforestation: 33, type: 'deforestation' },
  { lat: 19.4326, lng: -99.1332, deforestation: 55, reforestation: 45, type: 'deforestation' },
  { lat: 28.6139, lng: 77.2090, deforestation: 72, reforestation: 28, type: 'deforestation' },
  { lat: 35.6762, lng: 139.6503, deforestation: 18, reforestation: 82, type: 'reforestation' },
];

interface GoogleMapComponentProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
}

const GoogleMapComponent: React.FC<GoogleMapComponentProps> = ({ center, zoom }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'all',
            elementType: 'geometry.fill',
            stylers: [{ color: '#1a1a1a' }]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#0f4c75' }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#2d2d2d' }]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{ color: '#404040' }]
          },
          {
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#ffffff' }]
          }
        ]
      });
      setMap(newMap);
    }
  }, [ref, map, center, zoom]);

  useEffect(() => {
    if (map) {
      // Add forest data markers
      forestData.forEach((point) => {
        const color = point.type === 'deforestation' ? '#ff4444' : '#44ff44';
        const intensity = point.type === 'deforestation' ? point.deforestation : point.reforestation;
        
        // Create circle marker
        const circle = new google.maps.Circle({
          strokeColor: color,
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: color,
          fillOpacity: 0.35,
          map,
          center: { lat: point.lat, lng: point.lng },
          radius: intensity * 1000, // Scale radius based on intensity
        });

        // Create info window
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="color: black; padding: 8px;">
              <h3>${point.type === 'deforestation' ? 'Deforestation' : 'Reforestation'} Zone</h3>
              <p>Deforestation: ${point.deforestation}%</p>
              <p>Reforestation: ${point.reforestation}%</p>
              <p>Location: ${point.lat.toFixed(4)}, ${point.lng.toFixed(4)}</p>
            </div>
          `
        });

        // Add click listener
        circle.addListener('click', () => {
          infoWindow.setPosition({ lat: point.lat, lng: point.lng });
          infoWindow.open(map);
        });
      });

      // Note: Heatmap layer removed due to deprecation
    }
  }, [map]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};

const ForestGoogleMap: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <p>Google Maps API key not found. Please check your environment configuration.</p>
      </div>
    );
  }

  return (
    <Wrapper apiKey={apiKey}>
      <GoogleMapComponent
        center={{ lat: 0, lng: 0 }}
        zoom={2}
      />
    </Wrapper>
  );
};

export default ForestGoogleMap;
