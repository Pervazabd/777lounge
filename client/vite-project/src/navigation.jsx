import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { NavigationContext } from "./navigation-context.js";

function readLocation() {
    return {
        pathname: window.location.pathname.replace(/\/+$/, "") || "/",
        hash: window.location.hash,
    };
}

export function NavigationProvider({ children }) {
    const [location, setLocation] = useState(readLocation);

    const navigate = useCallback((to) => {
        const nextUrl = new URL(to, window.location.href);
        if (nextUrl.origin !== window.location.origin) return;

        const nextLocation = {
            pathname: nextUrl.pathname.replace(/\/+$/, "") || "/",
            hash: nextUrl.hash,
        };
        const currentLocation = readLocation();

        if (
            currentLocation.pathname === nextLocation.pathname &&
            currentLocation.hash === nextLocation.hash &&
            window.location.search === nextUrl.search
        ) {
            if (nextLocation.hash) {
                document.getElementById(nextLocation.hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
            return;
        }

        window.history.pushState(null, "", `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`);
        setLocation(nextLocation);
    }, []);

    useLayoutEffect(() => {
        const previousScrollRestoration = window.history.scrollRestoration;
        window.history.scrollRestoration = "manual";
        const syncLocation = () => setLocation(readLocation());
        window.addEventListener("popstate", syncLocation);
        return () => {
            window.removeEventListener("popstate", syncLocation);
            window.history.scrollRestoration = previousScrollRestoration;
        };
    }, []);

    useLayoutEffect(() => {
        const frame = window.requestAnimationFrame(() => {
            const prefersReducedMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)",
            ).matches;
            const behavior = prefersReducedMotion ? "instant" : "smooth";

            if (location.hash) {
                document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior });
            } else {
                window.scrollTo({ top: 0, behavior });
            }
        });

        return () => window.cancelAnimationFrame(frame);
    }, [location]);

    const value = useMemo(() => ({ location, navigate }), [location, navigate]);
    return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}
