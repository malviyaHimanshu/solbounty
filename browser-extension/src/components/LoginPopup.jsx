import React, { useState } from "react"
import SolanaLogo from "./img/SolanaLogo";
import { useDarkMode } from "../App";

export default function LoginPopup() {
  const isDarkMode = useDarkMode();
  const [show, setShow] = useState(true);
  const loginUrl = 'http://localhost:3000/login';

  const handleClose = () => {
    setShow(false);
  }

  return (
    <>
      {show && (
        <div style={{
          zIndex: '9999',
          position: 'fixed',
          right: '20px',
          bottom: '20px',
          borderRadius: '10px',
          backgroundColor: isDarkMode ? '#161B22':'#F6F8FA',
          border: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
          display: 'flex',
          alignItems: 'center',
          color: isDarkMode ? '#ffffff':'#1F2329',
          boxShadow: '0px 10px 50px 0px rgba(0,0,0,0.1)',
        }}>

          <div onClick={handleClose} style={{
            position: 'absolute',
            top: '-10px',
            right: '-10px',
            padding: '5px',
            borderRadius: '99999px',
            backgroundColor: isDarkMode ? '#30363D':'#D0D7DE',
            color: isDarkMode ? '#ffffff':'#1F2329',
            display: 'grid',
            placeContent: 'center',
            cursor: 'pointer',
          }}>
            <svg height="13" style={{ width: 'auto' }} fill="none" viewBox="0 0 24 24">
              <path stroke={isDarkMode ? '#ffffff':'#1F2329'} stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m6 18 6-6m0 0 6-6m-6 6L6 6m6 6 6 6"/>
            </svg>
          </div>

          <div style={{
            fontSize: '20px',
            padding: '20px 25px',
            borderRight: `1px solid ${isDarkMode ? '#30363D':'#D0D7DE'}`,
            display: 'grid',
            placeContent: 'center',
            height: '100%'
          }}>
            {/* <svg height="40" style={{ width: 'auto' }} fill="none" viewBox="0 0 24 24">
              <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.189 9a15 15 0 0 1 2.654 2.556c.105.13.157.287.157.444m-2.811 3a14.998 14.998 0 0 0 2.654-2.556A.704.704 0 0 0 21 12m0 0H8m5-7.472A6 6 0 0 0 3 9v6a6 6 0 0 0 10 4.472"/>
            </svg> */}
            <SolanaLogo height="25" color={isDarkMode ? '#ffffff':'#1F2329'} />
          </div>

          <div style={{
            padding: '15px 20px',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'start',
            alignItems: 'start',
            gap: '3px',
          }}>
            <p style={{fontSize: '18px', fontWeight: '500', margin: '0'}}>You are not logged In!</p>
            <p style={{margin: '0'}}>Login to <a style={{textDecoration: 'underline'}} href={loginUrl} target="_blank">solbounty</a> to continue.</p>
          </div>
        </div>
      )}    
    </>

  )
}