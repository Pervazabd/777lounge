
import { useEffect, useState } from "react";
import Navbar from "../layout/clinet/navbar.jsx";
import { useLanguage } from "../useLanguage.js";
import AppLink from "../AppLink.jsx";
import aboutVideo from "../assets/131025 reels 777.mp4";

export default function About() {
    const { t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);
    const highlights = t("about.highlights");

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setIsVisible(true);
        });

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#090a09] pt-24 text-white sm:pt-28">
            <Navbar />

            <style>{`
                @keyframes aboutFadeUp {
                    from {
                        opacity: 0;
                        transform: translateY(28px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes aboutImageReveal {
                    from {
                        opacity: 0;
                        transform: translateX(35px) scale(0.97);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) scale(1);
                    }
                }

                @keyframes aboutBadgeReveal {
                    from {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .about-reveal {
                    opacity: 0;
                    transform: translateY(28px);
                }

                .about-reveal.about-visible {
                    animation: aboutFadeUp 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .about-image-reveal {
                    opacity: 0;
                    transform: translateX(35px) scale(0.97);
                }

                .about-image-reveal.about-visible {
                    animation: aboutImageReveal 1200ms cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                .about-badge-reveal {
                    opacity: 0;
                }

                .about-badge-reveal.about-visible {
                    animation: aboutBadgeReveal 800ms cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                @media (prefers-reduced-motion: reduce) {
                    .about-reveal,
                    .about-image-reveal,
                    .about-badge-reveal {
                        opacity: 1;
                        transform: none;
                        animation: none !important;
                    }
                }
            `}</style>

            <section
                id="about"
                className="relative isolate overflow-hidden px-5 py-12 sm:px-8 sm:py-16 lg:px-14 lg:py-20"
            >
                {/* Dekoratif altın ışık */}
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-40 top-12 -z-10 h-96 w-96 rounded-full bg-amber-100/[0.04] blur-3xl"
                />

                <div className="mx-auto max-w-[1500px]">
                    {/* Üst başlık */}
                    <div
                        className={`mb-14 flex items-center gap-4 sm:mb-20 about-reveal ${isVisible ? "about-visible" : ""
                            }`}
                        style={{ animationDelay: "100ms" }}
                    >
                        <span className="h-px w-10 bg-[#d8c4a0]" />
                        <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#d8c4a0] sm:text-xs">
                            {t("about.heading")}
                        </p>
                    </div>

                    {/* Ana içerik */}
                    <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
                        {/* Sol taraf: Metinler */}
                        <div
                            className={`relative about-reveal ${isVisible ? "about-visible" : ""
                                }`}
                            style={{ animationDelay: "250ms" }}
                        >
                            <p className="mb-6 text-xs uppercase tracking-[0.25em] text-white/45">
                                {t("about.eyebrow")}
                            </p>

                            <h1 className="max-w-2xl font-serif text-5xl font-light leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                                {t("about.titleFirst")}
                                <span className="block italic text-[#d8c4a0]">
                                    {t("about.titleEmphasis")}
                                </span>
                                {t("about.titleLast")}
                            </h1>

                            <p className="mt-8 max-w-xl text-sm leading-7 text-white/65 sm:text-base sm:leading-8">
                                {t("about.description")}
                            </p>

                            <AppLink
                                href="/#menu"
                                className="group mt-9 inline-flex items-center gap-4 border-b border-[#d8c4a0]/50 pb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-[#e8d7bd] transition-colors hover:border-[#d8c4a0] hover:text-white"
                            >
                                {t("about.discover")}

                                <span
                                    aria-hidden="true"
                                    className="text-base transition-transform duration-300 group-hover:translate-x-1"
                                >
                                    →
                                </span>
                            </AppLink>
                        </div>

                        {/* Sağ taraf: Görsel */}
                        <div
                            className={`relative mx-auto w-full max-w-2xl lg:mx-0 about-image-reveal ${isVisible ? "about-visible" : ""
                                }`}
                            style={{ animationDelay: "400ms" }}
                        >
                            <div className="absolute -bottom-4 -left-4 right-10 top-10 border border-[#d8c4a0]/35 sm:-bottom-6 sm:-left-6 sm:right-14 sm:top-14" />

                            <video
                                aria-label={t("about.imageAlt")}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                className="relative aspect-[4/3] w-full object-cover"
                            >
                                <source src={aboutVideo} type="video/mp4" />
                            </video>

                            {/* 777 Lounge rozeti */}
                            <div
                                className={`absolute -bottom-5 right-4 flex h-24 w-24 flex-col items-center justify-center rounded-full border border-white/20 bg-[#11110f]/90 text-center backdrop-blur-sm sm:-bottom-7 sm:right-8 sm:h-32 sm:w-32 about-badge-reveal ${isVisible ? "about-visible" : ""
                                    }`}
                                style={{ animationDelay: "1000ms" }}
                            >
                                <span className="font-serif text-3xl font-light text-[#d8c4a0] sm:text-4xl">
                                    777
                                </span>
                                <span className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/65 sm:text-[9px]">
                                    Lounge
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Öne çıkan özellikler */}
                    <div className="mt-24 grid border-t border-white/10 sm:mt-32 sm:grid-cols-3">
                        {highlights.map((highlight, index) => (
                            <article
                                key={highlight.number}
                                className={`border-b border-white/10 py-7 sm:border-b-0 sm:px-7 sm:py-9 sm:first:pl-0 sm:last:pr-0 sm:[&:not(:first-child)]:border-l sm:[&:not(:first-child)]:border-white/10 about-reveal ${isVisible ? "about-visible" : ""
                                    }`}
                                style={{
                                    animationDelay: `${650 + index * 180}ms`,
                                }}
                            >
                                <span className="text-[10px] tracking-[0.2em] text-[#d8c4a0]">
                                    {highlight.number}
                                </span>

                                <h2 className="mt-4 font-serif text-2xl font-light sm:text-3xl">
                                    {highlight.title}
                                </h2>

                                <p className="mt-3 max-w-xs text-sm leading-6 text-white/55">
                                    {highlight.detail}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
