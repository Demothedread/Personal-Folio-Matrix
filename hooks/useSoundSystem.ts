import { useRef, useState, useCallback } from 'react';

interface SoundSystem {
  isMuted: boolean;
  toggleMute: () => void;
  triggerHover: (id: string) => void;
  triggerExpand: () => void;
  triggerClose: () => void;
  initializeAudio: () => void;
}

export const useSoundSystem = (): SoundSystem => {
  const [isMuted, setIsMuted] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const ctxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const activeNodesRef = useRef<AudioNode[]>([]);

  // High-register pentatonic/lydian scale for "Glassy/Plinky" feel
  const getFrequencyFromId = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    // Frequencies (C6 approx range): C, D, E, F#, G, A, B
    // High pitched, crystal clear
    const notes = [1046.5, 1174.7, 1318.5, 1480.0, 1568.0, 1760.0, 1975.5]; 
    return notes[Math.abs(hash) % notes.length];
  };

  // Generate a very long, dark impulse response for vast emptiness
  const createSpaceImpulse = (ctx: AudioContext) => {
    const duration = 8; // 8 seconds tail
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const impulse = ctx.createBuffer(2, length, rate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      // Heavy exponential decay
      const decay = Math.pow(1 - i / length, 6); 
      // Stereo noise
      left[i] = (Math.random() * 2 - 1) * decay;
      right[i] = (Math.random() * 2 - 1) * decay;
    }
    return impulse;
  };

  const initializeAudio = useCallback(() => {
    if (isInitialized) return;

    const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
    const ctx = new AudioContextClass();
    ctxRef.current = ctx;

    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // Start muted
    masterGainRef.current = masterGain;
    masterGain.connect(ctx.destination);

    // Reverb Bus (The Void)
    const reverb = ctx.createConvolver();
    reverb.buffer = createSpaceImpulse(ctx);
    reverbNodeRef.current = reverb;
    
    // Reverb Mix
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = 0.5; 
    reverb.connect(reverbGain);
    reverbGain.connect(masterGain);

    // --- THEREMIN DRONE (Cosmic Emptiness) ---
    // High Sine with heavy Vibrato (Theremin-like)
    const thereminOsc = ctx.createOscillator();
    thereminOsc.type = 'sine';
    thereminOsc.frequency.value = 783.99; // G5

    // Vibrato LFO
    const vibrato = ctx.createOscillator();
    vibrato.frequency.value = 4.5; // Fast wobble
    const vibratoGain = ctx.createGain();
    vibratoGain.gain.value = 8; // Pitch depth
    vibrato.connect(vibratoGain);
    vibratoGain.connect(thereminOsc.frequency);

    // Swell LFO (Wafting in and out imperceptibly)
    const swellOsc = ctx.createOscillator();
    swellOsc.frequency.value = 0.08; // ~12s cycle
    const thereminGain = ctx.createGain();
    thereminGain.gain.value = 0; // Base level 0
    
    // Using a Gain node to modulate amplitude 
    const swellAmp = ctx.createGain();
    swellAmp.gain.value = 0.02; // Max volume is very low
    swellOsc.connect(swellAmp);
    swellAmp.connect(thereminGain.gain);
    
    thereminOsc.connect(thereminGain);
    thereminGain.connect(reverb); // Only to reverb (Distance)

    // Sub Bass Drone (The Deep Ocean)
    const subOsc = ctx.createOscillator();
    subOsc.type = 'sine';
    subOsc.frequency.value = 55.0; // A1
    const subGain = ctx.createGain();
    subGain.gain.value = 0.04; // Quiet rumble
    subOsc.connect(subGain);
    subGain.connect(masterGain); // Dry + Reverb? Let's go Dry for clarity
    
    // Start Drone
    thereminOsc.start();
    vibrato.start();
    swellOsc.start();
    subOsc.start();

    activeNodesRef.current.push(thereminOsc, vibrato, swellOsc, subOsc);

    setIsInitialized(true);
    setIsMuted(false);
    
    // Slow fade in
    masterGain.gain.setTargetAtTime(1, ctx.currentTime, 4);
  }, [isInitialized]);

  const toggleMute = useCallback(() => {
    if (!ctxRef.current || !masterGainRef.current) {
      initializeAudio();
      return;
    }

    if (isMuted) {
      if (ctxRef.current.state === 'suspended') ctxRef.current.resume();
      masterGainRef.current.gain.setTargetAtTime(1, ctxRef.current.currentTime, 1);
      setIsMuted(false);
    } else {
      masterGainRef.current.gain.setTargetAtTime(0, ctxRef.current.currentTime, 0.5);
      setIsMuted(true);
    }
  }, [isMuted, initializeAudio]);

  const triggerHover = useCallback((id: string) => {
    if (isMuted || !ctxRef.current || !reverbNodeRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;
    
    // FM SYNTHESIS for "Glassy/Plinky" sounds
    const fundamental = getFrequencyFromId(id);
    
    // Carrier
    const carrier = ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.setValueAtTime(fundamental, now);

    // Modulator (Ratio 2.5 creates inharmonic bell/glass tones)
    const modulator = ctx.createOscillator();
    modulator.type = 'sine';
    modulator.frequency.setValueAtTime(fundamental * 2.5, now);

    // FM Envelope (Modulation Index)
    const modGain = ctx.createGain();
    modGain.gain.setValueAtTime(500, now); // High index
    modGain.gain.exponentialRampToValueAtTime(0.1, now + 0.2); // Sharp drop makes the "clink"

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    // Amplitude Envelope
    const ampGain = ctx.createGain();
    ampGain.gain.setValueAtTime(0, now);
    ampGain.gain.linearRampToValueAtTime(0.04, now + 0.01); // Instant attack
    ampGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5); // Long crystal tail

    // Random Pan for distinction
    const panner = ctx.createStereoPanner();
    panner.pan.value = (Math.random() * 1.6) - 0.8;

    carrier.connect(ampGain);
    ampGain.connect(panner);
    panner.connect(reverbNodeRef.current); // Send to void

    carrier.start(now);
    modulator.start(now);
    carrier.stop(now + 2);
    modulator.stop(now + 2);
  }, [isMuted]);

  const triggerExpand = useCallback(() => {
    if (isMuted || !ctxRef.current || !reverbNodeRef.current) return;
    const ctx = ctxRef.current;
    const now = ctx.currentTime;

    // "Hollow" Thud
    // Filtered Square Wave
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(55, now + 0.4);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, now); // Muffled
    filter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(reverbNodeRef.current);

    osc.start(now);
    osc.stop(now + 1);
  }, [isMuted]);

  const triggerClose = useCallback(() => {
     if (isMuted || !ctxRef.current || !reverbNodeRef.current) return;
     const ctx = ctxRef.current;
     const now = ctx.currentTime;

     // Quick reverse-like blip
     const osc = ctx.createOscillator();
     osc.type = 'sine';
     osc.frequency.setValueAtTime(600, now);
     osc.frequency.linearRampToValueAtTime(800, now + 0.1);
     
     const gain = ctx.createGain();
     gain.gain.setValueAtTime(0, now);
     gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
     gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

     osc.connect(gain);
     gain.connect(reverbNodeRef.current);
     osc.start(now);
     osc.stop(now + 0.3);
  }, [isMuted]);

  return {
    isMuted,
    toggleMute,
    triggerHover,
    triggerExpand,
    triggerClose,
    initializeAudio
  };
};