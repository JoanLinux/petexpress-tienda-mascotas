import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

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
}: MapComponentProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const customerMarker = useRef<L.Marker | null>(null);
  const deliveryMarker = useRef<L.Marker | null>(null);

  const initializeMap = () => {
    if (!mapContainer.current || map.current) return;

    // Create map centered on Mexico City
    map.current = L.map(mapContainer.current).setView([19.4326, -99.1332], 12);

    // Add OpenStreetMap tiles (completely free)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map.current);

    // Add custom geolocation button
    const GeolocationControl = L.Control.extend({
      onAdd: function(map: L.Map) {
        const button = L.DomUtil.create('button', 'leaflet-control-locate');
        button.innerHTML = '📍';
        button.style.backgroundColor = 'white';
        button.style.border = '2px solid rgba(0,0,0,0.2)';
        button.style.borderRadius = '4px';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.cursor = 'pointer';
        button.title = 'Mostrar mi ubicación';
        
        button.onclick = function() {
          map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
        };
        
        return button;
      }
    });

    map.current.addControl(new GeolocationControl({ position: 'topright' }));

    // Listen for location updates when clicking on map
    if (onLocationUpdate) {
      map.current.on('click', (e: L.LeafletMouseEvent) => {
        onLocationUpdate({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      });

      // Listen for geolocation
      map.current.on('locationfound', (e: L.LocationEvent) => {
        onLocationUpdate({
          lat: e.latlng.lat,
          lng: e.latlng.lng
        });
      });
    }
  };

  useEffect(() => {
    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update customer marker
  useEffect(() => {
    if (map.current && customerLocation) {
      // Remove existing marker
      if (customerMarker.current) {
        map.current.removeLayer(customerMarker.current);
      }

      // Create custom red icon for customer
      const customerIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
          background-color: #ef4444;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        ">📍</div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 12]
      });

      // Add new marker
      customerMarker.current = L.marker([customerLocation.lat, customerLocation.lng], { 
        icon: customerIcon 
      })
        .bindPopup('📍 Cliente')
        .addTo(map.current);

      // Center map on customer location
      map.current.setView([customerLocation.lat, customerLocation.lng], 14);
    }
  }, [customerLocation]);

  // Update delivery person marker
  useEffect(() => {
    if (map.current && deliveryLocation) {
      // Remove existing marker
      if (deliveryMarker.current) {
        map.current.removeLayer(deliveryMarker.current);
      }

      // Create custom green icon for delivery person
      const deliveryIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="
          background-color: #22c55e;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        ">🛵</div>`,
        iconSize: [25, 25],
        iconAnchor: [12, 12]
      });

      // Add new marker
      deliveryMarker.current = L.marker([deliveryLocation.lat, deliveryLocation.lng], { 
        icon: deliveryIcon 
      })
        .bindPopup('🛵 Repartidor')
        .addTo(map.current);

      // If we have both locations, fit bounds to show both
      if (customerLocation && map.current) {
        const group = L.featureGroup([
          L.marker([customerLocation.lat, customerLocation.lng]),
          L.marker([deliveryLocation.lat, deliveryLocation.lng])
        ]);
        map.current.fitBounds(group.getBounds().pad(0.1));
      }
    }
  }, [deliveryLocation, customerLocation]);

  return (
    <div className="space-y-4">      
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