import { useContext } from "react";
import { NavigationContext } from "./navigation-context.js";

export function useNavigation() {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation must be used within a NavigationProvider.");
    }
    return context;
}
