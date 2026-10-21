import { useLanguage } from "../../useLanguage.js";

export default function MenuHeader({ isHookahMenu }) {
    const { t } = useLanguage();
    const prefix = isHookahMenu ? "hookah" : "menu";

    return (
        <header className="text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#c9a24d] sm:text-xs sm:tracking-[0.5em]">
                {t(`${prefix}.eyebrow`)}
            </p>
            <h1 className="mt-4 text-4xl font-extralight uppercase tracking-[0.14em] sm:text-6xl md:text-7xl">
                {t(`${prefix}.title`)}
            </h1>
            <div className="mt-5 flex items-center justify-center gap-3 text-[9px] uppercase tracking-[0.2em] text-white/45 sm:gap-4 sm:text-[10px] sm:tracking-[0.3em]">
                <span className="h-px w-7 bg-white/25 sm:w-10" />
                {t(`${prefix}.tagline`)}
                <span className="h-px w-7 bg-white/25 sm:w-10" />
            </div>
        </header>
    );
}
