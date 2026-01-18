import { writable, derived, type Writable } from 'svelte/store';

export interface Note {
	id: string;
	note: string;
	octave: number;
	frequency: number;
	timestamp: number;
	duration?: number;
}

export interface Recording {
	id: string;
	name: string;
	notes: Note[];
	startTime: number;
	endTime: number;
	duration: number;
	createdAt: number;
}

export const notes: Writable<Note[]> = writable([]);

export const isRecording: Writable<boolean> = writable(false);

export const recordings: Writable<Recording[]> = writable([]);

export const currentRecording: Writable<Recording | null> = writable(null);

export const isPlaying: Writable<boolean> = writable(false);

export const volume: Writable<number> = writable(0.2);

export const activeNotes: Writable<Set<string>> = writable(new Set());

export const activeNotesArray = derived(activeNotes, ($activeNotes) => {
	return Array.from($activeNotes);
});

export const hasRecordings = derived(recordings, ($recordings) => {
	return $recordings.length > 0;
});

export const playbackProgress = derived(currentRecording, isPlaying, ($currentRecording, $isPlaying) => {
	if (!$currentRecording || !$isPlaying) return 0;
	const now = Date.now();
	return Math.min(1, (now - $currentRecording.startTime) / $currentRecording.duration);
});
