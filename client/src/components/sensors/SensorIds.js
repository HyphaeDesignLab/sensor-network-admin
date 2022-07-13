import React, {useState, useEffect} from 'react';
import SensorOcrParser from "./SensorOcrParser";
import InputString from "../InputString";


const sensorIdProps = {
    deveui: {title: 'Dev EUI'},
    appeui: {title: 'App EUI'},
    appkey: {title: 'App Key'}
};

const SensorIds = ({ids, onSave, headingLevel=3}) => {
    const Hx = 'h'+headingLevel;
    const [ids_, setIds] = useState(null);

    const onEditSaved = (ids__) => {
        setIds({ids_, ...ids__});
        saveToAws(ids__);
        setEditing(false);
    }

    const onOcrConfirmed = (ids__) => {
        setIds(ids__);
        saveToAws(ids__);
        setEditing(false);
    };

    useEffect(() => {
        if (!!ids) {
            setIds(ids);
        }
    }, [ids]);

    const saveToAws = (ids__) => {
        Promise.resolve()
            .then(() => {
                onSave(ids__);
            });
    }

    const [isEditing, setEditing] = useState(false);
    const handleEditClick = () => {
        setEditing(true);
    };

    const cancelEdit = () => {
        setEditing(false);
    };


    return <div>
        {!isEditing ?
            <React.Fragment>
                {!!ids_ && Object.keys(ids_).map(sensorId =>
                <div key={sensorId}>
                    <span>{sensorIdProps[sensorId].title}</span>:
                    <InputString path={sensorId} value={ids_[sensorId]} type={'text'} onSave={onEditSaved} hasLabel={false}
                                 inputStyle={{padding: '5px', fontFamily: 'monospace, sans-serif', letterSpacing: '3px'}}
                    />
                </div>)}
                <button type='button' onClick={handleEditClick}>{!!ids_ ? 'Update Ids' : 'Add Ids'}</button>
            </React.Fragment>
            :
            <SensorOcrParser onConfirm={onOcrConfirmed} onCancel={cancelEdit}/>
        }
    </div>;
};

export default SensorIds;