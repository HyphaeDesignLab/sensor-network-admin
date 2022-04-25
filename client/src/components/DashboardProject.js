import React, {useEffect, useState, useRef} from 'react';

const sampleData = {
    "style": "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
    "user": "hyphae-lab",
    "token": "pk.eyJ1IjoiaHlwaGFlLWxhYiIsImEiOiJjazN4czF2M2swZmhkM25vMnd2MXZrYm11In0.LS_KIw8THi2qIethuAf2mw",
};

const DashboardProject = ({project, saveProject, deleteProject}) => {
    const [project_, setProject] = useState(project);
    useEffect(() => {
        setProject(project);
    }, [project]);

    const styleInputEl = useRef(project.style);
    const userInputEl = useRef(project.user);
    const tokenInputEl = useRef(project.token);

    const onInputChange = e => {
        setProject({...project_, [e.target.name]: e.target.value});
    };
    const onInputFocus = e => {
        e.target.select();
    };

    const onSaveInternal = () => {
        saveProject(project_);
    }
    return <div>
        {project.name}
        <label>Style: <input name='style' ref={styleInputEl} value={project_.style} onChange={onInputChange} onFocus={onInputFocus} /></label>
        <label>User: <input name='user' ref={userInputEl} value={project_.user} onChange={onInputChange} onFocus={onInputFocus} /></label>
        <label>Token: <input name='token' ref={tokenInputEl} value={project_.token} onChange={onInputChange} onFocus={onInputFocus} /></label>

        <button button='button' onClick={onSaveInternal}>save</button>

        <button button='button' onClick={deleteProject.bind(null, project.id)}>delete</button>
    </div>;
};

export default DashboardProject;

