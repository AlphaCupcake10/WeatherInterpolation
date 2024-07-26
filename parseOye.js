const fs = require('fs');

const filePath = 'D:\\Users\\AlphaCupcake10\\Desktop\\asd\\oye.txt'; // Replace with the actual file path

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const records = data.split('\n').map(line => {

        let a = line.split('ZWL');
        
        a = [a[0].trim(), ...a[1].split(" ").slice(0,4)];
        a[1] = "ZWL" + a[1];

        a[2] = parseFloat(a[2]);
        a[3] = parseFloat(a[3]);
        a[4] = parseInt(a[4],10);

        const [label, localityId, latitude, longitude, deviceType] = a;
        return {
            label,
            localityId,
            latitude,
            longitude,
            deviceType
        };
    });

    console.log(records);
    //write to json file
    fs.writeFileSync('D:\\Users\\AlphaCupcake10\\Desktop\\asd\\oye.json', JSON.stringify(records, null, 2));
});