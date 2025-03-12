import React from 'react';

const TimeRuler: React.FC = () => {
  // This would be dynamic based on timeline settings and zoom level
  const divisions = Array.from({ length: 16 }, (_, i) => i);
  
  return (
    <div className="time-ruler">
      <div className="ruler-markings">
        {divisions.map((div) => (
          <div key={div} className="ruler-mark">
            <span>{div + 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeRuler;