import React from 'react';
import mapboxgl from 'mapbox-gl';
import { useRef } from 'react';
import { useEffect } from 'react';
import { token } from './config';

mapboxgl.accessToken = token;

const MyHookMap = ({ initMapHandle }) => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if(mapRef.current) return;

    console.log('MyHookMap useEffect()');

    mapRef.current = new mapboxgl.Map({ // Создание и настройки карты
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
        center: [44.479256, 48.711180], // starting position [lng, lat]
        zoom: 10 // starting zoom
    });

    console.log(mapRef.current);

    mapRef.current.on('load', () => initMapHandle(mapRef.current));
  }, [initMapHandle]);

  return <div ref={mapContainerRef} className="map-container"/>
};

export default MyHookMap;
