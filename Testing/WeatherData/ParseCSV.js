const fs = require('fs');

function parseCSV(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const fieldNames = lines[0].split(',');

    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        const obj = {};
        for (let j = 0; j < fieldNames.length; j++) {
            obj[fieldNames[j]] = values[j];
        }
        data.push(obj);
    }

    return JSON.stringify(data);
}

function hehe(path)
{
    const csvFilePath = `${path}.csv`;
    fs.writeFileSync(`${path}.json`, parseCSV(csvFilePath));
}

hehe('Testing\\WeatherData\\Ghitorni_20240606_20240805')
hehe('Testing\\WeatherData\\Sector23_20240606_20240805')
hehe('Testing\\WeatherData\\Sector24_20240606_20240805')