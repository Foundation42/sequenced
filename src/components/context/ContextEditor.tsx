import React, { useState } from 'react';
import ContextLevel from './ContextLevel';
import ContextPreview from './ContextPreview';

interface ContextEditorProps {
  onClose?: () => void;
}

const ContextEditor: React.FC<ContextEditorProps> = ({ onClose }) => {
  const [activeLevel, setActiveLevel] = useState('project');
  
  // Mock context data, would come from state
  const contextLevels = [
    { id: 'project', name: 'Project', content: 'This is a music project in the style of funk from the 1970s.' },
    { id: 'group1', name: 'Rhythm Section', content: 'This group contains the rhythm instruments that provide the groove.' },
    { id: 'track1', name: 'Bass Track', content: 'Generate bass lines that are funky and syncopated with emphasis on the one.' },
    { id: 'clip1', name: 'Intro Bass', content: 'Create a simple bass line to introduce the song.' }
  ];
  
  const handleSave = () => {
    console.log('Saving context');
    onClose && onClose();
  };

  return (
    <div className="context-editor">
      <h2>Context Editor</h2>
      
      <div className="context-editor-layout">
        <div className="context-levels">
          <div className="level-tabs">
            {contextLevels.map(level => (
              <button
                key={level.id}
                className={`level-tab ${activeLevel === level.id ? 'active' : ''}`}
                onClick={() => setActiveLevel(level.id)}
              >
                {level.name}
              </button>
            ))}
          </div>
          
          <ContextLevel 
            level={contextLevels.find(level => level.id === activeLevel) || contextLevels[0]} 
          />
        </div>
        
        <ContextPreview levels={contextLevels} />
      </div>
      
      <div className="context-editor-actions">
        <button onClick={handleSave}>Save</button>
        {onClose && <button onClick={onClose}>Cancel</button>}
      </div>
    </div>
  );
};

export default ContextEditor;