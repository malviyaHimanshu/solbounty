import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import BountyButton from './components/BountyButton';
import BountyLabel from './components/BountyLabel';

export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => setIsDarkMode(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDarkMode;
};

const App = () => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const mergeMessageElement = document.querySelector('.merge-message');
      if(mergeMessageElement) {
        const mergeButton = mergeMessageElement.querySelector(':scope > div');
        // console.log('mergeButton', mergeButton);
        if (mergeButton && !document.querySelector('#bounty-button')) {
          const bountyButtonContainer = document.createElement('div');
          mergeButton.className = 'flex';
          mergeButton.style.display = 'flex';
          mergeButton.style.alignItems = 'center';
          mergeButton.style.gap = '4px';
          mergeButton.style.marginBottom = '4px';
          mergeButton.insertBefore(bountyButtonContainer, mergeButton.firstChild);
  
          ReactDOM.render(
            <BountyButton />,
            bountyButtonContainer
          )
        }
      }

      // adding bounty label to the respective issue
      const issueTitleElement = document.querySelector('#issue_603_link');
      console.log('issueTitleElement', issueTitleElement);
      if(issueTitleElement && !document.querySelector('#bounty-label')) {
        const labelContainer = document.createElement('div');
        // issueTitleElement.classList.add('flex', 'items-center', 'gap-1');
        // issueTitleElement.style = { display: 'flex', alignItems: 'center', gap: '2px' };
        issueTitleElement.style.display = 'flex';
        issueTitleElement.style.alignItems = 'center';
        issueTitleElement.style.gap = '8px';
        labelContainer.id = 'bounty-label';
        issueTitleElement.appendChild(labelContainer);

        ReactDOM.render(
          <BountyLabel bountyAmount={10} />,
          labelContainer
        )
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