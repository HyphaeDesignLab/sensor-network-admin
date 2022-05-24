import React, {useEffect, useState} from 'react';

import GeoLocator from './sensors/GeoLocator';

const InstallSensor = ({setEditStep}) => {

  const [location, setLocation] = useState({});

  const handleCoordinateConfirmation = () => {

  }

  return <div>
    <div>Sensor Installation</div>
    <GeoLocator setLocation={setLocation}/>
    <button>Confirm Coordinates</button>
    <div>Add Photos of Sensor!</div>

    <button onClick={setEditStep.bind(null, '')}>Save</button>
  </div>
}

export default InstallSensor;