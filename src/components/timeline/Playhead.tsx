import React, { useContext } from 'react';
import useTimelineStore from '../../store/timelineStore';
import { TimelineContext } from './Timeline';

interface PlayheadProps {
  timelineRef: React.RefObject<HTMLDivElement>;
}

const Playhead: React.FC<PlayheadProps> = ({ timelineRef }) => {
  const playheadPosition = useTimelineStore(state => state.playheadPosition);
  const { beatToPixel } = useContext(TimelineContext);
  
  // Convert beat position to pixels
  const position = beatToPixel(playheadPosition);
  
  const handlePlayheadDrag = (e: React.MouseEvent) => {
    // Implement drag handling for manual positioning
    e.stopPropagation();
    
    const startX = e.clientX;
    const startPosition = playheadPosition;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!timelineRef.current) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const deltaX = moveEvent.clientX - startX;
      const pixelPosition = beatToPixel(startPosition) + deltaX;
      
      // Convert pixel position back to beats
      const newBeatPosition = Math.max(0, pixelPosition / beatToPixel(1));
      
      // Update playhead position
      useTimelineStore.getState().setPlayheadPosition(newBeatPosition);
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  return (
    <div className="playhead" style={{ left: `${position}px` }}>
      <div className="playhead-line"></div>
      <div 
        className="playhead-handle" 
        onMouseDown={handlePlayheadDrag}
      ></div>
    </div>
  );
};

export default Playhead;