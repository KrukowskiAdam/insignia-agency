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
		const [menuResponse, footerResponse] = await Promise.all([
			fetch(`${API_URL}/api/menu?sort=order&limit=100`),
			fetch(`${API_URL}/api/footer?limit=1`)
		]);
		
		if (!menuResponse.ok) {
			console.error('Failed to fetch menu:', menuResponse.statusText);
		}

		if (!footerResponse.ok) {
			console.error('Failed to fetch footer:', footerResponse.statusText);
		}

		const menuData: PayloadResponse = menuResponse.ok ? await menuResponse.json() : { docs: [] };
		const footerData: PayloadResponse = footerResponse.ok ? await footerResponse.json() : { docs: [] };
		
		const menu: MenuItem[] = menuData.docs || [];
		const footer = footerData.docs?.[0] || null;

		return { menu, footer };
	} catch (error) {
		console.error('Error loading layout data:', error);
		return { menu: [], footer: null };
	}
};

