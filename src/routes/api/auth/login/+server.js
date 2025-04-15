import { supabase } from "$lib/supabaseClient";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { json, redirect } from "@sveltejs/kit";
import { verifyPassword } from "$lib/auth";

const generateJWT = async (userID, email) => {
    const token = await jwt.sign({
        userID: userID,
        email: email
    }, SECRET_JWT_KEY);
    return token;
}

const checkUserCredentials = async (email, password) => {
    const { data: user, error } = await supabase
    .from('glint_user')
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
    if(!email || !password) {
        return json({ status: false, message: 'Error, Provide valid credentials.' });
    }
    const userID = await checkUserCredentials(email, password);
    if(!userID) {
        return json({ status: false, message: 'Log in failed' });
    }
    const token = await generateJWT(userID, email);
    return json({ status: true, data: token });
}