<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
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
	let hoveredColumn: number | null = null;
	let columnRefs: HTMLDivElement[] = [];

	function toggleCard(id: string) {
		openCardId = openCardId === id ? null : id;
	}

	const getColumnFlex = (colIndex: number) => {
		if (hoveredColumn === null) return 1;
		if (hoveredColumn === colIndex) return 1.08;
		return 0.97;
	};

	function getCardsColumns(cardsData: any[]) {
		return [
			cardsData.filter((c: any) => c.column === 'left').sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
			cardsData.filter((c: any) => c.column === 'middle').sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
			cardsData.filter((c: any) => c.column === 'right').sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
		];
	}

	// Initialize Lenis for cards blocks
	onMount(() => {
		const lenisInstances = columnRefs.map(columnEl => {
			if (!columnEl) return null;
			return new Lenis({
				wrapper: columnEl,
				content: columnEl.firstElementChild as HTMLElement,
				duration: 0.8,
				easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: 'vertical',
				smoothWheel: true,
				wheelMultiplier: 1.5,
				touchMultiplier: 2
			});
		}).filter(Boolean);

		function raf(time: number) {
			lenisInstances.forEach(lenis => lenis?.raf(time));
			requestAnimationFrame(raf);
		}

		if (lenisInstances.length > 0) {
			requestAnimationFrame(raf);
		}

		return () => {
			lenisInstances.forEach(lenis => lenis?.destroy());
		};
	});
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
			<section class="cards-block">
				{#if block.title}
					<h2 class="block-title">{block.title}</h2>
				{/if}
				
				<div class="cards-grid">
					{#each getCardsColumns(block.cards || []) as column, colIndex}
						<div 
							class="column"
							style="flex-grow: {getColumnFlex(colIndex)};"
							onmouseenter={() => hoveredColumn = colIndex}
							onmouseleave={() => hoveredColumn = null}
							role="group"
							bind:this={columnRefs[colIndex]}
						>
							<div class="column-content">
								{#each column as card}
									{@const cardType = card.Enumeration?.replace('Block_', '')}
									{@const cardId = card.id}
									
									<div class="card-wrapper">
										{#if cardType === 'Video' || cardType === 'Image'}
											<div 
												class="project-card" 
												class:open={openCardId === cardId}
												class:size-small={card.size === 'small'}
												class:size-medium={card.size === 'medium'}
												class:size-large={card.size === 'large'}
												on:click={() => toggleCard(cardId)}
												on:keydown={(e) => e.key === 'Enter' && toggleCard(cardId)}
												on:mouseleave={() => openCardId = null}
												role="button"
												tabindex="0"
											>
												<div class="card-slider" class:open={openCardId === cardId}>
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
											</div>
										{:else}
											<div 
												class="project-card" 
												class:size-small={card.size === 'small'}
												class:size-medium={card.size === 'medium'}
												class:size-large={card.size === 'large'}
											>
												<div class="card-content no-slider">
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
											</div>
										{/if}
										
										<div class="card-footer">
											<div class="footer-header">
												<div class="footer-title-wrapper">
													<img src="/dot.svg" alt="" class="footer-dot" />
													<span class="footer-title">{card.footerTitle || ''}</span>
												</div>
												{#if card.buttonText && card.buttonText.trim()}
													<a 
														href={card.buttonLinkValue || '#'} 
														class="footer-button" 
														class:button-red={card.buttonColor === 'red'}
														class:button-blue={card.buttonColor === 'blue'}
														class:button-green={card.buttonColor === 'green'}
														target={card.buttonLinkType === 'external' ? '_blank' : '_self'}
														rel={card.buttonLinkType === 'external' ? 'noopener noreferrer' : ''}
													>
														{card.buttonText}
													</a>
												{/if}
											</div>
											<h4 class="footer-description">{card.footerDescription || ''}</h4>
										</div>
									</div>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</div>

<style>
	:root {
		--color-red: #ff0000;
		--color-blue: #1e33fe;
		--color-green: #24bc12;
	}

	.page {
		font-family: 'Inter Tight', sans-serif;
	}

	.hero {
		position: relative;
		padding: 4rem 2rem;
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
		max-width: 1200px;
		margin: 2rem auto;
		padding: 2rem;
		line-height: 1.8;
		font-size: 1.1rem;
	}

	/* Cards Block - 3 kolumny */
	.cards-block {
		min-height: 100vh;
		padding: 2rem 0;
	}

	.block-title {
		text-align: center;
		font-size: 2.5rem;
		margin-bottom: 2rem;
		font-weight: 600;
	}

	.cards-grid {
		display: flex;
		gap: 0.5rem;
		width: 100%;
		height: 100vh;
		padding: 0 0.5rem;
		overflow: hidden;
		box-sizing: border-box;
	}

	.column {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: 0;
		transition: flex-grow 1.2s cubic-bezier(0.23, 1, 0.32, 1);
		height: 100%;
		overflow: hidden;
		position: relative;
	}

	.column-content {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding: 0.5rem 0;
	}

	.card-wrapper {
		flex-shrink: 0;
	}

	.project-card {
		width: 100%;
		flex-shrink: 0;
		background: #fff;
		position: relative;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		border-radius: 8px;
	}

	.project-card.size-small {
		aspect-ratio: 1;
		min-height: 320px;
	}

	.project-card.size-medium {
		aspect-ratio: 1;
		min-height: 320px;
	}

	.project-card.size-large {
		aspect-ratio: 9 / 16;
		min-height: 480px;
	}

	.project-card.open {
		transform: scale(1);
	}

	.card-slider {
		width: 100%;
		height: 100%;
		display: flex;
		position: relative;
		container-type: inline-size;
		margin-left: -1px;
		backface-visibility: hidden;
	}

	.card-content.no-slider {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8px;
	}

	.card-footer {
		padding: 0.75rem 0 1.5rem 0;
		background: white;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.footer-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.footer-title-wrapper {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.footer-dot {
		width: 0.5rem;
		height: 0.5rem;
		flex-shrink: 0;
	}

	.footer-title {
		font-size: 0.7rem;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 1.2px;
		font-weight: 500;
	}

	.footer-button {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 1.2px;
		font-weight: 700;
		text-decoration: none;
		transition: opacity 0.3s ease;
		line-height: 1;
	}

	.footer-button:hover {
		opacity: 0.8;
	}

	.footer-button.button-red {
		color: var(--color-red);
	}

	.footer-button.button-blue {
		color: var(--color-blue);
	}

	.footer-button.button-green {
		color: var(--color-green);
	}

	.footer-description {
		font-size: 0.85rem;
		color: #999;
		margin: 0;
		font-weight: 600;
		line-height: 1.3;
	}

	@media (max-width: 1024px) {
		.cards-grid {
			flex-direction: column;
		}

		.column {
			width: 100%;
		}
	}

	@media (max-width: 768px) {
		.hero h1 {
			font-size: 2rem;
		}

		.cards-grid {
			gap: 1rem;
		}
	}
</style>
