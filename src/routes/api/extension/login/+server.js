import { supabase } from "$lib/supabaseClient";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { verifyPassword } from "$lib/auth";
import { json } from "@sveltejs/kit";

const generateJWT = async (userID, email) => {
    const token = await jwt.sign({
        userID: userID,
        email: email
    }, SECRET_JWT_KEY);
    return token;
}

const checkUserCredentials = async (email, password) => {
    const { data: user, error } = await supabase
    .from('user')
    .select('userID, password')
    .eq('email', email)
    .single();

    if(error) {
        console.log(error);
        return;
    }

    const isValidPassword = await verifyPassword(user.password, password);
    if(isValidPassword) {
        return user.userID;
    }
}

export const POST = async ({ request }) => {
    const { email, password } = await request.json();
    // Validate all inputs
    if(!email || !password) {
        return {
            message: 'Error, Provide valid credentials.'
        };
    }
    const userID = await checkUserCredentials(email, password);
    if(!userID) {
        return {
            message: 'Loggin in failed. Please try again.'
        };
    }
    const token = await generateJWT(userID, email);
    return json({token});
}