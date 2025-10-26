export default {
  /**
   * Main fetch handler for the Cloudflare Worker.
   * @param {Request} request The incoming request object.
   * @param {Record<string, string>} env The environment variables, including secrets.
   * @returns {Promise<Response>}
   */
  async fetch(request, env) {
    const url = new URL(request.url);
    let targetUrl = url.searchParams.get('url');

    if (!targetUrl) {
      return new Response('Missing url parameter', { status: 400 });
    }

    // --- Security Check ---
    const allowedDomains = [
      'api.open-meteo.com',
      'openexchangerates.org',
      'api.frankfurter.app',
      'api.exchangerate-api.com'
    ];
    
    let targetDomain;
    try {
      targetDomain = new URL(targetUrl).hostname;
    } catch (e) {
      return new Response('Invalid target URL format', { status: 400 });
    }

    if (!allowedDomains.includes(targetDomain)) {
      return new Response('Domain not allowed', { status: 403 });
    }
    // --- End Security Check ---

    // --- Key Injection for Open-Meteo ---
    // If the target is Open-Meteo AND the secret key is configured,
    // append the key to the URL parameters.
    if (targetDomain === 'api.open-meteo.com') {
      const apiKey = env.OPENMETEO_API_KEY; 
      
      // Note: This assumes Open-Meteo uses an 'apikey' parameter.
      // If their documentation specifies a different parameter name (e.g., 'key'), 
      // you must change 'apikey' below to match.
      if (apiKey) {
        // Construct a new URL object to safely append the new parameter
        const finalUrl = new URL(targetUrl);
        finalUrl.searchParams.set('apikey', apiKey); 
        targetUrl = finalUrl.toString();
        
        console.log("Using API key for Open-Meteo request.");
      } else {
        console.log("No API key found in secrets; proceeding with non-authenticated call.");
      }
    }
    // --- End Key Injection ---

    try {
      const response = await fetch(targetUrl);
      
      // Ensure the response is handled correctly, preserving its body stream
      const responseHeaders = new Headers(response.headers);
      
      // Override default headers to ensure proper CORS and caching
      responseHeaders.set('Content-Type', 'application/json');
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.set('Access-Control-Allow-Methods', 'GET');
      responseHeaders.set('Cache-Control', 'public, max-age=300');
      
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders
      });
      
    } catch (error) {
      return new Response('Proxy error: ' + error.message, { status: 500 });
    }
  }
};
