const rootElement = document.createElement('div');
rootElement.id = 'react-root';
document.body.appendChild(rootElement);

const script = document.createElement('script');
script.src = chrome.runtime.getURL('bundle.js');
(document.head || document.documentElement).appendChild(script);