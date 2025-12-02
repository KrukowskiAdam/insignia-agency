import type { PageLoad } from './$types';
import { PUBLIC_PAYLOAD_URL } from '$env/static/public';

// Disable SSR to avoid CORS errors during build
export const ssr = false;
export const prerender = false;

const API_URL = PUBLIC_PAYLOAD_URL || 'http://localhost:3000';

type CardType = 'BigText' | 'DescText' | 'Video' | 'Image';

interface BaseCard {
	id: number;
	type: CardType;
	column: 'left' | 'middle' | 'right';
	size: 'small' | 'medium' | 'large';
	footerTitle: string;
	footerDescription: string;
	buttonText: string;
	buttonColor: 'red' | 'blue' | 'green';
	buttonLinkType: 'none' | 'external' | 'internal';
	buttonLinkValue: string;
	order: number;
}

interface BigTextCard extends BaseCard {
	type: 'BigText';
	titleLine1: string;
	titleLine2?: string;
	titleColor: 'red' | 'blue' | 'green';
}

interface DescTextCard extends BaseCard {
	type: 'DescText';
	title?: string;
	description?: string;
}

interface VideoCard extends BaseCard {
	type: 'Video';
	videoWebm: string;
	videoMp4: string;
	category: string;
	title: string;
	description: string;
}

interface ImageCard extends BaseCard {
	type: 'Image';
	imageSrc: string;
	imageAlt: string;
	category: string;
	title: string;
	description: string;
}

export type Card = BigTextCard | DescTextCard | VideoCard | ImageCard;

interface Page {
	id: string;
	title: string;
	slug: string;
	isHomepage: boolean;
	hero?: {
		heading?: string;
		subheading?: string;
		backgroundImage?: any;
	};
	content: string;
	blocks?: any[];
	homepageColumns?: {
		title?: string;
		cards?: any[];
	};
}

interface PayloadResponse {
	docs: any[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	pagingCounter: number;
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevPage: number | null;
	nextPage: number | null;
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		console.log('🔄 Fetching homepage from:', `${API_URL}/api/pages?where[isHomepage][equals]=true&where[status][equals]=published`);

		// Fetch homepage with timeout
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

		const pageResponse = await fetch(
			`${API_URL}/api/pages?where[isHomepage][equals]=true&where[status][equals]=published`,
			{ signal: controller.signal }
		);
		clearTimeout(timeoutId);

		let homepage: Page | null = null;

		if (pageResponse.ok) {
			const pageData: PayloadResponse = await pageResponse.json();
			console.log('✅ Response received:', pageData);
			if (pageData.docs && pageData.docs.length > 0) {
				homepage = pageData.docs[0];
				console.log('📄 Homepage data:', homepage);
				console.log('🧱 Homepage blocks:', homepage.blocks);
			} else {
				console.log('⚠️ No homepage found with isHomepage=true');
			}
		} else {
			console.error('❌ Response not OK:', pageResponse.status, pageResponse.statusText);
		}

		return { homepage };
	} catch (error) {
		console.error('❌ Error loading homepage:', error);
		return { homepage: null };
	}
};
