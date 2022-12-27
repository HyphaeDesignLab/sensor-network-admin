import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/echart-embedder/App';
import './style.css';
const appEl = document.querySelector('[data-app]');
ReactDOM.render(
    <App />,
    appEl
);
