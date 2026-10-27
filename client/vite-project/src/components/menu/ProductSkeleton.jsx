import { useLanguage } from "../../useLanguage.js";

function SkeletonCard() {
    return (
        <div className="overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[#11110f]" aria-hidden="true">
            <div className="skeleton-shimmer aspect-[4/3] w-full" />
            <div className="space-y-4 p-5 sm:p-6">
                <div className="flex items-center justify-between gap-4">
                    <div className="skeleton-shimmer h-4 w-2/5 rounded" />
                    <div className="skeleton-shimmer h-8 w-16 rounded-lg" />
                </div>
                <div className="space-y-2">
                    <div className="skeleton-shimmer h-3 w-full rounded" />
                    <div className="skeleton-shimmer h-3 w-4/5 rounded" />
                    <div className="skeleton-shimmer h-3 w-3/5 rounded" />
                </div>
                <div className="flex gap-2 pt-1">
                    <div className="skeleton-shimmer h-6 w-16 rounded-full" />
                    <div className="skeleton-shimmer h-6 w-20 rounded-full" />
                </div>
                <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <div className="skeleton-shimmer h-2.5 w-20 rounded" />
                    <div className="skeleton-shimmer h-8 w-8 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export default function ProductSkeleton() {
    const { t } = useLanguage();

    return (
        <div
            className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7"
            role="status"
            aria-label={t("menu.loading")}
        >
            {Array.from({ length: 6 }, (_, index) => (
                <SkeletonCard key={index} />
            ))}
        </div>
    );
}
