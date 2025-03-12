import React from 'react';

interface ContextPreviewProps {
  levels: Array<{
    id: string;
    name: string;
    content: string;
  }>;
}

const ContextPreview: React.FC<ContextPreviewProps> = ({ levels }) => {
  // In a real implementation, this would aggregate context based on
  // the inheritance model and which levels are enabled
  
  const combinedContext = levels.map(level => ({
    ...level,
    isEnabled: true // This would come from state
  }));
  
  const totalTokens = combinedContext.reduce(
    (sum, level) => sum + (level.isEnabled ? Math.round(level.content.length / 4) : 0), 
    0
  );

  return (
    <div className="context-preview">
      <h3>Aggregated Context Preview</h3>
      
      <div className="preview-content">
        {combinedContext.map(level => (
          level.isEnabled && (
            <div key={level.id} className={`context-level-preview level-${level.id}`}>
              <h4>{level.name}</h4>
              <div className="level-content">{level.content}</div>
            </div>
          )
        ))}
      </div>
      
      <div className="preview-footer">
        <span className="total-token-count">Total tokens: ~{totalTokens}</span>
      </div>
    </div>
  );
};

export default ContextPreview;