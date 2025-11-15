import type { PageLoad } from './$types';
import { PUBLIC_STRAPI_URL } from '$env/static/public';

const STRAPI_URL = PUBLIC_STRAPI_URL || 'http://localhost:1337';

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
	buttonLink: string;
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

interface StrapiResponse {
	data: {
		id: number;
		attributes: any;
	}[];
}

export const load: PageLoad = async ({ fetch }) => {
	try {
		// Add timestamp to prevent caching issues
		const timestamp = Date.now();
		const response = await fetch(`${STRAPI_URL}/api/cards?populate=*&sort=order:asc&_t=${timestamp}`);
		
		if (!response.ok) {
			console.error('Failed to fetch cards:', response.statusText);
			return { cards: [] };
		}

		const json: StrapiResponse = await response.json();
		
		// Return empty if no data
		if (!json.data || json.data.length === 0) {
			return { cards: [] };
		}
		
		const cards: Card[] = json.data.map((item: any) => {
			// Extract type from Enumeration (e.g., "Block_BigText" -> "BigText")
			const type = item.Enumeration?.replace('Block_', '') as CardType;
			
			// Helper to convert Strapi Rich Text to plain text
			const extractText = (richText: any): string => {
				if (!richText) return '';
				if (typeof richText === 'string') return richText;
				if (Array.isArray(richText)) {
					return richText.map(block => 
						block.children?.map((child: any) => child.text || '').join('') || ''
					).join('\n');
				}
				return '';
			};
			
			// Base fields
			const baseCard = {
				id: item.id,
				type,
				column: item.column,
				size: item.size,
				footerTitle: item.footerTitle,
				footerDescription: item.footerDescription,
				buttonText: item.buttonText,
				buttonColor: item.buttonColor,
				buttonLink: item.buttonLink,
				order: item.order || 0
			};

			// Type-specific fields
			if (type === 'BigText') {
				return {
					...baseCard,
					type: 'BigText' as const,
					titleLine1: item.titleLine1 || '',
					titleLine2: item.titleLine2,
					titleColor: item.titleColor || 'red'
				};
			} else if (type === 'DescText') {
				return {
					...baseCard,
					type: 'DescText' as const,
					title: item.title,
					description: extractText(item.description)
				};
			} else if (type === 'Video') {
				return {
					...baseCard,
					type: 'Video' as const,
				videoWebm: item.videoWebm?.url 
					? (item.videoWebm.url.startsWith('http') ? item.videoWebm.url : `${STRAPI_URL}${item.videoWebm.url}`) 
					: '',
				videoMp4: item.videoMp4?.url 
					? (item.videoMp4.url.startsWith('http') ? item.videoMp4.url : `${STRAPI_URL}${item.videoMp4.url}`) 
					: '',
					category: item.category || '',
					title: item.title || '',
					description: extractText(item.description)
				};
			} else if (type === 'Image') {
				return {
					...baseCard,
					type: 'Image' as const,
				imageSrc: item.imageSrc?.url 
					? (item.imageSrc.url.startsWith('http') ? item.imageSrc.url : `${STRAPI_URL}${item.imageSrc.url}`) 
					: '',
					imageAlt: item.imageAlt || '',
					category: item.category || '',
					title: item.title || '',
					description: extractText(item.description)
				};
			}

			return baseCard as Card;
		});

		return { cards };
	} catch (error) {
		console.error('Error loading cards:', error);
		return { cards: [] };
	}
};
