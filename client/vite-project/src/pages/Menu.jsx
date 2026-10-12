
import { useEffect, useState } from "react";
import { useLanguage } from "../useLanguage.js";

const menuCategories = [
    {
        id: "cold-drinks",
        label: "Soğuk İçecekler",
        labelEn: "Cold Drinks",
        items: [
            {
                name: "Buzlu Latte",
                desc: "Espresso, soğuk süt ve buz.",
                nameEn: "Iced Latte",
                descEn: "Espresso, cold milk and ice.",
                price: 6.5,
                image: "/images/menu/buzlu-latte.jpg",
            },
            {
                name: "Ice Americano",
                desc: "Çift espresso, soğuk su ve buz.",
                descEn: "Double espresso, cold water and ice.",
                price: 5.5,
                image: "/images/menu/ice-americano.jpg",
            },
            {
                name: "Limonata",
                desc: "Taze limon, nane ve şeker şurubu.",
                nameEn: "Lemonade",
                descEn: "Fresh lemon, mint and sugar syrup.",
                price: 5,
                image: "/images/menu/limonata.jpg",
            },
            {
                name: "Alkolsüz Mojito",
                desc: "Misket limonu, nane, soda ve buz.",
                nameEn: "Virgin Mojito",
                descEn: "Lime, mint, soda water and ice.",
                price: 7,
                image: "/images/menu/mojito.jpg",
            },
            {
                name: "Taze Meyve Suyu",
                desc: "Portakal, elma veya nar seçenekleri.",
                nameEn: "Fresh Juice",
                descEn: "Choose from orange, apple or pomegranate.",
                price: 6,
                image: "/images/menu/meyve-suyu.jpg",
            },
            {
                name: "Smoothie",
                desc: "Çilek, muz ve süt ile hazırlanır.",
                descEn: "Made with strawberries, banana and milk.",
                price: 8,
                image: "/images/menu/smoothie.jpg",
            },
        ],
    },
    {
        id: "hot-drinks",
        label: "Sıcak İçecekler",
        labelEn: "Hot Drinks",
        items: [
            {
                name: "Espresso",
                desc: "Yoğun aromalı, klasik İtalyan kahvesi.",
                descEn: "A rich, classic Italian coffee.",
                price: 3.5,
                image: "/images/menu/espresso.jpg",
            },
            {
                name: "Cappuccino",
                desc: "Espresso, buharda ısıtılmış süt ve süt köpüğü.",
                descEn: "Espresso with steamed milk and milk foam.",
                price: 5,
                image: "/images/menu/cappuccino.jpg",
            },
            {
                name: "Latte",
                desc: "Espresso ve yumuşak süt köpüğü.",
                descEn: "Espresso with smooth, steamed milk.",
                price: 5.5,
                image: "/images/menu/latte.jpg",
            },
            {
                name: "Türk Kahvesi",
                desc: "Geleneksel yöntemle hazırlanan Türk kahvesi.",
                nameEn: "Turkish Coffee",
                descEn: "Turkish coffee prepared using the traditional method.",
                price: 4,
                image: "/images/menu/turk-kahvesi.jpg",
            },
            {
                name: "Demleme Çay",
                desc: "Geleneksel siyah çay, limon ile servis edilir.",
                nameEn: "Brewed Tea",
                descEn: "Traditional black tea, served with lemon.",
                price: 2.5,
                image: "/images/menu/cay.jpg",
            },
            {
                name: "Sıcak Çikolata",
                desc: "Belçika çikolatası ve krema.",
                nameEn: "Hot Chocolate",
                descEn: "Belgian chocolate and cream.",
                price: 6.5,
                image: "/images/menu/sicak-cikolata.jpg",
            },
        ],
    },
    {
        id: "hot-meals",
        label: "Ana Yemekler",
        labelEn: "Main Courses",
        items: [
            {
                name: "BBQ Kaburga",
                desc: "Yavaş pişirilmiş kaburga, barbekü sosu ve patates.",
                nameEn: "BBQ Ribs",
                descEn: "Slow-cooked ribs with barbecue sauce and potatoes.",
                price: 28,
                image: "/images/menu/bbq-kaburga.jpg",
            },
            {
                name: "Ribeye Steak",
                desc: "250 g dana eti, ızgara sebzeler ve karabiber sosu.",
                descEn: "250 g beef with grilled vegetables and peppercorn sauce.",
                price: 42,
                image: "/images/menu/ribeye-steak.jpg",
            },
            {
                name: "Tavuk Fileto",
                desc: "Izgara tavuk göğsü, patates püresi ve mantar sosu.",
                nameEn: "Chicken Fillet",
                descEn: "Grilled chicken breast with mashed potatoes and mushroom sauce.",
                price: 18,
                image: "/images/menu/tavuk-fileto.jpg",
            },
            {
                name: "Lüle Kebabı",
                desc: "Dana eti, közlenmiş domates, lavaş ve sumak.",
                nameEn: "Lula Kebab",
                descEn: "Beef with roasted tomatoes, lavash and sumac.",
                price: 16,
                image: "/images/menu/lule-kebabi.jpg",
            },
            {
                name: "Tavuklu Alfredo",
                desc: "Fettuccine makarna, krema, parmesan ve tavuk.",
                nameEn: "Chicken Alfredo",
                descEn: "Fettuccine with cream, Parmesan and chicken.",
                price: 15,
                image: "/images/menu/alfredo.jpg",
            },
            {
                name: "Peynirli Patates",
                desc: "Çedar peyniri, çıtır pastırma ve taze soğan.",
                nameEn: "Loaded Cheese Fries",
                descEn: "Cheddar cheese, crispy bacon and fresh spring onions.",
                price: 11,
                image: "/images/menu/peynirli-patates.jpg",
            },
        ],
    },
    {
        id: "desserts",
        label: "Tatlılar",
        labelEn: "Desserts",
        items: [
            {
                name: "Tiramisu",
                desc: "Mascarpone kreması, espresso ve kakao.",
                descEn: "Mascarpone cream, espresso and cocoa.",
                price: 9,
                image: "/images/menu/tiramisu.jpg",
            },
            {
                name: "San Sebastian",
                desc: "Karamel soslu, üzeri kızarmış San Sebastian cheesecake.",
                descEn: "Basque cheesecake with a caramelized top and caramel sauce.",
                price: 10,
                image: "/images/menu/san-sebastian.jpg",
            },
            {
                name: "Napolyon Pastası",
                desc: "Kat kat çıtır hamur ve vanilyalı krema.",
                nameEn: "Napoleon Cake",
                descEn: "Layers of crisp pastry and vanilla cream.",
                price: 8,
                image: "/images/menu/napolyon.jpg",
            },
            {
                name: "Çikolatalı Sufle",
                desc: "Akışkan çikolata dolgusu ve vanilyalı dondurma.",
                nameEn: "Chocolate Soufflé",
                descEn: "A molten chocolate center served with vanilla ice cream.",
                price: 11,
                image: "/images/menu/sufle.jpg",
            },
            {
                name: "Baklava",
                desc: "Geleneksel Bakü baklavası, ceviz ve bal.",
                descEn: "Traditional Baku baklava with walnuts and honey.",
                price: 7,
                image: "/images/menu/baklava.jpg",
            },
        ],
    },
    {
        id: "hookah",
        label: "Nargile",
        labelEn: "Hookah",
        items: [
            {
                name: "Klasik Nargile",
                desc: "Seçtiğiniz tek aroma ile hazırlanır.",
                nameEn: "Classic Hookah",
                descEn: "Prepared with one flavor of your choice.",
                price: 25,
                image: "/images/menu/klasik-nargile.jpg",
                tags: ["Elma", "Nane", "Üzüm", "Karpuz"],
                tagsEn: ["Apple", "Mint", "Grape", "Watermelon"],
            },
            {
                name: "Meyve Karışımı",
                desc: "Karışık meyve aromaları, taze meyve sunumuyla.",
                nameEn: "Fruit Mix",
                descEn: "A blend of fruit flavors, served with fresh fruit.",
                price: 35,
                image: "/images/menu/meyveli-nargile.jpg",
                tags: ["Şeftali", "Ahududu", "Ananas", "Mango"],
                tagsEn: ["Peach", "Raspberry", "Pineapple", "Mango"],
            },
            {
                name: "Buzlu Nane",
                desc: "Serinletici buz ve nane aromalı özel nargile.",
                nameEn: "Icy Mint",
                descEn: "A refreshing hookah with cool ice and mint flavors.",
                price: 32,
                image: "/images/menu/buzlu-nargile.jpg",
                tags: ["Buzlu Nane", "Yaban Mersini", "Limon"],
                tagsEn: ["Icy Mint", "Blueberry", "Lemon"],
            },
            {
                name: "777 İmza",
                desc: "Şefin özel aroma karışımıyla hazırlanan premium nargile.",
                nameEn: "777 Signature",
                descEn: "Premium hookah prepared with the chef's special flavor blend.",
                price: 45,
                image: "/images/menu/777-nargile.jpg",
                tags: ["Özel Karışım", "Premium"],
                tagsEn: ["Special Blend", "Premium"],
            },
        ],
    },
];

const formatPrice = (price) =>
    `${Number.isInteger(price) ? price : price.toFixed(2)} ₼`;

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

export default function Menu() {
    const { language, t } = useLanguage();
    const localizedCategories = menuCategories.map((category) => ({
        ...category,
        label: language === "en" ? category.labelEn : category.label,
        items: category.items.map((item) => ({
            ...item,
            name: language === "en" ? item.nameEn ?? item.name : item.name,
            desc: language === "en" ? item.descEn : item.desc,
            tags: language === "en" ? item.tagsEn ?? item.tags : item.tags,
        })),
    }));
    const [activeId, setActiveId] = useState(() => {
        const hashId = window.location.hash.slice(1);
        return menuCategories.some((category) => category.id === hashId)
            ? hashId
            : localizedCategories[0].id;
    });
    const [view, setView] = useState("grid");

    const active = localizedCategories.find((cat) => cat.id === activeId);

    useEffect(() => {
        const syncCategoryWithHash = () => {
            const hashId = window.location.hash.slice(1);
            if (!menuCategories.some((category) => category.id === hashId)) return;

            setActiveId(hashId);
            requestAnimationFrame(() => {
                document.getElementById(hashId)?.scrollIntoView({ block: "start" });
            });
        };

        syncCategoryWithHash();
        window.addEventListener("hashchange", syncCategoryWithHash);
        return () => window.removeEventListener("hashchange", syncCategoryWithHash);
    }, []);

    return (
        <section
            id="menu"
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
                {/* Sayfa başlığı */}
                <header className="text-center">
                    <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a24d] sm:text-xs sm:tracking-[0.5em]">
                        {t("menu.eyebrow")}
                    </p>

                    <h1 className="mt-4 text-4xl font-extralight uppercase tracking-[0.14em] sm:text-6xl md:text-7xl">
                        {t("menu.title")}
                    </h1>

                    <div className="mt-5 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/45 sm:gap-4 sm:text-[10px] sm:tracking-[0.3em]">
                        <span className="h-px w-7 bg-white/25 sm:w-10" />
                        {t("menu.tagline")}
                        <span className="h-px w-7 bg-white/25 sm:w-10" />
                    </div>
                </header>

                {/* Kategoriler */}
                <nav
                    aria-label={t("menu.categories")}
                    className="no-scrollbar -mx-4 mt-10 overflow-x-auto px-4 sm:mx-0 sm:mt-14 sm:px-0"
                >
                    <ul className="flex min-w-max items-center gap-2 border-b border-white/10 sm:mx-auto sm:w-fit sm:gap-3">
                        {localizedCategories.map((cat) => {
                            const isActive = cat.id === activeId;

                            return (
                                <li key={cat.id}>
                                    <button
                                        type="button"
                                        onClick={() => setActiveId(cat.id)}
                                        aria-pressed={isActive}
                                        className={`relative rounded-t-lg px-4 py-3 text-xs font-medium transition-colors sm:px-5 sm:py-4 sm:text-sm ${isActive
                                                ? "bg-[#c9a24d]/[0.08] text-[#c9a24d]"
                                                : "text-white/55 hover:text-white"
                                            }`}
                                    >
                                        {cat.label}

                                        <span
                                            className={`absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[#c9a24d] transition-opacity ${isActive ? "opacity-100" : "opacity-0"
                                                }`}
                                        />
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Kategori başlığı ve görünüm seçenekleri */}
                <div
                    id={activeId === "hookah" ? "hookah" : undefined}
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
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
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
                                <svg
                                    viewBox="0 0 20 20"
                                    fill="none"
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                >
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

                {/* Ürünler */}
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

                {/* Alt bilgi */}
                <footer className="mt-14 border-t border-white/[0.08] pt-6 text-center sm:mt-20">
                    <p className="text-[10px] leading-6 tracking-wide text-white/35 sm:text-xs">
                        {t("menu.disclaimer")}
                    </p>
                </footer>
            </div>
        </section>
    );
}
