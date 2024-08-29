import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import BountyButton from './components/BountyButton';
import BountyLabel from './components/BountyLabel';
import ClaimBountyButton from './components/ClaimBountyButton';
import browser from 'webextension-polyfill';
import _ from 'lodash';
import LoginPopup from './components/LoginPopup';

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

function addBountyButton(userDetails, pr_url) {
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
        <BountyButton title={'Bounty'} userDetails={userDetails} prUrl={pr_url} />,
        bountyButtonContainer
      )
    }
  }
}

function addBountyLabelonIssues(issues) {
  // adding bounty label to the respective issue
  if(issues.length === 0) {
    return;
  }

  issues.forEach(issue => {
    const issueTitleElement = document.querySelector(`#issue_${issue.issue_number}_link`);
    // console.log('issueTitleElement', issueTitleElement);
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
    if(Number(issueId) !== issue.issue_number || !issue) {
      return;
    }

    // fetch details for the backend api about issue
    const issuePageMetaSection = document.querySelector('.gh-header-meta');
    // console.log('issuePageMetaSection', issuePageMetaSection);
    if (issuePageMetaSection) {
      const issueStatusElement = issuePageMetaSection.firstElementChild;
      // console.log('issueStatusElement', issueStatusElement);

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

function addClaimBountyOnPR(bounties) {
  // check if the current page includes 'compare' in route
  const prPagePattern = /\/pull\//;
  const match = window.location.pathname.match(prPagePattern);
  if (match) {
    // add claim bounty button while raising pr
    const prHeaderActions = document.querySelector('.gh-header-show .gh-header-actions');
    if (prHeaderActions) {
      // console.log('prHeaderActions', prHeaderActions);
      if (!document.querySelector('#claim-bounty-button')) {
        const claimBountyButtonContainer = document.createElement('div');
        claimBountyButtonContainer.id = 'claim-bounty-button';
        prHeaderActions.style.display = 'flex';
        prHeaderActions.style.alignItems = 'center';
        prHeaderActions.insertBefore(claimBountyButtonContainer, prHeaderActions.firstChild);

        ReactDOM.render(
          <ClaimBountyButton bounties={bounties} />,
          claimBountyButtonContainer
        )
      }
    }
  }
}

function addLoginButton() {
  if(!document.querySelector('#solbounty-login-button')) {
    const loginContainer = document.createElement('div');
    loginContainer.id = 'solbounty-login-button';
    document.body.appendChild(loginContainer);
    ReactDOM.render(
      <LoginPopup />,
      loginContainer
    );
  }
}

function removeLoginButton() {
  const loginButton = document.querySelector('#solbounty-login-button');
  if(loginButton) {
    loginButton.remove();
  }
}


function getOwnerAndRepoForIssueTab() {
  const currentUrl = window.location.href;
  const issuePageRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/?$/;
  const match = currentUrl.match(issuePageRegex);

  if (match) {
    const owner = match[1];
    const repo = match[2];
    return { owner, repo };
  } else {
    return null;
  }
}

function getOwnerAndRepoForPRPage() {
  const currentUrl = window.location.href;
  const prPageRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)$/;
  const match = currentUrl.match(prPageRegex);

  if (match) {
    const owner = match[1];
    const repo = match[2];
    return { owner, repo };
  } else {
    return null;
  }
}

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [bounties, setBounties] = useState([]);
  const [hasFetchedPRDetails, setHasFetchedPRDetails] = useState(false);
  const [hasFetchedBounties, setHasFetchedBounties] = useState(false);
  const [hasFetchedBountyDetails, setHasFetchedBountyDetails] = useState(false);

  const checkAuthStatus = () => {
    browser.runtime.sendMessage({
      type: 'GET_AUTH_STATUS',
    }).then(response => {
      // console.log('we ball ', response);
      setIsAuthenticated(response.data.isAuthenticated);
    }).catch(err => {
      // console.log(' ', err);
    });
  }

  const getAllBountiesByOwnerRepo = _.throttle(() => {
    const data = getOwnerAndRepoForIssueTab();
    if(data && !hasFetchedBounties) {
      browser.runtime.sendMessage({
        type: 'GET_BOUNTIES_BY_REPO',
        owner: data.owner,
        repo: data.repo
      }).then(response => {
        // console.log('bounties: ', response);
        // setBounties(response.data.data)
        addBountyLabelonIssues(response.data.data);
        setHasFetchedBounties(true);
      }).catch(err => {
        // console.log('error getting bounties: ', err);
      })
    }
  }, 2000); // throttle using lodash to run at most once every 2s

  const getBountyDetailByIssue = _.throttle(() => {
    const currentUrl = window.location.href;
    const issuePageRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)$/;
    const match = currentUrl.match(issuePageRegex);
    if(match && !hasFetchedBountyDetails) {
      browser.runtime.sendMessage({
        type: 'GET_BOUNTY_DETAIL',
        issueUrl: currentUrl
      }).then(response => {
        // console.log('specific bounty: ', response);
        addBountyLabelonIssuePage(response.data.data);
        setHasFetchedBountyDetails(true);
      }).catch(err => {
        // console.log('error in specific bounty: ', err);
      })
    }
  }, 2000);

  const getClaimBountyDetails = _.throttle(() => {
    const data = getOwnerAndRepoForPRPage();
    if(data) {
      browser.runtime.sendMessage({
        type: 'GET_BOUNTIES_BY_REPO',
        owner: data.owner,
        repo: data.repo
      }).then(response => {
        // console.log('bounties to claim: ', response);
        // setBounties(response.data.data);
        if(response.data.data.length) {
          addClaimBountyOnPR(response.data.data);
        }
      }).catch(err => {
        // console.log('error in bounties to claim: ', err);
      })
    }
  }, 2000);

  const getCurrentPRDetails = _.throttle(() => {
    const currentUrl = window.location.href;
    const prPageRegex = /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)$/;
    const match = currentUrl.match(prPageRegex);
    if(match && !hasFetchedPRDetails) {
      
      browser.runtime.sendMessage({
        type: 'GET_PR_DETAIL',
        prUrl: currentUrl
      }).then(response => {

        if(response.data?.data) {
          if(response.data?.isAuthorized) {
            // user himself looking at his own pr so can attempt an issue
            // console.log('adding attemp for issue');
            getClaimBountyDetails();
          } else if(!response.data?.isAuthorized) {
            // maintainer looking at some users pr so can give bounty
            addBountyButton(response.data.data, currentUrl);
            // console.log('added bounty button');
          }
        }
        setHasFetchedPRDetails(true);
      }).catch(err => {
        // console.log('error from pr detail: ', err);
      })
    }
  }, 2000);

  const handleMutation = () => {
    if(isAuthenticated) {
      removeLoginButton();
      if(window.location.href.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/?$/)) {
        getAllBountiesByOwnerRepo();
      } else if(window.location.href.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/issues\/(\d+)$/)) {
        getBountyDetailByIssue();
      } else if(window.location.href.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/pull\/(\d+)$/)) {
        getCurrentPRDetails();
      }
    } else {
      addLoginButton();
    }
  }

  // TODO: optimise api call and element injection
  useEffect(() => {
    const observer = new MutationObserver(handleMutation);
    const targetNode = document.body;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
    checkAuthStatus();

    return () => observer.disconnect();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleUrlChange = () => {
      setHasFetchedPRDetails(false);
    }

    window.addEventListener('popstate', handleUrlChange);

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    }
  }, []);

  return null;
};

const WalletApp = () => {
  return (
    <App />
  )
}

export default WalletApp;