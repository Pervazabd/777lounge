import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../useLanguage.js";
import { getMenuItems } from "../services/menu.js";

const HOOKAH_CATEGORY_ID = "nargile";
const formatPrice = (price) => `${price} TL`;

function ProductImage({ item, compact = false }) {
    const { t } = useLanguage();
    const [imageError, setImageError] = useState(false);

    return (
        <div
            className={`relative shrink-0 overflow-hidden bg-white/[0.04] ${compact
                ? "h-24 w-24 rounded-xl sm:h-28 sm:w-32"
                : "aspect-[4/3] w-full rounded-t-2xl"
                }`}
        >
            {!imageError ? (
                <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/25">
                    <span className="text-3xl">✳</span>
                    <span className="text-[10px] tracking-widest">{t("menu.unavailableImage")}</span>
                </div>
            )}

            {!compact && (
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            )}
        </div>
    );
}

function ProductTags({ tags }) {
    if (!tags?.length) return null;

    return (
        <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="rounded-full border border-[#c9a24d]/25 bg-[#c9a24d]/[0.06] px-2.5 py-1 text-[10px] text-[#c9a24d]/90"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

function ProductCard({ item }) {
    return (
        <article className="group overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111111] transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a24d]/40">
            <ProductImage item={item} />

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-medium leading-relaxed text-white transition-colors group-hover:text-[#c9a24d] sm:text-base">
                        {item.name}
                    </h3>

                    <span className="shrink-0 text-sm font-medium text-[#c9a24d]">
                        {formatPrice(item.price)}
                    </span>
                </div>

                <p className="mt-2 min-h-10 text-sm leading-6 text-white/50">
                    {item.desc}
                </p>

                <ProductTags tags={item.tags} />
            </div>
        </article>
    );
}

function ProductListItem({ item }) {
    return (
        <article className="group flex gap-4 rounded-2xl border border-white/[0.08] bg-[#111111] p-3 transition-colors hover:border-[#c9a24d]/40 sm:gap-5 sm:p-4">
            <ProductImage item={item} compact />

            <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <h3 className="text-sm font-medium leading-6 text-white transition-colors group-hover:text-[#c9a24d] sm:text-base">
                        {item.name}
                    </h3>

                    <span className="shrink-0 text-sm font-medium text-[#c9a24d] sm:text-base">
                        {formatPrice(item.price)}
                    </span>
                </div>

                <p className="mt-1 text-xs leading-5 text-white/50 sm:text-sm sm:leading-6">
                    {item.desc}
                </p>

                <ProductTags tags={item.tags} />
            </div>
        </article>
    );
}

export default function Menu({ categoryId = null }) {
    const { t } = useLanguage();
    const [categories, setCategories] = useState([]);
    const [activeId, setActiveId] = useState("");
    const [view, setView] = useState("grid");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const categoryScrollRef = useRef(null);

    const scrollCategories = (direction) => {
        const container = categoryScrollRef.current;
        if (!container) return;

        // Her klikdə təxminən bir tab eni qədər sürüşdür.
        const firstTab = container.querySelector("button[data-category-tab]");
        const step = firstTab ? firstTab.getBoundingClientRect().width + 12 : 150;
        container.scrollBy({ left: direction * step, behavior: "smooth" });
    };

    useEffect(() => {
        const controller = new AbortController();

        getMenuItems(controller.signal)
            .then((items) => {
                const categoryMap = new Map();

                for (const item of items) {
                    let category = categoryMap.get(item.category);

                    if (!category) {
                        category = {
                            id: item.category,
                            label: item.categoryName,
                            categoryOrder: item.categoryOrder,
                            items: [],
                        };
                        categoryMap.set(item.category, category);
                    }

                    category.items.push({
                        name: item.name,
                        desc: item.description,
                        price: item.price,
                        image: item.image.url,
                        tags: item.ingredients,
                        itemOrder: item.itemOrder,
                    });
                }

                const loadedCategories = [...categoryMap.values()]
                    .sort((a, b) => a.categoryOrder - b.categoryOrder)
                    .map((category) => ({
                        ...category,
                        items: category.items.sort((a, b) => a.itemOrder - b.itemOrder),
                    }));

                const visibleCategories = categoryId
                    ? loadedCategories.filter((category) => category.id === categoryId)
                    : loadedCategories.filter((category) => category.id !== HOOKAH_CATEGORY_ID);

                setCategories(visibleCategories);
                const hashId = window.location.hash.slice(1);
                setActiveId(
                    visibleCategories.some((category) => category.id === hashId)
                        ? hashId
                        : visibleCategories[0]?.id ?? "",
                );
            })
            .catch((error) => {
                if (error.name !== "AbortError") {
                    console.error("Could not load menu products:", error);
                    setLoadError(true);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) setLoading(false);
            });

        return () => controller.abort();
    }, [categoryId]);

    const active = categories.find((category) => category.id === activeId);

    useEffect(() => {
        const syncCategoryWithHash = () => {
            const hashId = window.location.hash.slice(1);
            if (!categories.some((category) => category.id === hashId)) return;

            setActiveId(hashId);
            requestAnimationFrame(() => {
                document.getElementById(hashId)?.scrollIntoView({ block: "start" });
            });
        };

        syncCategoryWithHash();
        window.addEventListener("hashchange", syncCategoryWithHash);
        return () => window.removeEventListener("hashchange", syncCategoryWithHash);
    }, [categories, categoryId]);

    return (
        <section
            id={categoryId === HOOKAH_CATEGORY_ID ? "hookah-menu" : "menu"}
            className="relative min-h-screen overflow-hidden bg-[#0a0a0a] pb-20 pt-28 text-white sm:pt-36 sm:pb-24"
        >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_at_top,rgba(201,162,77,0.12),transparent_70%)]" />

            <style>{`
        @keyframes menuFadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .menu-fade-up {
          animation: menuFadeUp .35s ease both;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .menu-fade-up { animation: none; }
        }
      `}</style>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <header className="text-center">
                    <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a24d] sm:text-xs sm:tracking-[0.5em]">
                        {t(categoryId === HOOKAH_CATEGORY_ID ? "hookah.eyebrow" : "menu.eyebrow")}
                    </p>

                    <h1 className="mt-4 text-4xl font-extralight uppercase tracking-[0.14em] sm:text-6xl md:text-7xl">
                        {t(categoryId === HOOKAH_CATEGORY_ID ? "hookah.title" : "menu.title")}
                    </h1>

                    <div className="mt-5 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/45 sm:gap-4 sm:text-[10px] sm:tracking-[0.3em]">
                        <span className="h-px w-7 bg-white/25 sm:w-10" />
                        {t(categoryId === HOOKAH_CATEGORY_ID ? "hookah.tagline" : "menu.tagline")}
                        <span className="h-px w-7 bg-white/25 sm:w-10" />
                    </div>
                </header>

                {loading ? (
                    <p role="status" className="mt-12 text-center text-sm text-white/50">
                        {t("menu.loading")}
                    </p>
                ) : loadError ? (
                    <p role="alert" className="mt-12 text-center text-sm text-white/50">
                        {t("menu.loadError")}
                    </p>
                ) : active ? (
                    <>
                        {categories.length > 1 && (
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

                                <div
                                    ref={categoryScrollRef}
                                    className="no-scrollbar min-w-0 flex-1 overflow-x-auto scroll-smooth"
                                >
                                    <ul className="flex w-max min-w-full items-center gap-2 border-b border-white/10 sm:gap-3">
                                        {categories.map((category) => {
                                            const isActive = category.id === activeId;

                                            return (
                                                <li key={category.id} className="shrink-0">
                                                    <button
                                                        type="button"
                                                        data-category-tab
                                                        onClick={() => {
                                                            setActiveId(category.id);
                                                            const container = categoryScrollRef.current;
                                                            const button = container?.querySelector(`[data-category-id="${category.id}"]`);
                                                            if (container && button) {
                                                                const left = button.getBoundingClientRect().left - container.getBoundingClientRect().left + container.scrollLeft;
                                                                container.scrollTo({ left, behavior: "smooth" });
                                                            }
                                                        }}
                                                        data-category-id={category.id}
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
                        )}

                        <div
                            id={active.id === "hookah" ? "hookah" : undefined}
                            className="mb-7 mt-9 flex scroll-mt-8 flex-col gap-5 sm:mb-9 sm:mt-12 sm:flex-row sm:items-end sm:justify-between"
                        >
                            <div>
                                <h2 className="text-2xl font-light tracking-wide sm:text-3xl">
                                    {active.label}
                                </h2>
                                <p className="mt-2 text-xs text-white/40">
                                    {t("menu.productCount", { count: active.items.length })}
                                </p>
                            </div>

                            <div className="flex items-center justify-between gap-3 sm:justify-end">
                                <span className="text-xs text-white/45">{t("menu.view")}</span>

                                <div
                                    className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1"
                                    aria-label={t("menu.view")}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setView("grid")}
                                        aria-pressed={view === "grid"}
                                        aria-label={t("menu.gridLabel")}
                                        title={t("menu.gridLabel")}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${view === "grid"
                                            ? "bg-[#c9a24d] text-black"
                                            : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                                            <rect x="2" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                            <rect x="12" y="2" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                            <rect x="2" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                            <rect x="12" y="12" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                        </svg>
                                        {t("menu.grid")}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setView("list")}
                                        aria-pressed={view === "list"}
                                        aria-label={t("menu.listLabel")}
                                        title={t("menu.listLabel")}
                                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${view === "list"
                                            ? "bg-[#c9a24d] text-black"
                                            : "text-white/60 hover:text-white"
                                            }`}
                                    >
                                        <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" aria-hidden="true">
                                            <path
                                                d="M7 4H18M7 10H18M7 16H18M2.5 4H2.6M2.5 10H2.6M2.5 16H2.6"
                                                stroke="currentColor"
                                                strokeWidth="1.7"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        {t("menu.list")}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            key={`${active.id}-${view}`}
                            className={
                                view === "grid"
                                    ? "menu-fade-up grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6"
                                    : "menu-fade-up grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4"
                            }
                        >
                            {active.items.map((item) =>
                                view === "grid" ? (
                                    <ProductCard key={item.name} item={item} />
                                ) : (
                                    <ProductListItem key={item.name} item={item} />
                                )
                            )}
                        </div>
                    </>
                ) : (
                    <p role="status" className="mt-12 text-center text-sm text-white/50">
                        {t("menu.empty")}
                    </p>
                )}

                <footer className="mt-14 border-t border-white/[0.08] pt-6 text-center sm:mt-20">
                    <p className="text-[10px] leading-6 tracking-wide text-white/35 sm:text-xs">
                        {t("menu.disclaimer")}
                    </p>
                </footer>
            </div>
        </section>
    );
}
