<script lang="ts">
	import type { PageData } from './$types';
	import BigTextCard from '../../components/BigTextCard.svelte';
	import DescTextCard from '../../components/DescTextCard.svelte';
	import VideoCard from '../../components/VideoCard.svelte';
	import ImageCard from '../../components/ImageCard.svelte';

	export let data: PageData;

	$: page = data.page;
	$: blocks = page.blocks || [];

	const API_URL = 'https://insignia-agency-production.up.railway.app';

	// Helper to get full media URL
	function getMediaUrl(media: any): string {
		if (!media) return '';
		if (typeof media === 'string') return media.startsWith('http') ? media : `${API_URL}${media}`;
		if (media.url) return media.url.startsWith('http') ? media.url : `${API_URL}${media.url}`;
		return '';
	}

	let openCardId: string | null = null;

	function toggleCard(id: string) {
		openCardId = openCardId === id ? null : id;
	}
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
					<h2 class="section-title">{block.title}</h2>
				{/if}
				<div class="cards-grid">
					{#each block.cards as card}
						{@const cardType = card.Enumeration?.replace('Block_', '')}
						{@const cardId = card.id}
						
						{#if cardType === 'Video' || cardType === 'Image'}
							<div 
								class="card-wrapper interactive"
								class:open={openCardId === cardId}
								on:click={() => toggleCard(cardId)}
								on:keydown={(e) => e.key === 'Enter' && toggleCard(cardId)}
								on:mouseleave={() => openCardId = null}
								role="button"
								tabindex="0"
							>
								{#if cardType === 'Video'}
									<VideoCard 
										videoWebm={getMediaUrl(card.videoWebm)}
										videoMp4={getMediaUrl(card.videoMp4)}
										category={card.category || ''}
										title={card.title || ''}
										description={card.description || ''}
										isOpen={openCardId === cardId}
									/>
								{:else}
									<ImageCard 
										imageSrc={getMediaUrl(card.imageSrc)}
										imageAlt={card.imageAlt || ''}
										category={card.category || ''}
										title={card.title || ''}
										description={card.description || ''}
										isOpen={openCardId === cardId}
									/>
								{/if}
							</div>
						{:else}
							<div class="card-wrapper static">
								{#if cardType === 'BigText'}
									<BigTextCard 
										titleLine1={card.titleLine1 || ''}
										titleLine2={card.titleLine2 || ''}
										titleColor={card.titleColor || 'red'}
									/>
								{:else if cardType === 'DescText'}
									<DescTextCard 
										title={card.title || ''}
										description={card.description || ''}
									/>
								{/if}
							</div>
						{/if}
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</div>

<style>
	.page {
		max-width: 1400px;
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

	.section-title {
		text-align: center;
		margin-bottom: 3rem;
		font-size: 2.5rem;
		font-weight: 600;
	}

	.cards-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		padding: 1rem 0;
	}

	.card-wrapper {
		min-height: 250px;
		transition: transform 0.3s ease;
	}

	.card-wrapper.interactive {
		cursor: pointer;
	}

	.card-wrapper.interactive:hover {
		transform: translateY(-5px);
	}

	.card-wrapper.static {
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.cards-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}

		.section-title {
			font-size: 2rem;
		}

		.hero h1 {
			font-size: 2rem;
		}
	}
</style>
