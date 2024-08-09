import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import BountyButton from './components/BountyButton';
import BountyLabel from './components/BountyLabel';
import ClaimBountyButton from './components/ClaimBountyButton';

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

function addBountyButton() {
  const mergeMessageElement = document.querySelector('.merge-message');
  if (mergeMessageElement) {
    const mergeButton = mergeMessageElement.querySelector(':scope > div');
    // console.log('mergeButton', mergeButton);
    if (mergeButton && !document.querySelector('#bounty-button')) {
      const bountyButtonContainer = document.createElement('div');
      bountyButtonContainer.id = 'bounty-button';
      mergeButton.className = 'flex';
      mergeButton.style.display = 'flex';
      mergeButton.style.alignItems = 'center';
      mergeButton.style.gap = '4px';
      mergeButton.style.marginBottom = '4px';
      mergeButton.insertBefore(bountyButtonContainer, mergeButton.firstChild);

      ReactDOM.render(
        <BountyButton title={'Approve'} />,
        bountyButtonContainer
      )
    }
  }
}

function addBountyLabelonIssues() {
  // adding bounty label to the respective issue
  const issueTitleElement = document.querySelector('#issue_603_link');
  console.log('issueTitleElement', issueTitleElement);
  if (issueTitleElement && !document.querySelector('#bounty-label')) {
    const labelContainer = document.createElement('div');
    labelContainer.id = 'bounty-label';
    issueTitleElement.style.display = 'flex';
    issueTitleElement.style.alignItems = 'center';
    issueTitleElement.style.gap = '8px';
    issueTitleElement.appendChild(labelContainer);

    ReactDOM.render(
      <BountyLabel bountyAmount={25} isClaimed={false} />,
      labelContainer
    )
  }
}

function addBountyLabelonIssuePage() {
  // check if the current page is an issue page
  const issuePagePattern = /\/issues\/(\d+)$/;
  const match = window.location.pathname.match(issuePagePattern);
  if (match) {
    const issueId = match[1];
    console.log('issueId', issueId);

    // TODO: fetch details for the backend api about issue
    const issuePageMetaSection = document.querySelector('.gh-header-meta');
    console.log('issuePageMetaSection', issuePageMetaSection);
    if (issuePageMetaSection) {
      const issueStatusElement = issuePageMetaSection.firstElementChild;
      console.log('issueStatusElement', issueStatusElement);

      if (issueStatusElement && !document.querySelector('#ind-bounty-label')) {
        const labelContainer = document.createElement('span');
        labelContainer.id = 'ind-bounty-label';
        issueStatusElement.style.display = 'flex';
        issueStatusElement.style.alignItems = 'center';
        issueStatusElement.style.gap = '4px';
        issueStatusElement.insertBefore(labelContainer, issueStatusElement.firstChild);

        ReactDOM.render(
          <BountyLabel size='lg' bountyAmount={25} isClaimed={false} />,
          labelContainer
        )
      }
    }
  }
}

function addClaimBountyOnPR() {
  // check if the current page includes 'compare' in route
  const prPagePattern = /\/compare\//;
  const match = window.location.pathname.match(prPagePattern);
  if (match) {
    // add claim bounty button while raising pr
    const prContainer = document.querySelector('.js-slash-command-surface');
    if (prContainer) {
      const createPRSection = prContainer.lastElementChild.lastElementChild;
      console.log('createPRSection', createPRSection);

      if (createPRSection && !document.querySelector('#claim-bounty-button')) {
        const claimBountyButtonContainer = document.createElement('div');
        claimBountyButtonContainer.id = 'claim-bounty-button';
        createPRSection.style.display = 'flex';
        createPRSection.style.alignItems = 'center';
        createPRSection.insertBefore(claimBountyButtonContainer, createPRSection.firstChild);

        ReactDOM.render(
          <ClaimBountyButton />,
          claimBountyButtonContainer
        )
      }
    }
  }
}

const App = () => {
  useEffect(() => {
    const observer = new MutationObserver(() => {
      addBountyButton();
      addBountyLabelonIssues();
      addBountyLabelonIssuePage();
      addClaimBountyOnPR();
    });

    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);

    return () => observer.disconnect();
  }, []);

  return null;
};

export default App;