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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!!env.cors_urls) {
    const cors = require("cors")({origin: env.cors_urls.split('|')});
    app.use(cors);
}

const { Client } = require('pg');

const { execSync } = require('child_process');
const removeSpaces = s => s.replace(/[^\w]/, '_').replace(/__+/, '_').replace(/^_+|_+$/, '');

const connectionString = `postgres://${env.pg_user}:${env.pg_pass}@${env.pg_host}:${env.pg_port}/${env.pg_db}`;

const pgQuery = (query) => {
    const pgClientProps = {connectionString};
    if (env.pg_ssl) {
        pgClientProps.ssl = { rejectUnauthorized: false };
    }
    const pgClient = new Client(pgClientProps);
    return new Promise((resolve, reject) => {
        pgClient.connect().then(() => {
            pgClient.query(query).then(queryResult => {
                pgClient.end().then(() => {
                    resolve(queryResult);
                }).catch((e) => reject('cannot end query' + e));
            }).catch((e) => reject('cannot query' + e));
        }).catch((e) => reject('cannot connect: ' + e));
    }).then(queryResult => {
        pgClient.end();
        return queryResult;
    }).catch(e => {
        pgClient.end();
        throw e;
    });
}
app.get('/sensors/readings/last', function (req, res) {
    pgQuery(`select * from ${env.project}.sensor_readings_latest`)
    .then(result => {
        res.send(JSON.stringify(result.rows));
    }).catch(e => {
        res.send(JSON.stringify(e));
    });
});

app.get('/sensors/get', function (req, res) {
    pgQuery(`select * from ${env.project}.sensors`)
    .then(result => {
        const sensors = [];
        result.rows.forEach(row => {
           sensors.push({
               deveui: !!row.ids ? row.ids.deveui : null,
               lng: row.location && row.location.lng ? row.location.lng : null,
               lat: row.location && row.location.lat ? row.location.lat : null,
               type: row.type ? row.type : null,
               elevation: row.elevation ? row.elevation : null,
               site: row.site ? row.site : null
           });
        });
        res.send(JSON.stringify(sensors));
    }).catch(e => {
        res.send(JSON.stringify(e));
    });
});

app.get('/sensors/sync', function (req, res) {
    pgQuery(`select now()`)
    .then(result => {
        res.send(JSON.stringify(result.rows));
    }).catch(e => {
        res.send(JSON.stringify(e));
    });
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
        const output = JSON.stringify({id: 0, error: error.stderr.toString()})
        res.status(500).send(output);
    }
});
app.get('/sensor/delete', function (req, res) {
    try {
        const id = req.query.id.replace(/[^\w\-]/g, '');
        if (!id) {
           throw new Error('no device id provided to delete');
        }
        const cmd = `aws iotwireless delete-wireless-device --id ${id}`;

        const outputBuffer = execSync(cmd);
        res.send({message: !outputBuffer || !outputBuffer.toString() ? `AWS IOT device ${id} was deleted` : outputBuffer.toString()});
    } catch(error) {
        const output = JSON.stringify({id: 0, error: error.message})
        res.status(500).send(output);
    }
});
app.get('/', function (req, res) {
    res.send('ok');
});

if (env.env === 'prod') {

    const key = fs.readFileSync(env.ssl_key);
    const cert = fs.readFileSync(env.ssl_cert);
    const ca = fs.readFileSync(env.ssl_chain);
    const https = require('https');
    let server = https.createServer({key: key, cert: cert, ca }, app);
    server.listen(3001);
} else {
    app.listen(3001);
}