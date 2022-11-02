const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

// https://firebase.google.com/docs/functions/networking
const http = require("https");

const express = require("express");
// https://expressjs.com/en/resources/middleware/cors.html
const cors = require("cors")({origin: (process.env.CORS_URLS ? process.env.CORS_URLS.split("|") : "*")});

// Setting the `keepAlive` option to `true` keeps
// connections open between function invocations
const agent = new http.Agent({keepAlive: true});

// docs: https://node-postgres.com/api/result
const { Client } = require("pg");
const connectionString = `postgres://${process.env.PG_USER}:${process.env.PG_PASS}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DB}`;


// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
// UNLESS page is in UNAUTH hash
const unauthedRoutes = {};
const checkAuth =  (appBasePath, req, res, next) => {
    if (req.method === "GET") {
        next();
        return;
    }
    if (unauthedRoutes[appBasePath+req.path]) {
        next();
        return;
    }
    if (!req.body || ((req.body instanceof Object) && Object.keys(req.body).length === 0)) {
        res.status(403).send({error: "need some parameters", body: req.body});
        return;
    }

    if (!req.body.token) {
        res.status(403).send({error: "not authorized"});
        return;
    }

    admin.auth().verifyIdToken(req.body.token).then(decodedToken => {
        req.user = decodedToken;
        next();
    }).catch (error => {
        res.status(403).send({error: "error verifying Firebase ID token "+error.message});
    });
};

const sensorsApp = express();

sensorsApp.use(cors);
const sensorsAppBasePath = "sensors"; // must match the property <path> in exports.<path> below
sensorsApp.use((req, res, next) => checkAuth(sensorsAppBasePath, req, res, next));

sensorsApp.post("/register", (request, response) => {
    if (!request.body || request.body.indexOf("deveui=") < 0) {
        response.status(500).send("must provide some params to sensor/register");
        return;
    }
    let req = http.request({
        host: process.env.URLS_AWS_CLI_API__HOST,
        port: process.env.URLS_AWS_CLI_API__PORT,
        path: `/device/add?${request.body}`,
        method: "GET",
        agent: agent // Holds the connection open after the first invocation
    }, res => {
        let rawData = "";
        res.setEncoding("utf8");
        res.on("data", chunk => { rawData += chunk; });
        res.on("end", () => {
            response.status(200).send(rawData);
        });
    });
    req.on("error", e => {
        response.status(500).send(e.message);
    });
    req.end();
});

unauthedRoutes[sensorsAppBasePath+"/readings/latest"] = true;
sensorsApp.get("/readings/latest", (request, response) => {
    const pgClient = new Client({connectionString});
    return new Promise((resolve, reject) => { //
        pgClient.connect().then(() => {
            pgClient.query(`select * from ${process.env.PG_PROJECT_NAME}.sensor_readings_latest`).then(res => {
                pgClient.end().then(() => {
                    resolve(res.rows);
                }).catch((e) => reject("cannot end query" + e));
            }).catch((e) => reject("cannot query" + e));
        }).catch((e) => reject("cannot connect: " + e));
    }).then(r => {
        pgClient.end();
        response.send(JSON.stringify(r));
    }).catch(e => {
        pgClient.end();
        response.send(JSON.stringify(e));
    });
}); //
exports.sensors = functions.https.onRequest(sensorsApp);

// Export-import app
const eximportApp = express();
eximportApp.use(cors);
const eximportAppBasePath = "eximport"; // must match the property <path> in exports.<path> below
eximportApp.use((req, res, next) => checkAuth(eximportAppBasePath, req, res, next));


eximportApp.post("/sensors/export/:projectId", (request, response) => {
    if (!parseInt(process.env.IMPORT_EXPORT_ALLOWED)) {
        response.status(500).send("action not enabled");
    }
    const projectId = request.params.projectId.replace(/\W/g, "");
    var queryRef = db.collection("sensors").where("network", "==", projectId).get();
    //        functions.logger.info(["sample project", sampleData], {structuredData: true});
    return queryRef.then(querySnap => {
        const data = [];
        querySnap.forEach(doc => {
            data.push(doc.data());
        });
        response.status(200).header("content-type", "text/plain").send(JSON.stringify(data));
    }).catch(e => {
        response.status(500).send(e.message);
    });
});

eximportApp.post("/sensors/import", (request, response) => {
    if (!parseInt(process.env.IMPORT_EXPORT_ALLOWED) || process.env.ENV !== "dev") {
        response.status(500).send("action not enabled");
    }
    return db.collection("sensor_networks").add({
        name: request.body.projectName,
        description: request.body.projectDescription
    }).then(docRef => {
        const sensors = JSON.parse(request.body.sensorsJson);
        const batch = db.batch();
        sensors.forEach(sensor => {
            var sensorsRef = db.collection("sensors").doc();
            sensor.network = docRef.id
            batch.set(sensorsRef, sensor);
        })

        return batch.commit().then(zz => {
            response.status(200).header("content-type", "text/html").send(JSON.stringify("imported: "+JSON.stringify(zz)));
        })
    }).catch(e => {
        response.status(500).send(e.message);
    });
});

unauthedRoutes[eximportAppBasePath+"/sync"] = true;
eximportApp.post("/sync", (request, response) => {
    const pgClient = new Client({connectionString});
    return new Promise((resolve, reject) => { //
        pgClient.connect().then(() => {
            pgClient.query(`select name, device_eui from ${process.env.PG_PROJECT_NAME}.sensors order by name`).then(res => {
                pgClient.end().then(() => {
                    resolve(res.rows.map(row => row.name+"/"+row.device_eui).join(", "));
                }).catch((e) => reject("cannot end query" + e));
            }).catch((e) => reject("cannot query" + e));
        }).catch((e) => reject("cannot connect: " + e));
    }).then(r => {
        pgClient.end();
        response.send(JSON.stringify(r));
    }).catch(e => {
        pgClient.end();
        response.send(JSON.stringify(e));
    });
}); //

// WILDCARD
// Listen for changes in all documents in the 'users' collection
exports.onSensorCreate = functions.firestore
    .document("sensors/{sensorId}")
    .onCreate((doc, context) => {
        const d = doc.data();
        functions.logger.log(JSON.stringify(["created", context.params.sensorId, d]));
        return d;
    })

exports.onSensorUpdate = functions.firestore
    .document("sensors/{sensorId}")
    .onUpdate((doc, context) => {
        const d = doc.after.data();
        functions.logger.log(JSON.stringify(["updated", context.params.sensorId, d]));
        return d;
    })

exports.onSensorDelete = functions.firestore
    .document("sensors/{sensorId}")
    .onDelete((doc, context) => {
        const d = doc.data();
        functions.logger.log(JSON.stringify(["deleted", context.params.sensorId, d]));
        return d;
    })

exports.eximport = functions.https.onRequest(eximportApp);

const testApp = express();
testApp.get("/ip/db/client", (request, response) => {
    const pgClient = new Client({connectionString});
    return new Promise((resolve, reject) => { //
        pgClient.connect().then(() => {
            pgClient.query(`insert into ${process.env.PG_PROJECT_NAME}.client_test (ip, host, now, tz) values (inet_client_addr(), 'localhost', now(), extract(timezone from now())/3600)`).then(() => {
                pgClient.end().then(() => {
                    resolve("entered ip");
                }).catch((e) => reject("cannot end query" + e));
            }).catch((e) => reject("cannot query" + e));
        }).catch((e) => reject("cannot connect: " + e));
    }).then(r => {
        pgClient.end();
        response.send(JSON.stringify(r));
    }).catch(e => {
        pgClient.end();
        response.send(JSON.stringify(e));
    });
}); //

testApp.get("/ip/db/client/count", (request, response) => {
    const pgClient = new Client({connectionString});
    return new Promise((resolve, reject) => { //
        pgClient.connect().then(() => {
            pgClient.query(`select count(*) from ${process.env.PG_PROJECT_NAME}.client_test`).then(queryResult => {
                pgClient.end().then(() => {
                    resolve(queryResult.rows);
                }).catch((e) => reject("cannot end query" + e));
            }).catch((e) => reject("cannot query" + e));
        }).catch((e) => reject("cannot connect: " + e));
    }).then(r => {
        pgClient.end();
        response.send(JSON.stringify(r));
    }).catch(e => {
        pgClient.end();
        response.send(JSON.stringify(e));
    });
}); //
exports.test = functions.https.onRequest(testApp);