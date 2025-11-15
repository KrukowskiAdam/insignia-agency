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
  const linkType = data.buttonLinkType;
  const linkValue = data.buttonLinkValue;
  
  if (linkType === 'none') {
    // No link required - clear value
    data.buttonLinkValue = '';
    return;
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
