export class AudioEngine {
	private context: AudioContext;
	private activeOscillators: Map<string, OscillatorNode[]> = new Map();
	private masterGain: GainNode;
	private volume: number = 0.2;

	constructor() {
		this.context = new (window.AudioContext || window.webkitAudioContext)();
		this.masterGain = this.context.createGain();
		this.masterGain.gain.value = this.volume;
		this.masterGain.connect(this.context.destination);
	}

	async resume(): Promise<void> {
		if (this.context.state === 'suspended') {
			await this.context.resume();
		}
	}

	playNote(frequency: number, id: string, waveType: OscillatorType = 'sine'): void {
		if (!id) return;

		if (!this.activeOscillators.has(id)) {
			this.activeOscillators.set(id, []);
		}

		const oscillator = this.context.createOscillator();
		const gainNode = this.context.createGain();

		oscillator.type = waveType;
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
		if (!id) return;
		const oscillators = this.activeOscillators.get(id);
		if (oscillators) {
			oscillators.forEach((osc) => {
				try {
					osc.stop(this.context.currentTime);
				} catch (e) {
					console.error('Error stopping oscillator:', e);
				}
			});
			this.activeOscillators.delete(id);
		}
	}

	setVolume(volume: number): void {
		this.volume = Math.max(0, Math.min(1, volume));
		this.masterGain.gain.setValueAtTime(this.volume, this.context.currentTime);
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

export const audioEngine = new AudioEngine();
