import React, { useCallback, useContext } from 'react';
import Clip from '../clips/Clip';
import useTimelineStore from '../../store/timelineStore';
import useClipInteractions from '../../hooks/useClipInteractions';
import { TimelineContext } from './Timeline';

interface ClipContainerProps {
  trackId: string;
}

const ClipContainer: React.FC<ClipContainerProps> = ({ trackId }) => {
  const track = useTimelineStore(state => state.tracks[trackId]);
  const clips = useTimelineStore(state => 
    track?.clips.map(clipId => state.clips[clipId]).filter(Boolean) || []
  );
  const { pixelToBeat } = useContext(TimelineContext);
  const { snapBeatToGrid } = useClipInteractions();
  const addClip = useTimelineStore(state => state.addClip);
  
  // Handle click on the clip container to create new clips
  const handleContainerClick = useCallback((e: React.MouseEvent) => {
    // If not a double click, just handle selection
    if (e.detail === 1) {
      // Deselect all clips if clicking on empty area
      useTimelineStore.getState().deselectAllClips();
      useTimelineStore.getState().deselectAllTracks();
      return;
    }
    
    // Double click to create a new clip
    if (e.detail === 2) {
      // Calculate click position relative to container
      const container = e.currentTarget as HTMLElement;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left + container.scrollLeft;
      
      // Convert to beats and snap to grid
      const clickBeat = pixelToBeat(x);
      const snappedBeat = snapBeatToGrid(clickBeat);
      
      // Create the new clip
      const newClipId = addClip({
        trackId,
        startTime: snappedBeat,
        duration: 4, // Default duration of 4 beats
        content: '', // Empty content
        status: 'idle'
      });
      
      // Select the new clip
      useTimelineStore.getState().selectClip(newClipId);
    }
  }, [trackId, pixelToBeat, snapBeatToGrid, addClip]);
  
  return (
    <div 
      className="clip-container"
      onClick={handleContainerClick}
    >
      {clips.map(clip => clip && (
        <Clip key={clip.id} id={clip.id} />
      ))}
    </div>
  );
};

export default ClipContainer;