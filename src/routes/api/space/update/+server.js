import { json } from "@sveltejs/kit";
import { supabase } from "$lib/supabaseClient";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";

export const PATCH = async ({ cookies, request }) => {
    const token = cookies.get("token");
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

    const { spaceID, content } = await request.json();
    const { error } = await supabase
    .from('glint_space')
    .update({ content })
    .eq('spaceID', spaceID)
    .eq('userID', userID)

    if(error) {
        return json({ status: false, message: "Couldn't update this space" });
    }

    return json({ status: true, data: null });
    
}