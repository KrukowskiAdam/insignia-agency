<script lang="ts">
	import BigTextCard from "../components/BigTextCard.svelte";
	import DescTextCard from "../components/DescTextCard.svelte";
	import VideoCard from "../components/VideoCard.svelte";
	import ImageCard from "../components/ImageCard.svelte";
	import type { Card } from "./+page";

	interface Props {
		data: {
			cards: Card[];
			homepage: any;
		};
	}

	let { data }: Props = $props();

	console.log("🚀 DATA RECEIVED:", data);
	console.log("🏠 HOMEPAGE:", data.homepage);

	const API_URL = "https://backend-isnisgnias-projects.vercel.app";

	// Helper to get full media URL
	function getMediaUrl(media: any): string {
		if (!media) return "";
		if (typeof media === "string")
			return media.startsWith("http") ? media : `${API_URL}${media}`;
		if (media.url)
			return media.url.startsWith("http")
				? media.url
				: `${API_URL}${media.url}`;
		return "";
	}

	// Use blocks from homepage ONLY
	const homepage = $derived(data.homepage);
	const blocks = $derived(homepage?.blocks || []);
	const homepageColumns = $derived(homepage?.homepageColumns || null);

	// Debug logs for browser console - inside $effect to work with reactive values
	$effect(() => {
		console.log("🏠 Homepage object:", homepage);
		console.log("🧱 Blocks array:", blocks);
		console.log("📦 Total blocks:", blocks.length);
		console.log("🧊 Homepage columns group:", homepageColumns);

		// Debug każdego bloku
		blocks.forEach((block: any, index: number) => {
			console.log(`📋 Block ${index}:`, block.blockType, block);
			if (block.blockType === "cards") {
				console.log(`  └─ Cards w bloku:`, block.cards);
			}
		});
	});

	let openCardId = $state<number | null>(null);

	// Helper functions for buttonLink validation
	function isExternalLink(linkType: string, linkValue: string): boolean {
		return (
			linkType === "external" &&
			Boolean(linkValue && linkValue.trim() !== "")
		);
	}

	function getValidLink(linkType: string, linkValue: string): string {
		if (linkType === "none" || !linkValue || !linkValue.trim()) return "#";

		const trimmedValue = linkValue.trim();

		if (linkType === "external") {
			return trimmedValue;
		} else if (linkType === "internal") {
			return trimmedValue;
		}

		return "#";
	}

	function mapCards(cards: any[] = []): Card[] {
		return cards.map((card: any, index: number) => ({
			...card,
			type: card.Enumeration?.replace("Block_", "") || card.type,
			imageSrc: getMediaUrl(card.imageSrc),
			videoWebm: getMediaUrl(card.videoWebm),
			videoMp4: getMediaUrl(card.videoMp4),
			column: ["left", "right"][index % 2],
			order: Math.floor(index / 2),
		}));
	}

	function getHomepageCards(): Card[] {
		const groupCards = homepageColumns?.cards;
		if (Array.isArray(groupCards) && groupCards.length > 0) {
			console.log(
				"🆕 Using cards from homepageColumns group:",
				groupCards.length,
			);
			return mapCards(groupCards);
		}

		const legacyCards: any[] = [];
		blocks.forEach((block: any) => {
			if (block.blockType === "cards" && Array.isArray(block.cards)) {
				legacyCards.push(...block.cards);
			}
		});
		console.log("♻️ Fallback to legacy blocks cards:", legacyCards.length);
		return mapCards(legacyCards);
	}

	const displayCards = $derived(getHomepageCards());

	// Grupowanie projektów według kolumn
	const columns = $derived([
		displayCards
			.filter((p) => p.column === "left")
			.sort((a, b) => a.order - b.order),
		displayCards
			.filter((p) => p.column === "right")
			.sort((a, b) => a.order - b.order),
	]);

	const toggleCard = (id: number) => {
		if (openCardId === id) {
			openCardId = null;
		} else {
			openCardId = id;
		}
	};

	let hoveredColumn = $state<number | null>(null);

	const handleCardClick = (event: MouseEvent, id: number) => {
		const target = event.target as HTMLElement | null;
		if (target?.closest(".card-footer")) {
			return;
		}
		toggleCard(id);
	};

	const getColor = (color: string | undefined) => {
		const colorMap: Record<string, string> = {
			red: "var(--color-red)",
			blue: "var(--color-blue)",
			green: "var(--color-green)",
		};
		return colorMap[color || "red"] || "var(--color-red)";
	};
</script>

<div class="projects-page">
	<div class="grid">
		{#each columns as column, columnIndex}
			<div
				class="column"
				class:expanded={hoveredColumn === columnIndex}
				class:collapsed={hoveredColumn !== null &&
					hoveredColumn !== columnIndex}
				onmouseenter={() => (hoveredColumn = columnIndex)}
				onmouseleave={() => (hoveredColumn = null)}
				role="group"
			>
				<div class="column-content">
					{#each column as project}
						<div class="card-wrapper">
							{#if project.type === "Video" || project.type === "Image"}
								<div
									class="project-card interactive"
									class:open={openCardId === project.id}
									class:size-small={project.size === "small"}
									class:size-medium={project.size ===
										"medium"}
									class:size-large={project.size === "large"}
									onclick={(event) =>
										handleCardClick(event, project.id)}
									onkeydown={(e) =>
										e.key === "Enter" &&
										toggleCard(project.id)}
									onmouseleave={() => (openCardId = null)}
									role="button"
									tabindex="0"
								>
									<div
										class="card-slider"
										class:open={openCardId === project.id}
									>
										{#if project.type === "Video"}
											<VideoCard
												videoWebm={project.videoWebm}
												videoMp4={project.videoMp4}
												category={project.category}
												title={project.title}
												description={project.description}
												isOpen={openCardId ===
													project.id}
											/>
										{:else}
											<ImageCard
												imageSrc={project.imageSrc}
												imageAlt={project.imageAlt}
												category={project.category}
												title={project.title}
												description={project.description}
												isOpen={openCardId ===
													project.id}
											/>
										{/if}
									</div>
									<div class="card-footer">
										<div class="footer-header">
											<div class="footer-title-wrapper">
												<img
													src="/dot.svg"
													alt=""
													class="footer-dot"
												/>
												<span class="footer-title">
													{project.footerTitle || ""}
												</span>
											</div>
											{#if project.buttonText && project.buttonText.trim()}
												<a
													href={getValidLink(
														project.buttonLinkType,
														project.buttonLinkValue,
													)}
													class="footer-button"
													class:button-red={project.buttonColor ===
														"red"}
													class:button-blue={project.buttonColor ===
														"blue"}
													class:button-green={project.buttonColor ===
														"green"}
													target={isExternalLink(
														project.buttonLinkType,
														project.buttonLinkValue,
													)
														? "_blank"
														: "_self"}
													rel={isExternalLink(
														project.buttonLinkType,
														project.buttonLinkValue,
													)
														? "noopener noreferrer"
														: ""}
												>
													{project.buttonText}
												</a>
											{/if}
										</div>
										<h4 class="footer-description">
											{project.footerDescription || ""}
										</h4>
									</div>
								</div>
							{:else}
								<div
									class="project-card"
									class:size-small={project.size === "small"}
									class:size-medium={project.size ===
										"medium"}
									class:size-large={project.size === "large"}
								>
									<div class="card-content no-slider">
										{#if project.type === "BigText"}
											<BigTextCard
												titleLine1={project.titleLine1}
												titleLine2={project.titleLine2}
												titleColor={project.titleColor}
												subtitle={project.subtitle}
												subtitleColor={project.subtitleColor ||
													project.titleColor}
											/>
										{:else}
											<DescTextCard
												title={project.title}
												description={project.description}
											/>
										{/if}
									</div>
									<div class="card-footer">
										<div class="footer-header">
											<div class="footer-title-wrapper">
												<img
													src="/dot.svg"
													alt=""
													class="footer-dot"
												/>
												<span class="footer-title">
													{project.footerTitle || ""}
												</span>
											</div>
											{#if project.buttonText && project.buttonText.trim()}
												<a
													href={getValidLink(
														project.buttonLinkType,
														project.buttonLinkValue,
													)}
													class="footer-button"
													class:button-red={project.buttonColor ===
														"red"}
													class:button-blue={project.buttonColor ===
														"blue"}
													class:button-green={project.buttonColor ===
														"green"}
													target={isExternalLink(
														project.buttonLinkType,
														project.buttonLinkValue,
													)
														? "_blank"
														: "_self"}
													rel={isExternalLink(
														project.buttonLinkType,
														project.buttonLinkValue,
													)
														? "noopener noreferrer"
														: ""}
												>
													{project.buttonText}
												</a>
											{/if}
										</div>
										<h4 class="footer-description">
											{project.footerDescription || ""}
										</h4>
									</div>
								</div>
							{/if}
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
		padding: 0;
		font-family: "Inter Tight", sans-serif;
		background: white;
	}

	/* Grid 3-kolumnowy */
	.grid {
		display: flex;
		gap: 1rem;
		width: 100%;
		height: 100vh; /* pełna wysokość viewportu */
		padding: 0 1rem;
		overflow: hidden;
		box-sizing: border-box;
		background: white;
	}

	.column {
		display: flex;
		flex-direction: column;
		flex: 1 1 0;
		height: 100%;
		overflow-y: auto;
		scroll-behavior: smooth;
		scrollbar-width: none;
		-ms-overflow-style: none;
		position: relative;
		transition:
			flex 0.35s ease,
			transform 0.35s ease,
			opacity 0.3s ease;
	}

	.column::-webkit-scrollbar {
		display: none;
	}

	.column.expanded {
		flex: 1.05 1 0;
		transform: scale(1.005);
	}

	.column.collapsed {
		flex: 0.95 1 0;
		opacity: 0.95;
	}

	.column-content {
		display: flex;
		flex-direction: column;
		gap: 5rem;
		padding: 0.5rem 0;
	}

	/* Card Wrapper */
	.card-wrapper {
		flex-shrink: 0;
	}

	/* Projekt Card */
	.project-card {
		width: 100%;
		margin: 0 auto;
		flex-shrink: 0;
		background: #fff;
		position: relative;
		transition: all 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		border-radius: 8px;
		display: flex;
		flex-direction: column;
	}

	.project-card.interactive {
		cursor: pointer;
		position: relative;
	}

	.project-card.interactive::after {
		content: "👆";
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		font-size: 1.5rem;
		opacity: 0;
		transform: translateY(-4px);
		transition:
			opacity 0.2s ease,
			transform 0.2s ease;
		pointer-events: none;
	}

	.project-card.interactive:hover::after,
	.project-card.interactive:focus-visible::after {
		opacity: 0.85;
		transform: translateY(0);
	}

	/* Różne rozmiary kart */
	.project-card.size-small {
		aspect-ratio: 16 / 9;
		min-height: 256px;
	}

	.project-card.size-medium {
		aspect-ratio: 4 / 3;
		min-height: 256px;
	}

	.project-card.size-large {
		aspect-ratio: 1;
		min-height: 384px;
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
		flex: 1 1 auto;
		overflow: hidden;
		border-radius: 8px 8px 0 0;
	}

	/* Card Content bez slidera */
	.card-content.no-slider {
		width: 100%;
		height: 100%;
		position: relative;
		overflow: hidden;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1 1 auto;
	}

	.card-footer {
		padding: 0.75rem 0 1.5rem 0;
		background: #fff;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		border-radius: 0 0 8px 8px;
		position: relative;
	}

	.card-footer::before {
		content: "";
		position: absolute;
		top: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 97%;
		height: 1px;
		background: #f0f0f0;
	}

	.footer-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.footer-title-wrapper {
		display: flex;
		align-items: flex-start;
		gap: 0.4rem;
		flex: 0 0 70%;
		max-width: 70%;
	}

	.footer-dot {
		width: 0.5rem;
		height: 0.5rem;
		flex-shrink: 0;
		margin-top: 0.1rem;
	}

	.footer-title {
		font-size: 0.7rem;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 1.2px;
		font-weight: 500;
		flex: 1;
	}

	.footer-button {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 1.2px;
		font-weight: 700;
		text-decoration: none;
		transition: color 0.2s ease;
		line-height: 1;
		padding-top: 0.1rem;
	}

	.footer-button:hover {
		color: color-mix(in srgb, currentColor 80%, white 20%);
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
		font-weight: 200;
		line-height: 1.3;
		padding-left: 0.9rem;
		width: 80%;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.grid {
			flex-direction: column;
		}

		.column {
			width: 100%;
			flex: 1 1 auto;
			transform: none;
			opacity: 1;
		}

		.column.expanded,
		.column.collapsed {
			flex: 1 1 auto;
			opacity: 1;
		}
	}

	@media (max-width: 640px) {
		.grid {
			gap: 1rem;
		}
	}
</style>
