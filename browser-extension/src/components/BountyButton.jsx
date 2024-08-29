import React, { useEffect, useState } from "react"
import SolanaLogo from "./img/SolanaLogo"
import { useDarkMode } from "../App";
import browser from "webextension-polyfill";

// TODO: add loading while waiting for transaction to complete
export default function BountyButton({
  title,
  userDetails,
  prUrl
}) {
  const isDarkMode = useDarkMode();
  const [user, setUser] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tokenAmount, setTokenAmount] = useState(0);
  const [tokenType, setTokenType] = useState("SOL");
  const [signature, setSignature] = useState(null);
  const [transactionError, setTransactionError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(userDetails);
    
    const handleMessage = (event) => {
      if(event.data.type === "SOLANA_BLOCKHASH_REQUEST") {

        browser.runtime.sendMessage({
          type: "GET_RECENT_BLOCKHASH"
        }).then(response => {
          // console.log("this is the blockhash content got", response.data);
          // send blockhash to pageScript.js
          window.postMessage({
            type: "SOLANA_BLOCKHASH_RESPONSE",
            blockhash: response.data
          }, "*"); // TODO: update target origin to be restrictive
        }).catch(error => {
          // console.log('failed to get latest blockhash: ', error);
          setTransactionError(error.message);
          window.postMessage({
            type: "SOLANA_BLOCKHASH_RESPONSE",
            error: error.message
          }, "*");
        })
        
      } else if(event.data.type === "SOLANA_SEND_RAW_TRANSACTION") {

        browser.runtime.sendMessage({
          type: "SEND_RAW_TRANSACTION",
          serialisedTransaction: event.data.serialisedTransaction,
          transactionDetails: {
            payer: event.data.payer,
            recipient: event.data.recipient,
            amount: event.data.amount,
            tokenType: event.data.tokenType,
            pr_url: prUrl.toString()
          }
        }).then(response => {
          if(response.error) {
            throw new Error(response.error);
          }
          // console.log("this is the signature content got", response.data);
          // send signature to pageScript.js
          window.postMessage({
            type: "SOLANA_SEND_RAW_TRANSACTION_RESPONSE",
            signature: response.data
          }, "*");
        }).catch(error => {
          // console.log('failed to send raw transaction: ', error);
          setTransactionError(error.message);
          window.postMessage({
            type: "SOLANA_SEND_RAW_TRANSACTION_RESPONSE",
            error: error.message
          }, "*");
        });

      } else if(event.data.type === "SOLANA_SIGN_RESPONSE") {
        if (event.data.error) {
          // console.error("error with signature: ", event.data.error);
          setTransactionError(event.data.error);
        } else {
          // console.log("final signature: ", event.data.signature);
          setIsLoading(false);
          setSignature(event.data.signature);
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
    setIsLoading(true);
    window.postMessage({ 
      type: "SOLANA_SIGN_REQUEST",
      recipient,
      amount,
      token
    }, "*"); // TODO: target origin needs to be restrictive
  }

  const handleOnClick = (event) => {
    event.preventDefault();
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleTokenAmountChange = (e) => {
    const inputValue = e.target.value;
    const regex = /^\d*\.?\d{0,9}$/;
    const totalDigits = inputValue.length;

    if (totalDigits <= 20 && regex.test(inputValue)) {
      setTokenAmount(inputValue);
    }
  }

  const handleTokenTypeChange = (e) => {
    setTokenType(e.target.value);
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
          backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.3)':'rgba(0, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          
          <div className="sol-bounty-modal-content" style={{
            backgroundColor: isDarkMode ? '#161B22':'#F6F8FA',
            border: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
            color: isDarkMode ? '#ffffff':'#1F2329',
            borderRadius: '12px',
            boxShadow: '0px 10px 100px 0px rgba(0,0,0,0.3)',
          }}>
            <div style={{
              padding: '15px 20px',
            }}>
              <h1 style={{ fontWeight: 500, fontSize: '16px' }}>Send a bounty</h1>
            </div>

            <div style={{
              borderTop: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
              padding: '15px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              width: '400px',
              maxWidth: '400px',
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
                  border: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
                  backgroundColor: isDarkMode?'#161B22':'#F6F8FA',
                  padding: '5px 16px 5px 0',
                }}>
                  <input
                    type="number"
                    disabled={isLoading || (signature && !transactionError) || transactionError}
                    value={tokenAmount || ''}
                    style={{
                      fontSize: '14px',
                      borderRadius: '8px',
                      padding: '3px 12px',
                      border: 'none',
                      outline: 'none',
                      backgroundColor: isDarkMode?'#161B22':'#F6F8FA',
                      color: isDarkMode ? '#ffffff':'#1F2329',
                      width: '100%',
                    }}
                    min={0}
                    onChange={handleTokenAmountChange}
                  />

                  <select onChange={handleTokenTypeChange} style={{
                    backgroundColor: isDarkMode?'#161B22':'#F6F8FA',
                    color: isDarkMode ? '#ffffff':'#1F2329',
                    border: 'none',
                    outline: 'none',
                    fontSize: '14px',
                    opacity: '0.5',
                  }}>
                    <option value="SOL">SOL</option>
                    {/* <option value="USDC">USDC</option> */}
                  </select>
                </div>

                {/* TODO: get realtime equivalent USD */}
                {/* <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  <p style={{ fontSize: '14px', opacity: '0.5' }}>{'~$0.15'}</p>
                  <p style={{ fontSize: '14px', opacity: '0.5' }}>Available: {'0.1 SOL'}</p>
                </div> */}
              </div>
              
              {(signature && !transactionError) && (
                <div style={{
                  padding: '10px',
                  border: `1px solid ${isDarkMode ? '#1F6427':'#4ade80'}`,
                  borderRadius: '8px',
                  backgroundColor: isDarkMode ? '#193022':'#bbf7d0',
                  color: isDarkMode ? '#14E022':'#16a34a',
                  width: '100%',
                }}>
                  <p style={{ fontSize: '14px', margin: '0' }}>✅ Transaction sent!</p>
                  <p style={{ fontSize: '12px', margin: '0', wordWrap: 'break-word', fontFamily: 'monospace' }}>{signature}</p>
                  <a target="_blank" href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`} style={{ fontSize: '14px', margin: '0', textDecoration: 'underline', fontWeight: '500'}}>view on explorer</a>
                </div>
              )}

              {transactionError && (
                <div style={{
                  padding: '10px',
                  border: `1px solid ${isDarkMode ? '#991b1b' : '#f87171'}`,
                  borderRadius: '8px',
                  backgroundColor: isDarkMode ? '#450a0a':'#fecaca',
                  color: isDarkMode ? '#f87171':'#dc2626',
                  width: '100%',
                }}>
                  <p style={{ fontSize: '14px', margin: '0' }}>❌ Transaction failed, try again!</p>
                  <p style={{ fontSize: '12px', margin: '0', textWrap: 'wrap' }}>{transactionError}</p>
                </div>
              )}

            </div>

            <div style={{
              marginTop: '10px',
              borderTop: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
              padding: '15px 20px',
              width: '100%',
              display: 'flex',
              justifyContent: 'end',
              gap: '5px',
            }}>
              {(signature && !transactionError) ? (
                <button onClick={handleCloseModal} style={{
                  padding: '5px 16px',
                  backgroundColor: '#238636',
                  border: '1px solid #3E924B',
                  borderRadius: '7px',
                  fontSize: '14px',
                  color: '#ffffff',
                }}>Done</button>
              ) : (
                <button onClick={handleCloseModal} style={{
                  padding: '5px 16px',
                  backgroundColor: isDarkMode ? '#21262D':'#F6F8FA',
                  border: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
                  color: isDarkMode ? '#ffffff':'#1F2329',
                  borderRadius: '7px',
                  fontSize: '14px',
                }}>Cancel</button>
              )}

              {/* this is pretty messy way, TODO: do it better */}
              { !(signature && !transactionError) && (
                (tokenAmount > 0 && user?.account_addr) ? (
                  <button onClick={() => sendBounty(tokenAmount, tokenType, user?.account_addr)} style={{
                    padding: '5px 16px',
                    backgroundColor: '#238636',
                    border: '1px solid #3E924B',
                    borderRadius: '7px',
                    fontSize: '14px',
                    color: '#ffffff',
                  }}>{ isLoading ? 'Loading...' : 'Send Bounty'}</button>
                ) : (
                  <button style={{
                    padding: '5px 16px',
                    opacity: '0.7',
                    cursor: 'not-allowed',
                    backgroundColor: isDarkMode ? '#21262D':'#F6F8FA',
                    border: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
                    borderRadius: '7px',
                    fontSize: '14px',
                    color: isDarkMode ? '#ffffff':'#1F2329',
                  }}>Send Bounty</button>
                )
              )}
            </div>
          </div>

        </section>
      )}
    </>
  )
}