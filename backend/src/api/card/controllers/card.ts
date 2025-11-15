/**
 * card controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::card.card', ({ strapi }) => ({
  async beforeCreate(ctx) {
    await validateButtonLink(ctx.request.body.data);
  },

  async beforeUpdate(ctx) {
    await validateButtonLink(ctx.request.body.data);
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
