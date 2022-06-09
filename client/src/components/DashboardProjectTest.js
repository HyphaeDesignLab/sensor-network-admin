import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";
import Maps from "./Maps";
import InputNumber from "./InputNumber";
import InputBoolean from "./InputBoolean";
import EditSensor from './EditSensor';
import {addDoc, updateDoc, deleteDoc, doc, collection} from "firebase/firestore";

const DashboardProject = ({db, project, saveProject, deleteProject, setCurrentProject, setStep}) => {
    const [projectInternal, setProjectInternal] = useState(project);
    const [sensorToEdit, setSensorToEdit] = useState(false);
    const [isExportShown, setExportShown] = useState(false);

    const [sensors, setSensors] = useState([]);
    useEffect(() => {
        setProjectInternal(project);
    }, [project]);

    const addNewSensor = () => {
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
            addDoc(collection(db, "sensors"), sensor).then(docRef => {
                console.log("Sensor written with ID: ", docRef.id);
                sensor.id = docRef.id;
                setSensors([...sensors, sensor]);
            }).catch(e => {
                console.error("Error adding sensor: ", e);
            });
        } else {
            const sensorDoc = doc(db, "sensors", sensor.id);
            updateDoc(sensorDoc, sensor).then(response => {
                console.log(response);
                const sensorsCopy = sensors.map(s => s.id === sensor.id ? {...sensor}:s);
                setSensors(sensorsCopy);
            }).catch(e => {
                console.error("Error editing sensor: ", e.message);
            });
        }
    }

    const cancelSaveSensor = () => {
        setSensorToEdit(false);
    };

    return <div>
        {!sensorToEdit ?
            <div>
                <label><InputString onSave={saveProject} value={projectInternal.name} path='name' type='string' /></label>
                <label><InputString onSave={saveProject} value={projectInternal.description} path='description' type='string' /></label>
                <label>
                    <strong>Sensors:</strong>
                    {project.sensors ? project.sensors.map(sensor =>
                        <div>{sensor.label}<a href='#edit' onClick={setSensorStep.bind(null, 'edit')}>edit</a></div>
                        ) : null}
                </label>
                <button onClick={addNewSensor}>Add New Sensor</button>
                <button onClick={closeProject}>Close Current Project</button>
                <button type='button' onClick={deleteProject.bind(null, project.id)}>delete</button>

                <button type='button' onClick={() => setExportShown(s => !s)}>export</button>

                {isExportShown && <div>
                    <textarea value={JSON.stringify(projectInternal)} rows={'15'} cols={'40'} readOnly></textarea>
                </div>}
            </div>
        : <EditSensor sensor={sensorToEdit} onSave={saveSensor} onCancel={cancelSaveSensor} />}
    </div>;
};

export default DashboardProject;

