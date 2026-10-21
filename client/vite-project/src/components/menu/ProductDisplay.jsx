
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../useLanguage.js";

const formatPrice = (price) => `${price} TL`;

function ProductImage({ item, compact = false }) {
    const { t } = useLanguage();
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        setImageError(false);
    }, [item.image]);

    return (
        <div
            className={`group/image relative shrink-0 overflow-hidden bg-[#171613] ${compact
                    ? "h-28 w-28 rounded-2xl sm:h-36 sm:w-40"
                    : "aspect-[4/3] w-full rounded-t-[1.4rem]"
                }`}
        >
            {!imageError && item.image ? (
                <img
                    src={item.image}
                    alt={item.imageAlt || item.name}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover/image:scale-110"
                />
            ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-[#c9a24d]/40">
                    <span className="text-4xl">✳</span>
                    <span className="text-[10px] uppercase tracking-[0.2em]">
                        {t("menu.unavailableImage")}
                    </span>
                </div>
            )}

            {!compact && (
                <>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/10 opacity-80 transition-opacity duration-500 group-hover/image:opacity-50" />
                    <div className="pointer-events-none absolute inset-0 border-b border-white/5" />
                    <div className="absolute bottom-4 left-4 h-px w-10 bg-[#c9a24d] transition-all duration-500 group-hover/image:w-20" />
                </>
            )}
        </div>
    );
}

function ProductTags({ tags }) {
    if (!tags?.length) return null;

    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
                <span
                    key={tag}
                    className="rounded-full border border-[#c9a24d]/20 bg-[#c9a24d]/[0.06] px-3 py-1.5 text-[10px] tracking-wide text-[#d8bd80] transition-colors duration-300 hover:border-[#c9a24d]/50 hover:bg-[#c9a24d]/10"
                >
                    {tag}
                </span>
            ))}
        </div>
    );
}

function ProductCard({ item, onSelect, index = 0 }) {
    return (
        <article
            aria-label={`${item.name} — ${formatPrice(item.price)}`}
            className="group relative w-full cursor-pointer rounded-[1.4rem] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24d]"
            style={{
                animation: "productReveal 650ms cubic-bezier(0.2, 0.7, 0.2, 1) both",
                animationDelay: `${Math.min(index, 10) * 75}ms`,
            }}
            onClick={() => onSelect(item)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(item);
                }
            }}
            role="button"
            tabIndex={0}
        >
            <div className="absolute -inset-px rounded-[1.45rem] bg-gradient-to-br from-[#c9a24d]/35 via-transparent to-[#c9a24d]/10 opacity-0 blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative h-full overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[#11110f] transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:border-[#c9a24d]/35 group-hover:shadow-[0_20px_55px_-25px_rgba(201,162,77,0.3)]">
                <ProductImage item={item} />

                <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                        <h3 className="min-w-0 text-sm font-medium leading-6 text-white/90 transition-colors duration-300 group-hover:text-[#e5ca8a] sm:text-base">
                            {item.name}
                        </h3>

                        <span className="shrink-0 rounded-lg border border-[#c9a24d]/20 bg-[#c9a24d]/[0.07] px-2.5 py-1.5 text-sm font-semibold text-[#d7b86c] transition-all duration-300 group-hover:border-[#c9a24d]/50 group-hover:bg-[#c9a24d]/15">
                            {formatPrice(item.price)}
                        </span>
                    </div>

                    <p className="mt-3 line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-white/45 transition-colors duration-300 group-hover:text-white/65">
                        {item.desc}
                    </p>

                    <ProductTags tags={item.tags} />

                    <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-white/30 transition-colors duration-300 group-hover:text-[#c9a24d]/70">
                            {item.categoryName || ""}
                        </span>

                        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-[#c9a24d] transition-all duration-300 group-hover:border-[#c9a24d]/40 group-hover:bg-[#c9a24d] group-hover:text-black">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
                                aria-hidden="true"
                            >
                                <path
                                    d="M5 12h14m-6-6 6 6-6 6"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </article>
    );
}

function ProductListItem({ item, onSelect, index = 0 }) {
    return (
        <article
            aria-label={`${item.name} — ${formatPrice(item.price)}`}
            className="group relative flex w-full cursor-pointer gap-4 rounded-2xl border border-white/[0.08] bg-[#11110f] p-3 text-left transition-all duration-400 hover:-translate-y-0.5 hover:border-[#c9a24d]/35 hover:bg-[#171613] hover:shadow-[0_12px_35px_-22px_rgba(201,162,77,0.3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24d] sm:gap-5 sm:p-4"
            style={{
                animation: "productReveal 550ms ease-out both",
                animationDelay: `${Math.min(index, 10) * 55}ms`,
            }}
            onClick={() => onSelect(item)}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(item);
                }
            }}
            role="button"
            tabIndex={0}
        >
            <ProductImage item={item} compact />

            <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                    <h3 className="text-sm font-medium leading-6 text-white/90 transition-colors group-hover:text-[#e5ca8a] sm:text-base">
                        {item.name}
                    </h3>

                    <span className="shrink-0 text-sm font-semibold text-[#d7b86c] sm:text-base">
                        {formatPrice(item.price)}
                    </span>
                </div>

                <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/45 transition-colors group-hover:text-white/65 sm:text-sm sm:leading-6">
                    {item.desc}
                </p>

                <ProductTags tags={item.tags} />
            </div>
        </article>
    );
}

function ProductDetailsModal({ item, onClose }) {
    const { t } = useLanguage();
    const closeButtonRef = useRef(null);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        const closeOnEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        window.addEventListener("keydown", closeOnEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", closeOnEscape);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 p-0 backdrop-blur-md sm:items-center sm:p-5"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            style={{ animation: "modalBackdrop 250ms ease-out both" }}
        >
            <section
                aria-labelledby="product-details-title"
                aria-modal="true"
                className="relative max-h-[94dvh] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-t-[2rem] border border-white/10 bg-[#11110f] text-white shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:max-h-[90vh] sm:rounded-[2rem]"
                role="dialog"
                style={{ animation: "modalReveal 350ms cubic-bezier(0.2,0.8,0.2,1) both" }}
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="group/modal relative h-56 overflow-hidden sm:h-80">
                    {item.image ? (
                        <img
                            src={item.image}
                            alt={item.imageAlt || item.name}
                            className="h-full w-full object-cover transition-transform duration-1000 group-hover/modal:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-[#191713] text-5xl text-[#c9a24d]/40">
                            ✳
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#11110f] via-black/10 to-black/35" />

                    <div className="absolute left-6 top-6 flex items-center gap-2 sm:left-8 sm:top-8">
                        <span className="h-px w-8 bg-[#c9a24d]" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[#e2c784]">
                            {item.categoryName || ""}
                        </span>
                    </div>

                    <button
                        ref={closeButtonRef}
                        aria-label={t("menu.closeProductDetails")}
                        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 text-2xl text-white backdrop-blur-md transition-all duration-300 hover:rotate-90 hover:border-[#c9a24d]/60 hover:bg-[#c9a24d] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24d] sm:right-6 sm:top-6"
                        onClick={onClose}
                        type="button"
                    >
                        ×
                    </button>
                </div>

                <div className="px-5 pb-7 pt-1 sm:px-9 sm:pb-9">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <h2
                            className="max-w-lg text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl"
                            id="product-details-title"
                        >
                            {item.name}
                        </h2>

                        <span className="rounded-xl border border-[#c9a24d]/30 bg-[#c9a24d]/[0.08] px-4 py-2.5 text-base font-semibold text-[#e0c47c] shadow-[0_0_25px_rgba(201,162,77,0.06)]">
                            {formatPrice(item.price)}
                        </span>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center gap-3">
                            <span className="h-px w-6 bg-[#c9a24d]" />
                            <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
                                {t("menu.productDescription")}
                            </h3>
                        </div>

                        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/65">
                            {item.desc}
                        </p>
                    </div>

                    {item.tags?.length > 0 && (
                        <div className="mt-7">
                            <div className="flex items-center gap-3">
                                <span className="h-px w-6 bg-[#c9a24d]" />
                                <h3 className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/45">
                                    {t("menu.productIngredients")}
                                </h3>
                            </div>

                            <ProductTags tags={item.tags} />
                        </div>
                    )}

                    <p className="mt-8 border-t border-white/[0.08] pt-5 text-xs leading-6 text-white/35">
                        {t("menu.productDetailsDisclaimer")}
                    </p>

                    <button
                        type="button"
                        onClick={onClose}
                        className="mt-5 w-full rounded-xl border border-[#c9a24d]/30 bg-[#c9a24d]/[0.07] px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#e0c47c] transition-all duration-300 hover:border-[#c9a24d] hover:bg-[#c9a24d] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a24d]"
                    >
                        {t("menu.closeProductDetails")}
                    </button>
                </div>
            </section>
        </div>
    );
}

export default function ProductDisplay({ items = [], view = "grid" }) {
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        if (!selectedProduct) return undefined;

        const handlePopState = () => setSelectedProduct(null);

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, [selectedProduct]);

    return (
        <>
            <style>{`
                @keyframes productReveal {
                    from {
                        opacity: 0;
                        transform: translateY(18px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes modalBackdrop {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes modalReveal {
                    from {
                        opacity: 0;
                        transform: translateY(22px) scale(0.985);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .product-motion,
                    .menu-fade-up {
                        animation: none !important;
                        transition: none !important;
                    }
                }
            `}</style>

            <div
                key={view}
                className={
                    view === "grid"
                        ? "menu-fade-up grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
                        : "menu-fade-up grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4"
                }
            >
                {items.map((item, index) =>
                    view === "grid" ? (
                        <ProductCard
                            key={item.id || item.name}
                            item={item}
                            index={index}
                            onSelect={setSelectedProduct}
                        />
                    ) : (
                        <ProductListItem
                            key={item.id || item.name}
                            item={item}
                            index={index}
                            onSelect={setSelectedProduct}
                        />
                    )
                )}
            </div>

            {selectedProduct && (
                <ProductDetailsModal
                    item={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                />
            )}
        </>
    );
}
