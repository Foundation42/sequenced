import React from 'react';
import TrackHeader from './TrackHeader';
import ClipContainer from './ClipContainer';
import useTimelineStore from '../../store/timelineStore';

interface TrackProps {
  id: string;
}

const Track: React.FC<TrackProps> = ({ id }) => {
  const track = useTimelineStore(state => state.tracks[id]);
  const selectedTrackIds = useTimelineStore(state => state.selectedTrackIds);
  const isSelected = selectedTrackIds.includes(id);
  
  if (!track) return null;
  
  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (e.shiftKey) {
      // Multi-select with shift key
      useTimelineStore.getState().selectTrack(id, true);
    } else {
      // Single select
      useTimelineStore.getState().selectTrack(id, false);
    }
  };
  
  return (
    <div 
      className={`track track-${track.type} ${isSelected ? 'selected' : ''}`} 
      data-track-id={id}
      onClick={handleTrackClick}
      style={{ height: `${track.height}px` }}
    >
      <TrackHeader id={id} />
      <ClipContainer trackId={id} />
    </div>
  );
};

export default Track;