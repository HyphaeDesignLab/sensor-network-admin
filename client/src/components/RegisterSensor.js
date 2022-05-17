import React, {useEffect, useState, useRef} from 'react';

const RegisterSensor = ({setRegister}) => {

  return <div>
    <div>Take a photo!</div>
    <button onClick={setRegister.bind(null, false)}>Next</button>
  </div>
}

export default RegisterSensor;
