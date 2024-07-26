import React, { createContext, useContext, useState } from 'react';
import { StationDataType } from '../types/types';
import { button, useControls } from 'leva';

interface StationContextType {
    localStationsData: StationDataType[];
    setLocalStationsData: React.Dispatch<React.SetStateAction<StationDataType[]>>;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export function StationProvider(props: { children: React.ReactNode }) {
    useControls({ "Simulate API Call": button(() => { fetchWeatherData() }) });

    const [localStationsData, setLocalStationsData] = useState<StationDataType[]>([]);

    function fetchWeatherData()
    {
        setLocalStationsData(prev => prev.map((val) => {
            val.locality_weather_data = {
              temperature: Math.floor(Math.random() * 10) + 20,
              humidity: Math.floor(Math.random() * 10) + 50,
              wind_speed: Math.floor(Math.random() * 10) + 5,
            //   wind_direction: 0,
              wind_direction: Math.floor(Math.random() * 360),
              rain_intensity: Math.floor(Math.random() * 10),
              rain_accumulation: Math.floor(Math.random() * 10)
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