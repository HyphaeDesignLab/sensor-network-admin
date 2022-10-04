import React, { useEffect, useState } from 'react';

import GeoLocator from "./sensors/GeoLocator";
import SensorPhotos from "./sensors/SensorPhotos";
import InputString from "./InputString";
import SensorIds from "./sensors/SensorIds";
import ConfirmDialog from "./ConfirmDialog";

const Sensor = ({sensor, onSave, onDelete, onSaveToAws, onDeleteFromAws, onCancel}) => {

  const [location, setLocation] = useState(sensor.location);
  const [isEditLocation, setEditLocation] = useState(false);
  const [hasLocationChanged, setLocationChanged] = useState(false);

  const handleLocationSet = (lngLat) => {
    setEditLocation(false);
    setLocation(lngLat);
    setLocationChanged(true);
    // spread the lng/lat into original object
    return onSave({...sensor, location: lngLat}).finally(() => {
      setTimeout(() => {
        setLocationChanged(false);
      }, 1000);
    });
  };

  const handleLocationEditStart = () => {
    setEditLocation(true);
  };
  const handleLocationEditCancel = () => {
    setEditLocation(false);
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

  const [isConfirmDeleteShown, setIsConfirmDeleteShown] = useState(false);
  const [isDeleteSensorInProgress, setIsDeleteSensorInProgress] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const confirmDelete = () => {
    setDeleteError(false);
    setIsDeleteSensorInProgress(true);
    setIsConfirmDeleteShown(false);
    onDelete(sensor).catch(e => {
      setDeleteError(e.message);
    })
    .finally(() => {
      setIsDeleteSensorInProgress(false);
    });
  };
  const cancelDelete = () => {
    setIsConfirmDeleteShown(false);
  };
  const handleDelete = () => {
    setIsConfirmDeleteShown(true);
  };

  const [awsError, setAwsError] = useState(false);
  const [isAwsRegInProgress, setAwsRegInProgress] = useState(false);
  const [awsIdUnregistered, setAwsIdUnregistered] = useState(false);
  const handleAwsIdsSave = () => {
    setAwsError(false);
    setAwsRegInProgress(true);
    setAwsIdUnregistered(false);
    onSaveToAws(sensor).then(awsId => {
      return onSave({...sensor, aws_iot_id: awsId});
    }).catch(e => {
      setAwsError(e.message);
    }).finally(() => {
      setAwsRegInProgress(false);
    });
  };

  const handleAwsIdsDelete = () => {
    setAwsError(false);
    setAwsRegInProgress(true)
    const awsIotId = sensor.aws_iot_id;
    let awsDeleteMessage = '';
    onDeleteFromAws(sensor).then(resp => {
      if (resp && resp.message) {
        awsDeleteMessage = resp.message;
      }
      return onSave({...sensor, aws_iot_id: null});
    }).then(() => {
      if (awsDeleteMessage) {
        setAwsIdUnregistered(awsIotId);
        setAwsError(awsDeleteMessage); // display the delete message as "ERROR" to add significance to its looks
      }
    }).catch(e => {
      setAwsError(e.message);
    }).finally(() => {
      setAwsRegInProgress(false);
    })
  };

  const handleAwsIdsClear = () => {
    setAwsRegInProgress(true);
    setAwsError(`Removing AWS IOT ID from DB...`);
    const awsIotId = sensor.aws_iot_id;
    onSave({...sensor, aws_iot_id: null}).then(() => {
      setAwsError(`Removed AWS IOT ID from DB.`);
      setAwsIdUnregistered(awsIotId);
    }).catch(e => {
      setAwsError('Error removing AWS IOT ID from DB');
    }).finally(() => {
      setAwsRegInProgress(false);
    });
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
      <h4>Register Ids in AWS IOT</h4>
      <div>
        {!sensor.type ?
            'Please set the sensor type (above) first':
            (!sensor.aws_iot_id ?
              <React.Fragment>
                <button type={'button'} onClick={handleAwsIdsSave} disabled={isAwsRegInProgress}>Register</button>
                {isAwsRegInProgress && <div className='spinning-loader'></div>}
                {awsIdUnregistered && <div>
                  <span>Please check manually that the device </span>
                  <a href={'https://us-west-2.console.aws.amazon.com/iot/home?region=us-west-2#/wireless/devices/details/'+awsIdUnregistered} target='_blank'>{awsIdUnregistered}</a>
                  <span> has been removed from AWS IOT itself.</span>
                </div>}
              </React.Fragment> :
              <React.Fragment>
                <span>Wireless device registered with ID <a href={'https://us-west-2.console.aws.amazon.com/iot/home?region=us-west-2#/wireless/devices/details/'+sensor.aws_iot_id} target='_blank'>{sensor.aws_iot_id}</a></span><br/>
                <button type={'button'} className='link' onClick={handleAwsIdsDelete} disabled={isAwsRegInProgress}>Un-Register from AWS IOT</button>
                <button type={'button'} className='link' onClick={handleAwsIdsClear} disabled={isAwsRegInProgress}>Only Clear AWS IOT ID</button>
                {isAwsRegInProgress && <div className='spinning-loader'></div>}
              </React.Fragment>
            )
        }
      </div>
      {!!awsError && <div style={{color: 'red'}}>{awsError}</div>}
    </React.Fragment>}

    <h3>Location</h3>
    <button type='button' className='link' onClick={handleLocationEditStart}>{!!location ? 'Edit' : 'Add'} Location</button>
    {!isEditLocation ? <div style={{transition: 'background-color 500ms ease-in', backgroundColor: hasLocationChanged ? '#98d28f':'white'}}>
      {!!location && <span>Longitude: {location.lng}, Latitude: {location.lat}</span>}
    </div> :
      <GeoLocator onDone={handleLocationSet} initalCoordinates={location} onCancel={handleLocationEditCancel}/>
    }

    <h3>Photos of Sensor as Installed</h3>
    <SensorPhotos photos={sensor.photos} onUpdated={handlePhotoUpdate} />

    <h3>Delete Sensor</h3>
    {isDeleteSensorInProgress && <div>Deleting sensor...</div>}
    {!!deleteError && <div className='error'>{deleteError}</div>}
    <button className='link' type='button' onClick={handleDelete} disabled={isDeleteSensorInProgress}>Delete</button>

    {isConfirmDeleteShown && <ConfirmDialog
        onCancel={cancelDelete} onConfirm={confirmDelete}
        title='Delete Sensor?'
        text='Do you really want to delete this sensor. It will also un-register the associated AWS IOT device. This can NOT be UNDONE.'
        confirmText='Delete'
    ></ConfirmDialog>}
  </div>
}

export default Sensor;