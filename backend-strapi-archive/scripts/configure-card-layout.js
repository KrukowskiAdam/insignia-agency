/**
 * Script to configure Card content type layout in Strapi admin
 * Run this after starting Strapi: node scripts/configure-card-layout.js
 */

const axios = require('axios');

const STRAPI_URL = 'http://localhost:1337';

// Login credentials - update these with your admin credentials
const ADMIN_EMAIL = 'your-email@example.com';
const ADMIN_PASSWORD = 'your-password';

const cardLayout = {
  layouts: {
    edit: [
      // Row 1 - Basic Configuration
      [
        { name: 'Enumeration', size: 4 },
        { name: 'column', size: 4 },
        { name: 'size', size: 4 }
      ],
      // Row 2 - Order
      [
        { name: 'order', size: 4 }
      ],
      // Row 3 - BigText Content Fields
      [
        { name: 'titleLine1', size: 6 },
        { name: 'titleLine2', size: 6 }
      ],
      [
        { name: 'titleColor', size: 4 }
      ],
      // Row 4 - Other Content Fields
      [
        { name: 'title', size: 6 },
        { name: 'category', size: 6 }
      ],
      [
        { name: 'description', size: 12 }
      ],
      // Row 5 - Media Fields
      [
        { name: 'imageSrc', size: 6 },
        { name: 'imageAlt', size: 6 }
      ],
      [
        { name: 'videoWebm', size: 6 },
        { name: 'videoMp4', size: 6 }
      ],
      // Row 6 - Button & Link Fields
      [
        { name: 'buttonText', size: 6 },
        { name: 'buttonColor', size: 6 }
      ],
      [
        { name: 'buttonLinkType', size: 4 },
        { name: 'buttonLinkValue', size: 8 }
      ],
      [
        { name: 'buttonLink', size: 12 }
      ],
      // Row 7 - Footer Fields
      [
        { name: 'footerTitle', size: 6 },
        { name: 'footerDescription', size: 6 }
      ]
    ],
    list: ['Enumeration', 'column', 'size', 'order']
  },
  settings: {
    searchable: true,
    filterable: true,
    bulkable: true,
    pageSize: 10,
    mainField: 'Enumeration',
    defaultSortBy: 'order',
    defaultSortOrder: 'ASC'
  }
};

async function configureLayout() {
  try {
    console.log('🔐 Logging in to Strapi...');
    
    // Login
    const loginResponse = await axios.post(`${STRAPI_URL}/admin/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    
    const token = loginResponse.data.data.token;
    console.log('✅ Logged in successfully');
    
    // Configure layout
    console.log('⚙️  Configuring Card layout...');
    
    const configResponse = await axios.put(
      `${STRAPI_URL}/content-manager/content-types/api::card.card/configuration`,
      cardLayout,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    
    console.log('✅ Layout configured successfully!');
    console.log('\n📋 New layout:');
    console.log('   - Basic Configuration (Enumeration, column, size, order)');
    console.log('   - Content Fields (titleLine1/2, title, description, category)');
    console.log('   - Media Fields (imageSrc, imageAlt, videoWebm, videoMp4)');
    console.log('   - Button & Links (buttonText, buttonColor, buttonLinkType, etc.)');
    console.log('   - Footer (footerTitle, footerDescription)');
    console.log('\n🔄 Refresh your admin panel to see changes!');
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.log('\n💡 Make sure to:');
    console.log('   1. Update ADMIN_EMAIL and ADMIN_PASSWORD in this script');
    console.log('   2. Strapi is running on http://localhost:1337');
  }
}

configureLayout();
