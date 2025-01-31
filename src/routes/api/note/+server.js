import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';

import { SECRET_API_KEY } from "$env/static/private";
import OpenAI from "openai";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';

const openai = new OpenAI({ apiKey: SECRET_API_KEY });
const getFolder = async (note, folders) => {
    let folderCompilation = "";
    folders.forEach(folder => folderCompilation += `- ${folder.name} `);
    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: `read a note from the user, then only return the name of the folder which the note is most likely to belong to out of these folders ${folderCompilation}`},
            { role: "user", content: note },
        ],
        model: "gpt-4o-mini"
    });

    console.log(completion.choices);
  return completion.choices[0].message.content;
}

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

    const { data: folders, error: foldersError } = await supabase
        .from('folder')
        .select("folderID, name")
        .eq("userID", userID);

    if (foldersError) {
        return json(
            { error: foldersError.message },
            { status: 500 }
        );
    }

    const selectedFolderName = await getFolder(content, folders);
    const selectedFolderID = folders.find(folder => folder.name == selectedFolderName).folderID;

    const { data, error } = await supabase
        .from('note')
        .insert([{ content, folderID: selectedFolderID }])
        .select();

    if (error) {
        return json(
            { error: error.message },
            { status: 500 }
        );
    }
    return json(
        { status: true, noteID: data[0].noteID, selectedFolderID }
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