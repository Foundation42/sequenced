interface MIDIOptions {
  sysex?: boolean;
  software?: boolean;
}

interface MIDIConnectionEvent extends Event {
  port: MIDIPort;
}

interface MIDIMessageEvent extends Event {
  data: Uint8Array;
}

interface MIDIPort extends EventTarget {
  id: string;
  manufacturer?: string;
  name?: string;
  type: 'input' | 'output';
  version?: string;
  state: 'connected' | 'disconnected';
  connection: 'open' | 'closed' | 'pending';
  onstatechange: ((this: MIDIPort, ev: MIDIConnectionEvent) => any) | null;
  open(): Promise<MIDIPort>;
  close(): Promise<MIDIPort>;
}

interface MIDIInput extends MIDIPort {
  type: 'input';
  onmidimessage: ((this: MIDIInput, ev: MIDIMessageEvent) => any) | null;
}

interface MIDIOutput extends MIDIPort {
  type: 'output';
  send(data: Uint8Array | number[], timestamp?: number): void;
  clear(): void;
}

interface MIDIAccess extends EventTarget {
  inputs: Map<string, MIDIInput>;
  outputs: Map<string, MIDIOutput>;
  onstatechange: ((this: MIDIAccess, ev: MIDIConnectionEvent) => any) | null;
}

interface Navigator {
  requestMIDIAccess(options?: MIDIOptions): Promise<MIDIAccess>;
}