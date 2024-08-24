import React from 'react';
import ReactDOM from 'react-dom';
import WalletApp from './App';
import './index.css';

const rootElement = document.createElement('div');
rootElement.id = 'react-root';
document.body.appendChild(rootElement);

ReactDOM.render(<WalletApp />, rootElement);