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

export function exportRecording(recording: Recording): string {
	return JSON.stringify(recording, null, 2);
}

export function importRecording(jsonData: string): {
	success: boolean;
	message: string;
	recording?: Recording;
} {
	try {
		const imported: Recording = JSON.parse(jsonData);

		// Validate data structure
		if (
			!imported.name ||
			!Array.isArray(imported.notes) ||
			typeof imported.duration !== 'number' ||
			typeof imported.createdAt !== 'number'
		) {
			return { success: false, message: 'Invalid format: Expected a recording object' };
		}

		// Validate notes structure
		const validNotes = imported.notes.filter(
			(note) => note.note && typeof note.octave === 'number' && typeof note.timestamp === 'number'
		);

		if (validNotes.length === 0) {
			return { success: false, message: 'No valid notes found in recording' };
		}

		// Create new recording with unique ID to avoid conflicts
		const newRecording: Recording = {
			...imported,
			id: `imported-${Date.now()}-${Math.random()}`,
			notes: validNotes,
			name: `${imported.name} (Imported)`
		};

		// Add imported recording to existing ones
		recordings.update((current) => [...current, newRecording]);
		saveToLocalStorage();

		return {
			success: true,
			message: `Successfully imported "${newRecording.name}"`,
			recording: newRecording
		};
	} catch (e) {
		return {
			success: false,
			message: 'Invalid JSON format. Please check your file.'
		};
	}
}

export function downloadRecording(recording: Recording): void {
	const jsonData = exportRecording(recording);
	const blob = new Blob([jsonData], { type: 'application/json' });
	const url = URL.createObjectURL(blob);

	// Sanitize filename
	const sanitizedName = recording.name.replace(/[^a-zA-Z0-9\s-]/g, '').trim();
	const a = document.createElement('a');
	a.href = url;
	a.download = `${sanitizedName || 'piano-recording'}-${new Date().toISOString().split('T')[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
