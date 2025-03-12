import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo">Sequenced</div>
      <nav className="main-nav">
        <button>New</button>
        <button>Open</button>
        <button>Save</button>
      </nav>
      <div className="user-controls">
        <button>Settings</button>
      </div>
    </header>
  );
};

export default Header;