import React, { useEffect, useState } from 'react';

import GeoLocator from "./sensors/GeoLocator";
import SensorPhotos from "./sensors/SensorPhotos";
import InputString from "./InputString";
import SensorIds from "./sensors/SensorIds";

const Sensor = ({sensor, onSave, onDelete, onSaveToAws, onCancel}) => {

  const [location, setLocation] = useState(sensor.location);
  const [isEditLocation, setEditLocation] = useState(false);

  const handleLocationSet = (lngLat) => {
    setEditLocation(false);
    setLocation(lngLat);
    return onSave({...sensor, location: lngLat}); // spread the lng/lat into original object
  };

  const handleLocationEdit = () => {
    setEditLocation(s => !s);
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

  const handleTypeEdit = (e) => {
    const type = e.target.value;
    return onSave({...sensor, type}); // spread the IDs into original object
  };
  const handleDelete = () => {
    return onDelete(sensor);
  };

  const [awsError, setAwsError] = useState(false);
  const [isAwsRegInProgress, setAwsRegInProgress] = useState(false);
  const handleAwsIdsSave = () => {
    setAwsError(false);
    setAwsRegInProgress(true)
    onSaveToAws(sensor).then(awsId => {
      onSave({...sensor, aws_iot_id: awsId});
    }).catch(e => {
      setAwsError(e.message);
    }).finally(() => {
      setAwsRegInProgress(false);
    })
  };

  return <div>
    <div><a href='#' onClick={onCancel}>&lt;&lt; All Sensors</a></div>

    <InputString onSave={handleNameEdit} value={sensor.name ? sensor.name : 'New Sensor'} path='name' type='string' isOnlyEditMode={!sensor.id} hasLabel={false} wrapEl='h2'/>

    <div>Type (for AWS IOT, etc.) <select onChange={handleTypeEdit} value={sensor.type}>
      <option>--select type--</option>
      <option value='temphum_dragino_sm31'>temp+hum (dragino sm31)</option>
      <option value='mrt_dragino_d22'>MRT+temp (dragino d22)</option>
      <option value='wind_barani_meteowind_iot_pro'>Wind (Barani MeteoWind IOT Pro)</option>
      <option value='temphum_dragino_lht65'>temp+hum indoor (dragino lht65)</option>
    </select></div>

    {/* send device id and show either a success of error to the user*/}
    <h3>AWS IOT Registration</h3>
    <h4>Enter/Scan Ids</h4>
    <SensorIds ids={sensor.ids} onSave={handleIdsEdit} headingLevel={5}/>
    {!!sensor && sensor.ids && <React.Fragment>
      <h4>Register Ids</h4>
      <div>
        {!sensor.type ?
            'Please set the sensor type (above) first':
            (!sensor.aws_iot_id ?
              <React.Fragment>
                <button type={'button'} onClick={handleAwsIdsSave} disabled={isAwsRegInProgress}>Register</button>
                {isAwsRegInProgress && <div className='spinning-loader'></div>}
              </React.Fragment> :
              <span>Wireless device registered with ID <a href={'https://us-west-2.console.aws.amazon.com/iot/home?region=us-west-2#/wireless/devices/details/'+sensor.aws_iot_id} target='_blank'>{sensor.aws_iot_id}</a></span>
            )
        }
      </div>
      {!!awsError && <div style={{color: 'red'}}>{awsError}</div>}
    </React.Fragment>}

    <h3>Location</h3>
    <div>
      {!!location && <span>Longitude: {location.lng}, Latitude: {location.lat}</span>}
      {!isEditLocation && <button type='button' className='link' onClick={handleLocationEdit}>{!!location ? 'Edit' : 'Add'} Location</button>}
    </div>
    {isEditLocation && <GeoLocator onDone={handleLocationSet} initialValue={location}/>}
    {isEditLocation && <div>
      <button type='button' className='link' onClick={handleLocationEdit}>Cancel {!!location ? 'Edit' : 'Add'} Location</button>
    </div>}

    <h3>Photos of Sensor as Installed</h3>
    <SensorPhotos photos={sensor.photos} onUpdated={handlePhotoUpdate} />

    <h3>Delete Sensor</h3>
    <button className='link' type='button' onClick={handleDelete}>Delete</button>
  </div>
}

export default Sensor;