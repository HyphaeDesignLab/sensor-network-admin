// Need rethinking of how map.projects looks like
import React, {useState, useEffect} from 'react';

import InputString from './InputString';
import { humanReadableTitle } from '../helpers.js';

const Maps = ({values, onSave, onAdd, path}) => {
    const [internalValues, setInternalValues] = useState([]);
    useEffect(() => {
        console.log('hi');
        if (!values || typeof values !== 'object' ) {
        console.log('lol');
            setInternalValues([]);
        } else if (Array.isArray(values)) {
            setInternalValues(values);
            console.log(values)
            // below: values.projects will most likely need to be changed to be values, and change where Maps is implemeted and the inputs being values.projects instraed of values, if applicable
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
        {!!path && <strong>{humanReadableTitle(path)}: </strong>}
        {/* {internalValues.map((item,i) =>
        <div>
            <InputString value={item} path={`${path}.${i}`} onSave={onSave} />
        </div>
        )} */}
        {internalValues.map((item, i) =>
        // console.log(item, i)
            <div>
                <InputString value={item.label} onSave={onSave} />
            </div>
        )}
        {/* <div>
            {isAddingNew ?
                <span>
                    New Value:
                    <InputString value={'new value'} path={`${path}.${internalValues.length}`} onSave={handleAddNew} isOnlyEditMode={true} onCancel={handleNewClick}/>
                </span> :
                <button type='button' onClick={handleNewClick}>+ New</button>
            }
        </div> */}
    </div>;
};

export default Maps;