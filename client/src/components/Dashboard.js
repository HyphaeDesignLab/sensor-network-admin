import React, {useState, useEffect} from 'react';
import Map from './Map';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Dashboard = ({db}) => {
    const [projects, setProjects] = useState([]);

    const addProject = () => {
        const sampleData = {
            someProp: "Ada "+(new Date()).toLocaleString()
        };

        addDoc(collection(db, "projects"), sampleData).then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            setProjects([...projects, sampleData]);
        }).catch(e => {
            console.error("Error adding document: ", e);
        });
    }

    return <div>
        <h1>Dashboard</h1>

        <button type='button' onClick={addProject}>Add Project</button>
        {projects.map(project => <div>{project.someProp}</div>)}
    </div>;
};

export default Dashboard;