import {connectAuthEmulator} from "firebase/auth";
import {connectFirestoreEmulator} from "firebase/firestore";
import env from '../../keys/env';
import serverConfigAllEnv from "../../keys/server";
const serverConfig = serverConfigAllEnv[env];

export default (auth, db) => {
    if (env.env === 'dev' && serverConfig.USE_EMULATORS === 'yes') {
        connectAuthEmulator(auth, "http://localhost:"+serverConfig.EMULATOR_FUNCTIONS_PORT);
        connectFirestoreEmulator(db, 'localhost', serverConfig.EMULATORS_FIRESTORE_PORT);
    }
};
