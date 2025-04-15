// This file was added to allow http requests to the api from other origins so that the non-web clients would work (extention, mobile app, desktop app)
export async function handle({ event, resolve }) {
    if (event.url.pathname.startsWith('/api/')) {
        if (event.request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                },
            });
        }

        const response = await resolve(event);

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE, PATCH');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    }

    return await resolve(event);
}