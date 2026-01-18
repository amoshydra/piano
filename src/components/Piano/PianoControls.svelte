<script lang="ts">
	import { scale } from '$lib/store';
	import { onMount } from 'svelte';

	let currentScale = $state(1);
	let isFullscreen = $state(false);

	$effect(() => {
		scale.set(currentScale);
	});

	function handleScaleChange(e: Event): void {
		const target = e.target as HTMLInputElement;
		currentScale = parseFloat(target.value);
	}

	function toggleFullscreen(): void {
		if (!document.fullscreenElement) {
			const pianoElement = document.querySelector('.piano-container') as HTMLElement;
			if (pianoElement) {
				pianoElement.requestFullscreen().catch((err) => {
					console.error('Fullscreen error:', err);
				});
			}
		} else {
			document.exitFullscreen();
		}
	}

	function handleFullscreenChange(): void {
		isFullscreen = !!document.fullscreenElement;
	}

	onMount(() => {
		document.addEventListener('fullscreenchange', handleFullscreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	});
</script>

<div class="controls">
	<div class="control-group scale-control">
		<div class="scale-icon">
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="M21 21l-4.35-4.35" />
				<path d="M8 11h6" />
				<path d="M11 8v6" />
			</svg>
		</div>
		<input
			id="scale"
			type="range"
			min="0.5"
			max="2"
			step="0.1"
			bind:value={currentScale}
			oninput={handleScaleChange}
			aria-label="Scale control"
		/>
		<span class="scale-value">{Math.round(currentScale * 100)}%</span>
	</div>
	<button
		class="fullscreen-button"
		onclick={toggleFullscreen}
		aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
		aria-pressed={isFullscreen}
	>
		{#if isFullscreen}
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
			>
				<path
					d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
				/>
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
				<path
					d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
				/>
			</svg>
		{/if}
	</button>
</div>

<style>
	.controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	.fullscreen-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50%;
		width: 48px;
		height: 48px;
		color: white;
		cursor: pointer;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.2),
			0 2px 8px rgba(0, 0, 0, 0.1),
			inset 0 1px 2px rgba(255, 255, 255, 0.2);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.fullscreen-button:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateY(-2px);
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.25),
			0 4px 12px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(255, 255, 255, 0.3);
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(20px);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 50px;
		padding: 0.75rem 1rem;
		font-size: 1rem;
		font-weight: 600;
		color: white;
		box-shadow:
			0 8px 32px rgba(0, 0, 0, 0.2),
			0 2px 8px rgba(0, 0, 0, 0.1),
			inset 0 1px 2px rgba(255, 255, 255, 0.2);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.control-group:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateY(-2px);
		box-shadow:
			0 12px 40px rgba(0, 0, 0, 0.25),
			0 4px 12px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(255, 255, 255, 0.3);
	}

	.scale-icon {
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	input[type='range'] {
		-webkit-appearance: none;
		appearance: none;
		height: 6px;
		background: rgba(255, 255, 255, 0.3);
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
		border: none;
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
		border: none;
		border-radius: 50%;
		cursor: pointer;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
		transition: all 0.2s ease;
	}

	input[type='range']::-moz-range-thumb:hover {
		transform: scale(1.1);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
	}

	.scale-value {
		font-size: 0.875rem;
		font-weight: 600;
		color: white;
		min-width: 45px;
	}

	@media (max-width: 768px) {
		.control-group {
			padding: 0.625rem 0.875rem;
		}

		.scale-value {
			font-size: 0.8125rem;
		}
	}

	@media (max-width: 480px) {
		.control-group {
			width: 100%;
			justify-content: space-between;
			padding: 0.5rem 0.75rem;
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

		.scale-icon svg {
			width: 16px;
			height: 16px;
		}

		.scale-value {
			font-size: 0.75rem;
			min-width: 40px;
		}

		.fullscreen-button {
			width: 40px;
			height: 40px;
			min-width: 40px;
			min-height: 40px;
		}
	}
</style>
