import { redirect } from "@sveltejs/kit";
export const load = ({ cookies }) => {
    cookies.delete("token", { path: "/" });
    throw redirect(302, "/login");
}