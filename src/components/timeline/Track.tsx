import React from 'react';
import TrackHeader from './TrackHeader';
import ClipContainer from './ClipContainer';

interface TrackProps {
  id: string;
  name: string;
  type: string;
}

const Track: React.FC<TrackProps> = ({ id, name, type }) => {
  return (
    <div className={`track track-${type}`} data-track-id={id}>
      <TrackHeader id={id} name={name} type={type} />
      <ClipContainer trackId={id} />
    </div>
  );
};

export default Track;