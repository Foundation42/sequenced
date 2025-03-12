import React, { useState, useRef, useContext } from 'react';
import ClipContent from './ClipContent';
import ClipStatusIndicator from './ClipStatusIndicator';
import useTimelineStore from '../../store/timelineStore';
import useClipInteractions from '../../hooks/useClipInteractions';
import { TimelineContext } from '../timeline/Timeline';

interface ClipProps {
  id: string;
}

const Clip: React.FC<ClipProps> = ({ id }) => {
  const clip = useTimelineStore(state => state.clips[id]);
  const selectedClipIds = useTimelineStore(state => state.selectedClipIds);
  const isSelected = selectedClipIds.includes(id);
  
  const [isEditing, setIsEditing] = useState(false);
  const clipRef = useRef<HTMLDivElement>(null);
  
  const { beatToPixel } = useContext(TimelineContext);
  
  const { 
    handleClipSelect,
    handleClipDrag,
    handleClipResize
  } = useClipInteractions({ snapToGrid: true, gridSize: 0.25 });
  
  if (!clip) return null;
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };
  
  const handleCloseEditor = () => {
    setIsEditing(false);
  };
  
  // Calculate position and width based on start time and duration
  const left = beatToPixel(clip.startTime);
  const width = beatToPixel(clip.duration);
  
  return (
    <>
      <div 
        ref={clipRef}
        className={`clip clip-status-${clip.status} ${isSelected ? 'selected' : ''}`}
        style={{
          left: `${left}px`,
          width: `${width}px`
        }}
        onClick={(e) => handleClipSelect(id, e)}
        onDoubleClick={handleDoubleClick}
        onMouseDown={(e) => handleClipDrag(id, e, clipRef)}
        data-clip-id={id}
      >
        <div className="clip-preview">
          {clip.content.substring(0, 50)}{clip.content.length > 50 ? '...' : ''}
        </div>
        <ClipStatusIndicator status={clip.status} />
        
        {/* Resize handles */}
        <div 
          className="clip-resize-handle clip-resize-handle-left"
          onMouseDown={(e) => handleClipResize(id, e, 'left')}
        />
        <div 
          className="clip-resize-handle clip-resize-handle-right"
          onMouseDown={(e) => handleClipResize(id, e, 'right')}
        />
      </div>
      
      {isEditing && (
        <ClipContent 
          id={id}
          content={clip.content} 
          onClose={handleCloseEditor}
        />
      )}
    </>
  );
};

export default Clip;