import { derived, writable, type Writable } from 'svelte/store';

export interface Note {
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
	duration: number;
	createdAt: number;
}

export const notes: Writable<Note[]> = writable([]);

export const isRecording: Writable<boolean> = writable(false);

export const recordings: Writable<Recording[]> = writable([]);

export const currentRecording: Writable<Recording | null> = writable(null);

export const isPlaying: Writable<boolean> = writable(false);

export const currentPlayingRecordingId: Writable<string | null> = writable(null);

export const volume: Writable<number> = writable(0.2);

export const scale: Writable<number> = writable(1);

export const activeNotes: Writable<Set<string>> = writable(new Set());

export const activeNotesArray = derived(activeNotes, ($activeNotes) => {
	return Array.from($activeNotes);
});

export const hasRecordings = derived(recordings, ($recordings) => {
	return $recordings.length > 0;
});

export const playbackProgress = derived(
	[currentRecording, isPlaying],
	([$currentRecording, $isPlaying]) => {
		if (!$currentRecording || !$isPlaying) return 0;
		// Progress is now handled in PlaybackControls component
		return 0;
	}
);
