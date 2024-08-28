
import browser from 'webextension-polyfill';
import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js';

const connection = new Connection("https://api.devnet.solana.com");
const API_URL = 'http://localhost:8080';

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if(message.type === 'GET_AUTH_STATUS') {
    axios.get(`${API_URL}/v1/auth/status`, {
      withCredentials: true
    }).then(response => {
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

  // get all bounties relating to the repo
  if(message.type === 'GET_BOUNTIES_BY_REPO') {
    axios.post(`${API_URL}/v1/bounty/by_owner_repo`, {
      owner: message.owner,
      repo: message.repo
    }, {
      withCredentials: true
    }).then(response => {
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

  // get bounty details for a specific issue
  if(message.type === 'GET_BOUNTY_DETAIL') {
    axios.post(`${API_URL}/v1/bounty/detail/issue_url`, {
      issueUrl: message.issueUrl
    }, {
      withCredentials: true
    }).then(response => {
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
    axios.post(`${API_URL}/v1/bounty/attempt`, {
      bountyId: message.bountyId,
      signature: message.signature
    }, {
      withCredentials: true
    }).then(response => {
      // console.log('we here at response', response.data);
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

  // pr details for a specific pr
  if(message.type === 'GET_PR_DETAIL') {
    axios.post(`${API_URL}/v1/bounty/detail/pr_url`, {
      prUrl: message.prUrl
    }, {
      withCredentials: true
    }).then(response => {
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
    let { serialisedTransaction, transactionDetails } = message;
    if (typeof serialisedTransaction === 'object' && !(serialisedTransaction instanceof Uint8Array)) {
      serialisedTransaction = new Uint8Array(Object.values(serialisedTransaction));
    }
    
    connection.sendRawTransaction(serialisedTransaction).then(signature => {
      console.log('signature', signature);
      if (!signature || typeof signature !== 'string') {
        throw new Error('Invalid transaction signature');
      }

      axios.post(`${API_URL}/v1/transaction`, {
        payer: transactionDetails.payer,
        recipient: transactionDetails.recipient,
        amount: transactionDetails.amount,
        tokenType: transactionDetails.tokenType,
        pr_url: transactionDetails.pr_url,
        signature: signature
      }, {
        withCredentials: true
      }).then(response => {
        sendResponse({
          data: signature
        });
      }).catch(err => {
        console.log('error while registering transaction', err);
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