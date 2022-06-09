import React, {useEffect, useState, useRef} from 'react';

import SensorIds from './sensors/SensorIds';

const RegisterSensor = ({sensor, onSave, onCancel}) => {
  const handleSave = () => {
  }

  return <div>
    {/* to add ORC component here */}
    <div>Take a photo!</div>
    {/* highlight A's and S's because those are most commonly wrong */}
    <div>Check to see if the sensor code is correct!</div>
    {/* send device id and show either a success of error to the user*/}
    <div>Register with sensor with AWS!</div>
    {/* <SensorIds /> */}
    <button onClick={handleSave}>Save</button>
  </div>
}

export default RegisterSensor;
