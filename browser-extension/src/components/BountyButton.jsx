import React from "react"
import SolanaLogo from "./SolanaLogo"

export default function BountyButton() {

  const handleOnClick = () => {
    console.log('Bounty button clicked');
    alert('only possible on solana?');
  }

  return (
    <button
      id="bounty-button"
      className="btn btn-primary flex items-center gap-2"
      onClick={handleOnClick}
    >
      <SolanaLogo height="14" />
      Bounty
    </button>
  )
}