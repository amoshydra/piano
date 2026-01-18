import type { PianoKey } from './piano.js';

export class AudioEngine {
	private context: AudioContext | null = null;
	private activeOscillators: Map<string, OscillatorNode[]> = new Map();
	private masterGain: GainNode | null = null;
	private volume: number = 0.5;

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

	playNote(frequency: number, id: string): void {
		if (!id || !this.context || !this.masterGain) return;

		if (!this.activeOscillators.has(id)) {
			this.activeOscillators.set(id, []);
		}

		const oscillator = this.context.createOscillator();
		const gainNode = this.context.createGain();

		const real = new Float32Array([0, 0, 0, 0, 0, 0]);
		const imag = new Float32Array([0, 2, 0.5, 0.3, 0, 0.1]);
		const pianoWave = this.context.createPeriodicWave(real, imag);
		oscillator.setPeriodicWave(pianoWave);

		oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);

		gainNode.gain.setValueAtTime(this.volume, this.context.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(this.volume * 0.5, this.context.currentTime + 0.01);
		gainNode.gain.exponentialRampToValueAtTime(0.0001, this.context.currentTime + 1);

		oscillator.connect(gainNode);
		gainNode.connect(this.masterGain);

		oscillator.start(this.context.currentTime);
		oscillator.stop(this.context.currentTime + 1);

		const oscillators = this.activeOscillators.get(id) || [];
		oscillators.push(oscillator);
		this.activeOscillators.set(id, oscillators);

		oscillator.onended = () => {
			const currentOscillators = this.activeOscillators.get(id) || [];
			const filtered = currentOscillators.filter((osc) => osc !== oscillator);
			if (filtered.length === 0) {
				this.activeOscillators.delete(id);
			} else {
				this.activeOscillators.set(id, filtered);
			}
		};
	}

	stopNote(id: string): void {
		if (!id || !this.context) return;
		const oscillators = this.activeOscillators.get(id);
		if (oscillators) {
			oscillators.forEach((osc) => {
				try {
					osc.stop(this.context!.currentTime);
				} catch (e) {
					console.error('Error stopping oscillator:', e);
				}
			});
			this.activeOscillators.delete(id);
		}
	}

	setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
		if (this.masterGain && this.context) {
			this.masterGain.gain.setValueAtTime(this.volume, this.context.currentTime);
		}
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
