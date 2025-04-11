import { supabase } from "$lib/supabaseClient";

export const load = async ({ params }) => {
    const { sharedURL } = params;

    const { data: spaceData, error: spaceError } = await supabase
    .from("glint_space")
    .select('created_at, name, content, userID')
    .eq("sharedURL", sharedURL)
    .single();

    if (spaceError || !spaceData) {
        return null;
    }
    
    const { data: userData, error: userError } = await supabase
    .from("glint_user")
    .select('name')
    .eq("userID", spaceData.userID)
    .single();
    
    if (userError || !userData) {
        return null;
    }
    
    return { spaceData, userData };
}