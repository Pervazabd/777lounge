import { useState } from "react";
import loungeLogo from "../../assets/Krom 777 Lounge Logo ve Tüy.png";
import { useLanguage } from "../../useLanguage.js";
import AppLink from "../../AppLink.jsx";

const navLinks = [
    { key: "home", href: "/" },
    { key: "about", href: "/about" },
    { key: "reservations", href: "/rezerv" },
];

export default function Navbar() {
    const { language, setLanguage, t } = useLanguage();
    const [menuOpen, setMenuOpen] = useState(false);
    const languagePicker = (
        <div className="flex items-center gap-1 rounded-full border border-white/20 p-1" aria-label={t("nav.language")}>
            {["tr", "en"].map((option) => (
                <button
                    key={option}
                    type="button"
                    lang={option}
                    aria-pressed={language === option}
                    onClick={() => setLanguage(option)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wider transition-colors ${language === option ? "bg-[#d8c4a0] text-[#11110f]" : "text-white/70 hover:text-white"
                        }`}
                >
                    {option.toUpperCase()}
                </button>
            ))}
        </div>
    );

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="mx-auto flex max-w-[1800px] items-center justify-between px-5 py-5 sm:px-8 lg:px-14 lg:py-7">

                {/* Logo */}
                <AppLink href="/" className="group shrink-0" aria-label="777 Lounge">
                    <img
                        src={loungeLogo}
                        alt="777 Lounge"
                        className="h-10 w-auto transition-opacity duration-300 group-hover:opacity-80 sm:h-12 lg:h-14"
                    />
                </AppLink>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-7 lg:flex xl:gap-9">
                    {navLinks.map((link, index) => (
                        <AppLink
                            key={link.key}
                            href={link.href}
                            className={`group relative py-2 text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300 hover:text-amber-200 xl:text-xs ${index === 0 ? "text-amber-200" : "text-white/90"
                                }`}
                        >
                            {t(`nav.${link.key}`)}
                            <span
                                className={`absolute -bottom-0.5 left-0 h-px w-0 bg-amber-200 transition-all duration-300 group-hover:w-full ${index === 0 ? "w-full" : ""
                                    }`}
                            />
                        </AppLink>
                    ))}
                    {languagePicker}
                </div>


                {/* Mobile Menu Button */}
                <button
                    type="button"
                    aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="relative z-50 flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-white/30 bg-black/10 backdrop-blur-sm lg:hidden"
                >
                    <span
                        className={`h-px w-5 bg-white transition-all duration-300 ${menuOpen ? "translate-y-[4px] rotate-45" : ""
                            }`}
                    />
                    <span
                        className={`h-px bg-white transition-all duration-300 ${menuOpen ? "w-5 -translate-y-[4px] -rotate-45" : "w-3.5"
                            }`}
                    />
                </button>
            </nav>

            {/* Mobile Menu */}
            <div
                className={`absolute inset-x-4 top-full overflow-hidden rounded-2xl border border-white/15 bg-neutral-950/90 shadow-2xl backdrop-blur-2xl transition-all duration-300 lg:hidden ${menuOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-3 opacity-0"
                    }`}
            >
                <div className="p-5">
                    {navLinks.map((link, index) => (
                        <AppLink
                            key={link.key}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-between border-b border-white/10 py-4 text-sm uppercase tracking-[0.18em] text-white/90 transition hover:pl-2 hover:text-amber-200"
                        >
                            <span>{t(`nav.${link.key}`)}</span>
                            <span className="text-amber-200">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </AppLink>
                    ))}
                    <div className="flex justify-end pt-5">
                        {languagePicker}
                    </div>
                </div>
            </div>
        </header>
    );
}
