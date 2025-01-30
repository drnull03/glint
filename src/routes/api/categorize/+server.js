import { json } from "@sveltejs/kit";
import { SECRET_API_KEY } from "$env/static/private";

import OpenAI from "openai";

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

export const POST = async ({ request }) => {
    try {
        const data = await request.json();

        const { note, folders } = data;

        const folder = await getFolder(note, folders);
        
        return json(folder);
    } catch (error) {
        return json({ error: 'Somwthing went wrong' }, { status: 500 });
    }
}

// export const GET = async () => {
//     return json({ content: getFolder("2", ["one", "two", "three"]) });
// }