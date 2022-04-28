import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";

const DashboardProject = ({project, saveProject, deleteProject}) => {
    const [projectInternal, setProjectInternal] = useState(project);
    useEffect(() => {
        setProjectInternal(project);
    }, [project]);

    return <div>
        <label>Name: <InputString onSave={saveProject} value={projectInternal.name} name='name' /></label>
        <label>Style: <InputString onSave={saveProject} value={projectInternal.style} name='style' /></label>

        <button type='button' onClick={deleteProject.bind(null, project.id)}>delete</button>
    </div>;
};

export default DashboardProject;

