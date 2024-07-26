type WeatherDataType = {
    temperature: number;
    humidity: number;
    wind_speed: number;
    wind_direction: number;
    rain_intensity: number;
    rain_accumulation: number;
};
type StationDataType = {
    label: string;
    localityId: string;
    latitude: number;
    longitude: number;
    deviceType: number;
    locality_weather_data?:WeatherDataType
}

export type { WeatherDataType, StationDataType };