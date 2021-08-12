import { token, profile } from "./config";


export default class RouteBuildingArray extends Array {
    _markerArray = [];
    _routePainterOnMap = null;

    #requestedRoute = null;

    onbecamenoempty = () => {};
    onstartrequestroute = () => {};
    onfinnalyrequestroute = () => {};

    isRequestRouteFromOut = true;

    constructor(routePainterOnMap, ...args) {
        super(...args);
        this._routePainterOnMap = routePainterOnMap;

        if(!this._routePainterOnMap) 
        throw new Error('routePainterOnMap is not defined');
    }

    toGeojson = () => ({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: this,
        },
    });

    get route() {
        if(this.isRequestRouteFromOut && this.#requestedRoute) 
        return this.#requestedRoute;

        return this;
    }

    drawRoute = () => {
        if(!this._routePainterOnMap) 
        throw new Error('routePainterOnMap is not defined');

        this._routePainterOnMap(this.route);
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

        if(this.#requestedRoute) this.#requestedRoute.length = 0;
    };

    requestAndDrawRoute = () => {
        if(this.isRequestRouteFromOut) {

          const arrayToUrl = this.map(
            lnglat => lnglat.slice().join(',')
            ).join(';');

          const url = 
          `https://api.mapbox.com/directions/v5/mapbox/${profile}/${arrayToUrl}?geometries=geojson&access_token=${token}`;
          
          console.log(url);
    
          this.onstartrequestroute();
          fetch(url)
              .then(resp => resp.json())
              .then(json => {
                  const data = json.routes[0];
                  const route = data.geometry.coordinates;
    
                  console.log(route);

                  this.#requestedRoute = route;
                  this.drawRoute();
              })
              .catch(err => console.log(err))
              .finally(this.onfinnalyrequestroute)
    
        } else {
          console.log(this);
          this.drawRoute();
        }
    };
};
