<script lang="ts">
	import { isRecording } from '$lib/store';
	import { startRecording, stopRecording, saveRecording } from '$lib/recorder';

	function toggleRecording(): void {
		if ($isRecording) {
			const recording = stopRecording();
			if (recording) {
				saveRecording(recording);
			}
		} else {
			startRecording();
		}
	}
</script>

<button
	class="record-button {$isRecording ? 'recording' : ''}"
	onclick={toggleRecording}
	aria-label={$isRecording ? 'Stop recording' : 'Start recording'}
	aria-pressed={$isRecording}
>
	<span class="indicator"></span>
	<span class="label">{$isRecording ? 'Stop' : 'Record'}</span>
</button>

<style>
	.record-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.5rem;
		background: #dc3545;
		color: white;
		border: none;
		border-radius: 25px;
		font-size: 1rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.2s;
	}

	.record-button:hover {
		background: #c82333;
		transform: translateY(-1px);
	}

	.record-button:active {
		transform: translateY(0);
	}

	.record-button.recording {
		background: #6c757d;
		animation: pulse 1s infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.7;
		}
	}

	.indicator {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		background: white;
	}

	.label {
		white-space: nowrap;
	}

	@media (max-width: 640px) {
		.record-button {
			padding: 0.625rem 1.25rem;
			font-size: 0.875rem;
		}

		.indicator {
			width: 10px;
			height: 10px;
		}
	}
</style>
