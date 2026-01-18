<script lang="ts">
	import Piano from '../Piano/Piano.svelte';
	import PianoControls from '../Piano/PianoControls.svelte';
	import RecordButton from '../Recording/RecordButton.svelte';
	import RecordingList from '../Recording/RecordingList.svelte';
</script>

<div class="mobile-layout">
	<header class="header">
		<div class="header-content">
			<div class="logo">
				<svg
					width="48"
					height="48"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect x="2" y="2" width="20" height="20" rx="2" fill="white" fill-opacity="0.2" />
					<rect x="4" y="4" width="3" height="14" rx="0.5" fill="white" />
					<rect x="8" y="4" width="3" height="14" rx="0.5" fill="white" />
					<rect x="12" y="4" width="3" height="14" rx="0.5" fill="white" />
					<rect x="16" y="4" width="4" height="14" rx="0.5" fill="white" />
					<rect x="5" y="18" width="2" height="2" fill="white" fill-opacity="0.5" />
					<rect x="9" y="18" width="2" height="2" fill="white" fill-opacity="0.5" />
					<rect x="13" y="18" width="2" height="2" fill="white" fill-opacity="0.5" />
				</svg>
			</div>
			<h1>Piano</h1>
		</div>
	</header>

	<main class="main">
		<section class="recording-section">
			<RecordButton />
		</section>

		<section class="piano-section">
			<div class="piano-header">
				<div class="piano-title">
					<span class="emoji">🎹</span>
					<h2>Virtual Piano</h2>
				</div>
				<PianoControls />
			</div>
			<Piano />
		</section>

		<section class="recordings-section">
			<RecordingList />
		</section>
	</main>

	<footer class="footer">
		<p>Tap keys or use keyboard shortcuts to play</p>
	</footer>
</div>

<style>
	.mobile-layout {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
		padding: 1.5rem;
		position: relative;
		overflow: hidden;
	}

	.mobile-layout::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
		pointer-events: none;
	}

	.header {
		text-align: center;
		margin-bottom: 2rem;
		position: relative;
		z-index: 1;
	}

	.header-content {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.logo {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.header h1 {
		color: white;
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0;
		text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
		letter-spacing: -0.5px;
		background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
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

	.recording-section {
		display: flex;
		justify-content: center;
	}

	.piano-section {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 2rem;
		box-shadow:
			0 20px 40px rgba(0, 0, 0, 0.15),
			0 8px 16px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.piano-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.piano-title {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.piano-title .emoji {
		font-size: 2rem;
	}

	.piano-title h2 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #1a1a2e;
		letter-spacing: -0.5px;
	}

	.recordings-section {
		background: rgba(255, 255, 255, 0.95);
		backdrop-filter: blur(20px);
		border-radius: 20px;
		padding: 2rem;
		box-shadow:
			0 20px 40px rgba(0, 0, 0, 0.15),
			0 8px 16px rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.3);
	}

	.footer {
		text-align: center;
		margin-top: 2rem;
		padding: 1rem;
		position: relative;
		z-index: 1;
	}

	.footer p {
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.875rem;
		margin: 0;
		font-weight: 500;
	}

	@media (max-width: 768px) {
		.mobile-layout {
			padding: 1rem;
		}

		.header {
			margin-bottom: 1.5rem;
		}

		.header-content {
			gap: 0.75rem;
		}

		.header h1 {
			font-size: 2rem;
		}

		.main {
			gap: 1rem;
		}

		.piano-section,
		.recordings-section {
			padding: 1.5rem;
			border-radius: 16px;
		}

		.piano-header {
			flex-direction: column;
			align-items: flex-start;
		}

		.piano-title h2 {
			font-size: 1.25rem;
		}
	}

	@media (max-width: 480px) {
		.mobile-layout {
			padding: 0.75rem;
		}

		.header {
			margin-bottom: 1rem;
		}

		.header-content {
			gap: 0.5rem;
		}

		.logo svg {
			width: 40px;
			height: 40px;
		}

		.header h1 {
			font-size: 1.5rem;
		}

		.main {
			gap: 0.75rem;
		}

		.piano-section,
		.recordings-section {
			padding: 1rem;
			border-radius: 12px;
		}

		.piano-title .emoji {
			font-size: 1.5rem;
		}

		.piano-title h2 {
			font-size: 1.125rem;
		}

		.footer {
			margin-top: 1.5rem;
			padding: 0.75rem;
		}

		.footer p {
			font-size: 0.8125rem;
		}
	}
</style>
