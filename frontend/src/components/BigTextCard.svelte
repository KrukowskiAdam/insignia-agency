<script lang="ts">
	interface Props {
		titleLine1: string;
		titleLine2?: string;
		titleColor: 'red' | 'blue' | 'green';
	}

	let { titleLine1, titleLine2, titleColor }: Props = $props();

	const getColor = (color: string) => {
		const colorMap: Record<string, string> = {
			red: 'var(--color-red)',
			blue: 'var(--color-blue)',
			green: 'var(--color-green)'
		};
		return colorMap[color] || 'var(--color-red)';
	};
</script>

<div class="big-text-card">
	<h3 class="preview-title" style="color: {getColor(titleColor)};">
		<span class="title-line">{titleLine1}</span>
		{#if titleLine2}
			<span class="title-line">{titleLine2}</span>
		{/if}
	</h3>
</div>

<style>
	.big-text-card {
		width: 100%;
		height: 100%;
		background: white;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		box-sizing: border-box;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.preview-title {
		font-size: clamp(2rem, 12vw, 5rem);
		font-weight: 700;
		margin: 0;
		line-height: 0.95;
		display: flex;
		flex-direction: column;
		gap: 0;
		text-align: center;
		width: 100%;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.title-line {
		display: block;
	}
</style>
