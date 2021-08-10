import { token, profile } from "./config";


export default class RouteBuildingArray extends Array {
    _markerArray = [];
    _routePainterOnMap = null;

    onbecamenoempty = () => {};
    onstartrequestroute = () => {};
    onfinnalyrequestroute = () => {};

    isRequestRouteFromOut = true;

    constructor(routePainterOnMap, ...args) {
        super(...args);
        this._routePainterOnMap = routePainterOnMap;

        if(this._routePainterOnMap === null) 
        throw new Error('routePainterOnMap is not defined');
    }

    setMarker = marker => {
        this.push(marker.getLngLat().toArray());
        this._markerArray.push(marker);
  
        if(this.length) this.onbecamenoempty();
  
        if(!(this.length >= 2)) return true;
  
        this.requestAndDrawRoute();
    };

    clearAll = () => {
        this.length = 0;
        this._routePainterOnMap(this);

        this._markerArray.forEach(marker => marker.remove());
        this._markerArray.length = 0;
    };

    requestAndDrawRoute = () => {
        if(this.isRequestRouteFromOut) {
          let url = 'https://api.mapbox.com/directions/v5/mapbox/' + profile + '/';
    
          url += this.map(
            lnglat => lnglat.slice().join(',')
            ).join(';');
    
          url += '?geometries=geojson&access_token=' + token;
          
          console.log(url);
    
          this.onstartrequestroute();
          fetch(url)
              .then(resp => resp.json())
              .then(json => {
                  const data = json.routes[0];
                  const route = data.geometry.coordinates;
    
                  console.log(route);
                  this._routePainterOnMap(route);
              })
              .catch(err => console.log(err))
              .finally(this.onfinnalyrequestroute)
    
        } else {
          console.log(this);
          this._routePainterOnMap(this);
        }
    };
};
