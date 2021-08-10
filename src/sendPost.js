import { toGeojson } from "./util";
import { tank_url } from "./config"

export const sendPost = async route => {
    try {
      const response = await fetch(tank_url, {
        method: 'POST',
        body: JSON.stringify(toGeojson(route)),
        headers: {
            'Content-Type': 'application/json',
         } });
    
      const json = await response.json();
      console.log(json);
    } catch (error) {
      console.log(error);
    }
  };
