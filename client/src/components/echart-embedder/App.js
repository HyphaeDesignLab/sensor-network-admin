import React, {useState, useEffect, useRef} from 'react';
import AuthUI from "./../AuthUI";
import Embedder from "./Embedder";

import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

import firebaseConfig from "./../../keys/firebase/config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

import {setupFirebaseEmulators} from '../../firebase-env';
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
    return (
        <div className='app'>
            <h1>eCharts Embedder</h1>
            <main>
                <AuthUI auth={auth}/>
                {!!authUser && <Embedder firebaseApp={{db, auth}}/> }
            </main>

        </div>
    );
};

export default App;