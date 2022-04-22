import React, {useState, useEffect} from 'react';
import MapStyle from './MapStyle';

const Map = () => {
    return <div>
        <h1>Map</h1>

        <MapStyle />
        <div>user</div>
        <div>token</div>
        <div>center</div>
        <div>zoom</div>
        <div>projects</div>
        <div>geosearchInputPlaceholderText</div>
    </div>;
};

export default Map;