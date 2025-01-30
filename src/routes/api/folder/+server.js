import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';

export async function GET({ cookies }) {
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

    const { data, error } = await supabase
        .from('folder')
        .select('*')
        .eq('userID', userID);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return json({folders: data});
}

export async function POST({ request, cookies }) {
    const token = cookies.get("token");
    if(!token) {
        throw redirect(302, "/login");
    }
    const verifiedToken = await jwt.verify(token, SECRET_JWT_KEY);
    const userData = verifiedToken.payload;
    const userID = userData.userID;
    const { name } = await request.json();

    if (!name || !userID) {
        return new Response(JSON.stringify({ error: 'name and userID are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { data, error } = await supabase
        .from('folder')
        .insert([{ name, userID }])
        .select();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return json({ status: true, folderID: data[0].folderID })
}

export async function DELETE({ request }) {
    const { folderID } = await request.json();

    if (!folderID) {
        return new Response(JSON.stringify({ error: 'folderID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { error } = await supabase
        .from('folder')
        .delete()
        .eq('folderID', folderID);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return json({ status: true });
}

export async function PATCH({ request }) {
    const { folderID, name } = await request.json();

    if (!folderID || !name) {
        return new Response(JSON.stringify({ error: 'folderID and name are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { data, error } = await supabase
        .from('folder')
        .update({ name })
        .eq('folderID', folderID)
        .select();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return json({ status: true });
}