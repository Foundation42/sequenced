import React, { useState } from 'react';
import TrackHeader from './TrackHeader';
import Track from './Track';

interface TrackGroupProps {
  id: string;
  name: string;
  tracks: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

const TrackGroup: React.FC<TrackGroupProps> = ({ id, name, tracks }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`track-group ${isCollapsed ? 'collapsed' : ''}`} data-group-id={id}>
      <TrackHeader 
        id={id} 
        name={name} 
        type="group" 
        isGroup={true}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      {!isCollapsed && (
        <div className="group-tracks">
          {tracks.map(track => (
            <Track key={track.id} id={track.id} name={track.name} type={track.type} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackGroup;