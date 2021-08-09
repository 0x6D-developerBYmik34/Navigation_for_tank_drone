import React from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoieXl5YXNoIiwiYSI6ImNrcGNncWt6OTE5ZTkyb3Q3OG5hMG85aDkifQ.hnhxUbd6VyLT0HJUzcvosg';

class MyMap extends React.Component {
  constructor(props) {
    super(props);
    this.mapContainerRef = React.createRef()
  }

  componentDidMount() {
    const map = new mapboxgl.Map({ // Создание и настройки карты
        container: this.mapContainerRef.current,
        style: 'mapbox://styles/mapbox/outdoors-v11', // style URL
        center: [44.479256, 48.711180], // starting position [lng, lat]
        zoom: 10 // starting zoom
    });
    
    map.on('load', () => this.props.initMapHandle(map));     
  }

  render() {
    return <div ref={this.mapContainerRef} className="map-container"/>
  }
}

export default MyMap;
