import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";
import MapProjects from "./MapProjects";
import InputNumber from "./InputNumber";
import InputBoolean from "./InputBoolean";

const DashboardProject = ({project, saveProject, deleteProject, setCurrentProject}) => {
    const [projectInternal, setProjectInternal] = useState(project);
    useEffect(() => {
        setProjectInternal(project);
    }, [project]);

    return <div>
        <label><InputString onSave={saveProject} value={projectInternal.name} name='name' type='string' /></label>
        <label><InputString onSave={saveProject} value={projectInternal.style} name='style' type='string' /></label>
        <label><MapProjects values={projectInternal.map} onSave={saveProject} name={'map.projects'} /></label>
        <label><InputString onSave={saveProject} value={projectInternal.zoom} name='zoom' type='number' /></label>
        <label><InputBoolean onSave={saveProject} value={projectInternal.default} name='default' /></label>

        <button onClick={setCurrentProject.bind(null, null)}>Close Current Project</button>
        <button type='button' onClick={deleteProject.bind(null, project.id)}>delete</button>
    </div>;
};

export default DashboardProject;

