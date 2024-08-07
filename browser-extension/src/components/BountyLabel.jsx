import React from "react";
import USDCLogo from "./img/USDCLogo";
import { useDarkMode } from "../App";

export default function BountyLabel({
  bountyAmount = 25,
}) {

  const isDarkMode = useDarkMode();

  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
      width: 'fit-content',
      gap: '2px',
      border: `1.1px solid ${isDarkMode ? '#1F6427' : '#0C8A17'}`,
      backgroundColor: isDarkMode ? '#193022' : '#0C8A17',
      color: isDarkMode ? '#14E022' : 'white',
      paddingLeft: '7px',
      paddingRight: '7px',
      lineHeight: '22px',
      fontSize: '12px',
      borderRadius: '9999px',
    }}>
      <USDCLogo height="13" /> {bountyAmount} USDC
    </span>
  );
}