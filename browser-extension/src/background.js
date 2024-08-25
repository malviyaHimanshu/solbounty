
import browser from 'webextension-polyfill';
import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://api.devnet.solana.com");

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
  if(message.type === 'CLAIM_BOUNTY') {
    console.log('message hello hello claim', message);

    axios.post('http://localhost:8080/v1/bounty/attempt', {
      bountyId: message.bountyId,
      signature: message.signature
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

  // TODO: get pr details for a specific pr
  if(message.type === 'GET_PR_DETAIL') {
    console.log('message hello hello pr', message);

    axios.post('http://localhost:8080/v1/bounty/detail/pr_url', {
      prUrl: message.prUrl
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


  // TODO: add approve bounty for the pr raised


  // get recent blockhash
  if(message.type === 'GET_RECENT_BLOCKHASH') {
    connection.getLatestBlockhash().then(blockhash => {
      console.log('we here at blockhash', blockhash);
      sendResponse({
        data: blockhash
      });
    }).catch(err => {
      console.log('err', err);
      sendResponse({
        data: null
      });
    });

    return true;
  }

  // send raw transaction
  if(message.type === 'SEND_RAW_TRANSACTION') {
    let { serialisedTransaction } = message;
    if (typeof serialisedTransaction === 'object' && !(serialisedTransaction instanceof Uint8Array)) {
      serialisedTransaction = new Uint8Array(Object.values(serialisedTransaction));
    }
    console.log('we here for serialised transaction', serialisedTransaction);
    connection.sendRawTransaction(serialisedTransaction).then(signature => {
      console.log('we here at signature', signature);

      connection.confirmTransaction(signature, {
        commitment: 'confirmed'
      }).then(() => {
        console.log('Transaction confirmed', signature);
        sendResponse({
          data: signature
        });
      }).catch(err => {
        console.log('Transaction not confirmed', err);
        sendResponse({
          data: null,
          error: err.message
        });
      });
    }).catch(err => {
      console.log('err', err);
      sendResponse({
        data: null,
        error: err.message
      });
    });

    return true;
  }
});