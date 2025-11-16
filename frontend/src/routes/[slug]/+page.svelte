<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	$: page = data.page;
	$: blocks = page.blocks || [];
</script>

<svelte:head>
	<title>{page.seo?.metaTitle || page.title}</title>
	{#if page.seo?.metaDescription}
		<meta name="description" content={page.seo.metaDescription} />
	{/if}
</svelte:head>

<div class="page">
	{#each blocks as block}
		{#if block.blockType === 'hero'}
			<section class="hero" style={block.backgroundImage?.url ? `background-image: url(${block.backgroundImage.url})` : ''}>
				<div class="hero-content">
					<h1>{block.heading}</h1>
					{#if block.subheading}
						<p class="subheading">{block.subheading}</p>
					{/if}
				</div>
			</section>
		{:else if block.blockType === 'content'}
			<div class="content-block">
				{@html block.text.replace(/\n/g, '<br>')}
			</div>
		{:else if block.blockType === 'cards'}
			<section class="cards-section">
				{#if block.title}
					<h2>{block.title}</h2>
				{/if}
				<div class="cards-grid">
					{#each block.selectedCards as card}
						<div class="card">
							{#if card.Enumeration === 'Block_BigText'}
								<div class="card-bigtext">
									<h3>{card.titleLine1}</h3>
									{#if card.titleLine2}
										<p>{card.titleLine2}</p>
									{/if}
								</div>
							{:else if card.Enumeration === 'Block_DescText'}
								<div class="card-desctext">
									<h3>{card.title}</h3>
									<p>{card.description}</p>
								</div>
							{:else if card.Enumeration === 'Block_Image'}
								<div class="card-image">
									<img src={card.imageSrc?.url} alt={card.imageAlt} />
								</div>
							{:else if card.Enumeration === 'Block_Video'}
								<div class="card-video">
									<video autoplay loop muted playsinline>
										<source src={card.videoWebm?.url} type="video/webm" />
										<source src={card.videoMp4?.url} type="video/mp4" />
									</video>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
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
		min-height: 400px;
		display: flex;
		align-items: center;
		justify-content: center;
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

	.content-block {
		line-height: 1.8;
		font-size: 1.1rem;
		margin: 2rem 0;
	}

	.cards-section {
		margin: 3rem 0;
	}

	.cards-section h2 {
		text-align: center;
		margin-bottom: 2rem;
		font-size: 2rem;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
	}

	.card {
		background: #f5f5f5;
		border-radius: 8px;
		overflow: hidden;
		transition: transform 0.3s;
	}

	.card:hover {
		transform: translateY(-5px);
	}

	.card-bigtext,
	.card-desctext {
		padding: 2rem;
	}

	.card-bigtext h3,
	.card-desctext h3 {
		margin-bottom: 1rem;
	}

	.card-image img,
	.card-video video {
		width: 100%;
		height: auto;
		display: block;
	}
</style>
