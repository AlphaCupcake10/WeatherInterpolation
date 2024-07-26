import { StationDataType } from "../types/types";

export function interpolateWeatherData(coords: number[],localStationsData: StationDataType[])
{
    let temperature = 0;
    let humidity = 0;
    let wind_u = 0;
    let wind_v = 0;
    let rain_intensity = 0;
    let rain_accumulation = 0;

    let totalWeight = 0;
    for(let i = 0; i < localStationsData.length; i++){
        let station = localStationsData[i];
        if(!station.locality_weather_data) continue;
        let weight = weightFunction(coords[0]-station.latitude,coords[1]-station.longitude);
        totalWeight += weight;
        temperature += station.locality_weather_data?.temperature * weight;
        humidity += station.locality_weather_data?.humidity * weight;
        wind_u += Math.cos(station.locality_weather_data?.wind_direction * Math.PI / 180) * station.locality_weather_data?.wind_speed * weight;
        wind_v += Math.sin(station.locality_weather_data?.wind_direction * Math.PI / 180) * station.locality_weather_data?.wind_speed * weight;
        rain_intensity += station.locality_weather_data?.rain_intensity * weight;
        rain_accumulation += station.locality_weather_data?.rain_accumulation * weight;
    }

    temperature /= totalWeight;
    humidity /= totalWeight;
    wind_u /= totalWeight;
    wind_v /= totalWeight;
    rain_intensity /= totalWeight;
    rain_accumulation /= totalWeight;

    return {
        temperature,
        humidity,
        wind_speed: Math.sqrt(wind_u*wind_u + wind_v*wind_v),
        wind_direction: Math.atan2(wind_v,wind_u) * 180 / Math.PI,
        rain_intensity,
        rain_accumulation,
    };
}

export function weightFunction(dx: number,dy: number)
{
    const distance = Math.sqrt(dx*dx + dy*dy);
    let weight = 1/Math.pow(distance,2);

    return weight;
}