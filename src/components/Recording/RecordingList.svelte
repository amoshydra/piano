<script lang="ts">
	import { recordings, type Recording } from '$lib/store';
	import PlaybackControls from './PlaybackControls.svelte';
	import { deleteRecording, importRecording, downloadRecording } from '$lib/recorder';

	interface Props {
		expanded?: boolean;
	}

	let { expanded = false }: Props = $props();
	let showList = $state(expanded);
	let editingId: string | null = $state(null);
	let editingName: string = $state('');

	function toggleList(): void {
		showList = !showList;
	}

	function handleDelete(id: string): void {
		if (confirm('Are you sure you want to delete this recording?')) {
			deleteRecording(id);
		}
	}

	function startEditing(recording: Recording): void {
		editingId = recording.id;
		editingName = recording.name;
	}

	function saveRename(id: string): void {
		if (editingName.trim() === '') return;

		const currentRecordings = $recordings;
		const updatedRecordings = currentRecordings.map((rec) =>
			rec.id === id ? { ...rec, name: editingName.trim() } : rec
		);

		recordings.set(updatedRecordings);

		// Save to localStorage
		try {
			localStorage.setItem('piano-recordings', JSON.stringify(updatedRecordings));
		} catch (e) {
			console.error('Error saving renamed recording:', e);
		}

		editingId = null;
		editingName = '';
	}

	function cancelRename(): void {
		editingId = null;
		editingName = '';
	}

	function autofocus(node: HTMLInputElement) {
		node.focus();
		return {};
	}

	function handleExportRecording(recording: Recording): void {
		downloadRecording(recording);
	}

	function handleImport(): void {
		const input = document.createElement('input');
		input.type = 'file';
		input.accept = '.json';
		input.onchange = () => {
			const file = input.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const jsonData = event.target?.result as string;
					const result = importRecording(jsonData);

					if (result.success) {
						alert(result.message);
						// Refresh the recordings list
						recordings.update((current) => [...current]);
					} else {
						alert(`Import failed: ${result.message}`);
					}
				} catch {
					alert('Failed to read file. Please check the file format.');
				}
			};
			reader.readAsText(file);
		};
		input.click();
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
									{#if editingId === recording.id}
										<div class="rename-input-container">
											<input
												type="text"
												class="rename-input"
												bind:value={editingName}
												onkeydown={(e) => {
													if (e.key === 'Enter') saveRename(recording.id);
													if (e.key === 'Escape') cancelRename();
												}}
												onblur={() => saveRename(recording.id)}
												use:autofocus
												placeholder="Recording name"
											/>
										</div>
									{:else}
										<h3 class="recording-name">{recording.name}</h3>
									{/if}
									<div class="recording-meta">
										<span class="duration">⏱ {formatDuration(recording.duration)}</span>
										<span class="date">{formatDate(recording.createdAt)}</span>
									</div>
								</div>
							</div>
							<div class="recording-actions">
								<PlaybackControls {recording} />
								{#if editingId === recording.id}
									<button
										class="save-button"
										onclick={() => saveRename(recording.id)}
										aria-label="Save name"
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M20 6L9 17l-5-5" />
										</svg>
									</button>
								{:else}
									<button
										class="export-button"
										onclick={() => handleExportRecording(recording)}
										aria-label="Export recording"
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
											<polyline points="7,10 12,15 17,10" />
											<line x1="12" y1="15" x2="12" y2="3" />
										</svg>
									</button>
									<button
										class="rename-button"
										onclick={() => startEditing(recording)}
										aria-label="Rename recording"
									>
										<svg
											width="20"
											height="20"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="2"
										>
											<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
											<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
										</svg>
									</button>
								{/if}
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
			{#if showList}
				<button class="import-button-float" onclick={handleImport} aria-label="Import recording">
					<svg
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="17,8 12,3 7,8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
					<span>Import</span>
				</button>
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
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 2px solid rgba(255, 255, 255, 0.4);
		border-radius: 12px;
		cursor: pointer;
		font-weight: 600;
		font-size: 1rem;
		color: white;
		text-align: left;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.1),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
	}

	.toggle-button:hover {
		background: rgba(255, 255, 255, 0.35);
		border-color: rgba(255, 255, 255, 0.5);
		transform: translateY(-1px);
		box-shadow:
			0 4px 12px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(255, 255, 255, 0.15);
	}

	.toggle-button:active {
		transform: translateY(0);
	}

	.toggle-icon {
		font-size: 0.875rem;
		color: white;
		transition: transform 0.3s ease;
	}

	.toggle-text {
		flex: 1;
		letter-spacing: 0.5px;
	}

	.toggle-count {
		background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
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
		background: rgba(255, 255, 255, 0.25);
		backdrop-filter: blur(16px);
		-webkit-backdrop-filter: blur(16px);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 12px;
		padding: 1rem;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow:
			0 2px 8px rgba(0, 0, 0, 0.05),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
	}

	.recording-card:hover {
		background: rgba(255, 255, 255, 0.35);
		border-color: rgba(255, 255, 255, 0.4);
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
		background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
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

	.rename-input-container {
		width: 100%;
	}

	.rename-input {
		width: 100%;
		padding: 0.5rem;
		background: rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
		border-radius: 6px;
		color: white;
		font-size: 0.9375rem;
		font-weight: 600;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		outline: none;
	}

	.rename-input:focus {
		background: rgba(255, 255, 255, 0.15);
		border-color: rgba(102, 126, 234, 0.6);
		box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
	}

	.rename-input::placeholder {
		color: rgba(255, 255, 255, 0.5);
	}

	.delete-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: rgba(220, 53, 69, 0.4);
		border: 1px solid rgba(220, 53, 69, 0.5);
		color: white;
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

	.rename-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: rgba(40, 167, 69, 0.4);
		border: 1px solid rgba(40, 167, 69, 0.5);
		color: white;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-size: 1rem;
	}

	.rename-button:hover {
		background: rgba(40, 167, 69, 0.9);
		border-color: #28a745;
		color: white;
		transform: scale(1.05);
	}

	.rename-button:active {
		transform: scale(0.95);
	}

	.save-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: rgba(40, 167, 69, 0.9);
		border: 1px solid #28a745;
		color: white;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-size: 1rem;
	}

	.save-button:hover {
		background: #28a745;
		transform: scale(1.05);
	}

	.save-button:active {
		transform: scale(0.95);
	}

	.export-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		background: rgba(13, 110, 253, 0.4);
		border: 1px solid rgba(13, 110, 253, 0.5);
		color: white;
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		font-size: 1rem;
	}

	.export-button:hover {
		background: rgba(13, 110, 253, 0.9);
		border-color: #0d6efd;
		color: white;
		transform: scale(1.05);
	}

	.export-button:active {
		transform: scale(0.95);
	}

	.import-button-float {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1rem;
		background: linear-gradient(135deg, #4a90e2 0%, #357abd 100%);
		color: white;
		border: none;
		border-radius: 50px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		box-shadow: 0 4px 20px rgba(74, 144, 226, 0.4);
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		z-index: 1000;
	}

	.import-button-float:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 25px rgba(74, 144, 226, 0.5);
	}

	.import-button-float:active {
		transform: translateY(0);
	}

	@media (max-width: 768px) {
		.import-export-buttons {
			gap: 0.5rem;
		}

		.import-button,
		.export-button {
			padding: 0.5rem 0.75rem;
			font-size: 0.8125rem;
		}

		.import-button svg,
		.export-button svg {
			width: 18px;
			height: 18px;
		}

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

		.rename-button,
		.save-button {
			width: 28px;
			height: 28px;
		}

		.rename-input {
			padding: 0.375rem;
			font-size: 0.875rem;
		}

		.import-button-float {
			bottom: 1rem;
			right: 1rem;
			padding: 0.625rem 0.875rem;
			font-size: 0.8125rem;
		}

		.import-button-float svg {
			width: 18px;
			height: 18px;
		}
	}
</style>
