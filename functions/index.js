const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// https://firebase.google.com/docs/functions/networking
const http = require("http");

const express = require("express");
// https://expressjs.com/en/resources/middleware/cors.html
const cors = require("cors")({origin: [
    "http://nbah.lan:8002",
    "http://localhost:5002",
    "https://geo-dashboard-347901.web.app",
    "https://geo-dashboard-347901.firebaseapp.com"]
});

// Setting the `keepAlive` option to `true` keeps
// connections open between function invocations
const agent = new http.Agent({keepAlive: true});


// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
const checkAuth =  (req, res, next) => {
    if (!req.body || ((req.body instanceof Object) && Object.keys(req.body instanceof Object).length === 0)) {
        res.status(403).send({error: "need some parameters"});
    }
    const body = Object.fromEntries(req.body.split("&").map(param => param.split("=").map(p => decodeURIComponent(p))));
    if ((!body || !body.token)) {
        res.status(403).send({error: "not authorized"});
        return;
    }

    admin.auth().verifyIdToken(body.token).then(decodedToken => {
        req.user = decodedToken;
        next();
    }).catch (error => {
        res.status(403).send({error: "error verifying Firebase ID token "+error.message});
    });
};

const sensorsApp = express();

sensorsApp.use(cors);
sensorsApp.use(checkAuth);

sensorsApp.post("/register", (request, response) => {
    if (!request.body || request.body.indexOf("deveui=") < 0) {
        response.status(500).send("must provide some params to sensor/register");
        return;
    }
    let req = http.request({
        host: "localhost",
        port: 3001,
        path: `/device/get?${request.body}`,
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
exports.sensors = functions.https.onRequest(sensorsApp);

// exports.exportProject = functions.https.onRequest((request, response) => {
//     // exmamples: https://firebase.google.com/docs/functions/get-started
//     // save sampleData as JSON to a file so that it can included in HTML
//     const docId = request.query.projectId;
//
//     // pull data form firestore(projects/docID)
//     const sampleData = {
//         blah: 1,
//         blah2: 2
//     }
//     functions.logger.info(["sample project", sampleData], {structuredData: true});
//
//     response.send({status: "success", docId, sampleData});
// });