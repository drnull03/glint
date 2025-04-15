import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";

export const POST = async ({ cookies, request }) => {
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

    const { userID: destinationUserID, spaceID } = await request.json();

    const { data: originalSpace, error: fetchError } = await supabase
    .from('glint_space')
    .select('name, content')
    .eq('spaceID', spaceID)
    .single();

    if (fetchError) throw fetchError;

    const { data: userNameData, error: userNameError } = await supabase
    .from('glint_user')
    .select("name")
    .eq('userID', userID)
    .single();

    if(userNameError) throw userNameError;

    const { error: createError } = await supabase
    .from('glint_space')
    .insert([{
        name: originalSpace.name,
        content: originalSpace.content,
        userID: destinationUserID,
        forwarded: userNameData.name
    }])

    if(createError) {
        return json({ status: false, message: "Couldn't forward this space" });
    }

    return json({ status: true, data: null });
    
}