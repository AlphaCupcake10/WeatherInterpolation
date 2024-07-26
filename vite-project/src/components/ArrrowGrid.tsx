import { useEffect, useState } from 'react'
import { useMap } from 'react-leaflet'
import Arrow from './Arrow';
import { interpolateWeatherData } from '../lib/Interpolation';
import { useControls } from 'leva';
import { useStation } from '../context/StationContext';
 
function ArrowGrid() {
    const map = useMap();
    const station = useStation();
    const [latlngs, setLatlngs] = useState<number[][]>([]);
    const { arrowSize , divisions } = useControls({
        arrowSize: {
          value: 1.5,
          min: .1,
          max: 5,
        },
        divisions: {
            value: 16,
            min: 1,
            max: 32,
            step:1
        },
    });

    useEffect(()=>{
        if(station.localStationsData.length == 0) return;
        generateArrowGrid();
    },[station.localStationsData])


    function generateArrowGrid()
    {
        console.log("Generating Arrow Grid");
        const latlngArray = [];
        const bounds = map.getBounds();
        const topLeft = bounds.getNorthWest();
        const bottomRight = bounds.getSouthEast();
        const latDiff = topLeft.lat - bottomRight.lat;
        const lngDiff = bottomRight.lng - topLeft.lng;


        const latStep = Math.max(latDiff,lngDiff) / divisions;

        for(let i = Math.floor(topLeft.lat*1000)/1000; i > bottomRight.lat; i-=latStep)
        {
            for(let j = Math.floor(topLeft.lng*1000)/1000; j < bottomRight.lng; j+=latStep)
            {
                latlngArray.push([i,j]);
            }
        }
        setLatlngs(latlngArray);
    }

    let arrowLengths: { [key: number]: number } = {
        18: 0.0002,
        17: 0.0003,
        16: 0.0008,
        15: 0.0008,
        14: 0.0008,
        13: 0,
    }
    
    return (
        <>
            {
                latlngs.length != 0 && latlngs.map((coords,index)=>{
                    let weatherData = interpolateWeatherData(coords,station.localStationsData);
                    let arrowLength = arrowLengths[map.getZoom()] * arrowSize || 0.0008 * arrowSize;
                    let angle = (weatherData.wind_direction) * (Math.PI / 180);
                    const dx = arrowLength/10 * Math.cos(angle);
                    const dy = arrowLength/10 * Math.sin(angle);
                    let color = "black";
                    if(weatherData.wind_speed < 3) color = "#F4D311";
                    if(weatherData.wind_speed > 3 && weatherData.wind_speed < 6) color = "#F48D11";
                    if(weatherData.wind_speed > 6) color = "#F41111";
                    return <Arrow key={index} color={color} positions={[[coords[0],coords[1]],[coords[0]+dx,coords[1]+dy]]}/>
                })
            }
        </>
    )
}

export default ArrowGrid