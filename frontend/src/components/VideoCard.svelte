<script lang="ts">
	interface Props {
		videoWebm: string;
		videoMp4: string;
		category: string;
		title: string;
		description: string;
		isOpen: boolean;
	}

	let { videoWebm, videoMp4, category, title, description, isOpen }: Props = $props();
</script>

<div class="video-card-container">
	<div class="slider-video">
		<video 
			class="card-video"
			autoplay
			loop
			muted
			playsinline
			preload="auto"
		>
			<source src={videoWebm} type="video/webm" />
			<source src={videoMp4} type="video/mp4" />
		</video>
	</div>
	<div class="slider-content">
		<span class="category">{category}</span>
		<h3>{title}</h3>
		<p>{description}</p>
	</div>
</div>

<style>
	.video-card-container {
		width: 200%;
		height: 100%;
		display: flex;
	}

	.slider-video {
		width: 50%;
		height: 100%;
		position: relative;
		flex-shrink: 0;
		overflow: hidden;
		border-radius: 8px;
	}

	.card-video {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		object-fit: cover;
		z-index: 0;
		filter: grayscale(100%);
		transition: filter 0.6s ease;
	}

	.video-card-container:hover .card-video {
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
