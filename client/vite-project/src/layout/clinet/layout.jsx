import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./navbar.jsx";
import Footer from "./footer.jsx";

function RouteScrollManager() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;
        const behavior = prefersReducedMotion ? "auto" : "smooth";

        if (!hash) {
            window.scrollTo({ top: 0, behavior });
            return;
        }

        const frame = window.requestAnimationFrame(() => {
            document.getElementById(hash.slice(1))?.scrollIntoView({ behavior });
        });

        return () => window.cancelAnimationFrame(frame);
    }, [pathname, hash]);

    return null;
}

const Layout = () => {
    const { pathname } = useLocation();

    return (
        <div>
            <RouteScrollManager />
            <Navbar />
            <div key={pathname} className="page-enter">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;