<script lang="ts">
	import { onMount } from 'svelte';
	import { audioEngine } from '$lib/audio';
	import { recordNote } from '$lib/recorder';
	import { isRecording } from '$lib/store';
	import Key from './Key.svelte';
	import { defaultKeys, findKeyByKeyCode, getKeyId } from '$lib/piano';
	import type { PianoKey } from '$lib/piano.js';

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
		activeKeys.add(id);

		const frequency = audioEngine.getFrequencyByIndex(keyIndex, keys);
		audioEngine.playNote(frequency, id);

		if ($isRecording) {
			recordNote(key.note, key.octave || 4, frequency);
		}
	}

	function stopNote(id: string): void {
		activeKeys.delete(id);
		audioEngine.stopNote(id);
	}
</script>

<div class="piano-container" role="application" aria-label="Piano keyboard">
	<div class="piano-stand">
		<div class="piano-body">
			<div class="piano-fallboard"></div>
			<div class="piano" style="--key-width: {keyWidth}" role="list">
				{#each keys as key, index (getKeyId(key, index))}
					<Key
						note={key.note}
						octave={key.octave || 4}
						color={key.color}
						{index}
						{keys}
						width={keyWidth}
						isActive={activeKeys.has(getKeyId(key, index))}
						onPointerDown={() => playNote(index, key, getKeyId(key, index))}
						onPointerUp={() => stopNote(getKeyId(key, index))}
					/>
				{/each}
			</div>
			<div class="piano-bottom"></div>
		</div>
	</div>
</div>

<style>
	.piano-container {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		padding: 1.5rem;
		background: linear-gradient(180deg, #2c2c2c 0%, #1a1a1a 100%);
		border-radius: 16px;
		width: 100%;
		overflow: hidden;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.3),
			0 4px 20px rgba(0, 0, 0, 0.15);
	}

	.piano-stand {
		display: flex;
		justify-content: center;
		align-items: flex-end;
	}

	.piano-body {
		position: relative;
		background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 100%);
		border-radius: 8px;
		padding: 0.75rem;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.4),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
	}

	.piano-fallboard {
		height: 2rem;
		background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%);
		margin-bottom: 0.5rem;
		border-radius: 4px;
		box-shadow:
			inset 0 2px 4px rgba(0, 0, 0, 0.2),
			0 2px 8px rgba(0, 0, 0, 0.1);
		border: 1px solid #2a2a2a;
	}

	.piano {
		display: flex;
		justify-content: center;
		align-items: flex-end;
		height: 10rem;
		position: relative;
		background: linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%);
		padding: 0.5rem;
		border-radius: 4px;
		box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
	}

	.piano-bottom {
		height: 0.5rem;
		margin-top: 0.5rem;
		background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 100%);
		border-radius: 2px;
		box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.3);
	}

	@media (max-width: 768px) {
		.piano-container {
			padding: 1rem;
			border-radius: 12px;
		}

		.piano-body {
			padding: 0.5rem;
			border-radius: 6px;
		}

		.piano-fallboard {
			height: 1.5rem;
			margin-bottom: 0.375rem;
		}

		.piano {
			height: 9rem;
			padding: 0.375rem;
		}

		.piano-bottom {
			margin-top: 0.375rem;
		}
	}

	@media (max-width: 480px) {
		.piano-container {
			padding: 0.75rem;
		}

		.piano-body {
			padding: 0.375rem;
		}

		.piano-fallboard {
			height: 1.25rem;
			margin-bottom: 0.25rem;
		}

		.piano {
			height: 7rem;
			padding: 0.25rem;
		}

		.piano-bottom {
			height: 0.375rem;
			margin-top: 0.25rem;
		}
	}
</style>
