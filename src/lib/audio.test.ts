import { describe, it, expect, beforeEach } from 'vitest';
import { AudioEngine } from '$lib/audio.js';
import { defaultKeys } from '$lib/piano.js';
import type { PianoKey } from '$lib/piano.js';

describe('AudioEngine Frequency Calculations', () => {
	let audioEngine: AudioEngine;

	beforeEach(() => {
		audioEngine = new AudioEngine();
	});

	// Expected frequencies from working version (dist/index.html)
	// Calculated using: 440 * Math.pow(2, semitones / 12) where semitones = index - 3
	const expectedFrequencies = [
		{ index: 0, note: 'F#', octave: 3, frequency: 440 * Math.pow(2, -3 / 12) }, // F#3
		{ index: 1, note: 'G', octave: 3, frequency: 440 * Math.pow(2, -2 / 12) }, // G3
		{ index: 2, note: 'G#', octave: 3, frequency: 440 * Math.pow(2, -1 / 12) }, // G#3
		{ index: 3, note: 'A', octave: 4, frequency: 440 * Math.pow(2, 0 / 12) }, // A4 (start key)
		{ index: 4, note: 'A#', octave: 4, frequency: 440 * Math.pow(2, 1 / 12) }, // A#4
		{ index: 5, note: 'B', octave: 4, frequency: 440 * Math.pow(2, 2 / 12) }, // B4
		{ index: 6, note: 'C', octave: 4, frequency: 440 * Math.pow(2, 3 / 12) }, // C4
		{ index: 7, note: 'C#', octave: 4, frequency: 440 * Math.pow(2, 4 / 12) }, // C#4
		{ index: 8, note: 'D', octave: 4, frequency: 440 * Math.pow(2, 5 / 12) }, // D4
		{ index: 9, note: 'D#', octave: 4, frequency: 440 * Math.pow(2, 6 / 12) }, // D#4
		{ index: 10, note: 'E', octave: 4, frequency: 440 * Math.pow(2, 7 / 12) }, // E4
		{ index: 11, note: 'F', octave: 4, frequency: 440 * Math.pow(2, 8 / 12) }, // F4
		{ index: 12, note: 'F#', octave: 4, frequency: 440 * Math.pow(2, 9 / 12) }, // F#4
		{ index: 13, note: 'G', octave: 4, frequency: 440 * Math.pow(2, 10 / 12) }, // G4
		{ index: 14, note: 'G#', octave: 4, frequency: 440 * Math.pow(2, 11 / 12) }, // G#4
		{ index: 15, note: 'A', octave: 4, frequency: 440 * Math.pow(2, 12 / 12) } // A4 (next octave)
	];

	it('should calculate correct frequencies using position-based method', () => {
		expectedFrequencies.forEach(({ index, frequency: expectedFreq }) => {
			const actualFreq = audioEngine.getFrequencyByIndex(index, defaultKeys);
			expect(actualFreq).toBeCloseTo(expectedFreq, 2);
		});
	});

	it('should have A4 (index 3) as 440Hz reference frequency', () => {
		const a4Frequency = audioEngine.getFrequencyByIndex(3, defaultKeys);
		expect(a4Frequency).toBeCloseTo(440, 2);
	});

	it('should calculate correct semitone offsets from start key', () => {
		// F#3 should be -3 semitones from A4
		const fSharp3Freq = audioEngine.getFrequencyByIndex(0, defaultKeys);
		const expectedFSharp3 = 440 * Math.pow(2, -3 / 12);
		expect(fSharp3Freq).toBeCloseTo(expectedFSharp3, 2);

		// G3 should be -2 semitones from A4
		const g3Freq = audioEngine.getFrequencyByIndex(1, defaultKeys);
		const expectedG3 = 440 * Math.pow(2, -2 / 12);
		expect(g3Freq).toBeCloseTo(expectedG3, 2);

		// G#3 should be -1 semitone from A4
		const gSharp3Freq = audioEngine.getFrequencyByIndex(2, defaultKeys);
		const expectedGSharp3 = 440 * Math.pow(2, -1 / 12);
		expect(gSharp3Freq).toBeCloseTo(expectedGSharp3, 2);
	});

	it('should work correctly with custom key arrays', () => {
		const customKeys: PianoKey[] = [
			{ note: 'C', key: 'a', color: 'white', octave: 4, start: true },
			{ note: 'D', key: 's', color: 'white', octave: 4 },
			{ note: 'E', key: 'd', color: 'white', octave: 4 }
		];

		// C should be 440Hz (start key)
		const cFreq = audioEngine.getFrequencyByIndex(0, customKeys);
		expect(cFreq).toBeCloseTo(440, 2);

		// D should be 1 semitone above C (since it's index 1)
		const dFreq = audioEngine.getFrequencyByIndex(1, customKeys);
		const expectedD = 440 * Math.pow(2, 1 / 12);
		expect(dFreq).toBeCloseTo(expectedD, 2);

		// E should be 2 semitones above C (since it's index 2)
		const eFreq = audioEngine.getFrequencyByIndex(2, customKeys);
		const expectedE = 440 * Math.pow(2, 2 / 12);
		expect(eFreq).toBeCloseTo(expectedE, 2);
	});

	it('should handle edge cases gracefully', () => {
		// Empty array should return 440 (default)
		const emptyFreq = audioEngine.getFrequencyByIndex(0, []);
		expect(emptyFreq).toBeCloseTo(440, 2);

		// Array without start key should return 440 (default)
		const noStartKeys: PianoKey[] = [
			{ note: 'C', key: 'a', color: 'white', octave: 4 },
			{ note: 'D', key: 's', color: 'white', octave: 4 }
		];
		const noStartFreq = audioEngine.getFrequencyByIndex(0, noStartKeys);
		expect(noStartFreq).toBeCloseTo(440, 2);
	});
});
