
import browser from 'webextension-polyfill';
import axios from 'axios';

// Example: Listen for messages
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type === 'GET_AUTH_STATUS') {
    axios.get('http://localhost:8080/v1/auth/status', {
      withCredentials: true
    }).then(response => {
      console.log('we here at response', response.data);
      sendResponse({
        data: response.data
      });
    }).catch(err => {
      console.log('err', err);
      sendResponse({
        data: null
      });
    });

    // return true to indicate that we will respond asynchronously
    return true;
  }

  // TODO: add get all bounties relating to the repo
  if(message.type === 'GET_BOUNTIES_BY_REPO') {
    console.log('message hello hello', message);

    axios.post('http://localhost:8080/v1/bounty/by_owner_repo', {
      owner: message.owner,
      repo: message.repo
    }, {
      withCredentials: true
    }).then(response => {
      console.log('we here at response', response.data);
      sendResponse({
        data: response.data
      });
    }).catch(err => {
      console.log('err', err);
      sendResponse({
        data: null
      });
    });

    return true;
  }

  // TODO: add get bounty details for a specific issue
  if(message.type === 'GET_BOUNTY_DETAIL') {
    console.log('message hello hello bounty', message);

    axios.post('http://localhost:8080/v1/bounty/detail/issue_url', {
      issueUrl: message.issueUrl
    }, {
      withCredentials: true
    }).then(response => {
      console.log('we here at response', response.data);
      sendResponse({
        data: response.data
      });
    }).catch(err => {
      console.log('err', err);
      sendResponse({
        data: null
      });
    });

    return true
  }

  // TODO: add claim bounty from a specific issue

  // TODO: add approve bounty for the pr raised
});