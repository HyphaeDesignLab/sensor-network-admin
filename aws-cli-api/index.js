const fs = require('fs');

// start running server by passing the ENV file (usually .env in same folder) that contains all environment variables
let env = {};
if (process.argv[2]) {
    const envFileContents = fs.readFileSync(process.argv[2]);
    if (envFileContents) {
        env = JSON.parse(envFileContents);
    }
}

var express = require('express');
const app = express();

if (!!env.cors_urls) {
    const cors = require("cors")({origin: env.cors_urls.split('|')});
    app.use(cors);
}

const { pgClient } = require('pg');

const { execSync } = require('child_process');
const removeSpaces = s => s.replace(/[^\w]/, '_').replace(/__+/, '_').replace(/^_+|_+$/, '');

app.get('/sensor/test-db', function (req, res) {
    const client = new pgClient({
        host: env.pg_host,
        port: env.pg_port,
        user: env.pg_user,
        password: env.pg_pass,
        database: env.pg_db,
        ssl: true,
    });
    return new Promise((resolve, reject) => {
        client.connect().then(() => {
            client.query('SELECT $1::text as zzz', ['Connection to postgres successful!']).then(res => {
                client.end().then(() => {
                    resolve(res.rows[0].zzz);
                }).catch(() => reject('cannot end query'));
            }).catch(() => reject('cannot query'));
        }).catch(() => reject('cannot connect'));
    }).then(r => res.send(JSON.stringify(r))).catch(e => res.send(JSON.stringify(e)))
});
app.get('/sensor/add', function (req, res) {
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
});
app.get('/sensor/delete', function (req, res) {
    try {
        const id = removeSpaces(req.query.id); // sensor type
        const cmd = `aws iotwireless create-wireless-device --id ${id}`;

        const outputBuffer = execSync(cmd);
        const outputObject = JSON.parse(outputBuffer.toString());
        // convert hash keys to lowercase
        const outputObjectLowercaseKeys = Object.fromEntries(Object.entries(outputObject).map(e => [e[0].toLowerCase(), e[1]]));

        res.send(JSON.stringify(outputObjectLowercaseKeys));
    } catch(error) {
        const output = JSON.stringify({id: 1, error: error.stderr.toString()})
        res.status(500).send(output);
    }
});
app.get('/', function (req, res) {
    res.send('ok');
});

if (env.env === 'prod') {

    let server;
    if (env.env === 'prod') {
        const key = fs.readFileSync(env.ssl_key);
        const cert = fs.readFileSync(env.ssl_cert);
        const ca = fs.readFileSync(env.ssl_chain);
        const https = require('https');
        server = https.createServer({key: key, cert: cert, ca }, app);
    }
    server.listen(3001);
} else {
    app.listen(3001);
}