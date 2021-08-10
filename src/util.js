import { source_id } from "./config";

export const toGeojson = route => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
});

export const initSourceForMap = map => {
  // загрузить слой с маршрутом 
  // (если его не загрузить, то маршрут не построится)
  map.addSource(source_id, {
    'type': 'geojson',
    'data': {
        'type': 'Feature',
        'properties': {},
        'geometry': {
            'coordinates': [
                [0, 0]
            ],
            'type': 'LineString'
        }
    }
  });

  map.addLayer({
      'id': source_id,
      'type': 'line',
      'source': 'LineString',
      'layout': {
          'line-join': 'round',
          'line-cap': 'round'
      },
      'paint': {
          'line-color': '#463BEC',
          'line-width': 5
      }
  });
};
