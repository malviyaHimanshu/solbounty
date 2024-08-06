import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './tailwind.css';

const rootElement = document.createElement('div');
rootElement.id = 'react-root';
document.body.appendChild(rootElement);

ReactDOM.render(<App />, rootElement);