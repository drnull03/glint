import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";

export const POST = async ({ cookies, request }) => {
    const token = cookies.get("token");
    if(!token) {
        return json({ status: false, message: "no-token" });
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

    const { data: spaceData, error: getSpaceError } = await supabase
    .from('glint_space')
    .select('name, content, sharedURL')
    .eq('spaceID', spaceID)
    .single();

    if(getSpaceError) {
        return json({ status: false, message: "Couldn't copy this space" });
    }

    if(!spaceData?.sharedURL) {
        return json({ status: false, message: "Space is not shared publicly" });
    }

    const { error } = await supabase
    .from('glint_space')
    .insert([{
        name: spaceData.name,
        content: spaceData.content,
        userID
    }])

    if(error) {
        return json({ status: false, message: "Couldn't copy this space" });
    }

    return json({ status: true, data: null });
}