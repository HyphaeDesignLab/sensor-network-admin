import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";
import Maps from "./Maps";
import InputNumber from "./InputNumber";
import InputBoolean from "./InputBoolean";
import Sensor from './Sensor';
import {addDoc, updateDoc, deleteDoc, doc, collection, query, where, getDocs} from "firebase/firestore";

import clientEnv from '../keys/client';
import ConfirmDialog from "./ConfirmDialog";

const noAwsProjectIdErrorMessage = 'Please set the Project AWS IOT ID in order to add sensors';
const Project = ({firebaseApp, project, saveProject, deleteProject, setCurrentProject, setStep, sensorTypes}) => {
    const [sensorToEdit, setSensorToEdit] = useState(false);

    const [sensors, setSensors] = useState([]);
    const [isSensorsLoading, setSensorsLoading] = useState(false);
    useEffect(() => {
        if (!project.id) {
            return; // no need for fetching sensors of new project
        }
        const sensorsRef = collection(firebaseApp.db, "sensors");
        // Create a query against the collection.
        const q = query(sensorsRef, where("network", "==", project.id));
        setSensorsLoading(true);
        getDocs(q).then(qSnapshot => {
            const sensors_ = [];
            qSnapshot.forEach(doc => {
                const sensor = doc.data();
                sensor.id = doc.id;
                sensors_.push(sensor);
            });
            setSensors(sensors_);
            setSensorsLoading(false);
        });
    }, [project]);

    const addNewSensor = () => {
        if (!project.aws_iot_id) {
            alert(noAwsProjectIdErrorMessage);
            return;
        }
        setSensorToEdit({});
    }

    const closeProject = () => {
      setCurrentProject(null);
      setSensorToEdit(false);
      setStep('projects');
    }

    const saveSensor = (sensor) => {
        sensor.network = project.id;
        if (!sensor.id) {
            return addDoc(collection(firebaseApp.db, "sensors"), sensor).then(docRef => {
                console.log("Sensor written with ID: ", docRef.id);
                sensor.id = docRef.id;
                setSensors([...sensors, sensor]);
                setSensorToEdit(sensor);
            }).catch(e => {
                console.error("Error adding sensor: ", e);
            });
        } else {
            const sensorDoc = doc(firebaseApp.db, "sensors", sensor.id);
            return updateDoc(sensorDoc, sensor).then(response => {
                const sensorsCopy = sensors.map(s => s.id === sensor.id ? {...sensor}:s);
                setSensors(sensorsCopy);
                setSensorToEdit(sensor);
            }).catch(e => {
                console.error("Error editing sensor: ", e.message);
            });
        }
    }

    // Add a deleted sensor note/error message + timeout to disappear (and clear timeout on UNmount)
    const [deletedSensorNote, setDeletedSensorNote] = useState(false);
    const deletedSensorNoteTimeout = useRef(0);
    useEffect(() => {
        if (deletedSensorNoteTimeout.current) {
            clearTimeout(deletedSensorNoteTimeout.current);
        }
    }, []);

    const deleteSensor = (sensor) => {
        setDeletedSensorNote(false);
        deleteSensorFromAwsIot(sensor);
        const sensorDoc = doc(firebaseApp.db, "sensors", sensor.id);
        return deleteDoc(sensorDoc, sensor).then(response => {
            setSensors(sensors.filter(s => s.id !== sensor.id));
            setSensorToEdit(null);
            setDeletedSensorNote(`Deleted sensor ${sensor.name} (id: ${sensor.id.substr(0,7)})`);
            deletedSensorNoteTimeout.current = setTimeout(() => {
                setDeletedSensorNote(false);
            }, 15000);
        }).catch(e => {
            setDeletedSensorNote("Error deleting sensor: " + e.message);
        });
    };

    const addSensorToAwsIot = (sensor) => {
        return firebaseApp.auth.currentUser.getIdToken().then(authToken => {
            if (!authToken) {
                console.log('visitor not logged in');
                return Promise.reject('visitor not logged in')
            }

            const body = {
                deveui: sensor.ids.deveui,
                appeui: sensor.ids.appeui,
                appkey: sensor.ids.appkey,
                appkeu: sensor.ids.appkey,
                project: project.aws_iot_id,
                type: sensor.type,
                name: sensor.name
            };
            const host = `${clientEnv.URLS_AWS_CLI_API__PROTOCOL}://${clientEnv.URLS_AWS_CLI_API__HOST}:${clientEnv.URLS_AWS_CLI_API__PORT}`;
            const query = Object.entries(body).map(e => `${e[0]}=${encodeURIComponent(e[1])}`).join('&');
            return fetch(`${host}/sensor/add?${query}`, {
                method: 'get',
                mode: 'cors', // no-cors, *cors, same-origin
            }).then(resp => resp.json()).then(json => {
                if (!!json.error) {
                    throw new Error(json.error);
                }
                if (!json.id) {
                    throw new Error('no AWS ID returned');
                }
                return json.id;
            });
        });
    }
    const deleteSensorFromAwsIot = (sensor) => {
        if (!sensor.aws_iot_id) {
            return Promise.resolve('Sensor has not AWS IOT ID to un-register');
        }

        return firebaseApp.auth.currentUser.getIdToken().then(authToken => {
            if (!authToken) {
                console.log('visitor not logged in');
                return Promise.reject('visitor not logged in')
            }

            const host = `${clientEnv.URLS_AWS_CLI_API__PROTOCOL}://${clientEnv.URLS_AWS_CLI_API__HOST}:${clientEnv.URLS_AWS_CLI_API__PORT}`;
            return fetch(`${host}/sensor/delete?id=${sensor.aws_iot_id}`, {
                method: 'get',
                mode: 'cors', // no-cors, *cors, same-origin
            }).then(resp => resp.json()).then(json => {
                if (!!json.error) {
                    throw new Error(json.error);
                }
                return json;
            });
        });
    };

    const cancelSaveSensor = () => {
        setSensorToEdit(false);
    };

    const [isConfirmProjectDeleteShown, setConfirmProjectDeleteShown] = useState(false);
    const confirmProjectDelete = () => {
        deleteProject(project.id);
    };

    return <section>
        <div><a href='#' onClick={closeProject}>&lt;&lt; all Projects</a></div>
        <h2>Project "{!project.id ? 'Untitled' : project.name}"</h2>
        {!sensorToEdit ?
            <React.Fragment>
                <section>
                    <h3>General</h3>
                    <InputString onSave={saveProject} value={project.id ? project.name : 'New Project'} path='name' type='string' isOnlyEditMode={!project.id} />
                    <InputString onSave={saveProject} value={project.description} path='description' type='string' />
                    <InputString onSave={saveProject} value={project.aws_iot_id} path='aws_iot_id' type='string' />
                    <div>
                        (AWS IOT ID is used to calculate the wireless destination topic: &lt;projectAwsIotId&gt;__&lt;sensorType&gt;)
                        {!project.aws_iot_id && <div className='error'>{noAwsProjectIdErrorMessage}</div>}
                    </div>
                </section>

                {!!project.id && <section>
                    <h3>Sensors:</h3>
                    {isSensorsLoading && <div className='spinning-loader'></div>}
                    {sensors && !sensors.length && <div>(no sensors)</div>}
                    <div style={{marginBottom: '10px'}}>
                        {!!deletedSensorNote &&
                            <div className='error'>{deletedSensorNote}</div>
                        }
                        <button type='button' onClick={addNewSensor} className='link'>Add New Sensor</button>
                    </div>
                    {sensors && sensors.map(sensor =>
                        <div key={sensor.id}>{sensor.name} (id: {sensor.id.substr(0,7)})<a href='#edit' onClick={setSensorToEdit.bind(null, sensor)}>edit</a></div>
                    )}
                </section>}

                <section>
                    <h3>Manage</h3>
                    <div>
                        {isConfirmProjectDeleteShown && <ConfirmDialog
                            onCancel={() => setConfirmProjectDeleteShown(false)}
                            onConfirm={confirmProjectDelete}
                            title='Delete Project?'
                            text='Do you really want to delete this project. This will NOT delete sensors or un-register them from AWS IOT. This can NOT be UNDONE.'
                            confirmText='Delete'
                        ></ConfirmDialog>}
                        <button className={'link'} style={{color: 'red'}} onClick={() => setConfirmProjectDeleteShown(true)}>(x) delete project</button>
                    </div>
                </section>
            </React.Fragment>
            :
            <Sensor sensor={sensorToEdit} onSave={saveSensor} onDelete={deleteSensor}
                    onSaveToAws={addSensorToAwsIot} onDeleteFromAws={deleteSensorFromAwsIot}
                    onCancel={cancelSaveSensor} sensorTypes={sensorTypes}/>
            }
    </section>;
};

export default Project;

