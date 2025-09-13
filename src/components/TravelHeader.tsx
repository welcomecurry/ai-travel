'use client';

import React, { useState } from 'react';

interface TravelHeaderProps {
  tripName?: string;
  currentCurrency?: string;
  userInitial?: string;
  userColor?: string;
}

const TravelHeader: React.FC<TravelHeaderProps> = ({ 
  tripName = "Trip Planning", 
  currentCurrency = "USD",
  userInitial = "A",
  userColor = "#86944d"
}) => {
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currencies = [
    { code: "USD", symbol: "$" },
    { code: "EUR", symbol: "€" },
    { code: "GBP", symbol: "£" },
    { code: "MXN", symbol: "$" },
    { code: "CAD", symbol: "C$" },
    { code: "AUD", symbol: "A$" },
    { code: "JPY", symbol: "¥" }
  ];

  const handleCurrencyChange = (currency: string) => {
    // TODO: Implement currency change logic
    console.log('Currency changed to:', currency);
    setShowCurrencyDropdown(false);
  };

  return (
    <div className="sidebar-header">
      <div className="sidebar-logo-wrapper">
        <a className="sidebar-logo-link" href="/">
          <div className="sidebar-logo">
            <div className="layla-avatar">
              <svg className="w-8 h-8 text-teal-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </a>
        <div className="name-trip-wrapper">
          <span>{tripName}</span>
        </div>
      </div>

      <div className="header-controls">
        {/* Currency and Locale Selector */}
        <div className="dropdown-menu-container">
          <div className="currency-and-locale-button">
            <button 
              className="currency-button-curr"
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            >
              {currentCurrency}
            </button>
            <hr className="currency-divider" />
            <button className="locale-button">
              <span className="flag-icon fi-us"></span>
            </button>
          </div>
          
          {/* Currency Dropdown */}
          {showCurrencyDropdown && (
            <div className="currency-dropdown">
              {currencies.map((currency) => (
                <button
                  key={currency.code}
                  className="currency-option"
                  onClick={() => handleCurrencyChange(currency.code)}
                >
                  {currency.code} ({currency.symbol})
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="menu-button-container">
          <button 
            className="menu-button"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div 
              className="user-avatar" 
              style={{ backgroundColor: userColor }}
            >
              {userInitial}
            </div>
            <img 
              alt="Menu" 
              loading="lazy" 
              width="18" 
              height="18" 
              src="/menu-icon.svg" 
            />
          </button>
          
          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="user-menu-dropdown">
              <button className="menu-item">Profile</button>
              <button className="menu-item">Settings</button>
              <button className="menu-item">Help</button>
              <hr className="menu-divider" />
              <button className="menu-item">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TravelHeader;

