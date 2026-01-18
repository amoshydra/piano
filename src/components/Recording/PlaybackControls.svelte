<script lang="ts">
	import { currentRecording, isPlaying } from '$lib/store';
	import { audioEngine } from '$lib/audio';
	import type { Recording, Note } from '$lib/store';

	interface Props {
		recording?: Recording;
	}

	let { recording }: Props = $props();

	let playbackTimeout: ReturnType<typeof setTimeout> | null = null;

	$effect(() => {
		if (recording) {
			currentRecording.set({ ...recording });
		}
	});

	async function playRecording(): Promise<void> {
		if (!recording || !recording.notes || recording.notes.length === 0) return;

		if ($isPlaying) {
			stopPlayback();
			return;
		}

		await audioEngine.resume();
		isPlaying.set(true);

		recording.notes.forEach((note: Note) => {
			const timeoutId = setTimeout(() => {
				const id = `${note.note}${note.octave}-${note.timestamp}`;
				audioEngine.playNote(note.frequency, id);

				if (note.duration) {
					setTimeout(() => {
						audioEngine.stopNote(id);
					}, note.duration);
				}
			}, note.timestamp);

			const currentMax = note.timestamp + (note.duration || 500);
			if (!playbackTimeout || currentMax > Number(playbackTimeout)) {
				playbackTimeout = timeoutId;
			}
		});

		if (playbackTimeout) {
			setTimeout(() => {
				isPlaying.set(false);
			}, recording.duration);
		}
	}

	function stopPlayback(): void {
		isPlaying.set(false);
		if (playbackTimeout) {
			clearTimeout(playbackTimeout);
			playbackTimeout = null;
		}
	}
</script>

<div class="playback-controls">
	<button
		class="play-button"
		onclick={playRecording}
		aria-label={$isPlaying ? 'Stop playback' : 'Play recording'}
		aria-pressed={$isPlaying}
	>
		{$isPlaying ? '⏹' : '▶'}
	</button>
</div>

<style>
	.playback-controls {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.play-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		background: #007bff;
		color: white;
		border: none;
		border-radius: 50%;
		font-size: 1.25rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.play-button:hover {
		background: #0056b3;
		transform: scale(1.05);
	}

	.play-button:active {
		transform: scale(0.95);
	}

	@media (max-width: 640px) {
		.play-button {
			width: 36px;
			height: 36px;
			font-size: 1.125rem;
		}
	}
</style>
