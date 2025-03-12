import React from 'react';
import useTimelineStore from '../../store/timelineStore';

interface TrackHeaderProps {
  id: string;
}

const TrackHeader: React.FC<TrackHeaderProps> = ({ id }) => {
  const track = useTimelineStore(state => state.tracks[id]);
  
  if (!track) return null;
  
  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    useTimelineStore.getState().updateTrack(id, { muted: !track.muted });
  };
  
  const handleSoloToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    useTimelineStore.getState().updateTrack(id, { solo: !track.solo });
  };

  return (
    <div className="track-header" onClick={(e) => e.stopPropagation()}>
      <div className="track-color-indicator" data-track-type={track.type}></div>
      <div className="track-name">{track.name}</div>
      
      <div className="track-controls">
        <button 
          className={`track-mute-button ${track.muted ? 'active' : ''}`} 
          aria-label={`${track.muted ? 'Unmute' : 'Mute'} track`}
          onClick={handleMuteToggle}
        >
          M
        </button>
        <button 
          className={`track-solo-button ${track.solo ? 'active' : ''}`} 
          aria-label={`${track.solo ? 'Unsolo' : 'Solo'} track`}
          onClick={handleSoloToggle}
        >
          S
        </button>
      </div>
    </div>
  );
};

export default TrackHeader;