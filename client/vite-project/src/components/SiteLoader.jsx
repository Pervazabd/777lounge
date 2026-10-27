import { useLanguage } from "../useLanguage.js";

export default function SiteLoader() {
    const { t } = useLanguage();

    return (
        <div className="site-loader" role="status" aria-label={t("app.loading")}>
            <div className="site-loader__content">
                <div className="coffee-scene" aria-hidden="true">
                    <span className="coffee-scene__orbit coffee-scene__orbit--outer" />
                    <span className="coffee-scene__orbit coffee-scene__orbit--inner" />
                    <svg className="coffee-cup" viewBox="0 0 140 140" fill="none">
                        <path
                            className="coffee-steam coffee-steam--left"
                            d="M53 40c-8-8 7-11 0-20"
                        />
                        <path
                            className="coffee-steam coffee-steam--right"
                            d="M79 39c-8-9 7-12 0-21"
                        />
                        <path
                            d="M35 54h57v37a21 21 0 0 1-21 21H56a21 21 0 0 1-21-21V54Z"
                            fill="url(#cup-fill)"
                            stroke="url(#cup-stroke)"
                            strokeWidth="2"
                        />
                        <path
                            d="M92 64h10a13 13 0 0 1 0 26H92"
                            stroke="url(#cup-stroke)"
                            strokeWidth="5"
                            strokeLinecap="round"
                        />
                        <path d="M37 64h53" stroke="#f0d99b" strokeOpacity=".7" strokeWidth="2" />
                        <path
                            d="M48 54c5 4 9 4 14 0s9-4 14 0 9 4 14 0"
                            stroke="#f6ddb0"
                            strokeOpacity=".7"
                            strokeWidth="2"
                        />
                        <path
                            d="M28 117h75"
                            stroke="url(#cup-stroke)"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <path
                            d="M47 122h38"
                            stroke="#c9a24d"
                            strokeOpacity=".4"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="cup-fill" x1="35" y1="54" x2="95" y2="112" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#352719" />
                                <stop offset="1" stopColor="#17120d" />
                            </linearGradient>
                            <linearGradient id="cup-stroke" x1="35" y1="54" x2="102" y2="118" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#f0d99b" />
                                <stop offset="1" stopColor="#a77c32" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <span className="coffee-scene__spark coffee-scene__spark--one">✦</span>
                    <span className="coffee-scene__spark coffee-scene__spark--two">·</span>
                </div>
                <p className="site-loader__brand">777 <span>LOUNGE</span></p>
                <p className="site-loader__caption">{t("app.loading")}</p>
                <span className="site-loader__progress" aria-hidden="true">
                    <span />
                </span>
            </div>
        </div>
    );
}
