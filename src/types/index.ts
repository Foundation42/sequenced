export interface Clip {
  id: string;
  trackId: string;
  startTime: number;
  duration: number;
  content: string;
  status: 'idle' | 'processing' | 'complete' | 'error';
  output?: any;
  dependencies?: string[]; // IDs of clips this one depends on
  outputRefs?: string[]; // IDs of clips that reference this clip's output
  context?: string;
  processingOptions?: Record<string, any>;
}

export interface Track {
  id: string;
  name: string;
  type: string;
  position: number;
  color: string;
  muted: boolean;
  solo: boolean;
  height: number;
  groupId: string | null;
  isGroup: boolean;
  deviceChain?: Device[];
  clips: string[]; // Clip IDs
  context?: string;
}

export interface Device {
  id: string;
  type: string;
  name: string;
  position: number;
  enabled: boolean;
  parameters: Parameter[];
  inputs?: Connection[];
  outputs?: Connection[];
  preset?: string;
}

export interface Parameter {
  id: string;
  name: string;
  type: 'range' | 'select' | 'checkbox' | 'text';
  defaultValue: any;
  value: any;
  min?: number;
  max?: number;
  options?: string[];
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  type: string;
}

export interface Project {
  id: string;
  name: string;
  created: number;
  modified: number;
  tempo: number;
  timeSignature: string;
  duration: number;
  tracks: Record<string, Track>;
  clips: Record<string, Clip>;
  globalContext: string;
}

export interface ContextLevel {
  id: string;
  level: 'project' | 'group' | 'track' | 'clip';
  targetId: string;
  content: string;
  enabled: boolean;
  order: number;
}

export interface DeviceOverride {
  deviceId: string;
  parameterOverrides: Record<string, any>;
  enabled: boolean;
  position: number;
}

export type ClipProcessingStatus = 'idle' | 'processing' | 'complete' | 'error';