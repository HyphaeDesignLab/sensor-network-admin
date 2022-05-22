import React, { useEffect, useState } from 'react';

import RegisterSensor from './RegisterSensor';
import InstallSensor from './InstallSensor';

const AddSensor = ({setSensorStep}) => {
  const [register, setRegister] = useState(true);

  return <div>
    {register ? <RegisterSensor setRegister={setRegister}/> : null}
    {!register ? <InstallSensor setRegister={setRegister} setSensorStep={setSensorStep}/> : null}
    <button onClick={setSensorStep.bind(null, '')}>Cancel</button>
  </div>
}

export default AddSensor;