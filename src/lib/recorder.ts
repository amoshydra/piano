import { get } from 'svelte/store';
import type { Note, Recording } from './store';
import { isRecording, currentRecording, recordings } from './store';

let recordingStartTime: number = 0;
let recordingNotes: Note[] = [];

export function startRecording(): void {
	recordingStartTime = Date.now();
	recordingNotes = [];
	isRecording.set(true);
	currentRecording.set(null);
}

export function stopRecording(): Recording | null {
	if (recordingNotes.length === 0) {
		isRecording.set(false);
		return null;
	}

	const endTime = Date.now();
	const recording: Recording = {
		id: `recording-${Date.now()}`,
		name: `Recording ${get(recordings).length + 1}`,
		notes: [...recordingNotes],
		startTime: recordingStartTime,
		endTime,
		duration: endTime - recordingStartTime,
		createdAt: Date.now()
	};

	recordingNotes = [];
	isRecording.set(false);

	return recording;
}

export function recordNote(note: string, octave: number, frequency: number): void {
	if (!get(isRecording)) return;

	const noteData: Note = {
		id: `note-${Date.now()}-${Math.random()}`,
		note,
		octave,
		frequency,
		timestamp: Date.now() - recordingStartTime
	};

	recordingNotes.push(noteData);
}

export function saveRecording(recording: Recording): void {
	recordings.update((current) => [...current, recording]);
	saveToLocalStorage();
}

export function deleteRecording(id: string): void {
	recordings.update((current) => current.filter((r) => r.id !== id));
	saveToLocalStorage();
}

export function loadRecordingsFromStorage(): void {
	try {
		const saved = localStorage.getItem('piano-recordings');
		if (saved) {
			const parsed: Recording[] = JSON.parse(saved);
			recordings.set(parsed);
		}
	} catch (e) {
		console.error('Error loading recordings from storage:', e);
	}
}

export function saveToLocalStorage(): void {
	try {
		const current = get(recordings);
		localStorage.setItem('piano-recordings', JSON.stringify(current));
	} catch (e) {
		console.error('Error saving recordings to storage:', e);
	}
}

export function clearRecordings(): void {
	recordings.set([]);
	localStorage.removeItem('piano-recordings');
}
