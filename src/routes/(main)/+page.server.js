import { supabase } from "$lib/supabaseClient";
import { redirect } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
export const load = async ({ cookies, fetch }) => {
    const token = cookies.get("token");
    if(!token) {
        throw redirect(302, "/login");
    }

    const verifiedToken = await jwt.verify(token, SECRET_JWT_KEY);
    const userData = verifiedToken.payload;
    const userID = userData.userID;
    const email = userData.email;

    const { data, error } = await supabase
    .from("glint_user")
    .select("userID")
    .eq("userID", userID)
    .single();

    if (error || !data) {
        cookies.delete("token", { path: "/" });
        throw redirect(302, "/login");
    }

    const spacesRes = await fetch("../api/space");
    const spacesJSON = await spacesRes.json();
    const spaces = spacesJSON.data;
    
    return { spaces, email };
}