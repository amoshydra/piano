<script lang="ts">
	import Piano from '../Piano/Piano.svelte';
	import PianoControls from '../Piano/PianoControls.svelte';
	import RecordButton from '../Recording/RecordButton.svelte';
	import RecordingList from '../Recording/RecordingList.svelte';
</script>

<div class="mobile-layout">
	<main class="main">
		<div class="controls-section">
			<PianoControls />
		</div>
		<Piano />

		<section class="recordings-section">
			<RecordButton />
			<RecordingList />
		</section>
	</main>
</div>

<style>
	:global(*) {
		box-sizing: border-box;
	}
	:global(:root) {
		font-family:
			system-ui,
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			Oxygen,
			Ubuntu,
			Cantarell,
			'Open Sans',
			'Helvetica Neue',
			sans-serif;
		background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 50%, #2d3748 100%);
		background-attachment: fixed;
		height: 100%;
	}
	:global(body) {
		margin: 0;
		height: 100%;
		overflow-x: hidden;
		overflow-y: auto;
	}
	.mobile-layout {
		display: flex;
		flex-direction: column;
		padding: clamp(0.25rem, 2vw, 1.5rem);
		min-height: 100dvh;
	}

	.main {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		position: relative;
		z-index: 1;
	}

	.controls-section {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.recordings-section {
		background: rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(24px);
		-webkit-backdrop-filter: blur(24px);
		border-radius: 20px;
		padding: 1.5rem;
		box-shadow:
			0 20px 40px rgba(0, 0, 0, 0.15),
			0 8px 16px rgba(0, 0, 0, 0.1),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.25);
		display: flex;
		justify-items: auto;
		flex-direction: column;
		gap: 1rem;
	}
</style>
