<script lang="ts">
	interface Props {
		title?: string;
		description?: string;
	}

	let { title, description }: Props = $props();
	
	// Parse description to check if it's a list (awards)
	const awards = description?.split('\n').filter(line => line.trim()) || [];
	const isAwardsList = awards.length > 1 && awards.every(a => a.match(/^\d+x\s|^-\s|^•\s/));
</script>

<div class="desc-text-card">
	{#if title}
		<h3 class="desc-title">{title}</h3>
	{/if}
	{#if isAwardsList}
		<ul class="awards-list">
			{#each awards as award}
				<li>{award.replace(/^-\s|^•\s/, '')}</li>
			{/each}
		</ul>
	{:else if description}
		<p class="desc-paragraph">{description}</p>
	{/if}
</div>

<style>
	.desc-text-card {
		width: 100%;
		height: 100%;
		background: white;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem;
	}

	.desc-title {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0 0 1rem 0;
		line-height: 1.2;
	}

	.desc-paragraph {
		font-size: 1rem;
		line-height: 1.6;
		margin: 0;
		white-space: pre-line;
	}

	.awards-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.awards-list li {
		font-size: 1.1rem;
		font-weight: 500;
		padding-left: 1.5rem;
		position: relative;
	}

	.awards-list li::before {
		content: '•';
		position: absolute;
		left: 0;
		color: #000;
	}
</style>
