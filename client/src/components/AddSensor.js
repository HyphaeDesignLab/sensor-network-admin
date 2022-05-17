import React, { useEffect, useState } from 'react';

import RegisterSensor from './RegisterSensor';
import InstallSensor from './InstallSensor';

const AddSensor = ({setStep}) => {
  const [register, setRegister] = useState(true);
  // const [install, setInstall] = useState(false);

  return <div>
    {register ? <RegisterSensor setRegister={setRegister}/> : null}
    {!register ? <InstallSensor setRegister={setRegister} setStep={setStep}/> : null}
    <button onClick={setStep.bind(null, 'project')}>Cancel</button>
  </div>
}

export default AddSensor;