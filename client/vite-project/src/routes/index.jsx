import Layout from "../layout/clinet/layout.jsx";
import Home from "../pages/Home.jsx";
import NotFound from "../pages/NotFound.jsx";
import Map from "../pages/Map.jsx";
import Admin from "../pages/Admin.jsx";

const routes = [
    { path: "/admin/*", element: <Admin /> },
    {
        path: "/",
        element: <Layout />,
        children: [
            { index: true, element: <Home /> },
            { path: "map", element: <Map /> },
            { path: "*", element: <NotFound /> },
        ],
    },
];

export default routes;