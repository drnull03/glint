import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";

const generateSharedURL = (length = 12) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_~';
    let result = '';
    
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        const randomValues = new Uint8Array(length);
        crypto.getRandomValues(randomValues);
        for (let i = 0; i < length; i++) {
            result += chars[randomValues[i] % chars.length];
        }
    } else {
        for (let i = 0; i < length; i++) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
    }
    
    return result;
}

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

    const { spaceID } = await request.json();

    const sharedURL = generateSharedURL();

    const { error } = await supabase
    .from('glint_space')
    .update({ sharedURL })
    .eq('spaceID', spaceID)
    .eq('userID', userID);

    if(error) {
        return json({ status: false, message: "Couldn't share this space" });
    }

    return json({ status: true, data: sharedURL });
    
}