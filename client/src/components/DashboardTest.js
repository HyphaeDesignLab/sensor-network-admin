import React, {useState, useEffect, useDebugValue} from 'react';
import DashboardProject from './DashboardProjectTest';
import { collection, getDocs, addDoc, doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import AddSensor from './AddSensor';

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
    // useDebugValue(projects, 'those damn prjs');

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

    const addProject = () => {
        const sampleData = {
            name: "A project "+(new Date()).toLocaleString(),
            style: "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
            user: "hyphae-lab",
            token: "pk.eyJ1IjoiaHlwaGFlLWxhYiIsImEiOiJjazN4czF2M2swZmhkM25vMnd2MXZrYm11In0.LS_KIw8THi2qIethuAf2mw",
            zoom: 14,
            clientId: Math.floor(Math.random() * 1000 * 1000 * 1000).toString(16)
        };

        addDoc(collection(db, "projects"), sampleData).then(docRef => {
            console.log("Document written with ID: ", docRef.id);
            sampleData.id = docRef.id;
            setProjects([...projects, sampleData]);

            // call the backend to export to file
            // dev:
            const backendUrlBase = 'http://localhost:5001/geo-dashboard-347901/us-central1';
            // prod:
            //const backendUrlBase = 'http://???/geo-dashboard-347901/us-central1';
            axios(backendUrlBase + '/export-project?projectId='+sampleData.id);
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

        <button type='button' onClick={addProject}>Add Project</button>

        {step === 'project' ? <DashboardProject project={currentProject} saveProject={saveProject} deleteProject={deleteProject} setCurrentProject={setCurrentProject} setStep={setStep}/> : null}

        {step === 'addSensor' ? <AddSensor setStep={setStep}/> : null}
    </div>;
};

export default Dashboard;
