// For Strapi v5, conditional fields require plugins or custom frontend modifications
// This configuration focuses on layout organization rather than dynamic visibility

const config = {
  // Custom admin configuration 
  locales: ['en'],
  
  // Custom layout configuration can be added here
  // For conditional fields, consider using plugins like:
  // - @strapi/plugin-content-manager extensions
  // - Custom field components
  
  menu: {
    logo: undefined
  }
};

export default {
  config
};