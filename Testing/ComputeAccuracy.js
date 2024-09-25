const fs = require('fs');

// type StationDataType = {
//     label: string;
//     latitude: number;
//     longitude: number;
//     temperature: number;
//     humidity: number;
//     wind_speed: number;
//     wind_direction: number;
//     rain_intensity: number;
//     rain_accumulation: number;
// }

function parseCSV(url)
{
    const result = {};
    fs.readFileSync(url, 'utf8').split('\n').forEach((line) => {
        const [city_name,locality_name,device_date_time,rain_intensity,rain_accumulation,humidity,temperature,wind_direction,wind_speed] = line.split(',');
        result[device_date_time] = {
            city_name,
            locality_name,
            device_date_time,
            rain_intensity: parseFloat(rain_intensity),
            rain_accumulation: parseFloat(rain_accumulation),
            humidity: parseFloat(humidity),
            temperature: parseFloat(temperature),
            wind_direction: parseFloat(wind_direction),
            wind_speed: parseFloat(wind_speed),
        };
    });

    return result;
}
function interpolateWeatherData(coords,localStationsData)
{
    function weightFunction(dx,dy)
    {
        const distance = Math.sqrt(dx*dx + dy*dy);
        let weight = 1/Math.pow(distance,2);

        return weight;
    }

    let temperature = 0;
    let humidity = 0;
    let wind_u = 0;
    let wind_v = 0;
    let rain_intensity = 0;
    let rain_accumulation = 0;

    
    let totalWeight = 0;
    for(let i = 0; i < localStationsData.length; i++){
        let station = localStationsData[i];
        let weight = weightFunction(coords[0]-station.latitude,coords[1]-station.longitude);
        totalWeight += weight;
        temperature += station?.temperature * weight;
        humidity += station?.humidity * weight;
        wind_u += Math.cos(station?.wind_direction * Math.PI / 180) * station?.wind_speed * weight;
        wind_v += Math.sin(station?.wind_direction * Math.PI / 180) * station?.wind_speed * weight;
        rain_intensity += station?.rain_intensity * weight;
        rain_accumulation += station?.rain_accumulation * weight;
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
 

const destLocation =  {
    "label": "Delhi NCR Sector 27",
    "localityId": "ZWL009706",
    "latitude": 28.46526,
    "longitude": 77.085742,
}

const sourceLocations = [
    {
        "label": "Delhi NCR Sector 28",
        "localityId": "ZWL004455",
        "latitude": 28.473457,
    },
    {
        "label": "Delhi NCR Sector 43, Gurgaon",
        "localityId": "ZWL007284",
        "latitude": 28.454416,
        "longitude": 77.08882,
    },
    {
        "label": "Delhi NCR SUSHANT LOK 1",
        "localityId": "ZWL008219",
        "latitude": 28.467923,
        "longitude": 77.07653,
    }
]

//city_name,locality_name,device_date_time,rain_intensity,rain_accumulation,humidity,temperature,wind_direction,wind_speed
//read csv file
const dest_data = parseCSV('Testing/WeatherData/Sector27_20240606_20240805.csv');

const source_data = [
    parseCSV('Testing/WeatherData/Sector28_20240606_20240805.csv'),
    parseCSV('Testing/WeatherData/Sector43Gurgaon_20240606_20240805.csv'),
    parseCSV('Testing/WeatherData/SUSHANTLOK1_20240606_20240805.csv'),
];

const interpolated = {}
const actual = {}

for(let date in dest_data)
{
    const coords = [destLocation.latitude,destLocation.longitude];
    
    const localStationsData = [];

    for(let i = 0; i < sourceLocations.length; i++)
    {
        const sourceLocation = sourceLocations[i];
        const sourceData = source_data[i];
        const sourceCoords = [sourceLocation.latitude,sourceLocation.longitude];
        if(sourceData[date])
        {
            localStationsData.push({
                ...sourceData[date],
                latitude: sourceCoords[0],
                longitude: sourceCoords[1],
            });
        }
    }

    interpolated[date] = interpolateWeatherData(coords,localStationsData);
    actual[date] = dest_data[date];
}



const sampleCount = interpolated.length;

const absError = {
    temperature: 0,
    humidity: 0,
    // wind_direction: 0,
    wind_speed: 0,
    rain_intensity: 0,
    rain_accumulation: 0
};

for(let i = 0; i < sampleCount; i++)
{
    absError.temperature += Math.abs(interpolated[i].temperature - actual[i].temperature);
    absError.humidity += Math.abs(interpolated[i].humidity - actual[i].humidity);
    absError.rain_intensity += Math.abs(interpolated[i].rain_intensity - actual[i].rain_intensity);
    absError.rain_accumulation += Math.abs(interpolated[i].rain_accumulation - actual[i].rain_accumulation);

    absError.wind_speed += Math.abs(interpolated[i].wind_speed - actual[i].wind_speed);
    // let intAngle = interpolated[i].wind_direction * Math.PI / 180;
    // let actAngle = actual[i].wind_direction * Math.PI / 180;
    // absError.wind_direction += Math.abs(Math.atan2(Math.sin(intAngle-actAngle),Math.cos(intAngle-actAngle)) * 180 / Math.PI);
}

absError.temperature /= sampleCount;
absError.humidity /= sampleCount;
absError.rain_intensity /= sampleCount;
absError.rain_accumulation /= sampleCount;
absError.wind_speed /= sampleCount;
// absError.wind_direction /= sampleCount;

const decimalPlaces = 4;

console.log("Mean Absolute Temperature Error: ",absError.temperature.toFixed(decimalPlaces),"°C");
console.log("Mean Humidity Error: ",absError.humidity.toFixed(decimalPlaces),"%");
console.log("Mean Rain Intensity Error: ",absError.rain_intensity.toFixed(decimalPlaces),"mm/min");
console.log("Mean Rain Accumulation Error: ",absError.rain_accumulation.toFixed(decimalPlaces),"mm");
// console.log("Mean Absolute Wind Direction Error: ",absError.wind_direction.toFixed(decimalPlaces),"°");
console.log("Mean Absolute Wind Speed Error: ",absError.wind_speed.toFixed(decimalPlaces),"m/s");   
