import React, { useEffect, useState } from 'react';

import GeoLocator from "./sensors/GeoLocator";
import SensorPhotos from "./sensors/SensorPhotos";
import InputString from "./InputString";
import SensorIds from "./sensors/SensorIds";

const EditSensor = ({sensor, onSave, onCancel}) => {

  const [location, setLocation] = useState(sensor.location);
  const [isEditLocation, setEditLocation] = useState(false);

  const handleLocationSet = (lngLat) => {
    setEditLocation(false);
    setLocation(lngLat);
    return onSave({...sensor, ...lngLat}); // spread the lng/lat into original object
  };

  const handleLocationEdit = () => {
    setEditLocation(s=>!s);
  };

  const handlePhotoUpdate = (photos) => {
    return onSave({...sensor, photos}); // add the photos array to original object
  };

  const handleNameEdit = (sensorFragment) => {
    return onSave({...sensor, ...sensorFragment}); // spread the fragment (contains name) into original object
  };

  const handleIdsEdit = (ids) => {
    return onSave({...sensor, ids}); // spread the IDs into original object
  };

  return <div>
    <div><a href='#' onClick={onCancel}>&lt;&lt; Back to Project</a></div>

    <h2>Sensor</h2>
    <InputString onSave={handleNameEdit} value={sensor.name ? sensor.name : 'New Sensor'} path='name' type='string' isOnlyEditMode={!sensor.id} hasLabel={false} wrapEl='h3'/>


    {/* send device id and show either a success of error to the user*/}
    <div>AWS Registration</div>
    <SensorIds ids={sensor.ids} onSave={handleIdsEdit} />

    <h3>Location</h3>
    <div>{!!location && <span>Longitude: {location.lng}, Latitude: {location.lat}</span>} <a href='#' onClick={handleLocationEdit}>{!!location ? 'Edit':'Add Location'}</a></div>
    {isEditLocation && <GeoLocator onDone={handleLocationSet} initialValue={location}/>}

    <h3>Photos of Sensor as Installed</h3>
    <SensorPhotos photos={sensor.photos} onUpdated={handlePhotoUpdate} />
  </div>
}

export default EditSensor;