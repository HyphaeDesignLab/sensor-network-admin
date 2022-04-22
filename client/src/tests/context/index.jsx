import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const appEl = document.querySelector('[data-app]');
ReactDOM.render(
    <App />,
    appEl
);
