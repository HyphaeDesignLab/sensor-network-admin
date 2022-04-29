import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";
import InputNumber from "./InputNumber";
import InputBoolean from "./InputBoolean";

const DashboardProject = ({project, saveProject, deleteProject}) => {
    const [projectInternal, setProjectInternal] = useState(project);
    useEffect(() => {
        setProjectInternal(project);
    }, [project]);

    return <div>
        <label>Name: <InputString onSave={saveProject} value={projectInternal.name} name='name' /></label>
        <label>Style: <InputString onSave={saveProject} value={projectInternal.style} name='style' /></label>
        <label>Zoom: <InputNumber onSave={saveProject} value={projectInternal.zoom} name='zoom' /></label>
        <label>Default: <InputBoolean onSave={saveProject} value={projectInternal.default} name='default' /></label>

        <button type='button' onClick={deleteProject.bind(null, project.id)}>delete</button>
    </div>;
};

export default DashboardProject;

