import { tank_url } from "./config"

export const sendPost = async geojson => {
    try {
      const response = await fetch(tank_url, {
        method: 'POST',
        body: JSON.stringify(geojson),
        headers: {
            'Content-Type': 'application/json',
         } });
    
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };
