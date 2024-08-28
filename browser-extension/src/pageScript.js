

import {
  Transaction,
  PublicKey,
  SystemProgram,
  sendAndConfirmTransaction,
  sendAndConfirmRawTransaction,
  Keypair
} from "@solana/web3.js";
import { Buffer } from "buffer";

window.Buffer = Buffer;

let blockhash = null;

console.log('only possible on solana.');

window.addEventListener("message", async (event) => {
  if(event.data.type === "SOLANA_BLOCKHASH_RESPONSE") {
    if(event.data.error) {
      // console.error('failed to get latest blockhash: ', event.data.error);
    } else {
      blockhash = event.data.blockhash;
      // console.log('recieved blockhash in pageScript: ', blockhash);
    }
  }

  if (event.data.type === "SOLANA_SIGN_REQUEST") {
    try {
      // Check if Phantom wallet is installed
      const provider = window.solana;
      if (!provider) {
        throw new Error("Please install Phantom wallet!");
      }
      
      const payerPublicKey = await connectWallet();

      // Transfer token
      const signature = await transferToken(
        payerPublicKey,
        event.data.recipient,
        event.data.amount,
        event.data.token
      );
      
      // Send the success response back to the content script
      window.postMessage({ type: "SOLANA_SIGN_RESPONSE", signature }, "*");
    } catch (error) {
      // Send the error response back to the content script
      window.postMessage({ type: "SOLANA_SIGN_RESPONSE", error: error.message }, "*");
    }
  }
});


async function connectWallet() {
  if("solana" in window) {
    const provider = window.solana;

    if(provider.isPhantom) {
      try {
        const response = await provider.connect();
        return response.publicKey.toString();
      } catch (error) {
        console.error('failed to connect wallet: ', error);
        return null;
      }
    }
  } else {
    console.error('Phantom wallet not installed');
    return null;
  }
}


function getBlockhash() {
  return new Promise((resolve, reject) => {
    window.postMessage({ type: "SOLANA_BLOCKHASH_REQUEST" }, "*");

    const onMessage = (event) => {
      if(event.data.type === "SOLANA_BLOCKHASH_RESPONSE") {
        if(event.data.error) {
          console.error('failed to get latest blockhash: ', event.data.error);
          reject(event.data.error);
        } else {
          blockhash = event.data.blockhash;
          // console.log('recieved blockhash in pageScript: ', blockhash);
          resolve(blockhash);
        }
        window.removeEventListener("message", onMessage);
      }
    }

    window.addEventListener("message", onMessage);
  });
}


function sendRawTransaction(serialisedTransaction, payer, recipient, amount, tokenType) {
  return new Promise((resolve, reject) => {
    window.postMessage({ type: "SOLANA_SEND_RAW_TRANSACTION", serialisedTransaction, payer, recipient, amount, tokenType }, "*");

    const onMessage = (event) => {
      if(event.data.type === "SOLANA_SEND_RAW_TRANSACTION_RESPONSE") {
        if(event.data.error) {
          console.error('failed to get raw transaction response: ', event.data.error);
          reject(event.data.error);
        } else {
          // console.log('Transaction successful, signature: ', event.data.signature);
          const signature = event.data.signature;
          resolve(signature);
        }
        window.removeEventListener("message", onMessage);
      }
    }

    window.addEventListener("message", onMessage);
  })
}


async function transferToken(
  payer,
  recipient,
  amount,
  tokenType
) {
  const recipientPublicKey = new PublicKey(recipient);
  const payerPublicKey = new PublicKey(payer);

  let transaction = new Transaction();

  if(tokenType === 'SOL') {
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payerPublicKey,
        toPubkey: recipientPublicKey,
        lamports: Number(amount) * 1e9 // 1 SOL = 1e9 lamports
      })
    );
  } else {
    throw new Error("Token type not supported");
  }

  // set the recent blockhash and fee payer
  const blockhash = await getBlockhash();
  transaction.recentBlockhash = blockhash.blockhash;
  transaction.feePayer = payerPublicKey;

  // Sign and send the transaction
  try {
    const provider = window.solana;
    const signedTransaction = await provider.signTransaction(transaction);
    // console.log('signed transaction: ', signedTransaction);
    
    const serialisedTransaction = signedTransaction.serialize();
    // console.log('serialised transaction: ', serialisedTransaction);

    const signature = await sendRawTransaction(serialisedTransaction, payer, recipient, amount, tokenType);

    console.log('Transaction successful, signature :', signature);
    return signature;
  } catch (error) {
    console.error('Transaction failed: ', error);
    return null;
  }
}