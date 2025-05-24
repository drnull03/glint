import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";
import OpenAI from "openai";
import { SECRET_DEEPSEEK_API_KEY } from "$env/static/private";

const client = new OpenAI({ baseURL: "https://api.deepseek.com/v1", apiKey: SECRET_DEEPSEEK_API_KEY });

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

    const { spaceID, sparks, oneLeft } = await request.json();

    const { data: fetchData, error: fetchError } = await supabase
    .from('glint_space')
    .select("sparks, content")
    .eq('spaceID', spaceID)
    .eq('userID', userID)
    .single()

    if(fetchError) {
        return json({ status: false, message: "Couldn't update this space" });
    }

    let { sparks: existingSparks, content } = fetchData;

    // If one spark is submitted, it's added
    // if more that one then all sparks are replaced
    // if 0 are submitted then we clear out the sparks and suggestion

    if(sparks.length === 1 && !oneLeft) {
        existingSparks.push(sparks[0]);
    } else if(sparks.length > 1 || oneLeft) {
        existingSparks = sparks;
    } else if(sparks.length === 0) {
        existingSparks = [];
    }

    const { error: insertSparkError } = await supabase
    .from('glint_space')
    .update({ sparks: existingSparks })
    .eq('spaceID', spaceID)
    .eq('userID', userID)

    if(insertSparkError) {
        return json({ status: false, message: "Couldn't update this space" });
    }

    if(existingSparks.length === 0) {
        const { error: insertSuggestionError } = await supabase
        .from('glint_space')
        .update({ suggestion: null })
        .eq('spaceID', spaceID)
        .eq('userID', userID)

        if(insertSuggestionError) {
            return json({ status: false, message: "Couldn't update this space" });
        }

        return json({ status: true, data: null });
    }

    const suggestion = await generateSuggestion(existingSparks, content);

    if(!suggestion) {
        return json({ status: false, message: "Failed to generate a suggestion" });
    }
    
    const { error: insertSuggestionError } = await supabase
    .from('glint_space')
    .update({ suggestion })
    .eq('spaceID', spaceID)
    .eq('userID', userID)

    if(insertSuggestionError) {
        return json({ status: false, message: "Couldn't update this space" });
    }

    return json({ status: true, sparks: existingSparks, suggestion });
}

const generateSuggestion = async (sparks, content) => {
    const messages = [
        {
            role: "system",
            content: `
            You're a helpful assistant, help the user integrate a new idea (a spark) into their file, generate a helpful suggestion to add to the file based on the information in the file, as well as the spark itself.
            Do not return the whole file, only the suggestion.
            Use the json format of tiptap for the suggestion, here's an example json format:

            {
                "type": "doc",
                "content": [
                    {
                    "type": "heading",
                    "attrs": { "level": 2 },
                    "content": [
                        {
                        "type": "text",
                        "text": "Sample Heading"
                        }
                    ]
                    },
                    {
                    "type": "paragraph",
                    "content": [
                        {
                        "type": "text",
                        "text": "This is a "
                        },
                        {
                        "type": "text",
                        "marks": [{ "type": "bold" }],
                        "text": "bold"
                        },
                        {
                        "type": "text",
                        "text": " and "
                        },
                        {
                        "type": "text",
                        "marks": [{ "type": "italic" }],
                        "text": "italic"
                        },
                        {
                        "type": "text",
                        "text": " text."
                        }
                    ]
                    },
                    {
                    "type": "bulletList",
                    "content": [
                        {
                        "type": "listItem",
                        "content": [
                            {
                            "type": "paragraph",
                            "content": [
                                { "type": "text", "text": "First item" }
                            ]
                            }
                        ]
                        },
                        {
                        "type": "listItem",
                        "content": [
                            {
                            "type": "paragraph",
                            "content": [
                                { "type": "text", "text": "Second item" }
                            ]
                            }
                        ]
                        }
                    ]
                    },
                    {
                    "type": "paragraph",
                    "content": [
                        {
                        "type": "text",
                        "marks": [
                            {
                            "type": "link",
                            "attrs": { "href": "https://example.com" }
                            }
                        ],
                        "text": "Visit Example"
                        }
                    ]
                    },
                    {
                    "type": "image",
                    "attrs": {
                        "src": "https://example.com/image.jpg",
                        "alt": "Example Image",
                        "title": "An example image"
                    }
                    }
                ]
            }

            Note that this is not an example of a suggestion, only an example of the json structure, keep the suggestions brief and concise.

            There could be multiple ideas (or sparks), in which case you need to generate a suggestion which fits all of them.

            Only return the suggestion content, never return the original content of the file.

            Note that there might be a previously integrated suggestion inside the content based on some old Sparks which might still be included in the request, detect them and make sure to generate the suggestion without taking them into account.
            `
        },
        {
            role: "user",
            content: `
            Here's the content of the file: ${JSON.stringify(content)}


            Here're the Sparks: ${sparks}
            `
        }
    ];

    const completion = await client.beta.chat.completions.parse({
        model: "deepseek-chat",
        messages,
        response_format: { type: 'json_object' },
        max_tokens: 8192
    });

    const data = JSON.parse(completion.choices[0].message.content);

    return data;
}