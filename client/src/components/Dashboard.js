import React, { useState, useEffect, useDebugValue } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import Project from './Project';

const Dashboard = ({firebaseApp}) => {
    const [step, setStep] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [isProjectsLoading, setProjectsLoading] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {
        setProjectsLoading(true);
        getDocs(collection(firebaseApp.db, "sensor_networks"))
        .then(querySnapshot => {
            let p = [];
            querySnapshot.forEach((doc) => {
                let project = doc.data();
                project.id = doc.id;
                p.push(project);
            })
            setProjects(p);
            setProjectsLoading(false);
        })
        .catch((error) => {
            console.log('Error getting project', error);
        });
    }, []);

    const addProject = (project) => {
        addDoc(collection(firebaseApp.db, "sensor_networks"), project).then(docRef => {
            project.id = docRef.id;
            setProjects([...projects, project]);
            setCurrentProject(project);
        }).catch(e => {
            console.error("Error adding project", e);
        }).finally(() => {
          setStep('project');
        });
    }

    const deleteProject = (id, e) => {
        e.preventDefault();

        if (!window.confirm(`Are you certain you want to delete project: ${projects.find(project => project.id === id).name} ?`)) {
            return;
        }

        deleteDoc(doc(firebaseApp.db, "sensor_networks", id))
            .then(() => {
                setProjects(projects.filter(p => p.id !== id));
            })
            .catch((error) => {
                console.log('Error deleting project', error);
            })
            .finally(() => {
              setStep('projects');
              setCurrentProject(null); // in case we were editing; let's set current to none after delete
            })

    }

    const saveProject = (projectFragment) => {
        if (!currentProject) {
            return;
        }

        if (!currentProject.id) {
            addProject(projectFragment);
            return;
        }

        const docRef = doc(firebaseApp.db, "sensor_networks", currentProject.id);
        updateDoc(docRef, projectFragment)
            .then(response => {
                console.log(response);
                const projectsCopy = [...projects];
                const index = projectsCopy.findIndex(p => p.id === currentProject.id);
                projectsCopy[index] = {...currentProject, ...projectFragment};
                setProjects(projectsCopy);
            })
            .catch(error => {
                console.log('project update error ', error.message);
            });
    }


    const editProject = (project, e) => {
        e.preventDefault();

        if (!!currentProject && currentProject.id === project.id) {
            return;
        }
        setCurrentProject(project);
        setStep('project');
    }


    const handleAddProject = (e) => {
        e.preventDefault();

        setCurrentProject({});
        setStep('project');
    }

    return <div>
        <h2>Projects</h2>
        {step === 'projects' && <div>
            {isProjectsLoading && <div className='spinning-loader'></div>}
            {projects.map(project =>
                <div key={project.id} className={currentProject && project.id === currentProject.id ? 'current':''}>
                    <a href='#edit' onClick={editProject.bind(null, project)}>{project.name}</a> &nbsp;
                    <a href='#delete' onClick={deleteProject.bind(null, project.id)}>delete</a>
                </div>
            )}
            <div><a href='#add' onClick={handleAddProject}>+ Add Project</a></div>
        </div>}

        {step === 'project' && <Project firebaseApp={firebaseApp} project={currentProject} addProject={addProject} saveProject={saveProject} deleteProject={deleteProject} setCurrentProject={setCurrentProject} setStep={setStep}/>}
    </div>;
};

export default Dashboard;
