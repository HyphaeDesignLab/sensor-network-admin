// Need rethinking of how map.projects looks like


import React, {useState, useEffect} from 'react';
import InputString from './InputString';

const MapProjects = ({values, onSave, name}) => {
    const [internalValues, setInternalValues] = useState([]);
    useEffect(() => {
        if (!values || typeof values.projects !== 'object' ) {
            setInternalValues([]);
        } else {
            let a =[];
            for (let keys in values.projects) {
                a.push(values.projects[keys]);
            }
            setInternalValues(a);
        }
    }, [values]);

    const [isAddingNew, setIsAddingNew] = useState(false);

    const handleNewClick = () => {
        setIsAddingNew(s => !s);
    };
    const handleAddNew = (itemFragment) => {
        const newValues = [...internalValues];
        newValues.push(Object.values(itemFragment)[0]);
        setInternalValues(newValues);
        setIsAddingNew(false);
        onSave(itemFragment);
    };
    return <div>
        {!!name && <strong>{name}: </strong>}
        {internalValues.map((item,i) =>
        <div>
            <InputString value={item} name={`${name}.${i}`} onSave={onSave} />
        </div>
        )}
        <div>
            {isAddingNew ?
                <span>
                    New Value:
                    <InputString value={'new value'} name={`${name}.${internalValues.length}`} onSave={handleAddNew} isOnlyEditMode={true} onCancel={handleNewClick}/>
                </span> :
                <button type='button' onClick={handleNewClick}>+ New</button>
            }
        </div>
    </div>;
};

export default MapProjects;