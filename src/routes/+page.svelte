<script lang="ts">
	import MobilePiano from '$components/Layout/MobilePiano.svelte';
	import { onMount } from 'svelte';
	import { loadRecordingsFromStorage } from '$lib/recorder';

	onMount(() => {
		loadRecordingsFromStorage();
	});
</script>

<svelte:head>
	<meta
		name="viewport"
		content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
	/>
	<meta name="apple-mobile-web-app-capable" content="yes" />
	<meta name="theme-color" content="#667eea" />
	<meta name="description" content="A mobile-friendly web piano with recording capabilities" />
</svelte:head>

<MobilePiano />
