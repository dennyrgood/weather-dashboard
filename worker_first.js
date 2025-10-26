export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    
    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }
    
    // Only allow specific APIs for security
    const allowedDomains = [
      'api.open-meteo.com',
      'openexchangerates.org',
      'api.frankfurter.app',
      'api.exchangerate-api.com'
    ];
    
    const targetDomain = new URL(targetUrl).hostname;
    if (!allowedDomains.includes(targetDomain)) {
      return new Response('Domain not allowed', { status: 403 });
    }
    
    try {
      const response = await fetch(targetUrl);
      const data = await response.text();
      
      return new Response(data, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Cache-Control': 'public, max-age=300'
        }
      });
    } catch (error) {
      return new Response('Proxy error: ' + error.message, { status: 500 });
    }
  }
};
