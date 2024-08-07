import React from "react"
import SolanaLogo from "./img/SolanaLogo"

export default function BountyButton() {

  const handleOnClick = () => {
    console.log('Bounty button clicked');
    alert('only possible on solana?');
  }

  return (
    <button
      id="bounty-button"
      className="btn btn-primary"
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      onClick={handleOnClick}
    >
      <SolanaLogo height="14" />
      Bounty
    </button>
  )
}