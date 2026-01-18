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
		class="play-button {$isPlaying ? 'playing' : ''}"
		onclick={playRecording}
		aria-label={$isPlaying ? 'Stop playback' : 'Play recording'}
		aria-pressed={$isPlaying}
	>
		{#if $isPlaying}
			<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<rect x="6" y="4" width="4" height="16" rx="1" />
				<rect x="14" y="4" width="4" height="16" rx="1" />
			</svg>
		{:else}
			<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
				<path d="M5 3l14 9-14 9V3z" />
			</svg>
		{/if}
	</button>
</div>

<style>
	.playback-controls {
		display: flex;
		align-items: center;
	}

	.play-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 44px;
		height: 44px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		border-radius: 50%;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
	}

	.play-button:hover {
		transform: scale(1.1);
		box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
	}

	.play-button:active {
		transform: scale(0.95);
	}

	.play-button.playing {
		background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
		box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
		animation: playing-pulse 1.5s ease-in-out infinite;
	}

	.play-button.playing:hover {
		box-shadow: 0 6px 16px rgba(220, 53, 69, 0.4);
	}

	@keyframes playing-pulse {
		0%,
		100% {
			box-shadow:
				0 4px 12px rgba(220, 53, 69, 0.3),
				0 0 0 0 rgba(220, 53, 69, 0.7);
		}
		50% {
			box-shadow:
				0 4px 12px rgba(220, 53, 69, 0.3),
				0 0 0 8px rgba(220, 53, 69, 0);
		}
	}

	@media (max-width: 768px) {
		.play-button {
			width: 40px;
			height: 40px;
		}

		.play-button svg {
			width: 20px;
			height: 20px;
		}
	}

	@media (max-width: 480px) {
		.play-button {
			width: 36px;
			height: 36px;
		}

		.play-button svg {
			width: 18px;
			height: 18px;
		}
	}
</style>
