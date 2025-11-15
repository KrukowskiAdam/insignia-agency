<script lang="ts">
	interface Props {
		imageSrc: string;
		imageAlt: string;
		category: string;
		title: string;
		description: string;
		isOpen: boolean;
	}

	let { imageSrc, imageAlt, category, title, description, isOpen }: Props = $props();
</script>

<div class="image-card-container">
	<div class="slider-image">
		<img 
			src={imageSrc} 
			alt={imageAlt}
			class="card-image"
		/>
	</div>
	<div class="slider-content">
		<span class="category">{category}</span>
		<h3>{title}</h3>
		<p>{description}</p>
	</div>
</div>

<style>
	.image-card-container {
		width: 200%;
		height: 100%;
		display: flex;
	}

	.slider-image {
		width: 50%;
		height: 100%;
		position: relative;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 8px;
	}

	.card-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
		border-radius: 8px;
		filter: grayscale(100%);
		transition: filter 0.6s ease;
	}

	.image-card-container:hover .card-image {
		filter: grayscale(0%);
	}

	.slider-content {
		width: 50%;
		height: 100%;
		background: white;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		flex-shrink: 0;
		overflow-y: auto;
	}

	.category {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 1.5px;
		color: #666;
		font-weight: 600;
	}

	h3 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
		line-height: 1.2;
	}

	p {
		font-size: 1rem;
		line-height: 1.6;
		margin: 0;
		color: #333;
	}
</style>
