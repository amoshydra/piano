<script lang="ts">
	import { recordings } from '$lib/store';
	import PlaybackControls from './PlaybackControls.svelte';
	import { deleteRecording } from '$lib/recorder';

	interface Props {
		expanded?: boolean;
	}

	let { expanded = false }: Props = $props();
	const initialValue = expanded;
	let showList = $state(initialValue);

	function toggleList(): void {
		showList = !showList;
	}

	function handleDelete(id: string): void {
		if (confirm('Are you sure you want to delete this recording?')) {
			deleteRecording(id);
		}
	}

	function formatDuration(ms: number): string {
		const seconds = Math.floor(ms / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
	}

	function formatDate(timestamp: number): string {
		const date = new Date(timestamp);
		return (
			date.toLocaleDateString() +
			' ' +
			date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
		);
	}
</script>

<div class="recordings-container">
	<button class="toggle-button" onclick={toggleList} aria-expanded={showList}>
		{showList ? '▼' : '▶'} My Recordings ({$recordings.length})
	</button>

	{#if showList}
		<div class="recordings-list">
			{#if $recordings.length === 0}
				<p class="no-recordings">No recordings yet. Start recording to create your first one!</p>
			{:else}
				{#each $recordings as recording (recording.id)}
					<div class="recording-item">
						<div class="recording-info">
							<span class="recording-name">{recording.name}</span>
							<span class="recording-meta"
								>{formatDuration(recording.duration)} • {formatDate(recording.createdAt)}</span
							>
						</div>
						<div class="recording-actions">
							<PlaybackControls {recording} />
							<button
								class="delete-button"
								onclick={() => handleDelete(recording.id)}
								aria-label="Delete recording"
							>
								🗑
							</button>
						</div>
					</div>
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.recordings-container {
		margin-top: 1rem;
	}

	.toggle-button {
		width: 100%;
		padding: 0.75rem;
		background: #fff;
		border: 1px solid #ddd;
		border-radius: 8px;
		cursor: pointer;
		font-weight: 600;
		color: #333;
		text-align: left;
		transition: all 0.2s;
	}

	.toggle-button:hover {
		background: #f8f8f8;
	}

	.recordings-list {
		margin-top: 0.5rem;
		border: 1px solid #ddd;
		border-radius: 8px;
		overflow: hidden;
	}

	.no-recordings {
		padding: 1rem;
		color: #666;
		text-align: center;
		margin: 0;
	}

	.recording-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem;
		border-bottom: 1px solid #eee;
		background: white;
		transition: background 0.2s;
	}

	.recording-item:hover {
		background: #f8f8f8;
	}

	.recording-item:last-child {
		border-bottom: none;
	}

	.recording-info {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.recording-name {
		font-weight: 600;
		color: #333;
	}

	.recording-meta {
		font-size: 0.875rem;
		color: #666;
	}

	.recording-actions {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.delete-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: transparent;
		border: 1px solid #dc3545;
		color: #dc3545;
		border-radius: 4px;
		cursor: pointer;
		transition: all 0.2s;
		font-size: 1rem;
	}

	.delete-button:hover {
		background: #dc3545;
		color: white;
	}

	@media (max-width: 640px) {
		.recording-item {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}

		.recording-actions {
			width: 100%;
			justify-content: space-between;
		}

		.delete-button {
			width: 28px;
			height: 28px;
		}
	}
</style>
