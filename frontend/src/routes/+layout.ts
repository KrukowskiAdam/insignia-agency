import 'lenis/dist/lenis.css';
import type { LayoutLoad } from './$types';
import { PUBLIC_PAYLOAD_URL } from '$env/static/public';

export const ssr = false;
export const prerender = false;

const API_URL = PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

interface MenuItem {
	id: string;
	label: string;
	url: string;
	order: number;
	openInNewTab: boolean;
}

interface PayloadResponse {
	docs: any[];
}

export const load: LayoutLoad = async ({ fetch }) => {
	try {
		const response = await fetch(`${API_URL}/api/menu?sort=order&limit=100`);
		
		if (!response.ok) {
			console.error('Failed to fetch menu:', response.statusText);
			return { menu: [] };
		}

		const data: PayloadResponse = await response.json();
		const menu: MenuItem[] = data.docs || [];

		return { menu };
	} catch (error) {
		console.error('Error loading menu:', error);
		return { menu: [] };
	}
};

