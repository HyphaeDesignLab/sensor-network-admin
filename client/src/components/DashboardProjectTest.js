import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";
import Maps from "./Maps";
import InputNumber from "./InputNumber";
import InputBoolean from "./InputBoolean";
import AddSensor from "./AddSensor";

const DashboardProject = ({project, saveProject, deleteProject, setCurrentProject, setStep}) => {
    const [projectInternal, setProjectInternal] = useState(project);
    const [addingSensor, setAddingSensor] = useState(false);
    useEffect(() => {
        setProjectInternal(project);
    }, [project]);

    const [isExportShown, setExportShown] = useState(false);

    const closeProject = () => {
      setCurrentProject(null);
      setStep('projects');
    }

    return <div>
        <label><InputString onSave={saveProject} value={projectInternal.name} path='name' type='string' /></label>
        <label><InputString onSave={saveProject} value={projectInternal.description} path='description' type='string' /></label>
        <label><Maps values={projectInternal.sensors} onSave={saveProject} path={'sensors'} /></label>

        {/* <label><InputString onSave={saveProject} value={projectInternal.style} path='style' type='string' /></label>
        <label><Maps values={projectInternal.map} onSave={saveProject} path={'map.projects'} /></label>
        <label><InputString onSave={saveProject} value={projectInternal.zoom} path='zoom' type='number' /></label>
        <label><InputBoolean onSave={saveProject} value={projectInternal.default} path='default' /></label> */}

        <button onClick={setStep.bind(null, 'addSensor')}>Add New Sensor</button>
        {addingSensor ? <AddSensor /> : null}
        <button onClick={closeProject}>Close Current Project</button>
        <button type='button' onClick={deleteProject.bind(null, project.id)}>delete</button>

        <button type='button' onClick={() => setExportShown(s => !s)}>export</button>

        {isExportShown && <div>
            <textarea value={JSON.stringify(projectInternal)} readOnly></textarea>
        </div>}
    </div>;
};

export default DashboardProject;

