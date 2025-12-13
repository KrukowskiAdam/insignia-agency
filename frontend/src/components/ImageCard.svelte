<script lang="ts">
	interface Props {
		imageSrc: string;
		imageAlt: string;
		category: string;
		title: string;
		description: string;
		isOpen: boolean;
	}

	let { imageSrc, imageAlt, category, title, description, isOpen }: Props =
		$props();
</script>

<div class="image-card-container">
	<div class="slider-image" class:slide-out={isOpen}>
		<img src={imageSrc} alt={imageAlt} class="card-image" />
	</div>
	<div class="slider-content">
		<span class="category">{category}</span>
		<h3>{title}</h3>
		<p>{description}</p>
	</div>
</div>

<style>
	.image-card-container {
		width: 100%;
		height: 100%;
		position: relative;
		display: flex;
	}

	.slider-image {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		z-index: 2;
		overflow: hidden;
		border-radius: 8px;
		transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
		will-change: transform;
	}

	.slider-image.slide-out {
		transform: translateX(-100%);
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
	}

	.slider-content {
		width: 100%;
		height: 100%;
		background: white;
		padding: 2rem;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: 1rem;
		position: relative;
		z-index: 1;
		overflow-y: auto;
		border-radius: 8px;
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
