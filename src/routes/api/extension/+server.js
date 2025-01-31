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
            { role: "system", content: `read a note from the user, then only return the name of the folder which the note is most likely to belong to out of these folders ${folderCompilation}, if no folders fit the note then answer with a new folder name which should fit the note, in this case present your answer in this format: "newFolder:newfoldername"`},
            { role: "user", content: note },
        ],
        model: "gpt-4o-mini"
    });

    console.log(completion.choices);
  return completion.choices[0].message.content;
}

export async function POST({ request }) {
    const { content, token } = await request.json();

    if (!content) {
        return json(
            { error: 'note content is required' },
            { status: 400 }
        );
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
    if(selectedFolderName.includes("newFolder:")) {
        const newFolderName = selectedFolderName.split(":")[1];
        const { data: newFolderData, error: newFolderError } = await supabase
            .from('folder')
            .insert([{ name: newFolderName, userID }])
            .select("*");
        
        const { data, error } = await supabase
            .from('note')
            .insert([{ content, folderID: newFolderData[0].folderID, userID }])
            .select();

        if (error) {
            return json(
                { error: error.message },
                { status: 500 }
            );
        }
        return json(
            { newFolder: true, folderName: newFolderName }
        );
    }
    const selectedFolderID = folders.find(folder => folder.name == selectedFolderName).folderID;

    const { data, error } = await supabase
        .from('note')
        .insert([{ content, folderID: selectedFolderID, userID }])
        .select();

    if (error) {
        return json(
            { error: error.message },
            { status: 500 }
        );
    }
    return json(
        { newFolder: false, folderName: selectedFolderName }
    );
}