import React from 'react';
import Device from './Device';

const DeviceChain: React.FC = () => {
  // This would come from the selected track's state
  const mockDevices = [
    { id: 'dev1', type: 'aiProcessor', name: 'AI Processor', enabled: true },
    { id: 'dev2', type: 'midiGenerator', name: 'MIDI Generator', enabled: true },
    { id: 'dev3', type: 'outputRouter', name: 'Output Router', enabled: true }
  ];

  return (
    <div className="device-chain">
      {mockDevices.map(device => (
        <Device 
          key={device.id}
          id={device.id}
          type={device.type}
          name={device.name}
          enabled={device.enabled}
        />
      ))}
      <button className="add-device-button">Add Device</button>
    </div>
  );
};

export default DeviceChain;