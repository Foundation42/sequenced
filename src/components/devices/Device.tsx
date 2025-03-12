import React, { useState } from 'react';
import DeviceControls from './DeviceControls';

interface DeviceProps {
  id: string;
  type: string;
  name: string;
  enabled: boolean;
}

const Device: React.FC<DeviceProps> = ({ id, type, name, enabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeviceEnabled, setIsDeviceEnabled] = useState(enabled);

  return (
    <div className={`device device-${type} ${isDeviceEnabled ? 'enabled' : 'disabled'}`}>
      <div className="device-header">
        <div className="device-title">{name}</div>
        <div className="device-controls">
          <button 
            className="toggle-device-button"
            onClick={() => setIsDeviceEnabled(!isDeviceEnabled)}
            aria-label={isDeviceEnabled ? 'Disable device' : 'Enable device'}
          >
            {isDeviceEnabled ? 'On' : 'Off'}
          </button>
          <button 
            className="expand-device-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse device' : 'Expand device'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </div>
      </div>
      
      {isExpanded && <DeviceControls deviceId={id} deviceType={type} />}
    </div>
  );
};

export default Device;