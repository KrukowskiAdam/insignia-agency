<script lang="ts">
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let selectedProject = $state<number | null>(null);

	const projects = [
		{ id: 1, title: 'Projekt 1', category: 'Branding' },
		{ id: 2, title: 'Projekt 2', category: 'Web Design' },
		{ id: 3, title: 'Projekt 3', category: 'Marketing' },
		{ id: 4, title: 'Projekt 4', category: 'Social Media' },
		{ id: 5, title: 'Projekt 5', category: 'Video' },
		{ id: 6, title: 'Projekt 6', category: 'Branding' },
		{ id: 7, title: 'Projekt 7', category: 'Web Design' },
		{ id: 8, title: 'Projekt 8', category: 'Marketing' },
		{ id: 9, title: 'Projekt 9', category: 'Social Media' }
	];

	const openProject = (id: number) => {
		selectedProject = id;
	};

	const closeProject = () => {
		selectedProject = null;
	};
</script>

<div class="projects-page">
	<div class="hero">
		<h1>Nasze Projekty</h1>
		<p>Portfolio realizacji</p>
	</div>

	{#if selectedProject === null}
		<div class="grid" transition:fade={{ duration: 300 }}>
			{#each projects as project, i}
				<button 
					class="project-card" 
					class:offset={i % 3 === 1}
					onclick={() => openProject(project.id)}
				>
					<div class="card-content">
						<span class="category">{project.category}</span>
						<h3>{project.title}</h3>
					</div>
				</button>
			{/each}
		</div>
	{:else}
		<div class="fullscreen" transition:scale={{ duration: 400, easing: cubicOut }}>
			<button class="close-btn" onclick={closeProject}>✕</button>
			<div class="fullscreen-content">
				<h2>Projekt {selectedProject}</h2>
				<p>Tutaj będzie film/content...</p>
			</div>
		</div>
	{/if}
</div>

<style>
	.projects-page {
		min-height: 100vh;
		padding: 2rem;
	}

	.hero {
		text-align: center;
		padding: 4rem 2rem;
	}

	.hero h1 {
		font-size: 3rem;
		margin: 0;
		font-weight: 700;
	}

	.hero p {
		font-size: 1.2rem;
		color: #666;
		margin-top: 1rem;
	}

	/* Grid 3-kolumnowy */
	.grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2rem;
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	/* Projekt Card */
	.project-card {
		aspect-ratio: 1;
		background: #f5f5f5;
		border: none;
		border-radius: 12px;
		cursor: pointer;
		transition: transform 0.3s ease, box-shadow 0.3s ease;
		padding: 2rem;
		display: flex;
		align-items: flex-end;
	}

	/* Offset dla middle column - parallax effect */
	.project-card.offset {
		margin-top: 3rem;
	}

	.project-card:hover {
		transform: translateY(-8px);
		box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
	}

	.card-content {
		text-align: left;
		width: 100%;
	}

	.category {
		font-size: 0.85rem;
		color: #999;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.card-content h3 {
		margin: 0.5rem 0 0;
		font-size: 1.5rem;
		font-weight: 600;
	}

	/* Fullscreen View */
	.fullscreen {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: white;
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.close-btn {
		position: absolute;
		top: 2rem;
		right: 2rem;
		width: 50px;
		height: 50px;
		border: none;
		background: #f5f5f5;
		border-radius: 50%;
		font-size: 1.5rem;
		cursor: pointer;
		transition: transform 0.2s;
	}

	.close-btn:hover {
		transform: rotate(90deg);
	}

	.fullscreen-content {
		text-align: center;
	}

	.fullscreen-content h2 {
		font-size: 3rem;
		margin-bottom: 1rem;
	}

	/* Responsive */
	@media (max-width: 1024px) {
		.grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 640px) {
		.grid {
			grid-template-columns: 1fr;
		}

		.project-card.offset {
			margin-top: 0;
		}
	}
</style>

