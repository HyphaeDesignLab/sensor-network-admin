import React, {useState, useEffect, useDebugValue} from 'react';
import DashboardProject from './DashboardProject';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

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

    const deleteProject = (id, e) => {
        e.preventDefault();

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

    const editProject = (project, e) => {
        e.preventDefault();

        if (!!currentProject && currentProject.id === project.id) {
            return;
        }
        setCurrentProject(project);
    }


    const saveProject = (projectFragment) => {
        if (!currentProject) {
            return;
        }

        const docRef = doc(db, "projects", currentProject.id);
        updateDoc(docRef, projectFragment)
            .then(response => {
                console.log(response)
                const projectsCopy = [...projects];
                const index = projectsCopy.findIndex(p => p.id === currentProject.id);
                projectsCopy[index] = {...currentProject, ...projectFragment};
                setProjects(projectsCopy);
            })
            .catch(error => {
                console.log('project update error '+error.message);
            });
    }

    return <div>
        <h1>Dashboard</h1>

        <h3>Projects</h3>
        {projects.map(project =>
            <div key={project.id} className={currentProject && project.id === currentProject.id ? 'current':''}>
                <a href='#edit' onClick={editProject.bind(null, project)}>{project.name}</a> &nbsp;
                <a href='#delete' onClick={deleteProject.bind(null, project.id)}>delete</a>
            </div>)}

        <button type='button' onClick={addProject}>Add Project</button>

        {!!currentProject && <DashboardProject project={currentProject} saveProject={saveProject} deleteProject={deleteProject} setCurrentProject={setCurrentProject}/>}
    </div>;
};

export default Dashboard;
