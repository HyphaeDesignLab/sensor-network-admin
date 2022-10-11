import {connectAuthEmulator} from "firebase/auth";
import {connectFirestoreEmulator} from "firebase/firestore";
import clientEnv from "./keys/client";

export const setupFirebaseEmulators = (props) => {
    if (clientEnv.USE_EMULATORS) {
        connectAuthEmulator(props.auth, "http://localhost:"+clientEnv.EMULATORS_AUTH_PORT);
        connectFirestoreEmulator(props.db, 'localhost', clientEnv.EMULATORS_FIRESTORE_PORT);
    }
};

export const getFirebaseFunctionsUrl = () => {
    return clientEnv.FUNCTIONS_URL;
};
