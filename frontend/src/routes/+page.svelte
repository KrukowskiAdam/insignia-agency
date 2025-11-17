<script lang="ts">
	import { onMount } from 'svelte';
	import Lenis from 'lenis';
	import BigTextCard from '../components/BigTextCard.svelte';
	import DescTextCard from '../components/DescTextCard.svelte';
	import VideoCard from '../components/VideoCard.svelte';
	import ImageCard from '../components/ImageCard.svelte';
	import type { Card } from './+page';

	interface Props {
		data: {
			cards: Card[];
			homepage: any;
		}
	}

	let { data }: Props = $props();

	const API_URL = 'https://backend-isnisgnias-projects.vercel.app';

	// Helper to get full media URL
	function getMediaUrl(media: any): string {
		if (!media) return '';
		if (typeof media === 'string') return media.startsWith('http') ? media : `${API_URL}${media}`;
		if (media.url) return media.url.startsWith('http') ? media.url : `${API_URL}${media.url}`;
		return '';
	}

	// Use blocks from homepage ONLY
	const homepage = $derived(data.homepage);
	const blocks = $derived(homepage?.blocks || []);
	
	// Debug logs for browser console
	console.log('🏠 Homepage object:', homepage);
	console.log('🧱 Blocks array:', blocks);
	console.log('📦 Total blocks:', blocks.length);
	
	// Debug każdego bloku
	blocks.forEach((block: any, index: number) => {
		console.log(`📋 Block ${index}:`, block.blockType, block);
		if (block.blockType === 'cards') {
			console.log(`  └─ Cards w bloku:`, block.cards);
		}
	});

	let hoveredColumn = $state<number | null>(null);
	let openCardId = $state<number | null>(null);
	let columnRefs: HTMLDivElement[] = [];

	// Helper functions for buttonLink validation
	function isExternalLink(linkType: string, linkValue: string): boolean {
		return linkType === 'external' && Boolean(linkValue && linkValue.trim() !== '');
	}

	function getValidLink(linkType: string, linkValue: string): string {
		if (linkType === 'none' || !linkValue || !linkValue.trim()) return '#';
		
		const trimmedValue = linkValue.trim();
		
		if (linkType === 'external') {
			return trimmedValue;
		} else if (linkType === 'internal') {
			return trimmedValue;
		}
		
		return '#';
	}

	// Group cards by columns from blocks
	function getCardsFromBlocks() {
		const allCards: Card[] = [];
		blocks.forEach((block: any) => {
			console.log('🔍 Checking block:', block.blockType, 'has cards?', !!block.cards);
			if (block.blockType === 'cards' && block.cards) {
				console.log('  ✅ Found cards block with', block.cards.length, 'cards');
				// Convert Payload format to frontend format
				const convertedCards = block.cards.map((card: any) => ({
					...card,
					type: card.Enumeration?.replace('Block_', '') || card.type,
					imageSrc: getMediaUrl(card.imageSrc),
					videoWebm: getMediaUrl(card.videoWebm),
					videoMp4: getMediaUrl(card.videoMp4),
				}));
				console.log('  📤 Converted cards:', convertedCards);
				allCards.push(...convertedCards);
			}
		});
		console.log('🎯 Total cards from all blocks:', allCards.length, allCards);
		return allCards;
	}

	const displayCards = $derived(getCardsFromBlocks());

	// Grupowanie projektów według kolumn
	const columns = $derived([
		displayCards.filter(p => p.column === 'left').sort((a, b) => a.order - b.order),
		displayCards.filter(p => p.column === 'middle').sort((a, b) => a.order - b.order),
		displayCards.filter(p => p.column === 'right').sort((a, b) => a.order - b.order)
	]);

	onMount(() => {
		// Initialize Lenis for each column
		const lenisInstances = columnRefs.map(columnEl => {
			return new Lenis({
				wrapper: columnEl,
				content: columnEl.firstElementChild as HTMLElement,
				duration: 0.8,
				easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
				orientation: 'vertical',
				smoothWheel: true,
				wheelMultiplier: 1.5,
				touchMultiplier: 2
			});
		});

		function raf(time: number) {
			lenisInstances.forEach(lenis => lenis.raf(time));
			requestAnimationFrame(raf);
		}

		requestAnimationFrame(raf);

		return () => {
			lenisInstances.forEach(lenis => lenis.destroy());
		};
	});

	const getColumnFlex = (colIndex: number) => {
		if (hoveredColumn === null) return 1;
		if (hoveredColumn === colIndex) return 1.08;
		return 0.97;
	};

	const toggleCard = (id: number) => {
		if (openCardId === id) {
			openCardId = null;
		} else {
			openCardId = id;
		}
	};

	const getColor = (color: string | undefined) => {
		const colorMap: Record<string, string> = {
			red: 'var(--color-red)',
			blue: 'var(--color-blue)',
			green: 'var(--color-green)'
		};
		return colorMap[color || 'red'] || 'var(--color-red)';
	};
</script>

<div class="projects-page">	<div class="grid">
		{#each columns as column, colIndex}
			<div 
				class="column"
				style="flex-grow: {getColumnFlex(colIndex)};"
				onmouseenter={() => hoveredColumn = colIndex}
				onmouseleave={() => hoveredColumn = null}
				role="group"
				bind:this={columnRefs[colIndex]}
			>
				<div class="column-content">
				{#each column as project}
				<div class="card-wrapper">
					{#if project.type === 'Video' || project.type === 'Image'}
					<div 
						class="project-card" 
						class:open={openCardId === project.id}
						class:size-small={project.size === 'small'}
						class:size-medium={project.size === 'medium'}
						class:size-large={project.size === 'large'}
						onclick={() => toggleCard(project.id)}
						onkeydown={(e) => e.key === 'Enter' && toggleCard(project.id)}
						onmouseleave={() => openCardId = null}
						role="button"
						tabindex="0"
					>
							<div class="card-slider" class:open={openCardId === project.id}>
								{#if project.type === 'Video'}
									<VideoCard 
											videoWebm={project.videoWebm}
											videoMp4={project.videoMp4}
											category={project.category}
											title={project.title}
											description={project.description}
											isOpen={openCardId === project.id}
										/>
									{:else}
										<ImageCard 
											imageSrc={project.imageSrc}
											imageAlt={project.imageAlt}
											category={project.category}
											title={project.title}
											description={project.description}
											isOpen={openCardId === project.id}
									/>
								{/if}
							</div>
						</div>
					{:else}
						<div 
							class="project-card" 
							class:size-small={project.size === 'small'}
							class:size-medium={project.size === 'medium'}
							class:size-large={project.size === 'large'}
						>
							<div class="card-content no-slider">
								{#if project.type === 'BigText'}
									<BigTextCard 
										titleLine1={project.titleLine1}
										titleLine2={project.titleLine2}
										titleColor={project.titleColor}
									/>
								{:else}
									<DescTextCard 
										title={project.title}
										description={project.description}
									/>
								{/if}
							</div>
						</div>
					{/if}
					<div class="card-footer">
							<div class="footer-header">
								<div class="footer-title-wrapper">
									<img src="/dot.svg" alt="" class="footer-dot" />
									<span class="footer-title">{project.footerTitle}</span>
								</div>
								{#if project.buttonText && project.buttonText.trim()}
									<a 
										href={getValidLink(project.buttonLinkType, project.buttonLinkValue)} 
										class="footer-button" 
										class:button-red={project.buttonColor === 'red'}
										class:button-blue={project.buttonColor === 'blue'}
										class:button-green={project.buttonColor === 'green'}
										target={isExternalLink(project.buttonLinkType, project.buttonLinkValue) ? '_blank' : '_self'}
										rel={isExternalLink(project.buttonLinkType, project.buttonLinkValue) ? 'noopener noreferrer' : ''}
									>
										{project.buttonText}
									</a>
								{/if}
							</div>
							<h4 class="footer-description">{project.footerDescription}</h4>
						</div>
					</div>
				{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	:root {
		--color-red: #ff0000;
		--color-blue: #1e33fe;
		--color-green: #24bc12;
	}

	.projects-page {
		min-height: 100vh;
		padding: 0;
		font-family: 'Inter Tight', sans-serif;
	}

	/* Grid 3-kolumnowy */
	.grid {
		display: flex;
		gap: 0.5rem;
		width: 100%;
		height: 100vh; /* Pełna wysokość viewport */
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

	/* Card Wrapper */
	.card-wrapper {
		flex-shrink: 0;
	}

	/* Projekt Card */
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

	/* Różne rozmiary kart */
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

	/* Card Slider Container */
	.card-slider {
		width: 100%;
		height: 100%;
		display: flex;
		position: relative;
		container-type: inline-size;
		margin-left: -1px;
		backface-visibility: hidden;
	}

	/* Card Content bez slidera */
	.card-content.no-slider {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8px;
	}

	/* Card Footer */
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

	/* Responsive */
	@media (max-width: 1024px) {

		.grid {
			flex-direction: column;
		}

		.column {
			width: 100%;
		}
	}

	@media (max-width: 640px) {
		.grid {
			gap: 1rem;
		}
	}
</style>

