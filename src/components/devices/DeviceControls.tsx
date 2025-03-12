import React from 'react';

interface DeviceControlsProps {
  deviceId: string;
  deviceType: string;
}

const DeviceControls: React.FC<DeviceControlsProps> = ({ deviceId, deviceType }) => {
  // These would be dynamically generated based on device type
  const mockParameters = [
    { id: 'param1', name: 'Intensity', type: 'range', min: 0, max: 100, defaultValue: 50 },
    { id: 'param2', name: 'Quality', type: 'select', options: ['Low', 'Medium', 'High'], defaultValue: 'Medium' },
    { id: 'param3', name: 'Enable Feature', type: 'checkbox', defaultValue: true }
  ];

  const renderControl = (param: any) => {
    switch (param.type) {
      case 'range':
        return (
          <div className="parameter-control slider-control">
            <input 
              type="range" 
              id={`${deviceId}-${param.id}`}
              min={param.min}
              max={param.max}
              defaultValue={param.defaultValue}
            />
            <span className="parameter-value">{param.defaultValue}</span>
          </div>
        );
      
      case 'select':
        return (
          <div className="parameter-control select-control">
            <select 
              id={`${deviceId}-${param.id}`}
              defaultValue={param.defaultValue}
            >
              {param.options.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="parameter-control checkbox-control">
            <input 
              type="checkbox" 
              id={`${deviceId}-${param.id}`}
              defaultChecked={param.defaultValue}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="device-parameters">
      {mockParameters.map(param => (
        <div key={param.id} className="parameter">
          <label htmlFor={`${deviceId}-${param.id}`}>{param.name}</label>
          {renderControl(param)}
        </div>
      ))}
      
      <div className="device-presets">
        <label>Preset:</label>
        <select>
          <option value="default">Default</option>
          <option value="preset1">Preset 1</option>
          <option value="preset2">Preset 2</option>
        </select>
        <button className="save-preset-button">Save</button>
      </div>
    </div>
  );
};

export default DeviceControls;