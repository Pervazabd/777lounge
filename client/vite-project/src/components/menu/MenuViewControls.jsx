import { useLanguage } from "../../useLanguage.js";

export default function MenuViewControls({ category, view, onViewChange }) {
    const { t } = useLanguage();

    return (
        <div
            id={category.id === "hookah" ? "hookah" : undefined}
            className="mb-7 mt-9 flex scroll-mt-8 flex-col gap-5 sm:mb-9 sm:mt-12 sm:flex-row sm:items-end sm:justify-between"
        >
            <div>
                <h2 className="text-2xl font-light tracking-wide sm:text-3xl">{category.label}</h2>
                <p className="mt-2 text-xs text-white/40">
                    {t("menu.productCount", { count: category.items.length })}
                </p>
            </div>
            <div className="flex items-center justify-between gap-3 sm:justify-end">
                <span className="text-xs text-white/45">{t("menu.view")}</span>
                <div className="flex rounded-xl border border-white/10 bg-white/[0.03] p-1" aria-label={t("menu.view")}>
                    <button
                        type="button"
                        onClick={() => onViewChange("grid")}
                        aria-pressed={view === "grid"}
                        aria-label={t("menu.gridLabel")}
                        title={t("menu.gridLabel")}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${view === "grid" ? "bg-[#c9a24d] text-black" : "text-white/60 hover:text-white"}`}
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
                        onClick={() => onViewChange("list")}
                        aria-pressed={view === "list"}
                        aria-label={t("menu.listLabel")}
                        title={t("menu.listLabel")}
                        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors ${view === "list" ? "bg-[#c9a24d] text-black" : "text-white/60 hover:text-white"}`}
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
    );
}
