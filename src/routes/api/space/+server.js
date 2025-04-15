import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";

export const GET = async ({ cookies, request }) => {
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

    const { data, error } = await supabase
    .from("glint_space")
    .select("*")
    .eq("userID", userID)
    .order("created_at");

    if(error) {
        return json({ status: false, message: "Couldn't get spaces" });
    }

    return json({ status: true, data });
}

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

    const { name, content, forwarded } = await request.json();

    const { data, error } = content ? await supabase
    .from('glint_space')
    .insert([
        { name, userID, content, forwarded }
    ])
    .select("spaceID") : await supabase
    .from('glint_space')
    .insert([
        { name, userID }
    ])
    .select("spaceID");


    if(error) {
        return json({ status: false, message: "Couldn't create this space" });
    }

    return json({ status: true, data: data[0] });
    
}

export const DELETE = async ({ cookies, request }) => {
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

    const { data: verifyData, error: verifyError } = await supabase
        .from('glint_space')
        .select('userID')
        .eq('spaceID', spaceID)
        .single();

    if (verifyError || verifyData.userID !== userID) {
        return json({ 
            status: false, 
            message: "Space not found or you don't have permission to delete it" 
        });
    }

    const { error } = await supabase
        .from('glint_space')
        .delete()
        .eq('spaceID', spaceID);

    if(error) {
        return json({ 
            status: false, 
            message: "Couldn't delete this space" 
        });
    }

    return json({ status: true, data: null });
}

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