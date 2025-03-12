import React, { useState } from 'react';

interface ClipContentProps {
  id: string;
  content: string;
  onClose: () => void;
}

const ClipContent: React.FC<ClipContentProps> = ({ id, content, onClose }) => {
  const [promptText, setPromptText] = useState(content);
  
  const handleSave = () => {
    // Here we would update the clip content in state
    console.log('Saving clip', id, 'with content:', promptText);
    onClose();
  };
  
  const handleProcess = () => {
    // Here we would trigger AI processing of the clip
    console.log('Processing clip', id);
  };

  return (
    <div className="clip-editor-modal">
      <div className="clip-editor">
        <h3>Edit Clip</h3>
        
        <div className="prompt-editor">
          <label htmlFor={`clip-textarea-${id}`}>Prompt:</label>
          <textarea 
            id={`clip-textarea-${id}`}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            rows={6}
          />
        </div>
        
        <div className="processing-options">
          <label>AI Model:</label>
          <select>
            <option value="default">Default</option>
            <option value="claude">Claude</option>
            <option value="gpt">GPT</option>
          </select>
        </div>
        
        <div className="editor-actions">
          <button onClick={handleProcess}>Process</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ClipContent;