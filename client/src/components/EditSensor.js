import React, { useEffect, useState } from 'react';

import RegisterSensor from './RegisterSensor';
import InstallSensor from './InstallSensor';

const EditSensor = ({setSensorStep, isNewSensor, setIsNewSensor, saveProject}) => {
  const [editStep, setEditStep] = useState('');

  useEffect(() => {
    isNewSensor ? setEditStep('register') : null;
  }, []);

  return <div>
    {!editStep ?
      <div>
        <button onClick={setEditStep.bind(null, 'register')}>Register Sensor</button>
        <button onClick={setEditStep.bind(null, 'install')}>Install Sensor</button>
      </div>
      : null}
    {editStep === 'register' ? <RegisterSensor setEditStep={setEditStep} isNewSensor={isNewSensor} setIsNewSensor={setIsNewSensor}/> : null}
    {editStep === 'install' ? <InstallSensor  setEditStep={setEditStep} saveProject={saveProject}/> : null}
    <button onClick={setSensorStep.bind(null, '')}>Return to Project</button>
  </div>
}

export default EditSensor;