import React from 'react';
import ReactDOM from 'react-dom';
import WalletApp from './App';
import './index.css';

const rootElement = document.createElement('div');
rootElement.id = 'react-root';
document.body.appendChild(rootElement);

const script = document.createElement('script');
script.src = chrome.runtime.getURL('pageScript.js');
script.onload = function() {
  this.remove();
};
(document.head || document.documentElement).appendChild(script);

ReactDOM.render(<WalletApp />, rootElement);