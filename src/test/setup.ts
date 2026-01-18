// Test setup for Vitest
import { vi } from 'vitest';

// Mock Web Audio API for testing
class MockAudioContext {
	createOscillator() {
		return {
			type: 'sine',
			frequency: { setValueAtTime: vi.fn() },
			connect: vi.fn(),
			start: vi.fn(),
			stop: vi.fn()
		};
	}

	createGain() {
		return {
			gain: { setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
			connect: vi.fn()
		};
	}

	destination = {};
	currentTime = 0;
	state = 'running';

	resume() {
		return Promise.resolve();
	}
}

// Mock window object
global.AudioContext = MockAudioContext as unknown as typeof AudioContext;
