import { useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MyMap from "./Map";
import Menu from "./Menu";
import Info from "./Info";
import Loader from "./Loader";
import ClearButton from "./ClearButton";
import { initSourceForMap } from "./util";
import { source_id } from "./config";
import RouteBuildingArray from "./RouteBuildingArray";
import { useEffect } from "react";
import { connect } from "mqtt";
import { toGeojson } from "./util";


const HookApp = () => {
    const rbArray = useRef(null);
    const clientPublisher = useRef(null);
    const locationMarker = useRef(null);

    const [info, setInfo] = useState('Get started!');
    const [clearButVisible, setClVisible] = useState(false);
    const [loaderVisible, setLoaderVisible] = useState(false);

    const onChangeTypeLine = e => 
    rbArray.current.isRequestRouteFromOut = !!(e.currentTarget.value);

    const onClickClear = () => rbArray.current.clearAll()

    useEffect(() => { //ws://0.0.0.0:1884

      clientPublisher.current = connect('ws://176.106.133.55:9008', {
        username: 'reactjs',
        password: '1884',
      }); //tcp://192.168.0.106:1883

      clientPublisher.current.on('connect', () => {
        clientPublisher.current.publish('tanknavigation', 'i tut');
        clientPublisher.current.subscribe('tanknavigationclient', console.log);
      });

      clientPublisher.current.on('error', err => {
        console.log(err);
      });

    }, []);
    
    const initMapHandle = map => {
      console.log('initMapHandle()');
  
      initSourceForMap(map);

      map.doubleClickZoom.disable(); // убрать приближение при двойном нажатии
      map.touchZoomRotate.disableRotation(); // отключить вращение карты

      locationMarker.current = new mapboxgl.Marker()

      rbArray.current = new RouteBuildingArray(route => 
        map.getSource(source_id).setData(toGeojson(route))
      );

      rbArray.current.onbecamenoempty = () => setClVisible(true);
      rbArray.current.onstartrequestroute = () => setLoaderVisible(true);
      rbArray.current.onfinnalyrequestroute = () => setLoaderVisible(false);

      clientPublisher.current.on('message', (t, buff, packet) => {
        const str = buff.toString()

        try {
          const {lng, lat} = JSON.parse(str);
          locationMarker.current.setLngLat([lng, lat]).addTo(map)
          console.log("added");
        } catch (err) {
          if (err.name === "SyntaxError") {
            console.log(str);
            return;
          } else {
            throw err; // проброс (*)
          }
        }
      });
  
      map.on('mousemove', e => {
        const {lat, lng} = e.lngLat.wrap()
        setInfo([lat, lng].join(';'));
      });
  
      map.on('dblclick', e => {
        const {lat, lng} = e.lngLat.wrap()
  
        const marker = new mapboxgl.Marker({
          draggable: false
        }).setLngLat([lng, lat]).addTo(map);
  
        rbArray.current.setMarker(marker);
  
      });
    };
  
    return <>
        <MyMap initMapHandle={initMapHandle}/>
        <Info>{info}</Info>
        <Menu updateLinesHandle={() => rbArray.current.requestAndDrawRoute()} 
        startResciveHandle={() => {
          console.log('отправленно');
          const outString = JSON.stringify(toGeojson(rbArray.current.route));
          clientPublisher.current.publish('tanknavigation', outString);
        }}
        onChangeTypeLine={onChangeTypeLine}/>
        {clearButVisible && <ClearButton onClickClear={onClickClear} setIsActive={setClVisible}/> }
        {loaderVisible && <Loader/> }
      </>;
}

export default HookApp;
