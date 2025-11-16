import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { PUBLIC_PAYLOAD_URL } from '$env/static/public';

export const ssr = false;
export const prerender = false;

const API_URL = PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

interface Page {
	id: string;
	title: string;
	slug: string;
	status: string;
	isHomepage: boolean;
	hero?: {
		heading?: string;
		subheading?: string;
		backgroundImage?: any;
	};
	content: string;
	seo?: {
		metaTitle?: string;
		metaDescription?: string;
		metaImage?: any;
	};
}

interface PayloadResponse {
	docs: any[];
	totalDocs: number;
}

export const load: PageLoad = async ({ params, fetch }) => {
	const { slug } = params;

	try {
	const response = await fetch(
		`${API_URL}/api/pages?where[slug][equals]=${slug}&where[status][equals]=published`
	);		if (!response.ok) {
			throw error(response.status, `Failed to fetch page: ${response.statusText}`);
		}

		const data: PayloadResponse = await response.json();

		if (!data.docs || data.docs.length === 0) {
			throw error(404, 'Page not found');
		}

		const page: Page = data.docs[0];

		return {
			page
		};
	} catch (err) {
		console.error('Error loading page:', err);
		throw error(500, 'Failed to load page');
	}
};
