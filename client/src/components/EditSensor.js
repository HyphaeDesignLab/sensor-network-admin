import React, { useEffect, useState } from 'react';

import GeoLocator from "./sensors/GeoLocator";
import SensorPhotos from "./sensors/SensorPhotos";

const EditSensor = ({sensor, onSave, onCancel}) => {

  const [location, setLocation] = useState(null);
  const [isEditLocation, setEditLocation] = useState(false);

  const handleLocationSet = (lngLat) => {
    setEditLocation(false);
    setLocation(lngLat);
    return onSave({...sensor, ...lngLat}); // spread the lng/lat into the sensor copy
  };

  const handleLocationEdit = () => {
    setEditLocation(s=>!s);
  };

  const handlePhotoUpdate = (photos) => {
    return onSave({...sensor, photos}); // spread the lng/lat into the sensor copy
  };

  return <div>
    <div><a href='#' onClick={onCancel}>&lt;&lt; Back to Project</a></div>

    <h2>Sensor</h2>

    {/* to add ORC component here */}
    <div>Take a photo!</div>
    {/* highlight A's and S's because those are most commonly wrong */}
    <div>Check to see if the sensor code is correct!</div>
    {/* send device id and show either a success of error to the user*/}
    <div>Register with sensor with AWS!</div>

    <h3>Location</h3>
    <div>{!!location && <span>Longitude: {location.lng}, Latitude: {location.lat}</span>} <a href='#' onClick={handleLocationEdit}>{!!location ? 'Edit':'Add Location'}</a></div>
    {isEditLocation && <GeoLocator onDone={handleLocationSet} initialValue={location}/>}

    <h3>Photos of Sensor as Installed</h3>
    <SensorPhotos photos={sensor.photos} onUpdated={handlePhotoUpdate} />
  </div>
}

export default EditSensor;