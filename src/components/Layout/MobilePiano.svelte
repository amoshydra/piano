<script lang="ts">
	import Piano from '../Piano/Piano.svelte';
	import PianoControls from '../Piano/PianoControls.svelte';
	import RecordButton from '../Recording/RecordButton.svelte';
	import RecordingList from '../Recording/RecordingList.svelte';
</script>

<div class="mobile-layout">
	<header class="header">
		<h1>Piano</h1>
	</header>

	<main class="main">
		<section class="recording-section">
			<RecordButton />
		</section>

		<section class="piano-section">
			<PianoControls />
			<Piano />
		</section>

		<section class="recordings-section">
			<RecordingList />
		</section>
	</main>
</div>

<style>
	.mobile-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		padding: 1rem;
	}

	.header {
		text-align: center;
		margin-bottom: 1.5rem;
	}

	.header h1 {
		color: white;
		font-size: 2rem;
		margin: 0;
		text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
	}

	.recording-section {
		display: flex;
		justify-content: center;
	}

	.piano-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.recordings-section {
		background: white;
		border-radius: 12px;
		padding: 1.5rem;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	@media (max-width: 768px) {
		.mobile-layout {
			padding: 0.5rem;
		}

		.header h1 {
			font-size: 1.5rem;
		}

		.piano-section,
		.recordings-section {
			padding: 1rem;
			border-radius: 8px;
		}
	}

	@media (max-width: 480px) {
		.mobile-layout {
			padding: 0.25rem;
		}

		.header {
			margin-bottom: 1rem;
		}

		.header h1 {
			font-size: 1.25rem;
		}

		.main {
			gap: 0.5rem;
		}

		.piano-section,
		.recordings-section {
			padding: 0.75rem;
		}
	}
</style>
