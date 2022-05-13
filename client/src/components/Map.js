import React, {useState, useEffect} from 'react';
import InputString from "./InputString";
import InputBoolean from "./InputBoolean";
import {doc, updateDoc} from "firebase/firestore";

const Map = ({isNew=false}) => {
    const handleAddNew = (itemFragment) => {
        const sampleData = {
            name: "A project "+(new Date()).toLocaleString(),
            style: "mapbox://styles/hyphae-lab/cl0lex1tp000115qtikua1z4e",
            user: "hyphae-lab",
            token: "pk.eyJ1IjoiaHlwaGFlLWxhYiIsImEiOiJjazN4czF2M2swZmhkM25vMnd2MXZrYm11In0.LS_KIw8THi2qIethuAf2mw",
            zoom: 14,
            layers: [ {
                "name": "Bio (People)",
                "children": [
                    {
                        "id": "bio-socialvulnerability-clip",
                        "name": "Social Vulnerability",
                        "initialVisibility": false,
                        "details": {
                            "attributeId": "socVulnRan",
                            "attributeName": "Social Vulnerability"
                        }
                    }
                ]
            }],
        };

        const newValues = [...internalValues];
        newValues.push(Object.values(itemFragment)[0]);
        setInternalValues(newValues);
        setIsAddingNew(false);
        onSave(itemFragment);
    };

    const saveProject = (projectFragment) => {
        if (!currentProject) {
            return;
        }

        const docRef = doc(db, "projects", currentProject.id);
        updateDoc(docRef, projectFragment)
            .then(response => {
                console.log(response)
                const projectsCopy = [...projects];
                const index = projectsCopy.findIndex(p => p.id === currentProject.id);
                projectsCopy[index] = {...currentProject, ...projectFragment};
                setProjects(projectsCopy);
            })
            .catch(error => {
                console.log('project update error '+error.message);
            });
    }

    return <div>
        <h1>Map</h1>

        <div>
            <label><InputString onSave={saveProject} value={projectInternal.name} path='name' type='string' /></label>
            <label><InputString onSave={saveProject} value={projectInternal.style} path='style' type='string' /></label>
            <label><Maps values={projectInternal.map} onSave={saveProject} path={'map.projects'} /></label>
            <label><InputString onSave={saveProject} value={projectInternal.zoom} path='zoom' type='number' /></label>
            <label><InputBoolean onSave={saveProject} value={projectInternal.default} path='default' /></label>
            <InputString value={item} path={`${path}.${i}`} onSave={onSave} />
        </div>
    </div>;
};

export default Map;