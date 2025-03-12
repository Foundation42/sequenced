import React from 'react';

interface TrackHeaderProps {
  id: string;
  name: string;
  type: string;
  isGroup?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const TrackHeader: React.FC<TrackHeaderProps> = ({ 
  id, 
  name, 
  type, 
  isGroup = false,
  isCollapsed = false,
  onToggleCollapse
}) => {
  return (
    <div className="track-header">
      {isGroup && (
        <button 
          className="collapse-button"
          onClick={onToggleCollapse}
          aria-label={isCollapsed ? 'Expand track group' : 'Collapse track group'}
        >
          {isCollapsed ? '►' : '▼'}
        </button>
      )}
      
      <div className="track-color-indicator" data-track-type={type}></div>
      <div className="track-name">{name}</div>
      
      <div className="track-controls">
        <button className="track-mute-button" aria-label="Mute track">M</button>
        <button className="track-solo-button" aria-label="Solo track">S</button>
      </div>
    </div>
  );
};

export default TrackHeader;