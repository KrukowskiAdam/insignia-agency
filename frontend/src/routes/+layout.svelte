<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar />

<main>
	{@render children()}
</main>

<footer>
	<p>&copy; 2025 INSIGNIA - Agencja Marketingowa</p>
</footer>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
	}

	main {
		min-height: 80vh;
	}

	footer {
		padding: 2rem;
		text-align: center;
		background: #f5f5f5;
		color: #666;
	}
</style>
