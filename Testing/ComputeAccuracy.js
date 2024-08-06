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
 

const testcaseLocations = [
    {
      "label": "Delhi NCR Ghitorni",
      "localityId": "ZWL009925",
      "latitude": 28.486412,
      "longitude": 77.125366,
      "deviceType": 1
    },
    {
      "label": "Delhi NCR Sector 24",
      "localityId": "ZWL009638",
      "latitude": 28.497419,
      "longitude": 77.09098,
      "deviceType": 1
    },
    {
      "label": "Delhi NCR Sector 23",
      "localityId": "ZWL008476",
      "latitude": 28.50908,
      "longitude": 77.057138,
      "deviceType": 1
    }
];


//read from json file
const A = JSON.parse(fs.readFileSync('Testing/WeatherData/Ghitorni_20240606_20240805.json', 'utf8'));
const B = JSON.parse(fs.readFileSync('Testing/WeatherData/Sector24_20240606_20240805.json', 'utf8'));
const C = JSON.parse(fs.readFileSync('Testing/WeatherData/Sector23_20240606_20240805.json', 'utf8'));

const coords = [testcaseLocations[1].latitude,testcaseLocations[1].longitude];

const interpolated = [];
const actual = [];

const sampleCount = 200;

console.log("Sample Count:",sampleCount);

for(let i = 0 ; i < sampleCount ; i ++)
{
    let a = A[i];
    let b = B[i];
    let c = C[i];

    if(!a || !b || !c)
    {
        console.log(i-2);
        break;   
    }

    const localStationsData = [
        {
            label: "Ghitorni",
            latitude: testcaseLocations[0].latitude,
            longitude: testcaseLocations[0].longitude,
            temperature: a.temperature,
            humidity: a.humidity,
            wind_speed: a.wind_speed,
            wind_direction: a.wind_direction,
            rain_intensity: a.rain_intensity,
            rain_accumulation: a.rain_accumulation
        },
        {
            label: "Sector 23",
            latitude: testcaseLocations[2].latitude,
            longitude: testcaseLocations[2].longitude,
            temperature: c.temperature,
            humidity: c.humidity,
            wind_speed: c.wind_speed,
            wind_direction: c.wind_direction,
            rain_intensity: c.rain_intensity,
            rain_accumulation: c.rain_accumulation
        }
    ];

    interpolated.push(interpolateWeatherData(coords,localStationsData));
    actual.push({
        temperature: parseFloat(b.temperature),
        humidity: parseFloat(b.humidity),
        wind_speed: parseFloat(b.wind_speed),
        wind_direction: parseFloat(b.wind_direction),
        rain_intensity: parseFloat(b.rain_intensity),
        rain_accumulation: parseFloat(b.rain_accumulation)
    });
}

console.log(actual)
console.log(interpolated)

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