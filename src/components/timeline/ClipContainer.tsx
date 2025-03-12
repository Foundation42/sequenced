import React from 'react';
import Clip from '../clips/Clip';

interface ClipContainerProps {
  trackId: string;
}

const ClipContainer: React.FC<ClipContainerProps> = ({ trackId }) => {
  // Mock clips, would come from state
  const mockClips = [
    { id: 'clip1', content: 'Generate a funky bass line', startTime: 0, duration: 4 },
    { id: 'clip2', content: 'Create a drum pattern with emphasis on the off-beat', startTime: 4, duration: 4 }
  ];
  
  const clipWidthUnit = 100; // px per time unit
  
  return (
    <div className="clip-container">
      {mockClips.map(clip => (
        <Clip 
          key={clip.id}
          id={clip.id}
          content={clip.content}
          style={{
            left: `${clip.startTime * clipWidthUnit}px`,
            width: `${clip.duration * clipWidthUnit}px`
          }}
        />
      ))}
    </div>
  );
};

export default ClipContainer;