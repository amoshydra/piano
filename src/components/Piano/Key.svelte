<script lang="ts">
	import { onMount } from 'svelte';
	import { audioEngine } from '$lib/audio';

	interface Props {
		note: string;
		octave: number;
		color: 'white' | 'black';
		index: number;
		width?: string;
	}

	let { note, octave, color, index, width = '2rem' }: Props = $props();

	let element: HTMLDivElement;
	let isActive = $state(false);

	onMount(() => {
		if (!element) return;

		element.addEventListener('pointerdown', handlePointerDown);
		element.addEventListener('pointerup', handlePointerUp);
		element.addEventListener('pointerleave', handlePointerUp);
		element.addEventListener('touchstart', handleTouchStart, { passive: false });
		element.addEventListener('touchend', handleTouchEnd);

		return () => {
			element.removeEventListener('pointerdown', handlePointerDown);
			element.removeEventListener('pointerup', handlePointerUp);
			element.removeEventListener('pointerleave', handlePointerUp);
			element.removeEventListener('touchstart', handleTouchStart);
			element.removeEventListener('touchend', handleTouchEnd);
		};
	});

	function handleTouchStart(e: TouchEvent): void {
		e.preventDefault();
		const touch = e.touches[0];
		if (touch && element.contains(touch.target as Node)) {
			handlePointerDown();
		}
	}

	function handleTouchEnd(e: TouchEvent): void {
		e.preventDefault();
		handlePointerUp();
	}

	function handlePointerDown(): void {
		if (isActive) return;
		isActive = true;

		const frequency = audioEngine.getFrequency(note, octave);
		const id = `${note}${octave}-${index}`;

		audioEngine.playNote(frequency, id);

		setTimeout(() => {
			isActive = false;
			audioEngine.stopNote(id);
		}, 500);
	}

	function handlePointerUp(): void {
		const id = `${note}${octave}-${index}`;
		if (isActive) {
			isActive = false;
			audioEngine.stopNote(id);
		}
	}
</script>

<div
	bind:this={element}
	class="key {color}-key {isActive ? 'active' : ''}"
	style="--key-width: {width}"
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointerleave={handlePointerUp}
	ontouchstart={handleTouchStart}
	ontouchend={handleTouchEnd}
	role="button"
	aria-label="{note} {octave}"
>
	<span class="note-name">{note}</span>
	<div class="key-reflection"></div>
</div>

<style>
	.key {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		color: white;
		font-weight: bold;
		user-select: none;
		background: var(--key-background);
		height: 10rem;
		width: var(--key-width);
		transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
		touch-action: none;
		position: relative;
		overflow: hidden;
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
		--key-background: linear-gradient(180deg, #ffffff 0%, #f5f5f5 50%, #e8e8e8 100%);
		z-index: 1;
		justify-content: center;
		align-items: flex-end;
		color: #1a1a2e;
		border: 1px solid #d0d0d0;
		border-radius: 0 0 6px 6px;
		box-shadow:
			0 4px 8px rgba(0, 0, 0, 0.15),
			inset 0 -2px 4px rgba(0, 0, 0, 0.05);
	}

	.white-key .note-name {
		font-size: 0.875rem;
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
		--key-background: linear-gradient(180deg, #3a3a3a 0%, #2a2a2a 50%, #1a1a1a 100%);
		width: 0;
		z-index: 2;
		position: relative;
		background: transparent;
		border: none;
		height: 10rem;
	}

	.black-key::before {
		content: '';
		position: absolute;
		background: var(--key-background);
		top: 0;
		left: 0;
		display: block;
		transform: translateX(-50%);
		width: calc(0.75 * var(--key-width));
		height: 6.5rem;
		border-radius: 0 0 4px 4px;
		border: 1px solid #1a1a1a;
		box-shadow:
			0 6px 12px rgba(0, 0, 0, 0.3),
			inset 0 -2px 4px rgba(0, 0, 0, 0.2),
			inset 0 1px 2px rgba(255, 255, 255, 0.1);
		transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.black-key::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.15) 0%,
			rgba(255, 255, 255, 0) 50%,
			rgba(255, 255, 255, 0) 100%
		);
		pointer-events: none;
		border-radius: 0 0 4px 4px;
	}

	.black-key:active::before,
	.black-key.active::before {
		background: linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%);
		box-shadow:
			0 3px 6px rgba(0, 0, 0, 0.2),
			inset 0 -1px 2px rgba(0, 0, 0, 0.15),
			inset 0 1px 2px rgba(255, 255, 255, 0.05);
		transform: translateX(-50%) translateY(2px);
	}

	@media (max-width: 640px) {
		.key {
			height: 7rem;
		}

		.white-key {
			border-radius: 0 0 4px 4px;
		}

		.black-key::before {
			height: 4.5rem;
			border-radius: 0 0 3px 3px;
		}

		.white-key .note-name {
			font-size: 0.75rem;
			padding-bottom: 0.5rem;
		}
	}

	@media (hover: hover) {
		.white-key:hover {
			background: linear-gradient(180deg, #fafafa 0%, #f0f0f0 50%, #e3e3e3 100%);
		}

		.black-key:hover::before {
			background: linear-gradient(180deg, #4a4a4a 0%, #3a3a3a 50%, #2a2a2a 100%);
		}
	}
</style>
