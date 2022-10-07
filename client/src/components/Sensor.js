import React, { useEffect, useState } from 'react';

import GeoLocator from "./sensors/GeoLocator";
import SensorPhotos from "./sensors/SensorPhotos";
import InputString from "./InputString";
import SensorIds from "./sensors/SensorIds";
import ConfirmDialog from "./ConfirmDialog";

const Sensor = ({sensor, onSave, onDelete, onSaveToAws, onDeleteFromAws, onCancel, sensorTypes}) => {

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

  const handleIdsEdit = (ids, hasAllIds) => {
    return onSave({...sensor, ids, has_all_ids: hasAllIds}); // spread the IDs into original object
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

  return <section>
    <div><a href='#' onClick={onCancel}>&lt;&lt; All Sensors</a></div>
    <h3>Sensor {!!sensor.id ? `"${sensor.name}" (id: ${sensor.id})` : '"New" (unsaved)'}</h3>

    <section>
    <h4>Edit Name / Type</h4>
    <h5>Name:</h5>
    <InputString onSave={handleNameEdit} value={sensor.name ? sensor.name : ''} path='name' type='string' isOnlyEditMode={!sensor.id} hasLabel={false}/>

    {/*<div>Generate name from Type abbreviation</div>*/}

    <h5>Type</h5>
    <div>
      <select onChange={handleTypeEdit} value={sensor.type}>
      <option>--select type--</option>
      {sensorTypes.map(type => <option key={type.id} value={type.id} title={type.description}>{type.name}</option>)}
    </select></div>
    </section>

    <section>
    <h4>AWS IOT Registration</h4>
      <section>
        <h5>Type / Scan Device Registration Keys</h5>
        <SensorIds ids={sensor.ids} onSave={handleIdsEdit} headingLevel={6}/>
      </section>
    {!!sensor && sensor.ids && sensor.has_all_ids && <section>
      <h5>Register Keys in AWS IOT</h5>
      <div>
        {!sensor.type ?
            'Please set the sensor type (above) first':
            (!sensor.aws_iot_id ?
              <React.Fragment>
                <button type={'button'} className='link' onClick={handleAwsIdsSave} disabled={isAwsRegInProgress}>Register</button>
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
    </section>}
    </section>

    <section>
    <h4>Location</h4>
    <button type='button' className='link' onClick={handleLocationEditStart}>{!!location ? 'Edit' : 'Add'} Location</button>
    {!isEditLocation ? <div style={{transition: 'background-color 500ms ease-in', backgroundColor: hasLocationChanged ? '#98d28f':'white'}}>
      {!!location && <span>Longitude: {location.lng}, Latitude: {location.lat}</span>}
    </div> :
      <GeoLocator onDone={handleLocationSet} initalCoordinates={location} onCancel={handleLocationEditCancel}/>
    }
    </section>

    <section>
    <h4>Photos</h4>
    <p>of sensor as-installed, or of the device itself or anything relevant.</p>
    <SensorPhotos photos={sensor.photos} onUpdated={handlePhotoUpdate} />
    </section>

    <section>
    <h4>Delete Sensor</h4>
    {isDeleteSensorInProgress && <div>Deleting sensor...</div>}
    {!!deleteError && <div className='error'>{deleteError}</div>}
    <button className='link' type='button' onClick={handleDelete} disabled={isDeleteSensorInProgress}>Delete</button>

    {isConfirmDeleteShown && <ConfirmDialog
        onCancel={cancelDelete} onConfirm={confirmDelete}
        title='Delete Sensor?'
        text='Do you really want to delete this sensor. It will also un-register the associated AWS IOT device. This can NOT be UNDONE.'
        confirmText='Delete'
    ></ConfirmDialog>}
    </section>
  </section>
}

export default Sensor;