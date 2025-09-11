import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MapComponentProps {
  customerLocation?: { lat: number; lng: number };
  deliveryLocation?: { lat: number; lng: number };
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
  height?: string;
  showLocationInput?: boolean;
  mapboxToken?: string;
}

const MapComponent = ({ 
  customerLocation, 
  deliveryLocation, 
  onLocationUpdate, 
  height = '400px',
  showLocationInput = false,
  mapboxToken 
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(mapboxToken || '');
  const [error, setError] = useState('');
  const customerMarker = useRef<mapboxgl.Marker | null>(null);
  const deliveryMarker = useRef<mapboxgl.Marker | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-99.1332, 19.4326], // Mexico City default
        zoom: 12,
        pitch: 0,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Add geolocate control
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });

      map.current.addControl(geolocate, 'top-right');

      // Listen for location updates
      if (onLocationUpdate) {
        geolocate.on('geolocate', (e: any) => {
          onLocationUpdate({
            lat: e.coords.latitude,
            lng: e.coords.longitude
          });
        });

        // Allow clicking to set location
        map.current.on('click', (e) => {
          onLocationUpdate({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng
          });
        });
      }

      setError('');
    } catch (err) {
      setError('Error al inicializar el mapa. Verifica tu token de Mapbox.');
      console.error('Mapbox error:', err);
    }
  };

  useEffect(() => {
    if (token) {
      initializeMap();
    }

    return () => {
      map.current?.remove();
    };
  }, [token]);

  // Update customer marker
  useEffect(() => {
    if (map.current && customerLocation) {
      // Remove existing marker
      if (customerMarker.current) {
        customerMarker.current.remove();
      }

      // Add new marker
      customerMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([customerLocation.lng, customerLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<div>📍 Cliente</div>'))
        .addTo(map.current);

      // Center map on customer location
      map.current.flyTo({
        center: [customerLocation.lng, customerLocation.lat],
        zoom: 14
      });
    }
  }, [customerLocation]);

  // Update delivery person marker
  useEffect(() => {
    if (map.current && deliveryLocation) {
      // Remove existing marker
      if (deliveryMarker.current) {
        deliveryMarker.current.remove();
      }

      // Add new marker
      deliveryMarker.current = new mapboxgl.Marker({ color: '#22c55e' })
        .setLngLat([deliveryLocation.lng, deliveryLocation.lat])
        .setPopup(new mapboxgl.Popup().setHTML('<div>🛵 Repartidor</div>'))
        .addTo(map.current);

      // If we have both locations, fit bounds to show both
      if (customerLocation) {
        const bounds = new mapboxgl.LngLatBounds()
          .extend([customerLocation.lng, customerLocation.lat])
          .extend([deliveryLocation.lng, deliveryLocation.lat]);

        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  }, [deliveryLocation, customerLocation]);

  if (showLocationInput && !token) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertDescription>
            Para usar el mapa, necesitas un token de Mapbox. Puedes obtenerlo gratis en{' '}
            <a 
              href="https://mapbox.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary underline"
            >
              mapbox.com
            </a>
          </AlertDescription>
        </Alert>
        <div>
          <Label htmlFor="mapbox-token">Token de Mapbox</Label>
          <Input
            id="mapbox-token"
            type="text"
            placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {showLocationInput && (
        <div>
          <Label htmlFor="mapbox-token">Token de Mapbox</Label>
          <Input
            id="mapbox-token"
            type="text"
            placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbG..."
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div 
        ref={mapContainer} 
        style={{ height }} 
        className="w-full rounded-lg border border-border"
      />
      
      {onLocationUpdate && (
        <p className="text-sm text-muted-foreground">
          Haz clic en el mapa o usa el botón de ubicación para establecer tu posición
        </p>
      )}
    </div>
  );
};

export default MapComponent;