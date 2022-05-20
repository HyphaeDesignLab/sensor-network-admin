import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";
import Maps from "./Maps";
import InputNumber from "./InputNumber";
import InputBoolean from "./InputBoolean";
import EditSensor from './EditSensor';

const DashboardProject = ({project, saveProject, deleteProject, setCurrentProject, setStep}) => {
    const [projectInternal, setProjectInternal] = useState(project);
    const [sensorStep, setSensorStep] = useState('');
    const [isNewSensor, setIsNewSensor] = useState(false);
    const [isExportShown, setExportShown] = useState(false);

    useEffect(() => {
        setProjectInternal(project);
    }, [project]);

    const addNewSensor = () => {
        setIsNewSensor(true);
        setSensorStep('edit');
    }

    const closeProject = () => {
      setCurrentProject(null);
      setStep('projects');
    }

    return <div>
        {!sensorStep ?
            <div>
                <label><InputString onSave={saveProject} value={projectInternal.name} path='name' type='string' /></label>
                <label><InputString onSave={saveProject} value={projectInternal.description} path='description' type='string' /></label>
                <label>
                    <strong>Sensors:</strong>
                    {project.sensors.map(sensor =>
                        <div>{sensor.label}<a href='#edit' onClick={setSensorStep.bind(null, 'edit')}>edit</a></div>
                        )}
                </label>
                <button onClick={addNewSensor}>Add New Sensor</button>
                <button onClick={closeProject}>Close Current Project</button>
                <button type='button' onClick={deleteProject.bind(null, project.id)}>delete</button>

                <button type='button' onClick={() => setExportShown(s => !s)}>export</button>

                {isExportShown && <div>
                    <textarea value={JSON.stringify(projectInternal)} readOnly></textarea>
                </div>}
            </div>
        : null }
        {sensorStep === 'edit' ? <EditSensor  setSensorStep={setSensorStep} isNewSensor={isNewSensor}/> : null}
    </div>;
};

export default DashboardProject;

