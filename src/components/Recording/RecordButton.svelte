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
	<div class="button-content">
		<span class="indicator"></span>
		<span class="label">{$isRecording ? 'Stop Recording' : 'Start Recording'}</span>
	</div>
	<div class="ripple"></div>
</button>

<style>
	.record-button {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem 2rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50px;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		overflow: hidden;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.2),
			0 2px 8px rgba(0, 0, 0, 0.1),
			inset 0 1px 2px rgba(255, 255, 255, 0.2);
	}

	.button-content {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		position: relative;
		z-index: 2;
	}

	.record-button:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateY(-2px);
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.25),
			0 4px 12px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(255, 255, 255, 0.3);
	}

	.record-button:active {
		transform: translateY(0);
	}

	.record-button.recording {
		background: rgba(220, 53, 69, 0.9);
		border-color: rgba(220, 53, 69, 1);
		animation: pulse-glow 2s ease-in-out infinite;
	}

	.record-button.recording:hover {
		background: rgba(220, 53, 69, 1);
	}

	@keyframes pulse-glow {
		0%,
		100% {
			box-shadow:
				0 8px 32px rgba(220, 53, 69, 0.4),
				0 2px 8px rgba(0, 0, 0, 0.2),
				inset 0 1px 2px rgba(255, 255, 255, 0.2),
				0 0 0 0 rgba(220, 53, 69, 0.7);
		}
		50% {
			box-shadow:
				0 8px 32px rgba(220, 53, 69, 0.6),
				0 2px 8px rgba(0, 0, 0, 0.2),
				inset 0 1px 2px rgba(255, 255, 255, 0.2),
				0 0 0 10px rgba(220, 53, 69, 0);
		}
	}

	.indicator {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: white;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		transition: all 0.3s ease;
	}

	.record-button.recording .indicator {
		animation: pulse 1.5s ease-in-out infinite;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
			opacity: 1;
		}
		50% {
			transform: scale(0.9);
			opacity: 0.8;
		}
	}

	.label {
		white-space: nowrap;
		letter-spacing: 0.5px;
	}

	.ripple {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		border-radius: 50%;
		background: rgba(255, 255, 255, 0.3);
		transform: translate(-50%, -50%);
		transition:
			width 0.6s ease,
			height 0.6s ease,
			opacity 0.6s ease;
		pointer-events: none;
	}

	.record-button:active .ripple {
		width: 200px;
		height: 200px;
		opacity: 0;
	}

	@media (max-width: 768px) {
		.record-button {
			padding: 0.875rem 1.75rem;
			font-size: 0.9375rem;
		}

		.indicator {
			width: 14px;
			height: 14px;
		}
	}

	@media (max-width: 480px) {
		.record-button {
			padding: 0.75rem 1.5rem;
			font-size: 0.875rem;
		}

		.button-content {
			gap: 0.5rem;
		}

		.indicator {
			width: 12px;
			height: 12px;
		}

		.label {
			font-size: 0.8125rem;
		}
	}
</style>
