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
		// Fetch homepage
		const pageResponse = await fetch(`${API_URL}/api/pages?where[isHomepage][equals]=true&where[status][equals]=published`);
		let homepage: Page | null = null;
		
		if (pageResponse.ok) {
			const pageData: PayloadResponse = await pageResponse.json();
			if (pageData.docs && pageData.docs.length > 0) {
				homepage = pageData.docs[0];
			}
		}

		// Fetch cards
		const cardsResponse = await fetch(`${API_URL}/api/cards?sort=order&limit=100`);
		
		if (!cardsResponse.ok) {
			console.error('Failed to fetch cards:', cardsResponse.statusText);
			return { cards: [], homepage };
		}

		const json: PayloadResponse = await cardsResponse.json();
		
		if (!json.docs || json.docs.length === 0) {
			return { cards: [] };
		}
		
		const cards: Card[] = json.docs.map((item: any) => {
			const type = item.Enumeration?.replace('Block_', '') as CardType;
			
			const baseCard = {
				id: item.id,
				type,
				column: item.column,
				size: item.size,
				footerTitle: item.footerTitle || '',
				footerDescription: item.footerDescription || '',
				buttonText: item.buttonText || '',
				buttonColor: item.buttonColor || 'red',
				buttonLinkType: item.buttonLinkType || 'none',
				buttonLinkValue: item.buttonLinkValue || '',
				order: item.order || 0
			};

			if (type === 'BigText') {
				return {
					...baseCard,
					type: 'BigText' as const,
					titleLine1: item.titleLine1 || '',
					titleLine2: item.titleLine2 || '',
					titleColor: item.titleColor || 'red'
				};
			} else if (type === 'DescText') {
				return {
					...baseCard,
					type: 'DescText' as const,
					title: item.title || '',
					description: item.description || ''
				};
			} else if (type === 'Video') {
				const videoWebmUrl = item.videoWebm?.url || '';
				const videoMp4Url = item.videoMp4?.url || '';
				
				return {
					...baseCard,
					type: 'Video' as const,
					videoWebm: videoWebmUrl.startsWith('http') ? videoWebmUrl : `${API_URL}${videoWebmUrl}`,
					videoMp4: videoMp4Url.startsWith('http') ? videoMp4Url : `${API_URL}${videoMp4Url}`,
					category: item.category || '',
					title: item.title || '',
					description: item.description || ''
				};
			} else if (type === 'Image') {
				const imageSrcUrl = item.imageSrc?.url || '';
				
				return {
					...baseCard,
					type: 'Image' as const,
					imageSrc: imageSrcUrl.startsWith('http') ? imageSrcUrl : `${API_URL}${imageSrcUrl}`,
					imageAlt: item.imageAlt || '',
					category: item.category || '',
					title: item.title || '',
					description: item.description || ''
				};
			}

			return baseCard as Card;
		});

		return { cards, homepage };
	} catch (error) {
		console.error('Error loading cards:', error);
		return { cards: [], homepage: null };
	}
};
