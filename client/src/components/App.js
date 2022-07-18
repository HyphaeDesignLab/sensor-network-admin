import React, {useState, useEffect, useRef} from 'react';
// import Dashboard from './Dashboard';
import Dashboard from './Dashboard';
import AuthUI from "./AuthUI";

import {initializeApp} from "firebase/app";
import {getAuth, onAuthStateChanged} from "firebase/auth";
import { getFirestore } from 'firebase/firestore';

import firebaseConfig from "./../firebase-config";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

//import {connectFirestoreEmulator } from 'firebase/firestore';
//connectFirestoreEmulator(db, 'localhost', 8080);

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
            <h1>Sensor Networks Dashboard</h1>
            <main>
                <AuthUI auth={auth}/>
                {!!authUser && <Dashboard firebaseApp={{db, auth}}/> }
            </main>

        </div>
    );
};

export default App;