import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';

export const GET = async ({ request }) => {
    let token;
    token = request.headers.get('Authorization')?.split(' ')[1] || "";

    if(!token) {
        return json({ status: false, message: "Unauthorized" });
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

    const { data, error } = await supabase
    .from("glint_space")
    .select("spaceID, name")
    .eq("userID", userID)
    .order("created_at");

    if(error) {
        return json({ status: false, message: "Couldn't get spaces" });
    }

    return json({ status: true, data });
}