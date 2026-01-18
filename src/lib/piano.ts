export interface PianoKey {
	note: string;
	key: string;
	color: 'white' | 'black';
	octave?: number;
	start?: boolean;
}

export const defaultKeys: PianoKey[] = [
	{ note: 'G', key: '', color: 'white', octave: 2 },
	{ note: 'G#', key: '', color: 'black', octave: 2 },
	{ note: 'A', key: '', color: 'white', octave: 2 },
	{ note: 'A#', key: '', color: 'black', octave: 2 },
	{ note: 'B', key: '', color: 'white', octave: 2 },
	{ note: 'C', key: '', color: 'white', octave: 3 },
	{ note: 'C#', key: '', color: 'black', octave: 3 },
	{ note: 'D', key: '', color: 'white', octave: 3 },
	{ note: 'D#', key: '', color: 'black', octave: 3 },
	{ note: 'E', key: '', color: 'white', octave: 3 },
	{ note: 'F', key: '', color: 'white', octave: 3 },
	{ note: 'F#', key: '`', color: 'black', octave: 3 },
	{ note: 'G', key: 'tab', color: 'white', octave: 3 },
	{ note: 'G#', key: '1', color: 'black', octave: 3 },
	{ note: 'A', key: 'q', color: 'white', octave: 4, start: true },
	{ note: 'A#', key: '2', color: 'black', octave: 4 },
	{ note: 'B', key: 'w', color: 'white', octave: 4 },
	{ note: 'C', key: 'e', color: 'white', octave: 4 },
	{ note: 'C#', key: '4', color: 'black', octave: 4 },
	{ note: 'D', key: 'r', color: 'white', octave: 4 },
	{ note: 'D#', key: '5', color: 'black', octave: 4 },
	{ note: 'E', key: 't', color: 'white', octave: 4 },
	{ note: 'F', key: 'y', color: 'white', octave: 4 },
	{ note: 'F#', key: '7', color: 'black', octave: 4 },
	{ note: 'G', key: 'u', color: 'white', octave: 4 },
	{ note: 'G#', key: '8', color: 'black', octave: 4 },
	{ note: 'A', key: 'i', color: 'white', octave: 4 },
	{ note: 'A#', key: '9', color: 'black', octave: 4 },
	{ note: 'B', key: 'o', color: 'white', octave: 4 },
	{ note: 'C', key: 'p', color: 'white', octave: 5 },
	{ note: 'C#', key: '-', color: 'black', octave: 5 },
	{ note: 'D', key: '[', color: 'white', octave: 5 },
	{ note: 'D#', key: '=', color: 'black', octave: 5 },
	{ note: 'E', key: ']', color: 'white', octave: 5 },
	{ note: 'F', key: '\\', color: 'white', octave: 5 },
	{ note: 'F#', key: 'backspace', color: 'black', octave: 5 },
	{ note: 'G', key: '', color: 'white', octave: 5 },
	{ note: 'G#', key: '', color: 'black', octave: 5 },
	{ note: 'A', key: '', color: 'white', octave: 5 },
	{ note: 'A#', key: '', color: 'black', octave: 5 },
	{ note: 'B', key: '', color: 'white', octave: 5 },
	{ note: 'C', key: '', color: 'white', octave: 6 },
	{ note: 'C#', key: '', color: 'black', octave: 6 },
	{ note: 'D', key: '', color: 'white', octave: 6 },
	{ note: 'D#', key: '', color: 'black', octave: 6 },
	{ note: 'E', key: '', color: 'white', octave: 6 }
];

export function getKeyId(key: PianoKey, index: number): string {
	return `${key.note}${key.octave || 4}-${index}`;
}

export function findKeyByKeyCode(keyCode: string, keys: PianoKey[]): number {
	return keys.findIndex((k) => k.key === keyCode.toLowerCase());
}

export function isBlackKey(note: string): boolean {
	return note.includes('#');
}
