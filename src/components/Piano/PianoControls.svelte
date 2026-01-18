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
		<label for="volume">Volume</label>
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
		justify-content: center;
		align-items: center;
		padding: 1rem;
		background: #f9f9f9;
		border-radius: 8px;
		margin-bottom: 1rem;
	}

	.control-group {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	label {
		font-size: 0.875rem;
		color: #666;
	}

	input[type='range'] {
		width: 150px;
	}

	.volume-value {
		font-size: 0.875rem;
		min-width: 40px;
	}

	@media (max-width: 640px) {
		.controls {
			flex-direction: column;
			gap: 0.5rem;
			padding: 0.75rem;
		}

		input[type='range'] {
			width: 200px;
		}
	}
</style>
