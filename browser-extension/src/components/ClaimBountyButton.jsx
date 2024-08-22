import React, { useEffect, useState } from 'react';
import SolanaLogo from './img/SolanaLogo';
import { useDarkMode } from '../App';
import browser from 'webextension-polyfill';

const ClaimBountyButton = ({
  bounties,
}) => {
  const isDarkMode = useDarkMode();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [issues, setIssues] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    // TODO: fetch issues from API
    setIssues(bounties);
  }, []);

  const handleButtonClick = (event) => {
    event.preventDefault();
    console.log(`${selectedOption.id} clicked`);

    // TODO: send claim request to API
    browser.runtime.sendMessage({
      type: 'CLAIM_BOUNTY',
      bountyId: selectedOption.id,
      signature: 'some_signature',
    }).then(response => {
      console.log('we ball ', response);
    }).catch(err => {
      console.log('got fucked up', err);
    });
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const updateClaimButtonStyle = () => {
    const claimButton = document.querySelector('#solbounty-claim-button');
    claimButton.style.backgroundColor = '#238636';
    claimButton.style.border = 'solid 1px #3E924B';
    claimButton.children[0].style.backgroundColor = '#238636';
    claimButton.children[0].style.border = 'none';
    claimButton.children[0].style.borderRight = 'solid 1px #3E924B';
    claimButton.children[1].style.backgroundColor = '#238636';
  }

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    updateClaimButtonStyle();
    // TODO: change this bg color when selectedOption is not null
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleMouseOver = (option) => {
    const dropdownItem = document.querySelector(`#solbounty-dropdown-item-${option}`);
    dropdownItem.style.backgroundColor = '#1F6FEB';
    dropdownItem.style.color = '#ffffff';
    dropdownItem.children[1].style.color = '#ffffff';
  };
  
  const handleMouseOut = (option) => {
    const dropdownItem = document.getElementById(`solbounty-dropdown-item-${option}`);
    dropdownItem.style.backgroundColor = '#161B22';
    dropdownItem.style.color = '#ffffff';
    dropdownItem.children[1].style.color = '#8D96A0';
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div id='solbounty-claim-button' style={{display: 'flex', alignItems: 'center', border: '1px solid #444c56', borderRadius: '6px', backgroundColor: '#2f363d', overflow: 'hidden', transition: 'background-color 0.1s ease'}}>
        <button
          type="button"
          className="btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2.5px 8px',
            backgroundColor: '#2f363d',
            color: '#ffffff',
            borderTop: 'none',
            borderLeft: 'none',
            borderBottom: 'none',
            borderRight: 'solid 1px #444c56',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '12px',
            lineHeight: '1.66',
          }}
          disabled={!selectedOption}
          onClick={handleButtonClick}
        >
          <SolanaLogo height="11" />
          Claim for Issue {selectedOption ? `#${selectedOption.issue_number}` : ''}
        </button>
        <button
          className='solbounty-dropdown-toggle'
          type="button"
          onClick={handleDropdownToggle}
          style={{
            height: '100%',
            width: '40px',
            padding: '2.5px 8px',
            fontSize: '12px',
            lineHeight: '1.66',
            backgroundColor: '#2f363d',
            color: '#ffffff',
            border: 'none',
            borderRadius: '0',
            cursor: 'pointer',
          }}
        >
        </button>
      </div>

      {isDropdownOpen && (
        <div style={{ 
          position: 'absolute',
          top: '100%', left: '0', zIndex: 1, width: 'max-content', 
          borderRadius: '6px', border: '1px solid #282E35', overflow: 'hidden',
          backgroundColor: '#161B22', marginTop: '4px',
          maxWidth: '300px',
          whiteSpace: 'normal',
          maxHeight: '600px', overflowY: 'auto',
        }}>
          {issues.map((issue, index) => (
            <div
              key={issue.id}
              id={`solbounty-dropdown-item-${issue.id}`}
              className='solbounty-dropdown-item'
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                gap: '1px',
                padding: '10px 12px',
                borderBottom: index===issues.length-1 ? 'none' : '1px solid #282E35',
                backgroundColor: '#161B22',
                color: '#ffffff',
                cursor: 'pointer',
                fontSize: '12px',
                lineHeight: '16px',
                width: '100%',
                textAlign: 'left',
                transition: 'background-color 0.1s ease, color 0.1s ease',
              }}
              onClick={() => handleOptionChange(issue)}
              onMouseOver={() => handleMouseOver(issue.id)}
              onMouseOut={() => handleMouseOut(issue.id)}
            >
              <p style={{margin: '0', color: 'white'}}>#{issue.issue_number} • {issue.amount} {issue.token}</p>
              <p style={{margin: '0', color: '#8D96A0', fontSize: '11px', transition: 'color 0.1s ease'}}>{issue.issue_title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimBountyButton;