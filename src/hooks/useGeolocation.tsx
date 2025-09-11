import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: GeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  });

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: 'La geolocalización no está soportada en este navegador.',
        loading: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 300000, // 5 minutes
      ...options,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      (error) => {
        let errorMessage = 'Error desconocido al obtener la ubicación.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Acceso a la ubicación denegado. Por favor, permite el acceso a tu ubicación.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado al obtener la ubicación.';
            break;
        }
        
        setState(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      defaultOptions
    );
  };

  const clearLocation = () => {
    setState({
      latitude: null,
      longitude: null,
      error: null,
      loading: false,
    });
  };

  // Auto-get location on mount
  useEffect(() => {
    getCurrentPosition();
  }, []);

  return {
    ...state,
    getCurrentPosition,
    clearLocation,
    hasLocation: state.latitude !== null && state.longitude !== null,
  };
};