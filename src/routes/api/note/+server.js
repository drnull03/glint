import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    const { content, folderID } = await request.json();

    if (!content || !folderID) {
        return json(
            { error: 'content and folderID are required' },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from('note')
        .insert([{ content, folderID }])
        .select();

    if (error) {
        return json(
            { error: error.message },
            { status: 500 }
        );
    }

    return json(
        { status: true, noteID: data[0].noteID }
    );
}

export async function DELETE({ request }) {
    const { noteID } = await request.json();

    if (!noteID) {
        return new Response(JSON.stringify({ error: 'noteID is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { error } = await supabase
        .from('note')
        .delete()
        .eq('noteID', noteID);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return json({ status: true });
}

export async function PATCH({ request }) {
    const { noteID, content } = await request.json();

    if (!noteID || !content) {
        return new Response(JSON.stringify({ error: 'noteID and content are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const { data, error } = await supabase
        .from('note')
        .update({ content })
        .eq('noteID', noteID)
        .select();

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return json({ status: true });
}