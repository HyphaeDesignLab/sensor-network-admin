import React, {useEffect, useState, useRef} from 'react';

const InstallSensor = ({setEditStep}) => {

  return <div>
    <div>Install Sensor On-Site!</div>
    <div>Enter Coordinates of Sensor!</div>
    {/* a link or just show googlemaps location of coordinates */}
    <div>Confirm Coordinates!</div>
    <div>Add Photos of Sensor!</div>

    <button onClick={setEditStep.bind(null, '')}>Save</button>
  </div>
}

export default InstallSensor;