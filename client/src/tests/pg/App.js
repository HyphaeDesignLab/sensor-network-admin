import React, {useState, useEffect, useRef} from 'react';
import AuthUI from "./../../components/AuthUI";

import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

import firebaseConfig from "../../keys/firebase/config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

import {getFirebaseFunctionsUrl, setupFirebaseEmulators} from '../../firebase-env';
setupFirebaseEmulators({auth, db});

const App = () => {
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        return onAuthStateChanged(auth, user => {
            // Check for user status
            setAuthUser(user);
        });
    }, []);

    useEffect(() => {
        return onAuthStateChanged(auth, user => {
            // Check for user status
            setAuthUser(user);
        });
    }, []);

    const [testPgOutput, setTestPgOutput] = useState('');

    const handleTestPG = () => {
        return auth.currentUser.getIdToken().then(authToken => {
            fetch(getFirebaseFunctionsUrl()+'/eximport/sync', {
                method: 'post',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({token: authToken})
            })
            .then(response => response.text())
                .then(text => {
                    setTestPgOutput(text);
                })
                .catch(error => {
                    setTestPgOutput(error.message);
                })
        });
    }

    return (
        <div className='app'>
            <h1>Sensor Networks Dashboard</h1>
            <main>
                <AuthUI auth={auth}/>
                {!!authUser && <div>
                    {!!testPgOutput && <div>{testPgOutput}</div>}
                    <button type={'button'} onClick={handleTestPG}>Test PG</button>
                </div> }
            </main>

        </div>
    );
};

export default App;