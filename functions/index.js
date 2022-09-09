const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

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
exports.sensors = functions.https.onRequest(sensorsApp);

// Export-import app
const exportApp = express();

exportApp.get("/projects/list", (request, response) => {
    if (!parseInt(process.env.IMPORT_EXPORT_ALLOWED)) {
        response.status(500).send("action not enabled");
    }
    var queryRef = db.collection("sensor_networks").get();
    return queryRef.then(querySnap => {
        let html = "";
        querySnap.forEach(doc => {
            const data = doc.data();
            html += `<a href="${process.env.FUNCTIONS_URL}/exportApp/sensors/export/${doc.id}">${data.name} (${data.description})</a><br/>`;
        });
        response.status(200).header("content-type", "text/html").send(html);
    }).catch(e => {
        response.status(500).send(e.message);
    });
});

exportApp.get("/sensors/export/:projectId", (request, response) => {
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

exportApp.get("/sensors/import", (request, response) => {
    if (!parseInt(process.env.IMPORT_EXPORT_ALLOWED)) {
        response.status(500).send("action not enabled");
    }
    response.status(200).header("content-type", "text/html").send(`
<form method="post" enctype="application/x-www-form-urlencoded">
<input name="projectName" placeholder="project name" /><br/>
<input name="projectDescription" placeholder="description"/><br/>
<textarea name="sensorsJson" style="max-width: 600px; width: 100%; height: 400px;" placeholder="">JSON of sensors data</textarea><br/>
<button>create project and import sensors</button>    
</form>
    `);
});

exportApp.post("/sensors/import", (request, response) => {
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
exports.exportApp = functions.https.onRequest(exportApp);


/*
firestore trigger function:
https://firebase.google.com/docs/functions/firestore-events

const functions = require('firebase-functions');

SINGLE DOC
exports.myFunction = functions.firestore
  .document('my-collection/{docId}')
  .onWrite((change, context) => {
  });

WILDCARD
// Listen for changes in all documents in the 'users' collection
exports.useWildcard = functions.firestore
    .document('users/{userId}')
    .onWrite((change, context) => {
      // If we set `/users/marie` to {name: "Marie"} then
      // context.params.userId == "marie"
      // ... and ...
      // change.after.data() == {name: "Marie"}
    });


onWrite(handler: (change: Change<DocumentSnapshot>, context: EventContext) => any): CloudFunction<Change<DocumentSnapshot>>
onWriteHandler(change, context) {

      // Get an object with the current document value.
      // If the document does not exist, it has been deleted.
      const document = change.after.exists ? change.after.data() : null;

      // Get an object representing the document
      // e.g. {'name': 'Marie', 'age': 66}
      const newValue = change.after.data();

      // ...or the previous value before this update
      const previousValue = change.before.data();

      // access a particular field as you would any JS property
      const name = newValue.name;

      // Then return a promise of a set operation to update the count
      return change.after.ref.set({
        name_change_count: count + 1
      }, {merge: true});
}

where:
context.eventType = <string>
    google.firestore.document.write
    google.firestore.document.create
    google.firestore.document.update
    google.firestore.document.delete

const db = admin.firestore();
onWriteHandler() {
    // writing to OTHER doc/collection other than ones that triggered
    db.doc('some/otherdoc').set({ ... });
}

*/