import React, {useState, useEffect} from 'react';
import SensorOcrParser from "./SensorOcrParser";

const SensorIdsComponent = ({ids, onSave}) => {
    const [ids_, setIds] = useState({});
    const onOcrConfirmed = (ids__) => {
        setIds(ids__);
        saveToAws(ids__);
    };

    const saveToAws = (sensorIds__) => {
        Promise.resolve()
            .then(() => {
                onSave(ids_);
            })
    }
    return <div>
        <SensorOcrParser onConfirmed={onOcrConfirmed} />
    </div>;
};

export default SensorIdsComponent;