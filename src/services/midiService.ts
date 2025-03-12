/**
 * MIDI Service for handling Web MIDI API interactions
 */

// MIDI message types
export const MIDI_MESSAGE_TYPES = {
  NOTE_OFF: 0x80,
  NOTE_ON: 0x90,
  POLYPHONIC_AFTERTOUCH: 0xA0,
  CONTROL_CHANGE: 0xB0,
  PROGRAM_CHANGE: 0xC0,
  CHANNEL_AFTERTOUCH: 0xD0,
  PITCH_BEND: 0xE0,
  SYSTEM_EXCLUSIVE: 0xF0,
  TIME_CODE: 0xF1,
  SONG_POSITION: 0xF2,
  SONG_SELECT: 0xF3,
  TUNE_REQUEST: 0xF6,
  END_OF_EXCLUSIVE: 0xF7,
  TIMING_CLOCK: 0xF8,
  START: 0xFA,
  CONTINUE: 0xFB,
  STOP: 0xFC,
  ACTIVE_SENSING: 0xFE,
  RESET: 0xFF
};

// MIDI Controller numbers
export const MIDI_CONTROLLERS = {
  MODULATION: 1,
  BREATH_CONTROLLER: 2,
  FOOT_CONTROLLER: 4,
  PORTAMENTO_TIME: 5,
  DATA_ENTRY: 6,
  VOLUME: 7,
  BALANCE: 8,
  PAN: 10,
  EXPRESSION: 11,
  SUSTAIN: 64,
  PORTAMENTO: 65,
  SOSTENUTO: 66,
  SOFT_PEDAL: 67,
  LEGATO: 68,
  HOLD_2: 69,
  SOUND_VARIATION: 70,
  RESONANCE: 71,
  RELEASE_TIME: 72,
  ATTACK_TIME: 73,
  BRIGHTNESS: 74,
  DECAY_TIME: 75,
  VIBRATO_RATE: 76,
  VIBRATO_DEPTH: 77,
  VIBRATO_DELAY: 78,
  PORTAMENTO_CONTROL: 84,
  REVERB_DEPTH: 91,
  TREMOLO_DEPTH: 92,
  CHORUS_DEPTH: 93,
  DETUNE_DEPTH: 94,
  PHASER_DEPTH: 95,
  DATA_INCREMENT: 96,
  DATA_DECREMENT: 97,
  NON_REGISTERED_PARAM_LSB: 98,
  NON_REGISTERED_PARAM_MSB: 99,
  REGISTERED_PARAM_LSB: 100,
  REGISTERED_PARAM_MSB: 101,
  ALL_SOUND_OFF: 120,
  RESET_ALL_CONTROLLERS: 121,
  LOCAL_CONTROL: 122,
  ALL_NOTES_OFF: 123,
  OMNI_MODE_OFF: 124,
  OMNI_MODE_ON: 125,
  MONO_MODE_ON: 126,
  POLY_MODE_ON: 127
};

// Interface for MIDI access and devices
interface MIDIServiceState {
  midiAccess: MIDIAccess | null;
  inputs: Map<string, MIDIInput>;
  outputs: Map<string, MIDIOutput>;
  selectedOutput: MIDIOutput | null;
  isInitialized: boolean;
  error: Error | null;
}

class MIDIService {
  private state: MIDIServiceState = {
    midiAccess: null,
    inputs: new Map(),
    outputs: new Map(),
    selectedOutput: null,
    isInitialized: false,
    error: null
  };
  
  /**
   * Initialize the MIDI service
   * @returns Promise that resolves when MIDI is initialized
   */
  async initialize(): Promise<boolean> {
    if (this.state.isInitialized) {
      return true;
    }
    
    try {
      if (navigator.requestMIDIAccess) {
        this.state.midiAccess = await navigator.requestMIDIAccess();
        this.updateDeviceLists();
        
        // Setup listeners for device changes
        this.state.midiAccess.addEventListener('statechange', this.handleStateChange);
        
        this.state.isInitialized = true;
        return true;
      } else {
        throw new Error('Web MIDI API is not supported in this browser');
      }
    } catch (error) {
      this.state.error = error instanceof Error ? error : new Error('Unknown error initializing MIDI');
      console.error('MIDI initialization error:', this.state.error);
      return false;
    }
  }
  
  /**
   * Update the lists of available MIDI inputs and outputs
   */
  private updateDeviceLists = (): void => {
    if (!this.state.midiAccess) return;
    
    // Clear existing maps
    this.state.inputs = new Map();
    this.state.outputs = new Map();
    
    // Populate inputs
    this.state.midiAccess.inputs.forEach(input => {
      this.state.inputs.set(input.id, input);
    });
    
    // Populate outputs
    this.state.midiAccess.outputs.forEach(output => {
      this.state.outputs.set(output.id, output);
    });
    
    // If we have outputs and no selected output, select the first one
    if (this.state.outputs.size > 0 && !this.state.selectedOutput) {
      this.state.selectedOutput = this.state.outputs.values().next().value;
    }
  };
  
  /**
   * Handle state change events when MIDI devices are connected/disconnected
   */
  private handleStateChange = (event: MIDIConnectionEvent): void => {
    this.updateDeviceLists();
    
    // If the selected output was disconnected, select a new one if available
    if (
      this.state.selectedOutput && 
      event.port.type === 'output' && 
      event.port.id === this.state.selectedOutput.id &&
      event.port.state === 'disconnected'
    ) {
      this.state.selectedOutput = this.state.outputs.size > 0 
        ? this.state.outputs.values().next().value 
        : null;
    }
  };
  
  /**
   * Get a list of available MIDI output devices
   * @returns Array of MIDI output devices
   */
  getOutputDevices(): MIDIOutput[] {
    return Array.from(this.state.outputs.values());
  }
  
  /**
   * Select a MIDI output device to send messages to
   * @param deviceId The ID of the device to select
   * @returns True if the device was selected, false otherwise
   */
  selectOutputDevice(deviceId: string): boolean {
    const device = this.state.outputs.get(deviceId);
    if (device) {
      this.state.selectedOutput = device;
      return true;
    }
    return false;
  }
  
  /**
   * Send a MIDI note on message
   * @param note The MIDI note number (0-127)
   * @param velocity The velocity value (0-127)
   * @param channel The MIDI channel (0-15)
   * @returns True if the message was sent, false otherwise
   */
  sendNoteOn(note: number, velocity: number, channel: number = 0): boolean {
    if (!this.state.selectedOutput) return false;
    
    try {
      const statusByte = MIDI_MESSAGE_TYPES.NOTE_ON | (channel & 0x0F);
      this.state.selectedOutput.send([statusByte, note & 0x7F, velocity & 0x7F]);
      return true;
    } catch (error) {
      console.error('Error sending MIDI note on:', error);
      return false;
    }
  }
  
  /**
   * Send a MIDI note off message
   * @param note The MIDI note number (0-127)
   * @param velocity The release velocity value (0-127)
   * @param channel The MIDI channel (0-15)
   * @returns True if the message was sent, false otherwise
   */
  sendNoteOff(note: number, velocity: number = 0, channel: number = 0): boolean {
    if (!this.state.selectedOutput) return false;
    
    try {
      const statusByte = MIDI_MESSAGE_TYPES.NOTE_OFF | (channel & 0x0F);
      this.state.selectedOutput.send([statusByte, note & 0x7F, velocity & 0x7F]);
      return true;
    } catch (error) {
      console.error('Error sending MIDI note off:', error);
      return false;
    }
  }
  
  /**
   * Send a MIDI control change message
   * @param controller The controller number (0-127)
   * @param value The controller value (0-127)
   * @param channel The MIDI channel (0-15)
   * @returns True if the message was sent, false otherwise
   */
  sendControlChange(controller: number, value: number, channel: number = 0): boolean {
    if (!this.state.selectedOutput) return false;
    
    try {
      const statusByte = MIDI_MESSAGE_TYPES.CONTROL_CHANGE | (channel & 0x0F);
      this.state.selectedOutput.send([statusByte, controller & 0x7F, value & 0x7F]);
      return true;
    } catch (error) {
      console.error('Error sending MIDI control change:', error);
      return false;
    }
  }
  
  /**
   * Send a MIDI program change message
   * @param program The program number (0-127)
   * @param channel The MIDI channel (0-15)
   * @returns True if the message was sent, false otherwise
   */
  sendProgramChange(program: number, channel: number = 0): boolean {
    if (!this.state.selectedOutput) return false;
    
    try {
      const statusByte = MIDI_MESSAGE_TYPES.PROGRAM_CHANGE | (channel & 0x0F);
      this.state.selectedOutput.send([statusByte, program & 0x7F]);
      return true;
    } catch (error) {
      console.error('Error sending MIDI program change:', error);
      return false;
    }
  }
  
  /**
   * Send a MIDI pitch bend message
   * @param value The pitch bend value (0-16383, 8192 is center)
   * @param channel The MIDI channel (0-15)
   * @returns True if the message was sent, false otherwise
   */
  sendPitchBend(value: number, channel: number = 0): boolean {
    if (!this.state.selectedOutput) return false;
    
    try {
      const statusByte = MIDI_MESSAGE_TYPES.PITCH_BEND | (channel & 0x0F);
      const lsbValue = value & 0x7F;
      const msbValue = (value >> 7) & 0x7F;
      this.state.selectedOutput.send([statusByte, lsbValue, msbValue]);
      return true;
    } catch (error) {
      console.error('Error sending MIDI pitch bend:', error);
      return false;
    }
  }
  
  /**
   * Send all notes off message to the selected MIDI output
   * @param channel The MIDI channel (0-15), or null for all channels
   * @returns True if the message was sent, false otherwise
   */
  sendAllNotesOff(channel: number | null = null): boolean {
    if (!this.state.selectedOutput) return false;
    
    try {
      if (channel === null) {
        // Send to all 16 channels
        for (let ch = 0; ch < 16; ch++) {
          const statusByte = MIDI_MESSAGE_TYPES.CONTROL_CHANGE | (ch & 0x0F);
          this.state.selectedOutput.send([statusByte, MIDI_CONTROLLERS.ALL_NOTES_OFF, 0]);
        }
      } else {
        // Send to specific channel
        const statusByte = MIDI_MESSAGE_TYPES.CONTROL_CHANGE | (channel & 0x0F);
        this.state.selectedOutput.send([statusByte, MIDI_CONTROLLERS.ALL_NOTES_OFF, 0]);
      }
      return true;
    } catch (error) {
      console.error('Error sending MIDI all notes off:', error);
      return false;
    }
  }
  
  /**
   * Get the current state of the MIDI service
   * @returns The current state
   */
  getState(): MIDIServiceState {
    return { ...this.state };
  }
  
  /**
   * Check if MIDI is available and initialized
   * @returns True if MIDI is available and initialized, false otherwise
   */
  isAvailable(): boolean {
    return this.state.isInitialized && !!this.state.midiAccess;
  }
  
  /**
   * Check if any MIDI output devices are available
   * @returns True if output devices are available, false otherwise
   */
  hasOutputDevices(): boolean {
    return this.state.outputs.size > 0;
  }
}

// Export a singleton instance
export default new MIDIService();