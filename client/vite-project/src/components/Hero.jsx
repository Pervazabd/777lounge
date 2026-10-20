import React, { useState } from "react";
import Navbar from "../layout/clinet/navbar.jsx";
import { useLanguage } from "../useLanguage.js";
import AppLink from "../AppLink.jsx";
import reservationImage from "../assets/EKO06195.png";

const menuItems = [
    {
        id: "menu",
        href: "/#menu",
        image:
            "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920&auto=format&fit=crop",
    },
    {
        id: "hookah",
        href: "/hookah#hookah-menu",
        image:
            "https://scontent.fyei1-1.fna.fbcdn.net/v/t1.6435-9/90720666_116337913328023_9020232255691292672_n.jpg?stp=dst-jpg_tt6&cstp=mx2048x1365&ctp=s2048x1365&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=127cfc&_nc_ohc=0ASSjWD90GoQ7kNvwHBwJMi&_nc_oc=Adqpsi4MfoNV8mX9MrcM19a0lDCVvM_WZZEr7u_ZYldHNitF2m270629PT6QeMUVIOo&_nc_zt=23&_nc_ht=scontent.fyei1-1.fna&_nc_gid=BT84gzOJFWoahsCz7y3hFQ&_nc_ss=7b2a8&oh=00_AQOOsBYfUTlQxDzjkiEjEOAd5cLdPBULg8XAbuN5zqTJNA&oe=6AFC6B85",
    },
    {
        id: "rezervasyon",
        href: "/rezerv",
        image: reservationImage,
    },
];

export default function Hero() {
    const { t } = useLanguage();
    const [activeItem, setActiveItem] = useState("menu");
    const [hoveredItem, setHoveredItem] = useState(null);

    return (
        <section
            id="home"
            className="relative isolate flex h-screen min-h-[560px] w-full items-center justify-center overflow-hidden bg-black text-white"
        >
            <Navbar />

            {/* Background Images */}
            {menuItems.map((item) => (
                <div
                    key={item.id}
                    className={`absolute inset-0 -z-20 bg-cover bg-center transition-all duration-1000 ease-in-out ${activeItem === item.id
                        ? "scale-105 opacity-100"
                        : "scale-100 opacity-0"
                        }`}
                    style={{
                        backgroundImage: `url("${item.image}")`,
                    }}
                />
            ))}

            {/* Dark overlays */}
            <div className="absolute inset-0 -z-10 bg-black/45" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/30 via-black/10 to-black/60" />

            {/* Center Content */}
            <div
                className="relative z-10 flex w-full flex-col items-center justify-center px-5 text-center sm:px-8"
                onMouseLeave={() => {
                    setActiveItem("menu");
                    setHoveredItem(null);
                }}
            >
                {/* Small heading */}
                <p className="mb-8 text-[9px] uppercase tracking-[0.45em] text-[#d8c4a0] sm:mb-12 sm:text-[11px]">
                    {t("home.discover")}
                </p>

                {/* Main interactive menu */}
                <div className="flex w-full flex-col items-center justify-center gap-5 sm:gap-7 md:flex-row md:gap-6 lg:gap-12">
                    {menuItems.map((item) => {
                        const isActive = activeItem === item.id;
                        const hasHoveredItem = hoveredItem !== null;

                        return (
                            <AppLink
                                key={item.id}
                                href={item.href}
                                onMouseEnter={() => {
                                    setActiveItem(item.id);
                                    setHoveredItem(item.id);
                                }}
                                onFocus={() => {
                                    setActiveItem(item.id);
                                    setHoveredItem(item.id);
                                }}
                                onClick={() => setActiveItem(item.id)}
                                className={`group relative py-2 transition-all duration-500 ease-in-out ${hasHoveredItem && hoveredItem !== item.id
                                    ? "md:scale-95 md:blur-[3px] md:opacity-35"
                                    : "scale-100 blur-0 opacity-100"
                                    }`}
                            >
                                <span
                                    className={`block whitespace-nowrap text-4xl font-light tracking-[0.06em] transition-all duration-500 sm:text-5xl md:text-3xl lg:text-5xl xl:text-6xl ${isActive
                                        ? "text-white"
                                        : "text-white/75 group-hover:text-white"
                                        }`}
                                >
                                    {t(`home.${item.id === "rezervasyon" ? "reservation" : item.id}`)}
                                </span>

                                {/* Gold underline */}
                                <span
                                    className={`absolute bottom-0 left-0 h-px bg-[#d8c4a0] transition-all duration-500 ${isActive ? "w-full" : "w-0"
                                        }`}
                                />
                            </AppLink>
                        );
                    })}
                </div>

                {/* Bottom detail */}
                <div className="mt-10 flex items-center gap-3 sm:mt-14">
                    <span className="h-px w-7 bg-[#d8c4a0]" />
                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/65 sm:text-[10px]">
                        {t("home.tagline")}
                    </p>
                    <span className="h-px w-7 bg-[#d8c4a0]" />
                </div>
            </div>
        </section>
    );
}
