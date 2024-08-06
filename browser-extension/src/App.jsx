import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import BountyButton from './components/BountyButton';


const App = () => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mergeMessageElement = document.querySelector('.merge-message');
      if(mergeMessageElement) {
        const mergeButton = mergeMessageElement.querySelector(':scope > div');
        // console.log('mergeButton', mergeButton);
        if (mergeButton && !document.querySelector('#bounty-button')) {
          const bountyButtonContainer = document.createElement('div');
          mergeButton.className = 'flex items-center gap-1 mb-1';
          mergeButton.insertBefore(bountyButtonContainer, mergeButton.firstChild);
  
          ReactDOM.render(
            <BountyButton />,
            bountyButtonContainer
          )
        }
      }
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    return () => observer.disconnect();
  }, []);

  return null;
};

export default App;