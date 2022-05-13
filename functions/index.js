const functions = require("firebase-functions");
//const config = functions.config();

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.exportProject = functions.https.onRequest((request, response) => {
    // exmamples: https://firebase.google.com/docs/functions/get-started
    // save sampleData as JSON to a file so that it can included in HTML
    const docId = request.query.projectId;

    // pull data form firestore(projects/docID)
    const sampleData = {
        blah: 1,
        blah2: 2
    }
    functions.logger.info(["sample project", sampleData], {structuredData: true});

    const fileContents = `
try {
    HygeoApp.INSTANCE.init(${JSON.stringify(sampleData)})
} catch(error) {
    alert(error);
}
`;
    const fileName = sampleData.clientId+".js";

    // save fileName with fileContents to hosting "{root}/public/project-configs/{fileName}"

    response.send({status: "success", docId, fileName, fileContents});
});