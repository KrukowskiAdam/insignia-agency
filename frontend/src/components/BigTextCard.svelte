<script lang="ts">
	interface Props {
		titleLine1: string;
		titleLine2?: string;
		titleColor: "red" | "blue" | "green";
		subtitle?: string;
		subtitleColor?: "red" | "blue" | "green";
	}

	let { titleLine1, titleLine2, titleColor, subtitle, subtitleColor }: Props =
		$props();

	const getColor = (color?: string) => {
		const colorMap: Record<string, string> = {
			red: "var(--color-red)",
			blue: "var(--color-blue)",
			green: "var(--color-green)",
		};

		return color ? colorMap[color] || colorMap.red : colorMap.red;
	};
</script>

<div class="big-text-card">
	<h3 class="preview-title" style="color: {getColor(titleColor)};">
		<span class="title-line">{titleLine1}</span>
		{#if titleLine2}
			<span class="title-line">{titleLine2}</span>
		{/if}
	</h3>
	{#if subtitle}
		<p
			class="preview-subtitle"
			style="color: {getColor(subtitleColor ?? titleColor)};"
		>
			{subtitle}
		</p>
	{/if}
</div>

<style>
	.big-text-card {
		width: 100%;
		height: 100%;
		background: white;
		display: flex;
		flex-direction: column;
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
		gap: 0.75rem;
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

	.preview-subtitle {
		font-size: 0.5em;
		font-weight: 500;
		margin: 0;
		text-align: center;
		line-height: 1.2;
	}
</style>
