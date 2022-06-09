import React, { useEffect, useState } from 'react';

import RegisterSensor from './RegisterSensor';
import InstallSensor from './InstallSensor';

const EditSensor = ({sensor, onSave, onCancel}) => {
  const [step, setStep] = useState(null);

  useEffect(() => {
    if (sensor.id) {
        setStep('register');
    }
  }, []);

  return <div>
    {!step &&
      <div>
        <button onClick={setStep.bind(null, 'register')}>Register Sensor</button>
        <button onClick={setStep.bind(null, 'install')}>Install Sensor</button>
      </div>}
    {step === 'register' && <RegisterSensor sensor={sensor} onSave={onSave}/>}
    {step === 'install' && <InstallSensor sensor={sensor} onSave={onSave} />}
    <button onClick={onCancel}>Return to Project</button>
  </div>
}

export default EditSensor;