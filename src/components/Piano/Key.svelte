<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		note: string;
		octave: number;
		color: 'white' | 'black';
		isActive?: boolean;
		onPointerDown?: () => void;
		onPointerUp?: () => void;
	}

	let { note, octave, color, isActive = false, onPointerDown, onPointerUp }: Props = $props();

	let element: HTMLDivElement;

	onMount(() => {
		if (!element) return;

		// Only handle touch events here, pointer events are handled by Svelte event handlers
		element.addEventListener('touchstart', handleTouchStart, { passive: false });
		element.addEventListener('touchend', handleTouchEnd);

		return () => {
			element.removeEventListener('touchstart', handleTouchStart);
			element.removeEventListener('touchend', handleTouchEnd);
		};
	});

	function handleTouchStart(e: TouchEvent): void {
		e.preventDefault();
		const touch = e.touches[0];
		if (touch && element.contains(touch.target as Node)) {
			onPointerDown?.();
		}
	}

	function handleTouchEnd(e: TouchEvent): void {
		e.preventDefault();
		onPointerUp?.();
	}

	function handlePointerDown(): void {
		onPointerDown?.();
	}

	function handlePointerUp(): void {
		onPointerUp?.();
	}
</script>

<div
	bind:this={element}
	class="key {color}-key {isActive ? 'active' : ''}"
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerUp}
	role="button"
	aria-label="{note} {octave}"
>
	<span class="note-name">{note}</span>
	<div class="key-reflection"></div>
</div>

<style>
	.key {
		font-size: clamp(0.325em, 1.5vw, 1rem);
		--key-width: 4em;

		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
		user-select: none;
		height: 20em;
		width: var(--key-width);
		/* transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); */
		touch-action: none;
		position: relative;
	}

	.key-reflection {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.3) 0%,
			rgba(255, 255, 255, 0) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		pointer-events: none;
		opacity: 0.5;
	}

	.white-key {
		background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%);
		z-index: 1;
		justify-content: center;
		align-items: flex-end;
		color: #1a1a2e;
		border-radius: 0 0 6px 6px;
		box-shadow:
			0 4px 8px rgba(0, 0, 0, 0.15),
			inset 0 -2px 4px rgba(0, 0, 0, 0.05);
	}

	.white-key .note-name {
		font-size: 1.5em;
		font-family: monospace;
		padding-bottom: 0.75rem;
		font-weight: 600;
		letter-spacing: 0.5px;
		opacity: 0.7;
		transition: opacity 0.15s ease;
	}

	.white-key:hover .note-name {
		opacity: 1;
	}

	.white-key:active,
	.white-key.active {
		background: linear-gradient(180deg, #e0e0e0 0%, #d5d5d5 50%, #c8c8c8 100%);
		box-shadow:
			0 2px 4px rgba(0, 0, 0, 0.1),
			inset 0 -1px 2px rgba(0, 0, 0, 0.08);
		transform: translateY(2px);
	}

	.white-key:active .note-name,
	.white-key.active .note-name {
		opacity: 1;
	}

	.black-key {
		background: transparent;
		width: 0;
		z-index: 2;
		border: none;
	}

	.black-key::after,
	.black-key::before {
		content: '';
		position: absolute;
		background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);
		top: -0.125rem;
		left: 0;
		display: block;
		transform: translateX(-50%);
		width: calc(0.8 * var(--key-width));
		height: 13em;
		border-radius: 0 0 4px 4px;
		box-shadow:
			0 6px 12px rgba(0, 0, 0, 0.3),
			inset 0 -2px 4px rgba(0, 0, 0, 0.2),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
		transition: transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.black-key::before {
		/* This is to prevent accidentally tapping white key in between two black keys */
		box-shadow: none;
		background: transparent;
		width: calc(var(--key-width));
	}

	.black-key:active::after,
	.black-key.active::after {
		background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%);
		box-shadow:
			0 3px 6px rgba(0, 0, 0, 0.2),
			inset 0 -1px 2px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(255, 255, 255, 0.05);
		transform: translateX(-50%) translateY(2px);
	}

	@media (hover: hover) {
		.white-key:not(.active):hover {
			background: linear-gradient(180deg, #fafafa 0%, #f0f0f0 50%, #e3e3e3 100%);
		}

		.black-key:not(.active):hover::after {
			background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%);
		}
	}
</style>
