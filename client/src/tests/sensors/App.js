import React, {useState, useEffect} from 'react';
import SensorIds from "../../components/sensors/SensorIds";

const sensorIds = Math.random() < .5 ? {
    deveui: 'asdasdasd',
    appeui: 'xvxvxcv',
    appkey: 'dfghdfgh'
} : null;

function App() {
    const onSave = () => {
        alert('Saved!');
    }
    return (
        <div>
            <SensorIds onSave={onSave} ids={sensorIds} />
        </div>
    );
}

export default App;
