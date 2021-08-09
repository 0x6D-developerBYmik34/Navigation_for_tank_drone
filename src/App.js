import React from 'react';
import Info from './Info';
import MyMap from './Map'
import mapboxgl from 'mapbox-gl';
import Menu from './Menu';
import ClearButton from './ClearButton';
import Loader from './Loader';

class App extends React.Component {

  profile = 'walking';
  source_id = 'LineString';
  token = 'pk.eyJ1IjoieXl5YXNoIiwiYSI6ImNrcGNncWt6OTE5ZTkyb3Q3OG5hMG85aDkifQ.hnhxUbd6VyLT0HJUzcvosg';
  tank_url = 'http://192.168.0.83:8080/postData';
  // url = `https://api.mapbox.com/directions/v5/mapbox/'${this.profile}'/`;

  constructor(props) {
    super(props);

    this.state = {
      info: 'Get started!',
      displayState: false,
    };

    Object.assign(this.MarkerArray.prototype, this.arrayMapMixin);

    this.marker_array = new this.MarkerArray();
    this._markerObjArray = [];
    this.useNavState = true;
  }

  toGeojson = route => ({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: route
    }
  });

  setClearButtonVisible = state => 
  this.setState(prevState => ({
    ...prevState,
    displayState: state,
  }));

  onChangeTypeLine = e => this.useNavState = !!(e.currentTarget.value);

  get drawRoute() {
    if(this._drawRoute) return this._drawRoute;
    throw new Error('Get attribute before assigment function');
  }

  set drawRoute(value) {
    console.log(value);
    this._drawRoute = value;
  }

  MarkerArray = class extends Array {};

  arrayMapMixin = {
    setMarker: marker => {
      console.log(this);
      this.marker_array.push(marker.getLngLat().toArray());
      this._markerObjArray.push(marker);

      if(this.marker_array.length) this.setClearButtonVisible(true);

      if(!(this.marker_array.length >= 2)) return true;

      this.updateLines(this.marker_array);
    },
    clearAll: () => {
      this.marker_array.length = 0;
      this.drawRoute(this.marker_array);
      this.clearMapMarkers();
      this.setClearButtonVisible(false);
    },
  };

  clearMapMarkers = () => {
    this._markerObjArray.forEach(marker => marker.remove());
    this._markerObjArray.length = 0;
  };

  updateLines = targetRoute => {
    if(this.useNavState) {
      let url = 'https://api.mapbox.com/directions/v5/mapbox/' + this.profile + '/';

      url += targetRoute.map(
        lnglat => lnglat.slice().join(',')
        ).join(';');

      url += '?geometries=geojson&access_token=' + this.token;
      
      console.log(url);
      fetch(url)
          .then(resp => resp.json())
          .then(json => {
              const data = json.routes[0];
              const route = data.geometry.coordinates;

              console.log(route);
              this.drawRoute(route);
          })
          .catch(err => console.log(err))

    } else {
      console.log(targetRoute);
      this.drawRoute(targetRoute);
    }
  };

  initSourceForMap = map => {
    // загрузить слой с маршрутом 
    // (если его не загрузить, то маршрут не построится)
    map.addSource(this.source_id, {
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
        'id': this.source_id,
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

  initMapHandle = map => {
    console.log('initMapHandle()');

    this.initSourceForMap(map);

    this.drawRoute = route => 
    map.getSource(this.source_id).setData(this.toGeojson(route));

    map.doubleClickZoom.disable(); // убрать приближение при двойном нажатии
    map.touchZoomRotate.disableRotation(); // отключить вращение карты

    map.on('mousemove', e => {
      const {lat, lng} = e.lngLat.wrap()

      this.setState(prevState => ({
        ...prevState,
        info: [lat, lng].join(';') ?? prevState.info,
      }));

    });

    map.on('dblclick', e => {
      const {lat, lng} = e.lngLat.wrap()

      const marker = new mapboxgl.Marker({
        draggable: false
      }).setLngLat([lng, lat]).addTo(map);

      // this.marker_array.push(marker)
      this.marker_array.setMarker(marker);

    });
  };

  onClickClear = e => {
    this.marker_array.clearAll();
    e.preventDefault();
  };

  sendPost = async () => {
    try {
      const response = await fetch(this.tank_url, {
        method: 'POST',
        body: JSON.stringify(this.toGeojson(this.marker_array)),
        headers: {
            'Content-Type': 'application/json',
         } });
    
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return <>
      <MyMap initMapHandle={this.initMapHandle}/>
      <Info>{this.state.info}</Info>
      <Menu updateLinesHandle={() => this.updateLines(this.marker_array)} 
      startResciveHandle={this.sendPost}
      onChangeTypeLine={this.onChangeTypeLine}/>
      {
      (this.state.displayState) ? 
      <ClearButton onClickClear={this.onClickClear}/> 
      : <></>
      }
      <Loader/>
      
    </>;
  }
}

export default App;
