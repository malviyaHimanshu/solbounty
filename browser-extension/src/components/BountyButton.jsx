import React, { useEffect, useState } from "react"
import SolanaLogo from "./img/SolanaLogo"
import { useDarkMode } from "../App";
import browser from "webextension-polyfill";

// TODO: add loading while waiting for transaction to complete
export default function BountyButton({
  title,
  userDetails
}) {
  const [user, setUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDarkMode = useDarkMode();
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenType, setTokenType] = useState("SOL");
  const [hasError, setHasError] = useState(false);
  const [signature, setSignature] = useState(null);
  const [transactionError, setTransactionError] = useState(null);

  useEffect(() => {
    console.log('we are speaking from bounty button the user is', userDetails);
    setUser(userDetails);
    
    const handleMessage = (event) => {
      if(event.data.type === "SOLANA_BLOCKHASH_REQUEST") {

        browser.runtime.sendMessage({
          type: "GET_RECENT_BLOCKHASH"
        }).then(response => {
          console.log("this is the blockhash content got", response.data);
          // send blockhash to pageScript.js
          window.postMessage({
            type: "SOLANA_BLOCKHASH_RESPONSE",
            blockhash: response.data
          }, "*"); // TODO: update target origin to be restrictive
        }).catch(error => {
          console.log('failed to get latest blockhash: ', error);
          window.postMessage({
            type: "SOLANA_BLOCKHASH_RESPONSE",
            error: error.message
          }, "*");
        })
        
      } else if(event.data.type === "SOLANA_SEND_RAW_TRANSACTION") {

        browser.runtime.sendMessage({
          type: "SEND_RAW_TRANSACTION",
          serialisedTransaction: event.data.serialisedTransaction
        }).then(response => {
          console.log("so we screwed over here", response.error);
          console.log("this is the signature content got", response.data);
          // send signature to pageScript.js
          window.postMessage({
            type: "SOLANA_SEND_RAW_TRANSACTION_RESPONSE",
            signature: response.data
          }, "*");
        }).catch(error => {
          console.log('failed to send raw transaction: ', error);
          window.postMessage({
            type: "SOLANA_SEND_RAW_TRANSACTION_RESPONSE",
            error: error.message
          }, "*");
        });

      } else if(event.data.type === "SOLANA_SIGN_RESPONSE") {
        if (event.data.error) {
          console.error("we fucked: ", event.data.error);
          setTransactionError(event.data.error);
        } else {
          console.log("here is the signature: ", event.data.signature);
          setSignature(response.data.signature);
        }
      }
    }

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    }

  }, []);

  const sendBounty = (amount, token, recipient) => {
    // send message to pageScript.js
    console.log('send it', amount, token, recipient);
    window.postMessage({ 
      type: "SOLANA_SIGN_REQUEST",
      recipient,
      amount,
      token
    }, "*"); // TODO: target origin needs to be restrictive
  }

  const handleOnClick = (event) => {
    event.preventDefault();
    console.log('Bounty button clicked');
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleTokenAmountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,9}$/;
    const totalDigits = inputValue.length;
    if(tokenAmount === 0) {
      setHasError(true);
    } else {
      setHasError(false);
    }

    if (totalDigits <= 20 && regex.test(inputValue)) {
      setTokenAmount(inputValue);
    }
  }

  function shortenAddress(address) {
    if (!address) return "";
    const start = address.slice(0, 4); // First 4 characters
    const end = address.slice(-4); // Last 4 characters
    return `${start}...${end}`;
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary"
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        onClick={handleOnClick}
      >
        <SolanaLogo height="14" />
        {title}
      </button>

      {isModalOpen && (
        <section className="sol-bounty-modal-overlay" style={{
          position: 'fixed',
          top: '0',
          left: '0',
          height: '100vh',
          width: '100vw',
          zIndex: '9999',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          
          <div className="sol-bounty-modal-content" style={{
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            color: '#ffffff',
            borderRadius: '12px',
          }}>
            <div style={{
              padding: '15px 20px',
            }}>
              <h1 style={{ fontWeight: 500, fontSize: '16px' }}>Send a bounty</h1>
            </div>

            <div style={{
              border: '1px solid #30363D',
              borderWidth: '1px 0',
              padding: '15px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              minWidth: '400px',
            }}>

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                width: '100%',
              }}>
                <p style={{ fontSize: '14px', opacity: '0.5', margin: '0' }}>Recipient</p>
                <p style={{ fontWeight: 500, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {user?.github_username}
                  <span style={{ opacity: '0.5', fontWeight: 400 }}>
                    ({shortenAddress(user?.account_addr)})
                  </span>
                </p>
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  borderRadius: '8px',
                  border: `1px solid ${hasError ? '#FF0000' : '#30363D'}`,
                  backgroundColor: '#161B22',
                  padding: '5px 16px 5px 0',
                }}>
                  <input
                    type="number"
                    value={tokenAmount || ''}
                    style={{
                      fontSize: '14px',
                      borderRadius: '8px',
                      padding: '3px 12px',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: '#161B22',
                      color: '#ffffff',
                      width: '100%',
                    }}
                    min={0}
                    onChange={handleTokenAmountChange}
                  />

                  <select style={{
                    backgroundColor: '#161B22',
                    color: '#ffffff',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    opacity: '0.5',
                  }}>
                    <option value="SOL">SOL</option>
                    {/* <option value="USDC">USDC</option> */}
                  </select>
                </div>

                {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <p style={{ fontSize: '14px', opacity: '0.5' }}>{'~$0.15'}</p>
                  <p style={{ fontSize: '14px', opacity: '0.5' }}>Available: {'0.1 SOL'}</p>
                </div> */}
              </div>
              
              {/* TODO: transaction is working but put some loading so let user know */}
              {signature && !transactionError && (
                <div style={{
                  padding: '10px',
                  border: '1px solid #1F6427',
                  borderRadius: '8px',
                  backgroundColor: '#193022',
                  color: '#14E022',
                  width: '100%',
                }}>
                  <p style={{ fontSize: '14px', margin: '0' }}>✅ Transaction Successful</p>
                  <p style={{ fontSize: '12px', margin: '0', textWrap: 'wrap' }}>{signature}</p>
                  <a href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} style={{ fontSize: '14px', margin: '0', textDecoration: 'underline', fontWeight: '500'}}>view on explorer</a>
                </div>
              )}

            </div>

            <div style={{
              padding: '15px 20px',
              width: '100%',
              display: 'flex',
              justifyContent: 'end',
              gap: '5px',
            }}>
              <button onClick={handleCloseModal} style={{
                padding: '5px 16px',
                backgroundColor: '#21262D',
                border: '1px solid #30363D',
                borderRadius: '7px',
                fontSize: '14px',
              }}>Cancel</button>

              {/* this is pretty messy way, TODO: do it better */}
              { (tokenAmount > 0 && user?.account_addr) ? (
                <button onClick={() => sendBounty(tokenAmount, tokenType, user?.account_addr)} className="sol-send-bounty-button" style={{
                  padding: '5px 16px',
                  backgroundColor: '#238636',
                  border: '1px solid #3E924B',
                  borderRadius: '7px',
                  fontSize: '14px',
                }}>Send Bounty</button>
              ) : (
                <button style={{
                  padding: '5px 16px',
                  backgroundColor: '#21262D',
                  border: '1px solid #3E924B',
                  borderRadius: '7px',
                  fontSize: '14px',
                }}>Send Bounty</button>
              )}
            </div>
          </div>

        </section>
      )}
    </>
  )
}