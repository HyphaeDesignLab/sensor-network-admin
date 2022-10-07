import React, { useState, useEffect, useDebugValue } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import Project from './Project';
import SensorTypes from './SensorTypes';

const Dashboard = ({firebaseApp}) => {
    const [sensorTypes, setSensorTypes] = useState([]);
    const [step, setStep] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [projectsError, setProjectsError] = useState(false);
    const [isProjectsLoading, setProjectsLoading] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {
        setProjectsLoading(true);
        Promise.any([initProjects(), initSensorTypes()])
            .finally(() => {
                setProjectsLoading(false);
            })
    }, []);

    const initProjects = () => {
        return new Promise((resolve, reject) => {
            const projectsRef = collection(firebaseApp.db, "sensor_networks");
            getDocs(projectsRef)
            .then(querySnapshot => {
                let p = [];
                querySnapshot.forEach((doc) => {
                    let project = doc.data();
                    project.id = doc.id;
                    p.push(project);
                })
                setProjects(p);
                resolve();
            })
            .catch((error) => {
                if (error.code === 'permission-denied') {
                    setProjectsError('You must have privilidges to access projects list');
                } else {
                    setProjectsError(error.message);
                }
                reject();
            });
        });
    };

    const initSensorTypes = () => {
        return new Promise((resolve, reject) => {
            const sensorTypesRef = collection(firebaseApp.db, "sensor_types");
            getDocs(sensorTypesRef)
                .then(querySnapshot => {
                    let typesArr = [];
                    querySnapshot.forEach((doc) => {
                        let type = doc.data();
                        type.id = doc.id;
                        typesArr.push(type);
                    })
                    setSensorTypes(typesArr);
                    resolve();
                })
                .catch((error) => {
                    if (error.code === 'permission-denied') {
                        setProjectsError('You must have privilidges to access sensor types');
                    } else {
                        setProjectsError(error.message);
                    }
                    reject();
                })
        });
    }

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

    const deleteProject = (id) => {
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
                const projectsCopy = [...projects];
                const index = projectsCopy.findIndex(p => p.id === currentProject.id);
                projectsCopy[index] = {...currentProject, ...projectFragment};
                setProjects(projectsCopy);
                setCurrentProject(projectsCopy[index]);
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

    const handleManageSensorTypes = (e) => {
        setCurrentProject({});
        setStep('sensor_types');
    }

    return <section>
        {step === 'projects' && <div>
            <h2>Projects</h2>
            {isProjectsLoading && <div className='spinning-loader'></div>}
            {!!projectsError && <div>{projectsError}</div>}
            {projects.map(project =>
                <div key={project.id} className={currentProject && project.id === currentProject.id ? 'current':''}>
                    <a href='#edit' onClick={editProject.bind(null, project)}>{project.name}</a>
                </div>
            )}
            <div><button className='link' onClick={handleAddProject}>+ Add Project</button></div>

            <h2>Other Settings</h2>
            <div><button className='link' onClick={handleManageSensorTypes}>Manage Sensor Types</button></div>
        </div>}
        {step === 'sensor_types' && <div>
            <div><button className={'link'} onClick={() => setStep('projects')}>&lt;&lt; all Projects</button></div>
            <SensorTypes title={<h2>Sensor Types</h2>} firebaseApp={firebaseApp} onUpdate={setSensorTypes} />
        </div>}
        {step === 'project' && <Project firebaseApp={firebaseApp} project={currentProject} addProject={addProject} saveProject={saveProject} deleteProject={deleteProject} setCurrentProject={setCurrentProject} setStep={setStep} sensorTypes={sensorTypes}/>}
    </section>;
};

export default Dashboard;
