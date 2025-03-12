import React, { useState } from 'react';
import DeviceChain from '../devices/DeviceChain';

const DevicePanel: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`device-panel ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="panel-header">
        <h3>Devices</h3>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
        >
          {isCollapsed ? '↑' : '↓'}
        </button>
      </div>
      {!isCollapsed && (
        <div className="panel-content">
          <DeviceChain />
        </div>
      )}
    </div>
  );
};

export default DevicePanel;