import React, { useCallback } from 'react';
import Track from './Track';
import TrackGroup from './TrackGroup';
import useTimelineStore from '../../store/timelineStore';

const TrackList: React.FC = () => {
  const tracks = useTimelineStore(state => {
    const allTracks = Object.values(state.tracks);
    // Sort tracks by position
    return [...allTracks].sort((a, b) => a.position - b.position);
  });
  
  const addTrack = useTimelineStore(state => state.addTrack);
  
  const handleAddTrack = useCallback(() => {
    const trackType = 'midi'; // Default track type
    addTrack({
      name: `Track ${tracks.length + 1}`,
      type: trackType
    });
  }, [tracks.length, addTrack]);
  
  const handleAddGroup = useCallback(() => {
    addTrack({
      name: `Group ${tracks.filter(track => track.isGroup).length + 1}`,
      type: 'group',
      isGroup: true
    });
  }, [tracks, addTrack]);
  
  // Separate tracks and groups, filtering out tracks that belong to groups
  // (they will be rendered by their parent group component)
  const topLevelTracks = tracks.filter(track => !track.groupId);
  
  return (
    <div className="track-list">
      {topLevelTracks.map(track => (
        track.isGroup ? (
          <TrackGroup key={track.id} id={track.id} />
        ) : (
          <Track key={track.id} id={track.id} />
        )
      ))}
      
      <div className="track-actions">
        <button 
          className="add-track-button"
          onClick={handleAddTrack}
        >
          Add Track
        </button>
        
        <button 
          className="add-group-button"
          onClick={handleAddGroup}
        >
          Add Group
        </button>
      </div>
    </div>
  );
};

export default TrackList;