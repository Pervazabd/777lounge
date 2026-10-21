import { useEffect, useState } from "react";
import { useLanguage } from "../useLanguage.js";
import { getMenuItems } from "../services/menu.js";
import CategoryNavigation from "../components/menu/CategoryNavigation.jsx";
import MenuHeader from "../components/menu/MenuHeader.jsx";
import MenuViewControls from "../components/menu/MenuViewControls.jsx";
import ProductDisplay from "../components/menu/ProductDisplay.jsx";

const HOOKAH_CATEGORY_ID = "nargile";

function groupMenuItems(items) {
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
            id: item._id,
            name: item.name,
            desc: item.description,
            price: item.price,
            currency: item.currency,
            image: item.image.url,
            imageAlt: item.image.alt,
            tags: item.ingredients,
            categoryName: item.categoryName,
            itemOrder: item.itemOrder,
        });
    }

    return [...categoryMap.values()]
        .sort((a, b) => a.categoryOrder - b.categoryOrder)
        .map((category) => ({
            ...category,
            items: category.items.sort((a, b) => a.itemOrder - b.itemOrder),
        }));
}

export default function Menu({ categoryId = null }) {
    const { t } = useLanguage();
    const [categories, setCategories] = useState([]);
    const [activeId, setActiveId] = useState("");
    const [view, setView] = useState("grid");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        getMenuItems(controller.signal)
            .then((items) => {
                const loadedCategories = groupMenuItems(items);
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

    const activeCategory = categories.find((category) => category.id === activeId);

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
                .menu-fade-up { animation: menuFadeUp .35s ease both; }
                @keyframes hookahComingSoon {
                  from { opacity: 0; transform: translateY(18px) scale(.96); }
                  to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .hookah-coming-soon {
                  animation: hookahComingSoon 900ms cubic-bezier(.22, 1, .36, 1) both;
                  text-shadow: 0 0 24px rgba(201, 162, 77, .32);
                }
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                @media (prefers-reduced-motion: reduce) {
                  .menu-fade-up, .hookah-coming-soon { animation: none; }
                }
            `}</style>

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <MenuHeader isHookahMenu={categoryId === HOOKAH_CATEGORY_ID} />

                {loading ? (
                    <p role="status" className="mt-12 text-center text-sm text-white/50">
                        {t("menu.loading")}
                    </p>
                ) : loadError ? (
                    <p role="alert" className="mt-12 text-center text-sm text-white/50">
                        {t("menu.loadError")}
                    </p>
                ) : activeCategory ? (
                    <>
                        <CategoryNavigation
                            categories={categories}
                            activeId={activeId}
                            onSelect={setActiveId}
                        />
                        <MenuViewControls
                            category={activeCategory}
                            view={view}
                            onViewChange={setView}
                        />
                        <ProductDisplay items={activeCategory.items} view={view} />
                    </>
                ) : categoryId === HOOKAH_CATEGORY_ID ? (
                    <div className="flex min-h-56 items-center justify-center py-12 text-center sm:min-h-72">
                        <p
                            role="status"
                            className="hookah-coming-soon font-serif text-5xl font-light tracking-wide text-[#e8d6b5] sm:text-7xl lg:text-8xl"
                        >
                            {t("hookah.comingSoon")}
                        </p>
                    </div>
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
