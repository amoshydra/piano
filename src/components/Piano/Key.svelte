<script lang="ts">
	import { onMount } from 'svelte';
	import { audioEngine } from '$lib/audio';
	import { activeNotes } from '$lib/store';

	interface Props {
		note: string;
		octave: number;
		color: 'white' | 'black';
		key: string;
		index: number;
		width?: string;
	}

	let {
		note,
		octave,
		color,
		key,
		index,
		width = '2rem'
	}: Props = $props();

	let dispatch: ((event: 'note', detail: { note: string; octave: number; frequency: number; id: string }) => void) &
		((event: 'noteEnd', detail: { note: string; octave: number; frequency: number; id: string }) => void) &
		((event: string, detail: any) => void) = (event, detail) => {
			element?.dispatchEvent(new CustomEvent(event, { detail, bubbles: true }));
		};
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
			handlePointerDown(e as any);
		}
	}

	function handleTouchEnd(e: TouchEvent): void {
		e.preventDefault();
		handlePointerUp(e as any);
	}

	function handlePointerDown(e: PointerEvent | TouchEvent): void {
		if (isActive) return;
		isActive = true;

		const frequency = audioEngine.getFrequency(note, octave);
		const id = `${note}${octave}-${index}`;

		audioEngine.playNote(frequency, id);

		activeNotes.update((set) => {
			const newSet = new Set(set);
			newSet.add(id);
			return newSet;
		});

		dispatch('note', { note, octave, frequency, id });

		setTimeout(() => {
			isActive = false;
			activeNotes.update((set) => {
				const newSet = new Set(set);
				newSet.delete(id);
				return newSet;
			});
			audioEngine.stopNote(id);
			dispatch('noteEnd', { note, octave, frequency, id });
		}, 500);
	}

	function handlePointerUp(e: PointerEvent | TouchEvent): void {
		const id = `${note}${octave}-${index}`;
		if (isActive) {
			isActive = false;
			activeNotes.update((set) => {
				const newSet = new Set(set);
				newSet.delete(id);
				return newSet;
			});
			audioEngine.stopNote(id);
			dispatch('noteEnd', { note, octave, frequency: audioEngine.getFrequency(note, octave), id });
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
</div>

<style>
	.key {
		border: 1px solid #000;
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
		transition: background-color 0.1s;
		touch-action: none;
	}

	.white-key {
		--key-background: white;
		z-index: 1;
		justify-content: center;
		align-items: flex-end;
		color: #fefefe;
	}

	.white-key .note-name {
		font-size: 0.875rem;
		padding-bottom: 0.5rem;
	}

	.black-key {
		--key-background: black;
		width: 0;
		z-index: 2;
		position: relative;
		background: transparent;
		border: none;
	}

	.black-key::before {
		content: '';
		position: absolute;
		background: var(--key-background);
		top: 0;
		left: 0;
		display: block;
		transform: translateX(-50%);
		width: calc(0.8 * var(--key-width));
		height: 6.5rem;
		border: 2px solid white;
		border-top: 1px solid black;
		border-bottom: none;
	}

	.white-key.active,
	.white-key:active {
		--key-background: #ccc;
	}

	.black-key.active,
	.black-key:active {
		--key-background: #555;
	}

	@media (max-width: 640px) {
		.key {
			height: 7rem;
		}

		.black-key::before {
			height: 4.5rem;
		}

		.white-key .note-name {
			font-size: 0.75rem;
		}
	}
</style>
