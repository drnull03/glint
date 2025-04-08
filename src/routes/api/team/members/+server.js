import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";
import { SECRET_JWT_KEY } from "$env/static/private";
import jwt from '@tsndr/cloudflare-worker-jwt';
import { redirect } from "@sveltejs/kit";

export const GET = async ({ cookies }) => {
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

    const { data: userTeamData, error: userError } = await supabase
    .from("glint_user")
    .select("teamID")
    .eq("userID", userID)
    .single();

    if (userError) throw userError;


    const { data: teamMembers, error: teamError } = await supabase
    .from("glint_user")
    .select("*")
    .eq("teamID", userTeamData.teamID)
    .neq("userID", userID)
    .order("created_at");

    if(teamError) {
        return json({ status: false, message: "Couldn't get members" });
    }

    return json({ status: true, data: teamMembers });
}
