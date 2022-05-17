import React, {useEffect, useState, useRef} from 'react';

const InstallSensor = ({setRegister, setStep}) => {

  const saveSensor = () => {
    setRegister(false);
    setStep('project');
  }

  return <div>
    Install Sensor On-Site!
    <button onClick={saveSensor}>Save / Return to Sensors</button>
  </div>
}

export default InstallSensor;