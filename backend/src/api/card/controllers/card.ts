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
  if (!data.buttonLink) return; // Empty is OK
  
  const link = data.buttonLink.trim();
  if (!link) return; // Empty after trim is OK
  
  const isExternalLink = /^https?:\/\/.+/.test(link);
  const isInternalLink = /^\//.test(link);
  const isStrapiMedia = /^https:\/\/.*\.strapiapp\.com\//.test(link) || /^https:\/\/.*\.media\.strapiapp\.com\//.test(link);
  
  if (!isExternalLink && !isInternalLink && !isStrapiMedia) {
    throw new Error('Invalid buttonLink format. Use: external links (https://...), internal links (/path), or leave empty.');
  }
}
