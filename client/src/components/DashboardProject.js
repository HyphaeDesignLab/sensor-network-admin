import React, {useEffect, useState, useRef} from 'react';
import InputString from "./InputString";

const sampleData = {
    "style": "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
    "user": "hyphae-lab",
    "token": "pk.eyJ1IjoiaHlwaGFlLWxhYiIsImEiOiJjazN4czF2M2swZmhkM25vMnd2MXZrYm11In0.LS_KIw8THi2qIethuAf2mw",
};

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

