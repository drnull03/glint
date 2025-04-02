import { supabase } from "$lib/supabaseClient";
import { json } from "@sveltejs/kit";

export const GET = async () => {
    const { data, error } = await supabase
    .from("glint_space")
    .select("*")
    .eq("userID", 1);

    if(error) {
        return json({ status: false, message: "Couldn't get spaces" });
    }

    return json({ status: true, data });
}