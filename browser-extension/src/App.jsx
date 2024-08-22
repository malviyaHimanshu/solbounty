import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import BountyButton from './components/BountyButton';
import BountyLabel from './components/BountyLabel';
import ClaimBountyButton from './components/ClaimBountyButton';
import browser from 'webextension-polyfill';

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

function addBountyLabelonIssues(issues) {
  // adding bounty label to the respective issue
  console.log('issues', issues);


  if(issues.length === 0) {
    return;
  }

  issues.forEach(issue => {
    const issueTitleElement = document.querySelector(`#issue_${issue.issue_number}_link`);
    console.log('issueTitleElement', issueTitleElement);
    if (issueTitleElement && !document.querySelector(`#bounty-label-${issue.issue_number}`)) {
      const labelContainer = document.createElement('div');
      labelContainer.id = `bounty-label-${issue.issue_number}`;
      issueTitleElement.style.display = 'flex';
      issueTitleElement.style.alignItems = 'center';
      issueTitleElement.style.gap = '8px';
      issueTitleElement.appendChild(labelContainer);
      // TODO: add isClaimed status from the backend
      ReactDOM.render(
        <BountyLabel bountyAmount={issue.amount} isClaimed={false} />,
        labelContainer
      )
    }
  });
}

function addBountyLabelonIssuePage(issue) {
  // check if the current page is an issue page
  const issuePagePattern = /\/issues\/(\d+)$/;
  const match = window.location.pathname.match(issuePagePattern);
  if (match) {
    const issueId = match[1];
    console.log('issueId', issueId);
    console.log('whats good issue', issue);
    

    if(Number(issueId) !== issue.issue_number || !issue) {
      return;
    }

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
        // TODO: add isClaimed status from the backend
        // TODO: add multi token support
        ReactDOM.render(
          <BountyLabel size='lg' bountyAmount={issue.amount} isClaimed={false} />,
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

function getOwnerAndRepo() {
  const currentUrl = window.location.href;
  const issuesTabRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/?$/;
  const match = currentUrl.match(issuesTabRegex);

  if (match) {
    const owner = match[1];
    const repo = match[2];
    return { owner, repo };
  } else {
    return null;
  }
}

function getCurrentIssueDetail() {
  const currentUrl = window.location.href;
  const issuePageRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)$/;
  const match = currentUrl.match(issuePageRegex);

  if(match) {
    return {
      issueUrl: currentUrl,
    };
  } else {
    return null;
  }
}

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bounties, setBounties] = useState([]);

  const checkAuthStatus = () => {
    browser.runtime.sendMessage({
      type: 'GET_AUTH_STATUS',
    }).then(response => {
      console.log('we ball ', response);
      setIsAuthenticated(response.data.isAuthenticated);
    }).catch(err => {
      console.log('we fucked here ', err);
    });
  }

  const getAllBountiesByOwnerRepo = () => {
    const data = getOwnerAndRepo();
    if(data) {
      console.log('owner: ', data.owner);
      console.log('repo: ', data.repo);

      browser.runtime.sendMessage({
        type: 'GET_BOUNTIES_BY_REPO',
        owner: data.owner,
        repo: data.repo
      }).then(response => {
        console.log('we ball the bounties: ', response);
        setBounties(response.data.data);
        addBountyLabelonIssues(response.data.data);
      }).catch(err => {
        console.log('we fucked with bounties: ', err);
      })
    }
  }

  const getBountyDetailByIssue = () => {
    const data = getCurrentIssueDetail();
    if(data) {
      console.log('issueUrl: ', data.issueUrl)
      
      browser.runtime.sendMessage({
        type: 'GET_BOUNTY_DETAIL',
        issueUrl: data.issueUrl
      }).then(response => {
        console.log('we ball with specific bounty: ', response);
        addBountyLabelonIssuePage(response.data.data);
      }).catch(err => {
        console.log('we fucked with specific bounty: ', err);
      })
    }
  }

  // TODO: optimise api call and element injection
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // if(isAuthenticated) {
      //   addBountyButton();
      //   addBountyLabelonIssues();
      //   addBountyLabelonIssuePage();
      //   addClaimBountyOnPR();
      // }
      // fetches all the bounties for a repo and injects the label in issues tab
      getAllBountiesByOwnerRepo();

      // fetches the bounty detail based on specific issue and injects the label
      getBountyDetailByIssue();
    });
    
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
    
    getAllBountiesByOwnerRepo();
    checkAuthStatus();

    return () => observer.disconnect();
  }, [isAuthenticated]);

  return null;
};

export default App;