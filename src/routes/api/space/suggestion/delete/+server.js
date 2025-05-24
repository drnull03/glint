import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";

export const PATCH = async ({ cookies, request }) => {
    let token;
    token = request.headers.get('Authorization')?.split(' ')[1] || "";
    if(!token) {
        token = cookies.get("token");
    }

    if(!token) {
        throw redirect(302, "/login");
    }
    
    const verifiedToken = await jwt.verify(token, SECRET_JWT_KEY);
    const userData = verifiedToken.payload;
    const userID = userData.userID;

    if (!userID) {
        return new Response(JSON.stringify({ error: 'userID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { spaceID } = await request.json();

    const { error } = await supabase
    .from('glint_space')
    .update({ suggestion: null })
    .eq('spaceID', spaceID)
    .eq('userID', userID)

    if(error) {
        return json({ status: false, message: "Couldn't delete the suggestion on this space" });
    }

    return json({ status: true, data: null });
}