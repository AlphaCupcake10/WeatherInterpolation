import { useStation } from '../context/StationContext'
import { WeatherDataType } from '../types/types'

function CurrentCard({weatherData}: {weatherData?: WeatherDataType}) {
    const station = useStation();
    if(weatherData === undefined) return null;
    return (
        <div className="text-[#8c92a4] z-20 h-screen w-screen fixed top-0 left-0 flex flex-col justify-end items-end p-16 pointer-events-none gap-4">
            <div className="w-full max-w-md bg-[#181c20] backdrop-blur-xl p-8 rounded-xl">
                <div className="flex justify-between">
                    <p>Stations in Vicinity</p>
                    <p>{station.localStationsData.length}</p>
                </div>
            </div>
            <div className="w-full max-w-md bg-[#181c20] backdrop-blur-xl p-8 rounded-xl">
                <div className="flex justify-between">
                    <p>Temperature</p><p>{weatherData?.temperature.toFixed(2)}°C</p>
                </div>
                <div className="flex justify-between">
                    <p>Humidity</p><p>{weatherData?.humidity.toFixed(2)}%</p>
                </div>
                <div className="flex justify-between">
                    <p>Wind Speed</p><p>{weatherData?.wind_speed.toFixed(2)}m/s</p>
                </div>
                <div className="flex justify-between">
                    <p>Wind Direction</p>
                    <svg style={{rotate: `${weatherData?.wind_direction - 90}deg` }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </div>
                <div className="flex justify-between">
                    <p>Rain Intensity</p><p>{weatherData?.rain_intensity.toFixed(2)}mm/hr</p>
                </div>
                <div className="flex justify-between">
                    <p>Rain Accumulation</p><p>{weatherData?.rain_accumulation.toFixed()}mm</p>
                </div>
            </div>
        </div>
    )
}

export default CurrentCard