import React, { useState } from 'react';

interface ContextLevelProps {
  level: {
    id: string;
    name: string;
    content: string;
  };
}

const ContextLevel: React.FC<ContextLevelProps> = ({ level }) => {
  const [content, setContent] = useState(level.content);
  const [isEnabled, setIsEnabled] = useState(true);

  return (
    <div className="context-level-editor">
      <div className="level-header">
        <h3>{level.name}</h3>
        <label className="level-enabled-toggle">
          <input 
            type="checkbox"
            checked={isEnabled}
            onChange={() => setIsEnabled(!isEnabled)}
          />
          Enabled
        </label>
      </div>
      
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`Enter ${level.name} context...`}
        disabled={!isEnabled}
        rows={10}
        className={!isEnabled ? 'disabled' : ''}
      />
      
      <div className="level-footer">
        <span className="token-count">Tokens: ~{Math.round(content.length / 4)}</span>
      </div>
    </div>
  );
};

export default ContextLevel;