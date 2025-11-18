<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutData } from './$types';
	import type { Snippet } from 'svelte';

	interface Props {
		data: LayoutData;
		children: Snippet;
	}

	let { children, data }: Props = $props();
	const footer = $derived(data.footer);
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Navbar />

<main>
	{@render children()}
</main>

<footer>
	{#if footer}
		<div class="footer-content">
			{#if footer.logo?.url}
				<img src={footer.logo.url} alt={footer.companyName} class="footer-logo" />
			{/if}
			
			<div class="footer-main">
				<div class="footer-section">
					<h3>{footer.companyName}</h3>
					{#if footer.description}
						<p class="footer-description">{footer.description}</p>
					{/if}
				</div>

				{#if footer.address?.street || footer.address?.city}
					<div class="footer-section">
						<h4>Adres</h4>
						<p>
							{#if footer.address.street}{footer.address.street}<br />{/if}
							{#if footer.address.postalCode}{footer.address.postalCode} {/if}
							{#if footer.address.city}{footer.address.city}{/if}
							{#if footer.address.country}<br />{footer.address.country}{/if}
						</p>
					</div>
				{/if}

				{#if footer.contact?.email || footer.contact?.phone}
					<div class="footer-section">
						<h4>Kontakt</h4>
						{#if footer.contact.email}
							<p><a href="mailto:{footer.contact.email}">{footer.contact.email}</a></p>
						{/if}
						{#if footer.contact.phone}
							<p><a href="tel:{footer.contact.phone}">{footer.contact.phone}</a></p>
						{/if}
					</div>
				{/if}

				{#if footer.links && footer.links.length > 0}
					<div class="footer-section">
						<h4>Linki</h4>
						<nav class="footer-links">
							{#each footer.links as link}
								<a href={link.url}>{link.label}</a>
							{/each}
						</nav>
					</div>
				{/if}

				{#if footer.socialMedia && footer.socialMedia.length > 0}
					<div class="footer-section">
						<h4>Social Media</h4>
						<div class="social-links">
							{#each footer.socialMedia as social}
								<a href={social.url} target="_blank" rel="noopener noreferrer" class="social-link">
									{social.platform}
								</a>
							{/each}
						</div>
					</div>
				{/if}
			</div>

			{#if footer.copyrightText}
				<div class="footer-bottom">
					<p>{footer.copyrightText}</p>
				</div>
			{/if}
		</div>
	{:else}
		<p>&copy; 2025 INSIGNIA - Agencja Marketingowa</p>
	{/if}
</footer>

<style>
	:global(body) {
		margin: 0;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
		overflow-x: hidden;
	}

	main {
		min-height: 100vh;
	}

	footer {
		padding: 2rem;
		background: #f5f5f5;
		color: #333;
	}

	.footer-content {
		max-width: 1200px;
		margin: 0 auto;
	}

	.footer-logo {
		max-width: 80px;
		margin-bottom: 1rem;
	}

	.footer-main {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 1rem;
		margin-bottom: 1rem;
	}

	.footer-section h3 {
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
		color: #000;
	}

	.footer-section h4 {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		margin-bottom: 0.5rem;
		color: #666;
		font-weight: 600;
	}

	.footer-description {
		color: #666;
		line-height: 1.4;
		font-size: 0.85rem;
	}

	.footer-section p {
		margin: 0.15rem 0;
		line-height: 1.4;
		font-size: 0.8rem;
	}

	.footer-section a {
		color: #333;
		text-decoration: none;
		transition: color 0.2s;
	}

	.footer-section a:hover {
		color: #3873A6;
	}

	.footer-links {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.social-links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.social-link {
		padding: 0.25rem 0.5rem;
		background: #fff;
		border-radius: 4px;
		text-transform: capitalize;
		font-size: 0.75rem;
		transition: background 0.2s;
	}

	.social-link:hover {
		background: #e0e0e0;
	}

	.footer-bottom {
		margin-top: 1rem;
		padding-top: 1rem;
		border-top: 1px solid #ddd;
		text-align: center;
		color: #666;
		font-size: 0.75rem;
	}

	@media (max-width: 768px) {
		.footer-main {
			grid-template-columns: 1fr;
		}
	}
</style>
