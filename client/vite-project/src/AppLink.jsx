import { useNavigation } from "./useNavigation.js";

export default function AppLink({ href, onClick, target, ...props }) {
    const { navigate } = useNavigation();

    const handleClick = (event) => {
        onClick?.(event);
        if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey ||
            (target && target !== "_self") ||
            !href.startsWith("/") ||
            href.startsWith("//")
        ) {
            return;
        }

        event.preventDefault();
        navigate(href);
    };

    return <a href={href} onClick={handleClick} target={target} {...props} />;
}
