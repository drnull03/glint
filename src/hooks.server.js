// src/hooks.server.js
export async function handle({ event, resolve }) {
    // Handle preflight requests (OPTIONS)
    if (event.request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Allow all origins (or specify your origin)
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', // Allow specific methods
          'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow specific headers
        },
      });
    }
  
    // Proceed with the request
    const response = await resolve(event);
  
    // Add CORS headers to the response
    response.headers.set('Access-Control-Allow-Origin', '*'); // Allow all origins (or specify your origin)
    response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    return response;
  }