import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';

export async function POST({ request, cookies }) {
    const { content } = await request.json();

    if (!content) {
        return json(
            { error: 'note content is required' },
            { status: 400 }
        );
    }

    const token = cookies.get("token");
    if(!token) {
        throw redirect(302, "/login");
    }

    const verifiedToken = await jwt.verify(token, SECRET_JWT_KEY);
    const userData = verifiedToken.payload;
    const userID = userData.userID;

    const { data, error } = await supabase
        .from('suggestion')
        .insert([{ content, userID }])
        .select();

    console.log(data);

    if (error) {
        return json(
            { error: error.message },
            { status: 500 }
        );
    }
    return json(
        { status: true, data }
    );
}