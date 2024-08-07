import React from "react";
import USDCLogo from "./img/USDCLogo";
import { useDarkMode } from "../App";

export default function BountyLabel({
  bountyAmount = 25,
  size = 'md',
  isClaimed = false,
}) {

  const isDarkMode = useDarkMode();

  const sizeStyles = {
    sm: {
      paddingLeft: '5px',
      paddingRight: '5px',
      lineHeight: '18px',
      fontSize: '10px',
    },
    md: {
      paddingLeft: '7px',
      paddingRight: '7px',
      lineHeight: '22px',
      fontSize: '12px',
    },
    lg: {
      paddingLeft: '12px',
      paddingRight: '12px',
      paddingTop: '2px',
      paddingBottom: '2px',
      lineHeight: '26px',
      fontSize: '14px',
      fontWeight: '500',
      height: '100%',
    },
  };

  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
      width: 'fit-content',
      gap: '2px',
      border: `1.1px solid ${isClaimed
        ? isDarkMode
          ? '#30363D'     // isDarkMode=true, isClaimed=true
          : '#D0D7DE'     // isDarkMode=false, isClaimed=true
        : isDarkMode 
          ? '#1F6427'     // isDarkMode=true, isClaimed=false
          : '#0C8A17'     // isDarkMode=false, isClaimed=false
      }`,
      backgroundColor: isClaimed
        ? isDarkMode
          ? '#161B22'     // isDarkMode=true, isClaimed=true
          : '#F6F8FA'     // isDarkMode=false, isClaimed=true
        : isDarkMode
          ? '#193022'     // isDarkMode=true, isClaimed=false
          : '#0C8A17',    // isDarkMode=false, isClaimed=false
      color: isClaimed
        ? isDarkMode
          ? '#8D96A0'     // isDarkMode=true, isClaimed=true
          : '#636C76'     // isDarkMode=false, isClaimed=true
        : isDarkMode
          ? '#14E022'     // isDarkMode=true, isClaimed=false
          : 'white',      // isDarkMode=false, isClaimed=false
      borderRadius: '9999px',
      ...sizeStyles[size],
    }}>
      <USDCLogo height={size === 'sm' ? '11' : size === 'md' ? '13' : '15'} /> {bountyAmount} USDC {isClaimed ? '• ✅ Claimed' : ''}
    </span>
  );
}