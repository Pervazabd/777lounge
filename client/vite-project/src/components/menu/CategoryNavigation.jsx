import { useRef } from "react";
import { useLanguage } from "../../useLanguage.js";

export default function CategoryNavigation({ categories, activeId, onSelect }) {
    const { t } = useLanguage();
    const scrollRef = useRef(null);

    const scrollCategories = (direction) => {
        const container = scrollRef.current;
        if (!container) return;

        const firstTab = container.querySelector("button[data-category-tab]");
        const step = firstTab ? firstTab.getBoundingClientRect().width + 12 : 150;
        container.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    const selectCategory = (category) => {
        onSelect(category.id);
        const container = scrollRef.current;
        const button = container?.querySelector(`[data-category-id="${category.id}"]`);
        if (!container || !button) return;

        const left = button.getBoundingClientRect().left
            - container.getBoundingClientRect().left
            + container.scrollLeft;
        container.scrollTo({ left, behavior: "smooth" });
    };

    if (categories.length <= 1) return null;

    return (
        <nav
            aria-label={t("menu.categories")}
            className="mt-10 flex min-w-0 items-center gap-2 sm:mt-14 sm:gap-3"
        >
            <button
                type="button"
                onClick={() => scrollCategories(-1)}
                aria-label="Əvvəlki kateqoriyalar"
                title="Əvvəlki kateqoriyalar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/75 transition hover:border-[#c9a24d]/60 hover:bg-[#c9a24d]/10 hover:text-[#c9a24d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24d]"
            >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div ref={scrollRef} className="no-scrollbar min-w-0 flex-1 overflow-x-auto scroll-smooth">
                <ul className="flex w-max min-w-full items-center gap-2 border-b border-white/10 sm:gap-3">
                    {categories.map((category) => {
                        const isActive = category.id === activeId;

                        return (
                            <li key={category.id} className="shrink-0">
                                <button
                                    type="button"
                                    data-category-tab
                                    data-category-id={category.id}
                                    onClick={() => selectCategory(category)}
                                    aria-pressed={isActive}
                                    className={`relative whitespace-nowrap rounded-t-lg px-4 py-3 text-xs font-medium transition-colors sm:px-5 sm:py-4 sm:text-sm ${isActive
                                        ? "bg-[#c9a24d]/[0.08] text-[#c9a24d]"
                                        : "text-white/55 hover:text-white"
                                        }`}
                                >
                                    {category.label}
                                    <span
                                        className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#c9a24d] transition-opacity ${isActive ? "opacity-100" : "opacity-0"
                                            }`}
                                    />
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <button
                type="button"
                onClick={() => scrollCategories(1)}
                aria-label="Növbəti kateqoriyalar"
                title="Növbəti kateqoriyalar"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white/75 transition hover:border-[#c9a24d]/60 hover:bg-[#c9a24d]/10 hover:text-[#c9a24d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24d]"
            >
                <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>
        </nav>
    );
}
