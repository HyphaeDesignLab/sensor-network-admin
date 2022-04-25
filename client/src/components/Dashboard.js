import React, {useState, useEffect, useDebugValue} from 'react';
import Map from './Map';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

const Dashboard = ({db}) => {
    const [projects, setProjects] = useState([]);
    // useDebugValue(projects, 'those damn prjs');

    useEffect(() => {

        getDocs(collection(db, "projects"))
        .then(querySnapshot => {
            let p = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                let project = doc.data();
                project.projectId = doc.id;
                p.push(project);
            })
            setProjects(p);
        })
        .catch((error) => {
            if (error) {
                console.log('error at getDoc');
            } else {
                console.log('no error at getDoc');
            }
        });

        // for finding specific project using id => ex "0ZuPU7BuJNhfghZovESf"

        // querySnapshot.forEach((doc) => {
        //     console.log(doc.id, '=>', doc.data());
        // })

        // const docRef = doc(db, "projects", "0ZuPU7BuJNhfghZovESf");
        // docSnap = () => getDoc(docRef)
        // .then(docSnap => {
        //     if (docSnap.exists()) {
        //         console.log('projects-before:', projects);
        //       console.log("Document data:", docSnap.data());
        //       setProjects([...projects, docSnap.data()]);
        //       console.log('projects-after:', projects);
        //     } else {
        //       console.log("No such document!");
        //     }

        // })
        // .catch( (error) => {
        //     console.log('wtf');
        //     if (error) {
        //         console.log('error at getDoc');
        //     } else {
        //         console.log('no error at getDoc');
        //     }
        // });

    }, []);

    const addProject = () => {
        const sampleData = {
            someProp: "Ada "+(new Date()).toLocaleString()
        };

        addDoc(collection(db, "projects"), sampleData).then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            sampleData.projectId = docRef.id;
            setProjects([...projects, sampleData]);
        }).catch(e => {
            console.error("Error adding document: ", e);
        });
    }

    const deleteProject = (projectId) => {
        deleteDoc(doc(db, "projects", projectId))
        .then(() => {
            // console.log(`projectId: ${projectId} deleted`)
            if (window.confirm(`Are you certain you want to delete project: ${projectId} ?`)) {
                setProjects(projects.filter(p => p.projectId !== projectId));
              }
        })
        .catch((error) => {
            if (error) {
                console.log(error);
            } else {
                console.log('will this ever run?');
            }
        })
    }

    return <div>
        <h1>Dashboard</h1>

        <h3>Projects</h3>
        {projects.map(project =>
        <aside>
            <div>{project.someProp}
                <span style={{'textDecoration': 'underline'}} onClick={deleteProject.bind(null, project.projectId)}>delete</span>
            </div>

        </aside>)}

        <button type='button' onClick={addProject}>Add Project</button>
    </div>;
};

export default Dashboard;
