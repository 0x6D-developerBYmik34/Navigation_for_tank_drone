import { useState, useRef } from "react";
import mapboxgl from "mapbox-gl";
import MyMap from "./Map";
import Menu from "./Menu";
import Info from "./Info";
import Loader from "./Loader";
import ClearButton from "./ClearButton";
import { initSourceForMap, toGeojson } from "./util";
import { sendPost } from "./sendPost";
import { source_id } from "./config";
import RouteBuildingArray from "./RouteBuildingArray";


const HookApp = () => {
    const rbArray = useRef(null);

    const [info, setInfo] = useState('Get started!');
    const [clearButVisible, setClVisible] = useState(false);
    const [loaderVisible, setLoaderVisible] = useState(false);

    const onChangeTypeLine = e => 
    rbArray.current.isRequestRouteFromOut = !!(e.currentTarget.value);

    const onClickClear = () => rbArray.current.clearAll()
    
    const initMapHandle = map => {
      console.log('initMapHandle()');
  
      initSourceForMap(map);

      map.doubleClickZoom.disable(); // убрать приближение при двойном нажатии
      map.touchZoomRotate.disableRotation(); // отключить вращение карты

      rbArray.current = new RouteBuildingArray(route => 
        map.getSource(source_id).setData(toGeojson(route))
      );

      rbArray.current.onbecamenoempty = () => setClVisible(true);
      rbArray.current.onstartrequestroute = () => setLoaderVisible(true);
      rbArray.current.onfinnalyrequestroute = () => setLoaderVisible(false);
  
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
        startResciveHandle={() => sendPost(rbArray.current)}
        onChangeTypeLine={onChangeTypeLine}/>
        {clearButVisible && <ClearButton onClickClear={onClickClear} setIsActive={setClVisible}/> }
        {loaderVisible && <Loader/> }
      </>;
}

export default HookApp;
