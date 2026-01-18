<script lang="ts">
	import { volume } from '$lib/store';

	let currentVolume = $state(0.2);

	$effect(() => {
		volume.set(currentVolume);
	});

	function handleVolumeChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		currentVolume = parseFloat(target.value);
	}
</script>

<div class="controls">
	<div class="control-group">
		<div class="volume-icon">
			{#if currentVolume < 0.1}
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M11 5L6 9H2v6h4l5 4V5z" />
					<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
				</svg>
			{:else if currentVolume < 0.5}
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M11 5L6 9H2v6h4l5 4V5z" />
					<path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
				</svg>
			{:else}
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
				>
					<path d="M11 5L6 9H2v6h4l5 4V5z" />
					<path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
				</svg>
			{/if}
		</div>
		<input
			id="volume"
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={currentVolume}
			oninput={handleVolumeChange}
			aria-label="Volume control"
		/>
		<span class="volume-value">{Math.round(currentVolume * 100)}%</span>
	</div>
</div>

<style>
	.controls {
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		align-items: center;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: rgba(0, 0, 0, 0.05);
		padding: 0.75rem 1rem;
		border-radius: 50px;
	}

	.volume-icon {
		color: #666;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		width: 150px;
		height: 6px;
		background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
		border-radius: 3px;
		outline: none;
		cursor: pointer;
		position: relative;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 18px;
		height: 18px;
		background: white;
		border: 3px solid #667eea;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
	}

	input[type='range']::-webkit-slider-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	input[type='range']::-moz-range-thumb {
		width: 18px;
		height: 18px;
		background: white;
		border: 3px solid #667eea;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
	}

	input[type='range']::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.volume-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: #1a1a2e;
		min-width: 45px;
	}

	@media (max-width: 768px) {
		.controls {
			justify-content: center;
		}

		.control-group {
			padding: 0.625rem 0.875rem;
		}

		input[type='range'] {
			width: 200px;
		}

		.volume-value {
			font-size: 0.8125rem;
		}
	}

	@media (max-width: 480px) {
		.controls {
			width: 100%;
		}

		.control-group {
			width: 100%;
			justify-content: space-between;
			padding: 0.5rem 0.75rem;
		}

		input[type='range'] {
			width: 120px;
			height: 5px;
		}

		input[type='range']::-webkit-slider-thumb {
			width: 16px;
			height: 16px;
			border-width: 2.5px;
		}

		input[type='range']::-moz-range-thumb {
			width: 16px;
			height: 16px;
			border-width: 2.5px;
		}

		.volume-icon svg {
			width: 16px;
			height: 16px;
		}

		.volume-value {
			font-size: 0.75rem;
			min-width: 40px;
		}
	}
</style>
