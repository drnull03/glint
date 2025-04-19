import { supabase } from "$lib/supabaseClient";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";
import { hashPassword } from "$lib/auth";

const generateJWT = async (userID, email) => {
    const token = await jwt.sign({
        userID: userID,
        email: email
    }, SECRET_JWT_KEY);
    return token;
}

const insertUser = async (name, email, password) => {
    if(!name || !email || !password) {
        return;
    }
    const { data, error } = await supabase
    .from('glint_user')
    .insert([
        {
            name: name,
            email: email,
            password: password
        }
    ])
    .select("userID");

    if(error) {
        console.error('Error inserting user:', error);
        return;
    }

    return data[0].userID;
}

export const actions = {
    signup: async ({ request, cookies, fetch }) => {
        const formData = await request.formData();
        const name = formData.get("name");
        const email = formData.get("email");
        const unhashedPassword = formData.get("password");
        const password = await hashPassword(unhashedPassword);
        // Validate all inputs
        const userID = await insertUser(name, email, password);
        if(!userID) {
            return {
                message: 'Account creation failed. Please try again.'
            };
        }
        // Generate a JWT token then save it in cookies then redirect to the homepage
        const token = await generateJWT(userID, email);
        cookies.set('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            path: '/',
            maxAge: 60 * 60 * 24 * 7 * 30
        });

        const res = await fetch("../../api/space", {
            method: "POST",
            body: JSON.stringify({
                userID,
                content: onboardingSpaceContent,
                name: "Onboarding 🎉",
                forwarded: "Glint's team"
            }),
            headers: {"Content-Type": "application/json"}
        });

        const myjson = await res.json();
        console.log(myjson);

        throw redirect(303, "/");
    }
    
}

export const load = ({ cookies }) => {
    const token = cookies.get("token");

    if(token) {
        throw redirect(303, "/");
    }

    return {isUserVar: false}
}

const onboardingSpaceContent = {"type":"doc","content":[{"type":"heading","attrs":{"level":1,"textAlign":null},"content":[{"text":"Welcome to Glint!","type":"text"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"You can use Glint as your personal writing space, behind this simple interface is a ","type":"text"},{"text":"very powerful ","type":"text","marks":[{"type":"italic"}]},{"text":"system, designed to fit your every creative need.","type":"text"}]},{"type":"paragraph","attrs":{"textAlign":null}},{"type":"heading","attrs":{"level":3,"textAlign":null},"content":[{"text":"Features","type":"text"}]},{"type":"bulletList","attrs":{"tight":true},"content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Rich text editor: ","type":"text","marks":[{"type":"bold"}]},{"text":"Glint allows you to express your thoughts with all necessary tools, play with 6 levels of titles, ordered or unordered lists, bold, italic, and all the other standard text formatting features.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Tasks:","type":"text","marks":[{"type":"bold"}]},{"text":" You can create tasks within your Spaces and manage them within Glint.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Auto save:","type":"text","marks":[{"type":"bold"}]},{"text":" Glint's powerful editor supports auto save, don't worry about losing your thoughts on accident!","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Space Sharing:","type":"text","marks":[{"type":"bold"}]},{"text":" Quickly share your ideas with the public or your team members with Space Sharing, this exposes your Space through a unique URL which you can send to anyone for them to get read-only access to your Space.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Desktop & Mobile:","type":"text","marks":[{"type":"bold"}]},{"text":" We have built apps for all platforms, Windows, Linux and Android, we're still working in IOS at the moment.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Arabic support:","type":"text","marks":[{"type":"bold"}]},{"text":" You can switch a Space to right alignment to have a comfortable experience writing Arabic and other right aligned languages","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Markdown support:","type":"text","marks":[{"type":"bold"}]},{"text":" If you ever need to just paste something from Chat GPT or any other markdown text, Glint covers you.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Shortcuts:","type":"text","marks":[{"type":"bold"}]},{"text":" You can shortcut your way through almost anything using Glint's wide shortcut system.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Auto scrolling:","type":"text","marks":[{"type":"bold"}]},{"text":" When your document gets larger, Glint's text editor will automatically scroll down while you write to keep your eyes at a nice centred level.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Minimal Design:","type":"text","marks":[{"type":"bold"}]},{"text":" Having a minimal design enables you to focus on what actually matters, creating awesome things.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Other features:","type":"text","marks":[{"type":"bold"}]},{"text":" I've probably forgot about a thing or two... or three. you'll stumble upon them eventually","type":"text"}]}]}]},{"type":"paragraph","attrs":{"textAlign":null}},{"type":"heading","attrs":{"level":3,"textAlign":null},"content":[{"text":"Coming soon","type":"text"}]},{"type":"bulletList","attrs":{"tight":true},"content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Captures:","type":"text","marks":[{"type":"bold"}]},{"text":" Capture ideas quickly by directly writing your idea or thought then easily forwarding it to the appropriate Space.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Real-time Spaces:","type":"text","marks":[{"type":"bold"}]},{"text":" Work on the same Space with your team at the same time using Glint's real-time editor.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Offline Support:","type":"text","marks":[{"type":"bold"}]},{"text":" This will be enabled for the desktop and mobile clients, write what you want, then it will be synced with the cloud once you gain back internet access.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Browser Extension:","type":"text","marks":[{"type":"bold"}]},{"text":" Adding Glint's browser extension will help with capturing important thoughts as soon as possible.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Telegram Bot:","type":"text","marks":[{"type":"bold"}]},{"text":" If you regularly use Telegram, the bot will enable you to save ideas quickly by sending them or forwarding them to the bot.","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Interface redesign:","type":"text","marks":[{"type":"bold"}]},{"text":" As this is just a prototype, the UI will undertake massive enhancements throughout the upcoming period, stay tuned!","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"AI assistance:","type":"text","marks":[{"type":"bold"}]},{"text":" AI will be integrated into Glint in many ways, from helping you quickly choose a Space for your Captures, to connecting your thoughts and ideas behind the scenes.","type":"text"}]}]}]},{"type":"paragraph","attrs":{"textAlign":null}},{"type":"heading","attrs":{"level":3,"textAlign":null},"content":[{"text":"Note","type":"text"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"This is just a prototype to validate the various ideas of Glint and it's nowhere near the finished product, so expect bugs, and kindly report them to the developers.","type":"text"}]},{"type":"paragraph","attrs":{"textAlign":null}},{"type":"heading","attrs":{"level":3,"textAlign":null},"content":[{"text":"Shortcuts","type":"text"}]},{"type":"bulletList","attrs":{"tight":true},"content":[{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"H1 - ","type":"text"},{"text":"ctrl","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"alt","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"1","type":"text","marks":[{"type":"code"}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"H2 - ","type":"text"},{"text":"ctrl","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"alt","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"2","type":"text","marks":[{"type":"code"}]},{"type":"hardBreak"},{"text":".","type":"text"},{"type":"hardBreak"},{"text":".","type":"text"},{"type":"hardBreak"},{"text":".","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"H6 - ","type":"text"},{"text":"ctrl","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"alt","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"6","type":"text","marks":[{"type":"code"}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Unordered list - ","type":"text"},{"text":"dash","type":"text","marks":[{"type":"code"}]},{"text":" then ","type":"text"},{"text":"space","type":"text","marks":[{"type":"code"}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Ordered list - ","type":"text"},{"text":"number","type":"text","marks":[{"type":"code"}]},{"text":" then ","type":"text"},{"text":".","type":"text","marks":[{"type":"code"}]},{"text":" then ","type":"text"},{"text":"space","type":"text","marks":[{"type":"code"}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Task - ","type":"text"},{"text":"[]","type":"text","marks":[{"type":"code"}]},{"text":" then ","type":"text"},{"text":"space","type":"text","marks":[{"type":"code"}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Bold - ","type":"text"},{"text":"ctrl","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"B","type":"text","marks":[{"type":"code"}]}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Italic - ","type":"text"},{"text":"ctrl","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"I","type":"text","marks":[{"type":"code"}]},{"text":" ","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Right align (for Arabic) - ","type":"text"},{"text":"ctrl","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"shift","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"R","type":"text","marks":[{"type":"code"}]},{"text":" ","type":"text"}]}]},{"type":"listItem","content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Left align (for Latin) - ","type":"text"},{"text":"ctrl","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"shift","type":"text","marks":[{"type":"code"}]},{"text":" + ","type":"text"},{"text":"L","type":"text","marks":[{"type":"code"}]},{"text":" ","type":"text"}]}]}]},{"type":"paragraph","attrs":{"textAlign":null}},{"type":"heading","attrs":{"level":3,"textAlign":null},"content":[{"text":"Create your first Space from the ","type":"text"},{"text":"+","type":"text","marks":[{"type":"code"}]},{"text":" button in the left side bar","type":"text"}]},{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Onboarding tasks:","type":"text"}]},{"type":"taskList","content":[{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Create my first Space","type":"text"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Try out the different formatting options","type":"text"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Play around with the shortcuts","type":"text"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Share a Space","type":"text"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Add Glint to my tab bookmarks","type":"text"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Download Glint on my PC and Mobile","type":"text"}]}]},{"type":"taskItem","attrs":{"checked":false},"content":[{"type":"paragraph","attrs":{"textAlign":null},"content":[{"text":"Tell my friends about Glint","type":"text"}]}]}]}]}