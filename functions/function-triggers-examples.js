
/*
firestore trigger function:
https://firebase.google.com/docs/functions/firestore-events
*/
const functions = require('firebase-functions');

// SINGLE DOC
exports.myFunction = functions.firestore
  .document('my-collection/{docId}')
  .onWrite((change, context) => {
  });

// WILDCARD
// Listen for changes in all documents in the 'users' collection
exports.useWildcard = functions.firestore
    .document('users/{userId}')
    .onCreate((doc, context) => {
        const d = doc.data();
        functions.logger.log(JSON.stringify(d));
    })
    .onWrite((change, context) => {
      // If we set `/users/marie` to {name: "Marie"} then
      // context.params.userId == "marie"
      // ... and ...
      // change.after.data() == {name: "Marie"}
    });


// onWrite(handler: (change: Change<DocumentSnapshot>, context: EventContext) => any): CloudFunction<Change<DocumentSnapshot>>
function onWriteHandler(change, context) {

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

// where:
context.eventType = String;
    // google.firestore.document.write
    // google.firestore.document.create
    // google.firestore.document.update
    // google.firestore.document.delete

const db = admin.firestore();
function onWriteHandler2() {
    var someObj = {};
    // writing to OTHER doc/collection other than ones that triggered
    db.doc('some/otherdoc').set({ ...someObj });
}

