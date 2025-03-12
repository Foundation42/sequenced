import React, { useState } from 'react';
import TrackHeader from './TrackHeader';
import Track from './Track';
import useTimelineStore from '../../store/timelineStore';

interface TrackGroupProps {
  id: string;
}

const TrackGroup: React.FC<TrackGroupProps> = ({ id }) => {
  const group = useTimelineStore(state => state.tracks[id]);
  const childTracks = useTimelineStore(state => {
    // Get tracks that belong to this group
    const allTracks = Object.values(state.tracks);
    return allTracks
      .filter(track => track.groupId === id)
      .sort((a, b) => a.position - b.position);
  });
  
  const selectedTrackIds = useTimelineStore(state => state.selectedTrackIds);
  const isSelected = selectedTrackIds.includes(id);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  if (!group || !group.isGroup) return null;
  
  const handleGroupClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.shiftKey) {
      // Multi-select with shift key
      useTimelineStore.getState().selectTrack(id, true);
    } else {
      // Single select
      useTimelineStore.getState().selectTrack(id, false);
    }
  };
  
  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div 
      className={`track-group ${isCollapsed ? 'collapsed' : ''} ${isSelected ? 'selected' : ''}`} 
      data-group-id={id}
      onClick={handleGroupClick}
    >
      <div className="track-group-header">
        <TrackHeader id={id} />
        <button 
          className="collapse-button"
          onClick={handleToggleCollapse}
          aria-label={isCollapsed ? 'Expand track group' : 'Collapse track group'}
        >
          {isCollapsed ? '►' : '▼'}
        </button>
      </div>
      
      {!isCollapsed && (
        <div className="group-tracks">
          {childTracks.map(track => (
            <Track key={track.id} id={track.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrackGroup;