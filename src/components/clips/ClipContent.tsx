import React, { useState, useEffect } from 'react';
import useTimelineStore from '../../store/timelineStore';

interface ClipContentProps {
  id: string;
  content: string;
  onClose: () => void;
}

const ClipContent: React.FC<ClipContentProps> = ({ id, content: initialContent, onClose }) => {
  const [promptText, setPromptText] = useState(initialContent);
  const updateClip = useTimelineStore(state => state.updateClip);
  const updateClipStatus = useTimelineStore(state => state.updateClipStatus);
  const clip = useTimelineStore(state => state.clips[id]);
  
  useEffect(() => {
    // Update local state if clip content changes externally
    if (clip?.content !== promptText) {
      setPromptText(clip?.content || '');
    }
  }, [clip?.content]);
  
  const handleSave = () => {
    updateClip(id, { content: promptText });
    onClose();
  };
  
  const handleProcess = () => {
    // Set status to processing
    updateClipStatus(id, 'processing');
    
    // Simulate processing with a timer
    setTimeout(() => {
      // Set status to complete and add some mock output
      updateClipStatus(id, 'complete', { 
        result: 'Processed content: ' + promptText,
        processingTime: 2.5
      });
      
      // Close the editor
      onClose();
    }, 2000);
  };
  
  const handleCancel = () => {
    onClose();
  };
  
  // If the clip no longer exists, close the editor
  if (!clip) {
    onClose();
    return null;
  }

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
            placeholder="Enter your prompt here..."
            autoFocus
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
          <button onClick={handleProcess} disabled={!promptText.trim()}>Process</button>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default ClipContent;