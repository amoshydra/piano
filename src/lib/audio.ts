import type { PianoKey } from './piano.js';

export class AudioEngine {
	private context: AudioContext | null = null;
	private activeOscillators: Map<string, OscillatorNode[]> = new Map();
	private activeGainNodes: Map<string, GainNode[]> = new Map();
	private masterGain: GainNode | null = null;
	private volume: number = 0.8;
	private releaseTime: number = 1.5; // Realistic piano release time in seconds
	private sustainTime: number = 0.5; // Natural decay while key is held

	constructor() {
		if (typeof window !== 'undefined') {
			const AudioContextClass =
				window.AudioContext ||
				(window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
			this.context = new AudioContextClass();
			this.masterGain = this.context.createGain();
			this.masterGain.gain.value = this.volume;
			this.masterGain.connect(this.context.destination);
		}
	}

	async resume(): Promise<void> {
		if (!this.context) return;
		if (this.context.state === 'suspended') {
			await this.context.resume();
		}
	}

	private cancelRelease(id: string): void {
		if (!id || !this.context) return;

		const oscillators = this.activeOscillators.get(id);
		const gainNodes = this.activeGainNodes.get(id);

		if (oscillators && gainNodes) {
			oscillators.forEach((oscillator, index) => {
				const gainNode = gainNodes[index];
				if (gainNode && oscillator) {
					// Cancel any scheduled gain ramps for immediate retrigger
					gainNode.gain.cancelScheduledValues(this.context!.currentTime);
				}
			});
		}
	}

	playNote(frequency: number, id: string): void {
		if (!id || !this.context || !this.masterGain) return;

		if (!this.activeOscillators.has(id)) {
			this.activeOscillators.set(id, []);
		}
		if (!this.activeGainNodes.has(id)) {
			this.activeGainNodes.set(id, []);
		}

		const oscillator = this.context.createOscillator();
		const gainNode = this.context.createGain();

		const real = new Float32Array([0, 0, 0, 0, 0, 0]);
		const imag = new Float32Array([0, 2, 0.5, 0.3, 0, 0.1]);
		const pianoWave = this.context.createPeriodicWave(real, imag);
		oscillator.setPeriodicWave(pianoWave);

		// oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

		// Simple clean envelope (like old implementation)
		gainNode.gain.setValueAtTime(this.volume * 0.4, this.context.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(
			0.0001,
			this.context.currentTime + this.sustainTime + 0.5
		);

		oscillator.connect(gainNode);
		gainNode.connect(this.masterGain);

		oscillator.start(this.context.currentTime);
		oscillator.stop(this.context.currentTime + this.sustainTime + 0.5);

		const oscillators = this.activeOscillators.get(id) || [];
		const gainNodes = this.activeGainNodes.get(id) || [];
		oscillators.push(oscillator);
		gainNodes.push(gainNode);
		this.activeOscillators.set(id, oscillators);
		this.activeGainNodes.set(id, gainNodes);

		oscillator.onended = () => {
			const currentOscillators = this.activeOscillators.get(id) || [];
			const currentGainNodes = this.activeGainNodes.get(id) || [];
			const filteredOscs = currentOscillators.filter((osc) => osc !== oscillator);
			const filteredGains = currentGainNodes.filter((gain) => gain !== gainNode);

			if (filteredOscs.length === 0) {
				this.activeOscillators.delete(id);
				this.activeGainNodes.delete(id);
			} else {
				this.activeOscillators.set(id, filteredOscs);
				this.activeGainNodes.set(id, filteredGains);
			}
		};
	}

	stopNote(id: string): void {
		if (!id || !this.context) return;

		const oscillators = this.activeOscillators.get(id);
		const gainNodes = this.activeGainNodes.get(id);

		if (oscillators && gainNodes) {
			// Simple release - just let the natural envelope handle it
			// Oscillators will stop automatically due to scheduled stop time
			this.activeOscillators.delete(id);
			this.activeGainNodes.delete(id);
		}
	}

	setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
		if (this.masterGain && this.context) {
			this.masterGain.gain.setValueAtTime(this.volume, this.context.currentTime);
		}
	}

	setReleaseTime(releaseTime: number): void {
		this.releaseTime = Math.max(0.1, Math.min(5, releaseTime));
	}

	getReleaseTime(): number {
		return this.releaseTime;
	}

	setSustainTime(sustainTime: number): void {
		this.sustainTime = Math.max(0.1, Math.min(3, sustainTime));
	}

	getSustainTime(): number {
		return this.sustainTime;
	}

	getVolume(): number {
		return this.volume;
	}

	getFrequency(noteName: string, octave: number): number {
		const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
		const noteIndex = notes.indexOf(noteName);
		if (noteIndex === -1) return 440;

		const semitonesFromA4 = (octave - 4) * 12 + (noteIndex - 9);
		return 440 * Math.pow(2, semitonesFromA4 / 12);
	}

	getFrequencyByIndex(keyIndex: number, keys: PianoKey[]): number {
		const startFrequency = 440;
		const startIndex = keys.findIndex((k) => k.start === true);
		const keyOffset = startIndex >= 0 ? -startIndex : 0;
		const semitones = keyIndex + keyOffset;
		return startFrequency * Math.pow(2, semitones / 12);
	}

	destroy(): void {
		this.activeOscillators.forEach((oscillators) => {
			oscillators.forEach((osc) => {
				try {
					osc.stop();
				} catch (e) {
					console.error('Error stopping oscillator during destroy:', e);
				}
			});
		});
		this.activeOscillators.clear();
		this.activeGainNodes.clear();
	}
}

let audioEngineInstance: AudioEngine | null = null;

export function getAudioEngine(): AudioEngine {
	if (!audioEngineInstance && typeof window !== 'undefined') {
		audioEngineInstance = new AudioEngine();
	}
	return audioEngineInstance || new AudioEngine();
}

export const audioEngine = getAudioEngine();
