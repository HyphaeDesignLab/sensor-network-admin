import React, {useState, useEffect, useRef} from 'react';

import { mapboxToken } from '../../keys/mapbox';
import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = mapboxToken;

import './mapbox.css';
import InputString from "../InputString";

const GeoLocator = ({onDone, onCancel, initalCoordinates=null}) => {
  // current component mounted state (maybe there is a better way to do it?)
  // to be used / checked with in async callback's outside of react
  const isMounted = useRef(true); // initial true
  useEffect(() => {
    return () => {
      isMounted.current = false; // when dismounting set to false
    }
  }, []);

  const [coordinates, setCoordinates] = useState({...initalCoordinates});
  const [manualCoordinates, setManualCoordinates] = useState({...initalCoordinates});
  const [isCoordinatesChanged, setCoordinatesChanged] = useState(false);
  const [error, setError] = useState('');
  const [isGetCurrentLocationInProgress, setGetCurrentLocationInProgress] = useState(false);
  const handleGetCurrentLocation = () => {
    setGetCurrentLocationInProgress(true);
    navigator.geolocation.getCurrentPosition(res => {
      if (!isMounted.current) {
        return;
      }
      setCoordinates({lng: res.coords.longitude, lat: res.coords.latitude, accuracy: res.coords.accuracy});
      setGetCurrentLocationInProgress(false);
    }, err => {
      if (!isMounted.current) {
        return;
      }
      let error = ({1: 'permission deined', 2: 'position unavailable', 3: 'timeout'})[err.code]  + ' ' + err.message;
      setError(error);
    }, {
      maximumAge: 0,
      timeout: 1000 * 60,
      enableHighAccuracy: true
    });
  };

  const [isEditingOnMap, setEditingOnMap] = useState(false);

  const mapContainer = useRef(null);
  const map = useRef(null);
  useEffect(() => {
    if (!coordinates || !coordinates.lng || !coordinates.lat) {
      return;
    }
    const layerId = 'currentLocation';

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [coordinates.lng, coordinates.lat],
        zoom: 16
      });
      map.current.on('load', () => {
        map.current.addSource(layerId, {
          type: 'geojson',
          data: {
            type: 'Point',
            coordinates: [coordinates.lng, coordinates.lat]
          }
        });
        map.current.addLayer({
          id: layerId,
          type: 'circle',
          source: layerId,
          style: {
            type: 'circle',
            layout: {
              'circle-radius': 4,
              'circle-color': 'blue',
              'circle-stroke-color': 'black',
              'circl-stroke-width': 1
            }
          }
        });
      });

      const setNewCoordinates = () => {
        const newCoordinates  = map.current.getCenter();
        map.current.getSource(layerId).setData({
          type: 'Point',
          coordinates: [newCoordinates.lng, newCoordinates.lat]
        });
        setCoordinates({...coordinates, ...newCoordinates});
        setEditingOnMap(false);
      }
      // standard events
      map.current.on('dragstart',  () => {setEditingOnMap(true);});
      map.current.on('dragend', setNewCoordinates);
      // touch events
      map.current.on('touchstart',  () => {setEditingOnMap(true);});
      map.current.on('touchcancel',  () => {setEditingOnMap(false);});
      map.current.on('touchmove', setNewCoordinates);
    } else {
      map.current.setCenter([coordinates.lng, coordinates.lat]);
      map.current.getSource(layerId).setData({
        type: 'Point',
        coordinates: [coordinates.lng, coordinates.lat]
      });
    }
  }, [coordinates]);

  useEffect(() => {
    if (!!initalCoordinates) {
      if (JSON.stringify(initalCoordinates) !== JSON.stringify(coordinates)) {
        setCoordinatesChanged(true);
      } else {
        if (isCoordinatesChanged) {
          setCoordinatesChanged(false);
        }
      }
    } else {
      if (coordinates.lng && coordinates.lat) {
        setCoordinatesChanged(true);
      }
    }
  }, [coordinates]);

  const handleManualEdit = (coordinatesFragment) => {
    setManualCoordinates({ ...manualCoordinates, ...coordinatesFragment });
  };

  // whenever manual coordinates change, check if
  useEffect(() => {
    if (JSON.stringify(manualCoordinates) !== JSON.stringify(coordinates)
        && manualCoordinates.lng && manualCoordinates.lat) {
      setCoordinates(manualCoordinates);
    }
  }, [manualCoordinates]);

  const handleConfirm = () => {
    onDone({lng: coordinates.lng, lat: coordinates.lat})
        .then(() => {
          setCoordinatesChanged(false);
        });
  };

  return <section>
      <div>
        {isCoordinatesChanged && <button onClick={handleConfirm}>Save {!!initalCoordinates && 'Edits'}</button>}
        <button type='button' className='link' onClick={onCancel}>Cancel {!!initalCoordinates && isCoordinatesChanged && 'Edits'}</button>
        <h5>Enter Longitude/Latitude</h5>
        <div>
          Longitude:
          <InputString onSave={handleManualEdit} value={coordinates.lng || ''} path='lng' type='number' hasLabel={false} wrapEl='span' />
          Latitude:
          <InputString onSave={handleManualEdit} value={coordinates.lat || ''} path='lat' type='number' hasLabel={false} wrapEl='span' />
          {!!coordinates && !!coordinates.accuracy && <span>accuracy: {coordinates.accuracy}</span>}
        </div>

        <h5>Change on Map</h5>
        <p>Drag map to re-adjust location</p>
        <div>
          <button className='link' onClick={handleGetCurrentLocation} disabled={isGetCurrentLocationInProgress}>{isGetCurrentLocationInProgress ? 'Getting location...' : 'Get Current Location'}</button>
        </div>
        {!!coordinates.lng && !!coordinates.lat && <div style={{width: '300px', height: '300px', position: 'relative'}} className='map-container-outer'>
          <svg style={{width: '40px', position: 'absolute', bottom: 'calc(50% - 5px)', left: 'calc(50% - 20px)', fill: '#ff28c4', display: isEditingOnMap ? '':'none'}} viewBox="0 0 100 100">
            <path d="M50,89.5c0.32,0,0.62-0.17,0.78-0.43c1.03-1.59,24.88-39.15,24.88-52.91C75.66,22.02,64.15,10.5,50,10.5  c-14.15,0-25.66,11.51-25.66,25.66c0,13.75,23.85,51.32,24.88,52.91C49.38,89.33,49.68,89.5,50,89.5z M33.46,36.16  c0-9.13,7.41-16.55,16.54-16.55c9.13,0,16.54,7.43,16.54,16.55c0,9.11-7.41,16.54-16.54,16.54C40.87,52.7,33.46,45.27,33.46,36.16z">
            </path>
          </svg>
          <div ref={mapContainer} className="map-container" style={{width: '100%', height: '100%'}}>
          </div>
        </div>}
      </div>
    {error ? <div>{error}</div> : null}
  </section>
}

export default GeoLocator;
