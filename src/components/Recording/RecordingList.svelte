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
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

		if (diffDays === 0) {
			return 'Today';
		} else if (diffDays === 1) {
			return 'Yesterday';
		} else if (diffDays < 7) {
			return `${diffDays} days ago`;
		} else {
			return date.toLocaleDateString();
		}
	}
</script>

<div class="recordings-container">
	<button class="toggle-button" onclick={toggleList} aria-expanded={showList}>
		<span class="toggle-icon">{showList ? '▼' : '▶'}</span>
		<span class="toggle-text">My Recordings</span>
		<span class="toggle-count">{$recordings.length}</span>
	</button>

	{#if showList}
		<div class="recordings-list">
			{#if $recordings.length === 0}
				<div class="no-recordings">
					<div class="no-recordings-icon">🎵</div>
					<p class="no-recordings-text">No recordings yet</p>
					<p class="no-recordings-subtext">Start recording to create your first one!</p>
				</div>
			{:else}
				<div class="recordings-grid">
					{#each $recordings as recording (recording.id)}
						<div class="recording-card">
							<div class="recording-header">
								<div class="recording-icon">🎹</div>
								<div class="recording-info">
									<h3 class="recording-name">{recording.name}</h3>
									<div class="recording-meta">
										<span class="duration">⏱ {formatDuration(recording.duration)}</span>
										<span class="date">{formatDate(recording.createdAt)}</span>
									</div>
								</div>
							</div>
							<div class="recording-actions">
								<PlaybackControls {recording} />
								<button
									class="delete-button"
									onclick={() => handleDelete(recording.id)}
									aria-label="Delete recording"
								>
									<svg
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										stroke-width="2"
									>
										<path
											d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
										/>
									</svg>
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.recordings-container {
		width: 100%;
	}

	.toggle-button {
		width: 100%;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 1.25rem;
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 2px solid rgba(255, 255, 255, 0.3);
		border-radius: 12px;
		cursor: pointer;
		font-weight: 600;
		font-size: 1rem;
		color: white;
		text-align: left;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.05),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
	}

	.toggle-button:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.4);
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.08),
			inset 0 1px 2px rgba(255, 255, 255, 0.15);
	}

	.toggle-button:active {
		transform: translateY(0);
	}

	.toggle-icon {
		font-size: 0.875rem;
		color: #667eea;
		transition: transform 0.3s ease;
	}

	.toggle-text {
		flex: 1;
		letter-spacing: 0.5px;
	}

	.toggle-count {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 0.25rem 0.625rem;
		border-radius: 20px;
		font-size: 0.75rem;
		font-weight: 700;
	}

	.recordings-list {
		margin-top: 1rem;
	}

	.no-recordings {
		text-align: center;
		padding: 3rem 2rem;
		background: rgba(255, 255, 255, 0.08);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.15);
		box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.05);
	}

	.no-recordings-icon {
		font-size: 3rem;
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.no-recordings-text {
		font-size: 1.125rem;
		font-weight: 600;
		color: white;
		margin: 0 0 0.5rem 0;
	}

	.no-recordings-subtext {
		font-size: 0.875rem;
		color: rgba(255, 255, 255, 0.8);
		margin: 0;
	}

	.recordings-grid {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.recording-card {
		background: rgba(255, 255, 255, 0.15);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.2);
		border-radius: 12px;
		padding: 1rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.05),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
	}

	.recording-card:hover {
		background: rgba(255, 255, 255, 0.25);
		border-color: rgba(255, 255, 255, 0.3);
		transform: translateY(-2px);
		box-shadow:
			0 8px 24px rgba(0, 0, 0, 0.12),
			inset 0 1px 2px rgba(255, 255, 255, 0.15);
	}

	.recording-header {
		display: flex;
		align-items: flex-start;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.recording-icon {
		font-size: 1.5rem;
		background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
		width: 48px;
		height: 48px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}

	.recording-info {
		flex: 1;
		min-width: 0;
	}

	.recording-name {
		font-size: 1rem;
		font-weight: 600;
		color: white;
		margin: 0 0 0.375rem 0;
		letter-spacing: -0.25px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.recording-meta {
		display: flex;
		gap: 0.75rem;
		font-size: 0.8125rem;
		color: rgba(255, 255, 255, 0.7);
		flex-wrap: wrap;
	}

	.duration,
	.date {
		display: flex;
		align-items: center;
		gap: 0.25rem;
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
		width: 36px;
		height: 36px;
		background: rgba(220, 53, 69, 0.1);
		border: 1px solid rgba(220, 53, 69, 0.2);
		color: #dc3545;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-size: 1rem;
	}

	.delete-button:hover {
		background: rgba(220, 53, 69, 0.9);
		border-color: #dc3545;
		color: white;
		transform: scale(1.05);
	}

	.delete-button:active {
		transform: scale(0.95);
	}

	@media (max-width: 768px) {
		.toggle-button {
			padding: 0.875rem 1rem;
			font-size: 0.9375rem;
		}

		.toggle-icon {
			font-size: 0.75rem;
		}

		.toggle-count {
			font-size: 0.6875rem;
			padding: 0.1875rem 0.5rem;
		}

		.no-recordings {
			padding: 2rem 1.5rem;
		}

		.no-recordings-icon {
			font-size: 2.5rem;
		}

		.no-recordings-text {
			font-size: 1rem;
		}

		.no-recordings-subtext {
			font-size: 0.8125rem;
		}

		.recording-card {
			padding: 0.875rem;
		}

		.recording-icon {
			font-size: 1.25rem;
			width: 40px;
			height: 40px;
		}

		.recording-name {
			font-size: 0.9375rem;
		}

		.recording-meta {
			font-size: 0.75rem;
		}

		.delete-button {
			width: 32px;
			height: 32px;
		}
	}

	@media (max-width: 480px) {
		.toggle-button {
			gap: 0.5rem;
		}

		.recording-header {
			gap: 0.5rem;
		}

		.recording-card {
			padding: 0.75rem;
		}

		.recording-icon {
			width: 36px;
			height: 36px;
			font-size: 1.125rem;
		}

		.recording-name {
			font-size: 0.875rem;
			margin-bottom: 0.25rem;
		}

		.recording-meta {
			gap: 0.5rem;
			font-size: 0.6875rem;
		}

		.recording-actions {
			gap: 0.375rem;
		}

		.delete-button {
			width: 28px;
			height: 28px;
		}
	}
</style>
