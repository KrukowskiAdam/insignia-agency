<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { page } from '$app/stores';
	
	let isOpen = $state(false);

	const toggleMenu = () => {
		isOpen = !isOpen;
	};

	const closeMenu = () => {
		isOpen = false;
	};

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/o-nas', label: 'O nas' },
		{ href: '/projekty', label: 'Projekty' },
		{ href: '/klienci', label: 'Klienci' },
		{ href: '/zespol', label: 'Zespół' },
		{ href: '/news', label: 'News' },
		{ href: '/kontakt', label: 'Kontakt' }
	];
</script>

<nav class="navbar">
	<div class="logo">
		<a href="/">
			<img src="/logo-insignia.svg" alt="Insignia" />
		</a>
	</div>

	<!-- Desktop Menu -->
	<div class="desktop-menu">
		{#each links as link}
			<a href={link.href} class:active={$page.url.pathname === link.href}>
				{link.label}
			</a>
		{/each}
	</div>

	<!-- Hamburger Button -->
	<button class="hamburger" class:open={isOpen} onclick={toggleMenu} aria-label="Toggle menu">
		<span></span>
		<span></span>
		<span></span>
	</button>
</nav>

<!-- Mobile Menu Overlay -->
{#if isOpen}
	<button 
		class="overlay" 
		transition:fade={{ duration: 400 }} 
		onclick={closeMenu}
		onkeydown={(e) => e.key === 'Escape' && closeMenu()}
		aria-label="Close menu"
	></button>
	
	<div class="mobile-menu" in:fly={{ x: 400, duration: 500, easing: cubicOut, opacity: 1 }} out:fly={{ x: 400, duration: 500, easing: cubicOut, opacity: 1 }}>
		<div class="menu-content">
			{#each links as link}
				<a 
					href={link.href} 
					class:active={$page.url.pathname === link.href}
					onclick={closeMenu}
				>
					{link.label}
				</a>
			{/each}
		</div>
	</div>
{/if}

<style>
	.navbar {
		position: sticky;
		top: 0;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem 2rem;
		background: white;
		box-shadow: none;
	}

	.logo a {
		display: block;
		line-height: 0;
	}

	.logo img {
		height: 40px;
		width: auto;
	}

	/* Desktop Menu - ukryte, tylko hamburger */
	.desktop-menu {
		display: none;
	}

	/* Hamburger Button - ZAWSZE widoczny */
	.hamburger {
		display: flex;
		flex-direction: column;
		gap: 6px;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0.5rem;
		z-index: 101;
	}

	.hamburger span {
		width: 28px;
		height: 3px;
		background: #000;
		border-radius: 3px;
		transition: all 0.3s ease;
	}

	/* Hamburger Animation to X */
	.hamburger.open span:nth-child(1) {
		transform: rotate(45deg) translate(8px, 8px);
	}

	.hamburger.open span:nth-child(2) {
		opacity: 0;
	}

	.hamburger.open span:nth-child(3) {
		transform: rotate(-45deg) translate(8px, -8px);
	}

	/* Overlay */
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
		background: rgba(0, 0, 0, 0.5);
		z-index: 98;
		border: none;
		padding: 0;
		cursor: pointer;
	}

	/* Mobile Menu */
	.mobile-menu {
		position: fixed;
		top: 0;
		right: 0;
		width: 400px;
		max-width: 85vw;
		height: 100vh;
		background: white;
		box-shadow: -5px 0 20px rgba(0, 0, 0, 0.1);
		z-index: 99;
		overflow-y: auto;
	}

	.menu-content {
		display: flex;
		flex-direction: column;
		padding: 6rem 2rem 2rem;
		gap: 1rem;
	}

	.menu-content a {
		text-decoration: none;
		color: #333;
		font-size: 1.25rem;
		font-weight: 500;
		padding: 1rem;
		border-radius: 8px;
		transition: all 0.3s;
	}

	.menu-content a:hover,
	.menu-content a.active {
		background: #f5f5f5;
		color: #000;
	}
</style>
