import React, { useState, useEffect, useDebugValue } from 'react';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

import DashboardProject from './DashboardProjectTest';
import AddProject from './AddProject';

const dummyData = [
  {
    name: 'Project Name',
    description: 'I\'m the description of this project',
    // id: '',
    sensors: [
        {
            id: 'asdf-123',
        },
        {
            id: 'gehr-546',
        },
    ],
  },
  {
    name: 'Second Project',
    description: 'I describe stuff',
    // id: '',
    sensors: [
      {
        id: 'gtjh-5679',
      }
    ]
  }
];


const Dashboard = ({db}) => {
    const [step, setStep] = useState('projects');
    const [projects, setProjects] = useState([]);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {

      // setProjects(dummyData);

        getDocs(collection(db, "sensor_networks"))
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
                console.log(error);
            } else {
                console.log('no error at getDoc');
            }
        });
    }, []);

    const addProject = (project) => {
        addDoc(collection(db, "sensor_networks"), project).then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            project.id = docRef.id;
            setProjects([...projects, project]);
            console.log(project);
            setCurrentProject(project);
        }).catch(e => {
            console.error("Error adding document: ", e);
        }).finally(() => {
          setStep('project');
        }

        );
    }

    const deleteProject = (id, e) => {
        e.preventDefault();

        if (!window.confirm(`Are you certain you want to delete project: ${projects.find(project => project.id === id).name} ?`)) {
            return;
        }

        deleteDoc(doc(db, "sensor_networks", id))
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
              setStep('projects');
              setCurrentProject(null); // in case we were editing; let's set current to none after delete
            })

    }

    const editProject = (project, e) => {
        e.preventDefault();

        if (!!currentProject && currentProject.id === project.id) {
            return;
        }
        setCurrentProject(project);
        setStep('project');
    }


    const saveProject = (projectFragment) => {
        if (!currentProject) {
            return;
        }

        const docRef = doc(db, "sensor_networks", currentProject.id);
        console.log('docRef:', docRef);
        console.log('id:', currentProject.id);
        console.log('projectGragment:', projectFragment);
        updateDoc(docRef, projectFragment)
            .then(response => {
                console.log(response);
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

        {step === 'projects' ? <h3>Projects</h3> : null}
        {step === 'projects' ? projects.map(project =>
            <div key={project.id} className={currentProject && project.id === currentProject.id ? 'current':''}>
                <a href='#edit' onClick={editProject.bind(null, project)}>{project.name}</a> &nbsp;
                <a href='#delete' onClick={deleteProject.bind(null, project.id)}>delete</a>
            </div>) : null }

        {step === 'projects' ? <button type='button' onClick={setStep.bind(null, 'addProject')}>Add Project</button> : null}

        {step === 'addProject' ? <AddProject setStep={setStep} setCurrentProject={setCurrentProject} addProject={addProject}/> : null}

        {step === 'project' ? <DashboardProject project={currentProject} addProject={addProject} saveProject={saveProject} deleteProject={deleteProject} setCurrentProject={setCurrentProject} setStep={setStep}/> : null}
    </div>;
};

export default Dashboard;
