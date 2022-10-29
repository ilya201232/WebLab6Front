import LogInPage from "@/pages/LogInPage";
import { createRouter, createWebHashHistory } from "vue-router";
import AdminPage from "@/pages/AdminPage";
import ClientPage from "@/pages/ClientPage";


const routes = [
    {path: "/", name: 'Log In', component: LogInPage},
    {path: "/admin", name: "Admin", component: AdminPage},
    {path: "/clients/:username", name: "Client", component: ClientPage},
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router;
