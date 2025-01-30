import { supabase } from '$lib/supabaseClient';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
    const { folderID } = params;

    const { data, error } = await supabase
        .from('note')
        .select('*')
        .eq('folderID', folderID);

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return json({notes: data});
}