import React, {useState, useEffect} from 'react';

import { googleAPIKey } from '../../keys/googleAPIKey';

const GeoLocator = ({setLocation}) => {

  const [href, setHref] = useState('');
  // const [location, setLocation] = useState({});
  const [error, setError] = useState('');

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(res => {
      const lng = res.coords.longitude;
      const lat = res.coords.latitude;
      const accuracy = res.coords.accuracy;
      let href = `https://www.google.com/maps/embed/v1/place?key=${googleAPIKey}&q=${lat},${lng}&zoom=15`
      setHref(href);
      setLocation({lat, lng});
    }, err => {
      let error = ({1: 'permission deined', 2: 'position unavailable', 3: 'timeout'})[err.code]  + ' ' + err.message;
      console.log(error);
      setError(error);
    }, {
      maximumAge: 0,
      timeout: 1000 * 60,
      enableHighAccuracy: true
    });
  }

  return <div>
    {!href ? <button onClick={handleClick}>Get Current Location</button> : null}
    {href ? <iframe
      width='300'
      height='300'
      src={href}
      style={{ border: 0 }}
      loading="lazy"
      allowFullScreen
      target="_blank"
      /> : null}
    {error ? <div>{error}</div> : null}
  </div>
}

export default GeoLocator;
