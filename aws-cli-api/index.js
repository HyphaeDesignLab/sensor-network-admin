var express = require('express')
var app = express()
const { execSync } = require('child_process');
const removeSpaces = s => s.replace(/[^\w]/, '_').replace(/__+/, '_').replace(/^_+|_+$/, '');

app.get('/device/get', function (req, res) {
    try {

        const name = decodeURIComponent(req.query.name).replace('"', ''); // sensor name
        const type = removeSpaces(req.query.type); // sensor type
        const project = removeSpaces(req.query.project);
        const deveui = req.query.deveui;
        const appeui = req.query.appeui;
        const appkey = req.query.appkey;

        const cmd = `aws iotwireless create-wireless-device \\
  --type LoRaWAN \\
  --name "${name} (type: ${type}, project: ${project})" \\
  --destination-name "${project}__${type}" \\
  --lorawan '{"DeviceProfileId": "bd2f3e79-bbea-47a0-9697-c9414b2d6394","ServiceProfileId": "349d0631-1d39-4438-8487-a43b3919d80c","OtaaV1_0_x": {"AppKey": "${appkey}","AppEui": "${appeui}"},"DevEui": "${deveui}"}'`;

        const outputBuffer = execSync(cmd);
        const outputObject = JSON.parse(outputBuffer.toString());
        // convert hash keys to lowercase
        const outputObjectLowercaseKeys = Object.fromEntries(Object.entries(outputObject).map(e => [e[0].toLowerCase(), e[1]]));

        res.send(JSON.stringify(outputObjectLowercaseKeys));
    } catch(error) {
        const output = JSON.stringify({id: 1, error: error.stderr.toString()})
        res.status(500).send(output);
    }
})

app.listen(3001)