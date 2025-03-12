import { useCallback, useContext } from 'react';
import useTimelineStore from '../store/timelineStore';
import { TimelineContext } from '../components/timeline/Timeline';

interface ClipInteractionOptions {
  snapToGrid?: boolean;
  gridSize?: number;
}

/**
 * Hook for managing clip interactions (drag, resize, select, etc.)
 */
const useClipInteractions = (options: ClipInteractionOptions = {}) => {
  const {
    snapToGrid = true,
    gridSize = 0.25 // Default to 1/4 beat grid
  } = options;
  
  const {
    selectClip,
    deselectClip,
    deselectAllClips,
    moveClip,
    resizeClip,
    removeClip
  } = useTimelineStore();
  
  const { pixelToBeat, beatToPixel } = useContext(TimelineContext);
  
  // Snap a beat value to the grid
  const snapBeatToGrid = useCallback((beat: number) => {
    if (!snapToGrid) return beat;
    return Math.round(beat / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);
  
  // Handle selecting a clip
  const handleClipSelect = useCallback((clipId: string, event: React.MouseEvent) => {
    // If shift is held, this is a multi-select
    if (event.shiftKey) {
      selectClip(clipId, true);
    } else {
      selectClip(clipId, false);
    }
  }, [selectClip]);
  
  // Handle dragging a clip
  const handleClipDrag = useCallback((
    clipId: string, 
    event: React.MouseEvent,
    containerRef: React.RefObject<HTMLDivElement>
  ) => {
    event.stopPropagation();
    event.preventDefault();
    
    const clip = useTimelineStore.getState().clips[clipId];
    if (!clip) return;
    
    // Get initial values
    const startX = event.clientX;
    const startY = event.clientY;
    const initialPosition = clip.startTime;
    const initialTrackId = clip.trackId;
    
    // First, select the clip if not already selected
    handleClipSelect(clipId, event);
    
    // Setup mouse move handler
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      
      // Calculate delta in pixels
      const deltaX = moveEvent.clientX - startX;
      
      // Convert to beats
      const deltaBeat = pixelToBeat(deltaX);
      
      // Calculate new position
      let newPosition = initialPosition + deltaBeat;
      
      // Snap to grid if enabled
      if (snapToGrid) {
        newPosition = snapBeatToGrid(newPosition);
      }
      
      // Ensure position is not negative
      newPosition = Math.max(0, newPosition);
      
      // Track detection for drag between tracks
      const deltaY = moveEvent.clientY - startY;
      let newTrackId = initialTrackId;
      
      if (Math.abs(deltaY) > 20) { // Only consider track change if significant vertical movement
        // Find the track at the current vertical position
        // This is a simplified approach - in a real app we would need more complex track detection
        const tracksArray = Object.values(useTimelineStore.getState().tracks);
        tracksArray.sort((a, b) => a.position - b.position);
        
        const trackHeight = 80; // This should match the CSS track height
        const trackIndex = Math.floor(deltaY / trackHeight) + tracksArray.findIndex(t => t.id === initialTrackId);
        
        if (trackIndex >= 0 && trackIndex < tracksArray.length) {
          const track = tracksArray[trackIndex];
          if (track) {
            newTrackId = track.id;
          }
        }
      }
      
      // Move the clip
      moveClip(clipId, newPosition, newTrackId);
    };
    
    // Setup mouse up handler
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Register event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [pixelToBeat, snapBeatToGrid, moveClip, handleClipSelect]);
  
  // Handle resizing a clip
  const handleClipResize = useCallback((
    clipId: string, 
    event: React.MouseEvent,
    direction: 'left' | 'right'
  ) => {
    event.stopPropagation();
    event.preventDefault();
    
    const clip = useTimelineStore.getState().clips[clipId];
    if (!clip) return;
    
    // Get initial values
    const startX = event.clientX;
    const initialDuration = clip.duration;
    const initialPosition = clip.startTime;
    
    // Setup mouse move handler
    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Calculate delta in pixels
      const deltaX = moveEvent.clientX - startX;
      
      // Convert to beats
      const deltaBeat = pixelToBeat(deltaX);
      
      if (direction === 'right') {
        // Resize by changing duration
        let newDuration = initialDuration + deltaBeat;
        
        // Snap to grid if enabled
        if (snapToGrid) {
          newDuration = snapBeatToGrid(newDuration);
        }
        
        // Ensure minimum duration
        newDuration = Math.max(gridSize, newDuration);
        
        // Update the clip
        resizeClip(clipId, newDuration);
      } else if (direction === 'left') {
        // Resize by changing start time and duration
        let newPosition = initialPosition + deltaBeat;
        
        // Snap to grid if enabled
        if (snapToGrid) {
          newPosition = snapBeatToGrid(newPosition);
        }
        
        // Ensure position is not negative
        newPosition = Math.max(0, newPosition);
        
        // Calculate new duration to maintain end point
        const originalEnd = initialPosition + initialDuration;
        const newDuration = originalEnd - newPosition;
        
        // Only update if new duration is valid
        if (newDuration >= gridSize) {
          moveClip(clipId, newPosition);
          resizeClip(clipId, newDuration);
        }
      }
    };
    
    // Setup mouse up handler
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    // Register event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [pixelToBeat, snapBeatToGrid, moveClip, resizeClip, gridSize]);
  
  // Handle deleting a clip
  const handleClipDelete = useCallback((clipId: string) => {
    removeClip(clipId);
  }, [removeClip]);
  
  return {
    handleClipSelect,
    handleClipDrag,
    handleClipResize,
    handleClipDelete,
    snapBeatToGrid
  };
};

export default useClipInteractions;