import React, {useState, useEffect, useDebugValue} from 'react';
import DashboardProject from './DashboardProject';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc } from 'firebase/firestore';

const Dashboard = ({db}) => {
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);
    // useDebugValue(projects, 'those damn prjs');

    useEffect(() => {

        getDocs(collection(db, "projects"))
        .then(querySnapshot => {
            let p = [];
            querySnapshot.forEach((doc) => {
                // console.log(doc.id, '=>', doc.data());
                let project = doc.data();
                project.id = doc.id;
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
            name: "A project "+(new Date()).toLocaleString(),
            style: "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
            user: "hyphae-lab",
            token: "pk.eyJ1IjoiaHlwaGFlLWxhYiIsImEiOiJjazN4czF2M2swZmhkM25vMnd2MXZrYm11In0.LS_KIw8THi2qIethuAf2mw",
            zoom: 14
        };

        addDoc(collection(db, "projects"), sampleData).then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            sampleData.id = docRef.id;
            setProjects([...projects, sampleData]);
        }).catch(e => {
            console.error("Error adding document: ", e);
        });
    }

    const deleteProject = (id) => {
        if (!window.confirm(`Are you certain you want to delete project: ${projects.find(project => project.id === id).name} ?`)) {
            return;
        }

        deleteDoc(doc(db, "projects", id))
            .then(() => {
                // console.log(`id: ${id} deleted`)
                setProjects(projects.filter(p => p.id !== id));
            })
            .catch((error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('will this ever run?');
                }
            })
            .finally(() => {
                setCurrentProject(null); // in case we were editing; let's set current to none after delete
            })

    }

    const editProject = (project) => {
        if (!!currentProject && currentProject.id === project.id) {
            return;
        }
        setCurrentProject(project);
    }


    const saveProject = (project) => {
        // save the data to sb
        // do something with with project data

        // set current project to nothing
        setCurrentProject(null);
    }

    return <div>
        <h1>Dashboard</h1>

        <h3>Projects</h3>
        {projects.map(project =>
            <div key={project.id}>
                <a href='#' onClick={editProject.bind(null, project)}>{project.name}</a> &nbsp;
                <span style={{'textDecoration': 'underline'}} onClick={deleteProject.bind(null, project.id)}>delete</span>
            </div>)}

        <button type='button' onClick={addProject}>Add Project</button>

        {!!currentProject && <DashboardProject project={currentProject} saveProject={saveProject} deleteProject={deleteProject} />}
    </div>;
};

export default Dashboard;
