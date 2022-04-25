import React, {useRef} from 'react';

const sampleData = {
    "style": "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
    "user": "hyphae-lab",
    "token": "pk.eyJ1IjoiaHlwaGFlLWxhYiIsImEiOiJjazN4czF2M2swZmhkM25vMnd2MXZrYm11In0.LS_KIw8THi2qIethuAf2mw",
};

const DashboardProject = ({project, saveProject, deleteProject}) => {
    const styleInputEl = useRef(project.style);
    const userInputEl = useRef(project.user);
    const tokenInputEl = useRef(project.token);


    return <div>
        {project.name}
        <label>Style: <input ref={styleInputEl}/></label>
        <label>User: <input ref={userInputEl}/></label>
        <label>Token: <input ref={tokenInputEl}/></label>

        <button button='button' onClick={saveProject.bind(null, project)}>save</button>

        <button button='button' onClick={deleteProject.bind(null, project.id)}>delete</button>
    </div>;
};

export default DashboardProject;

