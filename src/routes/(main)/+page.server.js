// import { supabase } from "$lib/supabaseClient";
// import { redirect } from "@sveltejs/kit";
// import { SECRET_JWT_KEY } from "$env/static/private";
// import jwt from '@tsndr/cloudflare-worker-jwt';
// export const load = async ({ cookies }) => {
//     const token = cookies.get("token");
//     if(!token) {
//         throw redirect(302, "/login");
//     }

//     const verifiedToken = await jwt.verify(token, SECRET_JWT_KEY);
//     const userData = verifiedToken.payload;
//     const userID = userData.userID;
//     const email = userData.email;

//     // const { data, error } = await supabase
//     // .from("tasks")
//     // .select("*")
//     // .eq("userID", userID);


//     // if(error) {
//     //     console.log(error);
//     //     cookies.delete("token", { path: "/" });
//     //     throw redirect(302, "/login");
//     // }

//     const { data, error } = await supabase
//     .from("user")
//     .select("userID")
//     .eq("userID", userID)
//     .single();

//     if (error || !data) {
//         cookies.delete("token", { path: "/" });
//         throw redirect(302, "/login"); // Redirect if user is not found
//     }

//     // const { data: tasksData, error: tasksError } = await supabase
//     // .from("tasks")
//     // .select("*")
//     // .eq("userID", userID);

//     // let { data: notesData, error: notesError } = await supabase
//     // .from("note")
//     // .select(`
//     //     noteID,
//     //     content,
//     //     folder:folderID (folderID)
//     // `)
//     // .eq("folder.userID", userID);

//     const fetchData = async (userID) => {
//         const [
//             { data: notesData, error: notesError },
//             { data: foldersData, error: foldersError },
//         ] = await Promise.all([
//             supabase
//                 .from("note")
//                 .select("*")
//             .eq("userID", userID),
//             supabase
//             .from("folder")
//             .select("*")
//             .eq("userID", userID),
//         ]);
      
//         if (notesError) {
//             console.error("Error fetching notes:", notesError);
//         } else {
//             console.log("Notes data:", notesData);
//         }
      
//         if (foldersError) {
//             console.error("Error fetching folders:", foldersError);
//         } else {
//             console.log("Folders data:", foldersData);
//         }

//         return { notesData, foldersData };
//     };
      
//     let { notesData, foldersData } = await fetchData(userID);
    
//     return {notesData, foldersData, email};
// }

// // export const actions = {
// //     addTask: async ({ request, cookies }) => {
// //         const formData = await request.formData();
// //         const content = formData.get("content");

// //         const token = cookies.get("token");
// //         const verifiedToken = await jwt.verify(token, SECRET_JWT_KEY);
// //         const userData = verifiedToken.payload;
// //         const userID = userData.userID;

// //         const { data, error } = await supabase
// //         .from('tasks')
// //         .insert({ content, userID })
// //         .select("taskID");

// //         if(error) {
// //             // do something, maybe send an error message
// //             return;
// //         }

// //         return data[0].taskID;
// //     }
// // }