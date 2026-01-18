<script lang="ts">
	import { audioEngine } from '$lib/audio';
	import { defaultKeys, findKeyByKeyCode, getKeyId } from '$lib/piano';
	import type { PianoKey } from '$lib/piano.js';
	import { recordNote } from '$lib/recorder';
	import { isRecording, scale } from '$lib/store';
	import { onMount } from 'svelte';
	import Key from './Key.svelte';

	let { keys = defaultKeys } = $props();

	let activeKeysArray = $state<string[]>([]);

	function isKeyActive(key: PianoKey, index: number): boolean {
		return activeKeysArray.includes(getKeyId(key, index));
	}

	onMount(() => {
		audioEngine.resume();
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	});

	function handleKeyDown(e: KeyboardEvent): void {
		const keyIndex = findKeyByKeyCode(e.key, keys);
		if (keyIndex < 0) return;

		// Prevent default behavior for all valid piano keys to avoid browser interference
		e.preventDefault();

		const key = keys[keyIndex];
		const id = getKeyId(key, keyIndex);

		if (activeKeysArray.includes(id)) return;

		playNote(keyIndex, key, id);
	}

	function handleKeyUp(e: KeyboardEvent): void {
		const keyIndex = findKeyByKeyCode(e.key, keys);
		if (keyIndex < 0) return;

		const key = keys[keyIndex];
		const id = getKeyId(key, keyIndex);

		stopNote(id);
	}

	function playNote(keyIndex: number, key: PianoKey, id: string): void {
		activeKeysArray = [...activeKeysArray, id];

		const frequency = audioEngine.getFrequencyByIndex(keyIndex, keys);
		audioEngine.playNote(frequency, id);

		if ($isRecording) {
			recordNote(key.note, key.octave || 4, frequency);
		}
	}

	function stopNote(id: string): void {
		activeKeysArray = activeKeysArray.filter((keyId) => keyId !== id);
		audioEngine.stopNote(id);
	}
</script>

<div class="piano-container" role="application" aria-label="Piano keyboard">
	<div class="piano-stand">
		<div class="piano-body">
			<div class="piano" style="zoom: {$scale}" role="list">
				{#each keys as key, index (getKeyId(key, index))}
					<Key
						note={key.note}
						octave={key.octave || 4}
						color={key.color}
						isActive={isKeyActive(key, index)}
						onPointerDown={() => playNote(index, key, getKeyId(key, index))}
						onPointerUp={() => stopNote(getKeyId(key, index))}
					/>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.piano-container {
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}
	.piano-stand {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		width: 100%;
	}
	.piano-body {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
		border-radius: 8px;
		padding: 1rem;
		width: 100%;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.4),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
	}
	.piano {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		background: linear-gradient(180deg, #2b2b2b 0%, #2b2b2b 100%);
		padding: 1rem 0;
		border-radius: 4px;
		box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
		min-width: min-content;
		width: 100%;
	}
</style>
