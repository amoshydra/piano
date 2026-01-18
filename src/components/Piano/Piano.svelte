<script lang="ts">
	import { onMount } from 'svelte';
	import { audioEngine } from '$lib/audio';
	import { recordNote } from '$lib/recorder';
	import { isRecording } from '$lib/store';
	import Key from './Key.svelte';
	import { defaultKeys, findKeyByKeyCode, getKeyId } from '$lib/piano';

	let { keys = defaultKeys, keyWidth = '2rem' } = $props();

	let activeKeys = $state(new Set<string>());

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

		const key = keys[keyIndex];
		const id = getKeyId(key, keyIndex);

		if (activeKeys.has(id)) return;

		activeKeys.add(id);

		const frequency = audioEngine.getFrequency(key.note, key.octave || 4);
		audioEngine.playNote(frequency, id);

		if ($isRecording) {
			recordNote(key.note, key.octave || 4, frequency);
		}
	}

	function handleKeyUp(e: KeyboardEvent): void {
		const keyIndex = findKeyByKeyCode(e.key, keys);
		if (keyIndex < 0) return;

		const key = keys[keyIndex];
		const id = getKeyId(key, keyIndex);

		activeKeys.delete(id);
		audioEngine.stopNote(id);
	}
</script>

<div class="piano-container" role="application" aria-label="Piano keyboard">
	<div class="piano" role="list">
		{#each keys as key, index (getKeyId(key, index))}
			<Key note={key.note} octave={key.octave || 4} color={key.color} {index} width={keyWidth} />
		{/each}
	</div>
</div>

<style>
	.piano-container {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding: 1rem;
		background: #f0f0f0;
		border-radius: 10px;
		width: 100%;
		overflow-x: auto;
	}

	.piano {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		height: 10rem;
		position: relative;
	}

	@media (max-width: 640px) {
		.piano-container {
			padding: 0.5rem;
		}

		.piano {
			height: 7rem;
		}
	}
</style>
