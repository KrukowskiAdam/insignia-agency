<script>
    import { PUBLIC_STRAPI_URL } from '$env/static/public';
    
    console.log('Environment check:');
    console.log('PUBLIC_STRAPI_URL:', PUBLIC_STRAPI_URL);
    console.log('import.meta.env.PUBLIC_STRAPI_URL:', import.meta.env.PUBLIC_STRAPI_URL);
</script>

<h1>Test Environment Variables</h1>
<p>PUBLIC_STRAPI_URL: {PUBLIC_STRAPI_URL || 'UNDEFINED'}</p>
<p>Meta env: {import.meta.env.PUBLIC_STRAPI_URL || 'UNDEFINED'}</p>
<p>Manual API test:</p>