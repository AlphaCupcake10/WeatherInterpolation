import React, { createContext, useContext, useState } from 'react';
import { StationDataType } from '../types/types';
import { button, useControls } from 'leva';
import axios from 'axios';

interface StationContextType {
    localStationsData: StationDataType[];
    setLocalStationsData: React.Dispatch<React.SetStateAction<StationDataType[]>>;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export function StationProvider(props: { children: React.ReactNode }) {
    useControls({ "API Call": button(() => { fetchWeatherData() }) });

    const [localStationsData, setLocalStationsData] = useState<StationDataType[]>([]);

    // useEffect(() => {
    //     console.log(localStationsData)
    // }, [localStationsData]);

    async function fetchWeatherData()
    {
        setLocalStationsData(prev => prev.map((val) => {
            if(!val.locality_weather_data)
            {
                console.log(val.localityId)
                try
                {
                    axios.get('https://www.weatherunion.com/gw/weather/external/v0/get_locality_weather_data',{
                        params: {
                            locality_id: val.localityId
                        },
                        headers: {'X-Zomato-Api-Key': 'b03bb9100d788d83a9f023a093beb9b6'}
                    }).then((response) => {
                        if(response.status == 200)
                        {
                            console.log(response);
                            val.locality_weather_data = response.data.locality_weather_data;
                        }
                    })
                }
                catch(e)
                {
                    console.log(e);
                    return val;
                }

                // val.locality_weather_data = {
                // temperature: Math.floor(Math.random() * 10) + 20,
                // humidity: Math.floor(Math.random() * 10) + 50,
                // wind_speed: Math.floor(Math.random() * 10) + 5,
                // wind_direction: Math.floor(Math.random() * 360),
                // rain_intensity: Math.floor(Math.random() * 10),
                // rain_accumulation: Math.floor(Math.random() * 10)
                // }
            }
            return val;
        }))
    }


    return (
        <StationContext.Provider value={{localStationsData,setLocalStationsData}}>
            {props.children}
        </StationContext.Provider>
    );
};

export const useStation = (): StationContextType => {
    const context = useContext(StationContext);
    if (!context) {
        throw new Error('useStation must be used within a StationProvider');
    }
    return context;
};