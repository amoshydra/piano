# Piano Project - Agent Development Guide

This document provides essential guidelines for working with the Piano web application codebase.

## Essential Commands

### Development

```bash
pnpm dev              # Start development server (http://localhost:5173)
pnpm build            # Production build
pnpm preview          # Preview production build
```

### Code Quality

```bash
pnpm check            # Type checking with svelte-check
pnpm check:watch      # Watch mode for type checking
pnpm format            # Format code with Prettier
pnpm lint             # Run Prettier + ESLint checks
```

### Testing

```bash
pnpm test             # Run all E2E tests
pnpm test:e2e        # Run Playwright tests (same as above)
```

**Running single tests:** Playwright tests don't have a direct single-test flag, but you can:

- Use `.only` on specific test in `e2e/*.test.ts` files temporarily
- Filter tests: `npx playwright test --grep "test name pattern"`

## Code Style Guidelines

### Import Conventions

- Use SvelteKit path aliases: `$lib/`, `$components/`, `$routes/`
- Svelte 5 imports: `import { onMount } from 'svelte'` (no `type` keyword needed)
- Store imports: Use `type` for store types when needed
- External libraries: ES module syntax preferred

```typescript
// ✅ Good
import { onMount } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import { audioEngine } from '$lib/audio';

// ❌ Bad
import { onMount } from 'svelte';
import * as Svelte from 'svelte';
```

### Formatting Rules

Prettier configuration (`.prettierrc`):

- **Tabs**, not spaces
- **Single quotes** for strings
- **No trailing commas**
- Print width: 100 characters
- Semi-colons: ASI style (inserted where needed)

Run `pnpm format` before committing.

### TypeScript Conventions

- **Strict mode** enabled in `tsconfig.json`
- All function parameters must be typed
- Use interfaces for complex objects (Props, Note, Recording)
- Explicit return types for all functions
- Optional properties: `property?: Type`
- Null checks required before accessing object properties

```typescript
// ✅ Good
interface Props {
	note: string;
	octave: number;
	width?: string;
}

function handleKeyDown(e: KeyboardEvent): void {
	if (!key) return;
	const frequency = audioEngine.getFrequency(note, octave);
}

// ❌ Bad
function handleKeyDown(e) {
	const frequency = audioEngine.getFrequency(note, octave);
}
```

### Naming Conventions

- **Files:** PascalCase.svelte (e.g., `MobilePiano.svelte`, `RecordButton.svelte`)
- **Components:** PascalCase (e.g., `MobilePiano`, `RecordButton`)
- **Functions:** camelCase (e.g., `handlePointerDown`, `toggleRecording`)
- **Variables:** camelCase (e.g., `activeKeys`, `playbackTimeout`)
- **Constants/Stores:** UPPER_SNAKE_CASE for exports (e.g., `isRecording`, `audioEngine`)
- **Interfaces:** PascalCase (e.g., `Props`, `Note`, `Recording`)
- **Private class members:** camelCase with `private` keyword (e.g., `private context`)

```typescript
// ✅ Good
export class AudioEngine {
	private context: AudioContext | null = null;
	public playNote(frequency: number, id: string): void {}
}

export const isRecording: Writable<boolean> = writable(false);

// ❌ Bad
export class audio_engine {
	private Context: AudioContext;
}
```

### Svelte 5 Specific Patterns

- Use `$props()` for component props (NOT `export let`)
- Use `$state()` for reactive component state
- Use `$derived()` for computed values
- Use `$effect()` for side effects (replaces `onMount` where reactive)
- Don't use `createEventDispatcher` - use native DOM events

```typescript
// ✅ Svelte 5 patterns
let { note, octave, width = '2rem' } = $props();
let isActive = $state(false);
let activeKeys = $derived([...]);

$effect(() => {
	if (recording) {
		currentRecording.set({ ...recording });
	}
});

// ❌ Old patterns (avoid)
export let note: string;
let isActive = false;
const activeKeys = derived(activeNotes, ($activeNotes) => [...]);
```

### Error Handling

- **SSR safety:** Always check for `window` before accessing browser APIs
- **Null checks:** Guard against null/undefined values
- **Try-catch:** Wrap operations that might fail (audio, localStorage)
- **Type guards:** Use type checking before type assertions

```typescript
// ✅ Good - SSR safe
class AudioEngine {
	constructor() {
		if (typeof window !== 'undefined') {
			this.context = new (window.AudioContext || window.webkitAudioContext)();
		}
	}
}

// ✅ Good - Error handling
try {
	const saved = localStorage.getItem('piano-recordings');
	if (saved) {
		const parsed: Recording[] = JSON.parse(saved);
		recordings.set(parsed);
	}
} catch (e) {
	console.error('Error loading recordings:', e);
}

// ❌ Bad - No SSR check
constructor() {
	this.context = new (window.AudioContext || window.webkitAudioContext)();
}
```

### Web Audio API Guidelines

- **Initialization:** Create context only in browser environment
- **Resume:** Always call `resume()` on first user interaction
- **Cleanup:** Stop oscillators properly to prevent memory leaks
- **Gain nodes:** Use exponential ramp for smooth volume changes

```typescript
async resume(): Promise<void> {
	if (!this.context) return;
	if (this.context.state === 'suspended') {
		await this.context.resume();
	}
}

playNote(frequency: number, id: string): void {
	if (!id || !this.context) return; // Guard check

	const oscillator = this.context.createOscillator();
	oscillator.stop(this.context.currentTime + 1); // Auto-cleanup
}
```

### Component Structure

- Use `<script lang="ts">` for TypeScript
- Keep logic in script, styling in `<style>`, HTML in template
- Use `role` and `aria-label` for accessibility
- Touch events: Include `touch-action: none` and `e.preventDefault()`

```svelte
<script lang="ts">
	import { onMount } from 'svelte';
	import { audioEngine } from '$lib/audio';

	let element: HTMLDivElement;

	onMount(() => {
		if (!element) return;
		element.addEventListener('pointerdown', handlePointerDown);
		return () => {
			element.removeEventListener('pointerdown', handlePointerDown);
		};
	});

	function handleTouchStart(e: TouchEvent): void {
		e.preventDefault(); // Prevent default touch behavior
	}
</script>

<div
	bind:this={element}
	role="button"
	aria-label="Play note"
	ontouchstart={handleTouchStart}
	style="touch-action: none;"
>
	<span class="note-name">{note}</span>
</div>
```

### CSS Conventions

- Use **CSS variables** for theme values (`--key-width`, `--key-background`)
- Mobile-first approach with `@media` queries for larger screens
- Use `rem` for responsive sizing, `px` for borders/shadows
- Smooth transitions: `transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1)`
- Modern features: `backdrop-filter: blur()`, `linear-gradient()`, `box-shadow` layers

### Testing Conventions

- Use Playwright for E2E tests in `e2e/` directory
- Test files: `*.test.ts`
- Test functions use `test('description', async ({ page }) => {})` format
- Keep tests independent and fast
- Use `expect().toBeVisible()` for UI elements

### Project-Specific Patterns

- **Audio:** Always check `typeof window !== 'undefined'` before using Audio API
- **Storage:** Wrap localStorage in try-catch for quota/parsing errors
- **Piano keys:** Use flexbox layout; black keys have `width: 0` with `::before` pseudo-element
- **Each blocks:** Always use unique keys, preferably composite (`getKeyId(key, index)`)
- **Stores:** Use Svelte 5 stores (`writable`, `derived`, `state`)

## Workflow

1. Make changes
2. Run `pnpm format` to format code
3. Run `pnpm lint` to check for errors
4. Run `pnpm check` for type safety
5. Test manually with `pnpm dev`
6. Commit changes using conventional commit format

## Conventional Commits

**All commits must follow conventional commit format:**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat:` - new features
- `fix:` - bug fixes
- `docs:` - documentation changes
- `style:` - formatting, styling changes
- `refactor:` - code refactoring
- `test:` - tests
- `chore:` - maintenance, build, dependencies
- `perf:` - performance improvements
- `ci:` - CI/CD changes

**Examples:**

- `feat(piano): add volume control slider`
- `fix(audio): resolve frequency calculation error`
- `docs(readme): update installation instructions`
- `test(audio): add unit tests for frequency calculations`

## Key Files

- `svelte.config.js` - SvelteKit configuration (aliases, adapter)
- `tsconfig.json` - TypeScript strict mode configuration
- `.prettierrc` - Prettier formatting rules
- `eslint.config.js` - ESLint rules configuration
- `playwright.config.ts` - E2E test configuration
