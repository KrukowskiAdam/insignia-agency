<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: page = data.page;
</script>

<svelte:head>
	<title>{page.seo?.metaTitle || page.title}</title>
	{#if page.seo?.metaDescription}
		<meta name="description" content={page.seo.metaDescription} />
	{/if}
</svelte:head>

<div class="page">
	{#if page.hero?.heading || page.hero?.subheading}
		<section class="hero" style={page.hero.backgroundImage ? `background-image: url(${page.hero.backgroundImage.url})` : ''}>
			<div class="hero-content">
				{#if page.hero.heading}
					<h1>{page.hero.heading}</h1>
				{/if}
				{#if page.hero.subheading}
					<p class="subheading">{page.hero.subheading}</p>
				{/if}
			</div>
		</section>
	{:else}
		<h1>{page.title}</h1>
	{/if}

	<div class="content">
		{@html page.content.replace(/\n/g, '<br>')}
	</div>
</div>

<style>
	.page {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	.hero {
		position: relative;
		padding: 4rem 2rem;
		margin: -2rem -2rem 2rem;
		background-size: cover;
		background-position: center;
		color: white;
		text-align: center;
	}

	.hero::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.5);
		z-index: 0;
	}

	.hero-content {
		position: relative;
		z-index: 1;
	}

	.hero h1 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	.subheading {
		font-size: 1.25rem;
		opacity: 0.9;
	}

	.content {
		line-height: 1.8;
		font-size: 1.1rem;
	}

	h1 {
		margin-bottom: 2rem;
	}
</style>
