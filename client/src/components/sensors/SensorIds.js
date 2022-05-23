import React, {useState, useEffect} from 'react';
import SensorOcrParser from "./SensorOcrParser";
import InputString from "../InputString";


const sensorIdProps = {
    deveui: {title: 'Dev EUI'},
    appeui: {title: 'App EUI'},
    appkey: {title: 'App Key'}
};

const SensorIdsComponent = ({ids, onSave}) => {
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
    const onEditClick = () => {
        setEditing(true);
    };


    return <div>
        {!isEditing ?
            <React.Fragment>
                {!!ids_ && Object.keys(sensorIdProps).map(sensorId =>
                <div key={sensorId}>
                    <span>{sensorIdProps[sensorId].title}</span>:
                    <InputString path={sensorId} value={ids_[sensorId]} type={'text'} onSave={onEditSaved} hasLabel={false}
                                 inputStyle={{padding: '5px', fontFamily: 'monospace, sans-serif', letterSpacing: '3px'}}
                    />
                </div>)}
                <button type='button' onClick={onEditClick}>{!!ids_ ? 'Update Ids' : 'Add Ids'}</button>
            </React.Fragment>
            :
            <SensorOcrParser onConfirmed={onOcrConfirmed} />
        }
    </div>;
};

export default SensorIdsComponent;