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
    // console.log(`${selectedOption.id} clicked`);

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
    claimButton.children[0].style.color = '#ffffff';
    claimButton.children[1].style.color = '#ffffff';
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
    dropdownItem.children[0].style.color = '#ffffff';
    dropdownItem.children[1].style.color = '#ffffff';
  };
  
  const handleMouseOut = (option) => {
    const dropdownItem = document.getElementById(`solbounty-dropdown-item-${option}`);
    dropdownItem.style.backgroundColor = isDarkMode ? '#161B22' : '#F6F8FA';
    dropdownItem.style.color = isDarkMode ? '#ffffff' : '#1F2329';
    dropdownItem.children[0].style.color = isDarkMode ? '#ffffff' : '#1F2329';
    dropdownItem.children[1].style.color = isDarkMode ? '#8D96A0' : '#636C76';
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <div id='solbounty-claim-button' style={{
        display: 'flex', alignItems: 'center', 
        border: isDarkMode ? 'solid 1px #30363D' : 'solid 1px #D0D7DE', borderRadius: '6px', 
        backgroundColor: isDarkMode ? '#21262D' : '#F6F8FA', 
        overflow: 'hidden', transition: 'background-color 0.1s ease'}}>
        <button
          type="button"
          className="btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '2.5px 8px',
            backgroundColor: isDarkMode ? '#21262D' : '#F6F8FA',
            color: isDarkMode ? '#ffffff' : '#24292F',
            borderTop: 'none',
            borderLeft: 'none',
            borderBottom: 'none',
            borderRight: isDarkMode ? 'solid 1px #30363D' : 'solid 1px #D0D7DE',
            borderRadius: '0',
            cursor: 'pointer',
            fontSize: '12px',
            lineHeight: '1.66',
          }}
          disabled={!selectedOption}
          onClick={handleButtonClick}
        >
          <SolanaLogo height="11" color={isDarkMode ? '#ffffff' : selectedOption ? '#ffffff' : '#24292F'} />
          Attempt for Issue {selectedOption ? `#${selectedOption.issue_number}` : ''}
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
            backgroundColor: isDarkMode ? '#21262D' : '#F6F8FA',
            color: isDarkMode ? '#ffffff' : '#24292F',
            border: 'none',
            borderRadius: '0',
            cursor: 'pointer',
          }}
        >
          <style>
            {`
              .solbounty-dropdown-toggle::after {
                content: "";
                display: inline-block;
                width: 0;
                height: 0;
                vertical-align: -2px;
                border: 4px solid ${isDarkMode ? '#ffffff' : selectedOption ? '#ffffff' : '#24292F'};
                border-right-color: transparent;
                border-bottom-color: transparent;
                border-left-color: transparent;
              }
            `}
          </style>
        </button>
      </div>

      {isDropdownOpen && (
        <div style={{ 
          position: 'absolute',
          top: '100%', left: '0', zIndex: 1, width: 'max-content', 
          borderRadius: '6px', overflow: 'hidden',
          border: isDarkMode ? '1px solid #282E35' : '1px solid #D0D7DE',
          backgroundColor: isDarkMode ? '#161B22' : '#F6F8FA',
          maxWidth: '300px', marginTop: '4px',
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
                borderBottom: index===issues.length-1 ? 'none' : isDarkMode ? '1px solid #282E35' : '1px solid #D0D7DE',
                backgroundColor: isDarkMode ? '#161B22' : '#F6F8FA',
                color: isDarkMode ? '#ffffff' : '#1F2329',
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
              <p style={{margin: '0', color: isDarkMode ? '#ffffff' : '#1F2329'}}>#{issue.issue_number} • {issue.amount} {issue.token}</p>
              <p style={{margin: '0', color: isDarkMode ? '#8D96A0' : '#636C76', fontSize: '11px', transition: 'color 0.1s ease'}}>{issue.issue_title}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimBountyButton;