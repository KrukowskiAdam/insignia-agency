/**
 * card controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::card.card', ({ strapi }) => ({
  async beforeCreate(ctx) {
    await validateButtonLink(ctx.request.body.data);
    await validateCardTypeFields(ctx.request.body.data);
  },

  async beforeUpdate(ctx) {
    await validateButtonLink(ctx.request.body.data);
    await validateCardTypeFields(ctx.request.body.data);
  },
}));

function validateButtonLink(data: any) {
  const buttonText = data.buttonText;
  const linkType = data.buttonLinkType;
  const linkValue = data.buttonLinkValue;
  
  // If no button text, force link type to 'none'
  if (!buttonText || !buttonText.trim()) {
    data.buttonLinkType = 'none';
    data.buttonLinkValue = '';
    return;
  }
  
  // If there's button text but link type is still 'none', that's OK
  if (linkType === 'none') {
    data.buttonLinkValue = '';
    return;
  }
  
  // If link type is set but no button text, that's an error
  if (linkType !== 'none' && (!buttonText || !buttonText.trim())) {
    throw new Error('Button text is required when button link is set');
  }
  
  if (!linkValue || !linkValue.trim()) {
    throw new Error(`Button link value is required when type is "${linkType}"`);
  }
  
  const trimmedValue = linkValue.trim();
  
  if (linkType === 'external') {
    if (!trimmedValue.startsWith('http://') && !trimmedValue.startsWith('https://')) {
      throw new Error('External links must start with http:// or https://');
    }
  } else if (linkType === 'internal') {
    if (!trimmedValue.startsWith('/')) {
      throw new Error('Internal links must start with / (e.g., /about, /contact)');
    }
  }
}

function validateCardTypeFields(data: any) {
  const cardType = data.Enumeration;
  
  if (!cardType) {
    throw new Error('Card type (Enumeration) is required');
  }
  
  switch (cardType) {
    case 'Block_BigText':
      validateBigTextCard(data);
      break;
    case 'Block_DescText':
      validateDescTextCard(data);
      break;
    case 'Block_Video':
      validateVideoCard(data);
      break;
    case 'Block_Image':
      validateImageCard(data);
      break;
    default:
      throw new Error(`Unknown card type: ${cardType}`);
  }
}

function validateBigTextCard(data: any) {
  // Required fields
  if (!data.titleLine1 || !data.titleLine1.trim()) {
    throw new Error('BigText card requires titleLine1');
  }
  if (!data.titleColor) {
    throw new Error('BigText card requires titleColor');
  }
  
  // Clear irrelevant fields
  data.imageSrc = null;
  data.videoWebm = null;
  data.videoMp4 = null;
  data.category = null;
  data.title = null;
  data.description = null;
}

function validateDescTextCard(data: any) {
  // Required fields
  if (!data.title || !data.title.trim()) {
    throw new Error('DescText card requires title');
  }
  if (!data.description || !data.description.length) {
    throw new Error('DescText card requires description');
  }
  
  // Clear irrelevant fields
  data.imageSrc = null;
  data.videoWebm = null;
  data.videoMp4 = null;
  data.titleLine1 = null;
  data.titleLine2 = null;
  data.titleColor = null;
  data.category = null;
}

function validateVideoCard(data: any) {
  // Required fields - at least one video format
  if (!data.videoWebm && !data.videoMp4) {
    throw new Error('Video card requires at least videoWebm or videoMp4');
  }
  if (!data.category || !data.category.trim()) {
    throw new Error('Video card requires category');
  }
  if (!data.title || !data.title.trim()) {
    throw new Error('Video card requires title');
  }
  if (!data.description || !data.description.length) {
    throw new Error('Video card requires description');
  }
  
  // Clear irrelevant fields
  data.imageSrc = null;
  data.titleLine1 = null;
  data.titleLine2 = null;
  data.titleColor = null;
  data.imageAlt = null;
}

function validateImageCard(data: any) {
  // Required fields
  if (!data.imageSrc) {
    throw new Error('Image card requires imageSrc (image file)');
  }
  if (!data.category || !data.category.trim()) {
    throw new Error('Image card requires category');
  }
  if (!data.title || !data.title.trim()) {
    throw new Error('Image card requires title');
  }
  if (!data.description || !data.description.length) {
    throw new Error('Image card requires description');
  }
  
  // Clear irrelevant fields
  data.videoWebm = null;
  data.videoMp4 = null;
  data.titleLine1 = null;
  data.titleLine2 = null;
  data.titleColor = null;
}
