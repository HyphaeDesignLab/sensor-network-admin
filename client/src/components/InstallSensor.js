import React, {useEffect, useState} from 'react';

import GeoLocator from './sensors/GeoLocator';

const InstallSensor = ({setEditStep, saveProject}) => {

  const [location, setLocation] = useState({});

  const handleCoordinateConfirmation = () => {
    console.log('aaaaaaaaaaaaaahgasdfgjioge')
    // saveProject(location);
  }

  const handleSave = () => {
    // also deal with saving when how to save it is decided
    setEditStep('');
  }

  return <div>
    <div>Sensor Installation</div>
    <GeoLocator setLocation={setLocation}/>
    <button onClick={handleCoordinateConfirmation}>Confirm Coordinates</button>
    <div>Add Photos of Sensor!</div>

    <button onClick={handleSave}>Save</button>
  </div>
}

export default InstallSensor;