const fs = require('fs');

fs.readFile('Testing\\TestCase\\oye.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const locations = JSON.parse(data);

    const thresholdDistance = 1; // Kilometers
    const thresholdAngle = thresholdDistance / 111;// 1 degree = 111 km

    const radiusKM = 2;
    const radiusAngle = radiusKM / 111;

    const result = [];

    for(let i = 0; i < locations.length; i++) {
        for(let j = i + 1; j < locations.length; j++) {
            for(let k = j + 1; k < locations.length; k++) {

                let distance1 = (Math.pow(locations[i].latitude - locations[j].latitude, 2) + Math.pow(locations[i].longitude - locations[j].longitude, 2));
                let distance2 = (Math.pow(locations[j].latitude - locations[k].latitude, 2) + Math.pow(locations[j].longitude - locations[k].longitude, 2));
                let distance3 = (Math.pow(locations[k].latitude - locations[i].latitude, 2) + Math.pow(locations[k].longitude - locations[i].longitude, 2));

                if(distance1 > radiusAngle*radiusAngle || distance2 > radiusAngle*radiusAngle || distance3 > radiusAngle*radiusAngle) {
                    continue;
                }

                let midLatitude = (locations[i].latitude + locations[k].latitude) / 2;
                let midLongitude = (locations[i].longitude + locations[k].longitude) / 2;

                let distance = Math.sqrt(Math.pow(locations[j].latitude - midLatitude, 2) + Math.pow(locations[j].longitude - midLongitude, 2));
                if(distance < thresholdAngle) {
                    result.push([locations[i], locations[j], locations[k]]);
                }
            }           
        }
    }
    
    console.log(result);

    fs.writeFile('testcases.json', JSON.stringify(result), (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
});