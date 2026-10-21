import { Reorder, useDragControls } from "framer-motion";
import { useMemo, useRef, useState } from "react";
import {
    getAdminMenuItems,
    reorderMenuCategories,
    reorderMenuItems,
    removeMenuItem,
    saveMenuItem,
} from "../services/adminMenu.js";
import {
    cancelAdminReservation,
    deleteAllAdminReservations,
    deleteAdminReservation,
    getAdminReservations,
} from "../services/adminReservations.js";

const emptyItem = {
    category: "",
    categoryName: "",
    categoryOrder: 1,
    name: "",
    itemOrder: 1,
    price: 0,
    currency: "TRY",
    description: "",
    ingredients: [],
    image: { url: "", alt: "", source: "" },
    isActive: true,
};

function toFormItem(item) {
    return {
        ...item,
        ingredients: item.ingredients.join("\n"),
        image: { ...item.image },
    };
}

function toPayload(item) {
    return {
        ...item,
        category: item.category.trim().toLowerCase(),
        categoryName: item.categoryName.trim(),
        name: item.name.trim(),
        description: item.description.trim(),
        categoryOrder: Number(item.categoryOrder),
        itemOrder: Number(item.itemOrder),
        price: Number(item.price),
        ingredients: item.ingredients
            .split(/\r?\n/)
            .map((ingredient) => ingredient.trim())
            .filter(Boolean),
        image: {
            url: item.image.url.trim(),
            alt: item.image.alt.trim(),
            source: item.image.source.trim(),
        },
    };
}

function Field({ label, children, className = "" }) {
    return (
        <label className={`block space-y-2 ${className}`}>
            <span className="text-xs font-medium text-white/65">{label}</span>
            {children}
        </label>
    );
}

const reservationStatusLabels = {
    pending: "Bekliyor",
    confirmed: "Onaylandı",
    cancelled: "İptal edildi",
};

function formatReservationDate(date) {
    const [year, month, day] = date.split("-").map(Number);
    return new Intl.DateTimeFormat("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(year, month - 1, day));
}

function reservationGuestCount(guests) {
    return guests === "20+" ? 20 : Number(guests);
}

function SortableProductItem({ item, selected, saving, onSelect, onDragEnd }) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={item}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            onDragEnd={onDragEnd}
            className={`flex items-stretch gap-2 rounded-xl ${selected ? "bg-[#c9a24d]/10" : ""}`}
            whileDrag={{ scale: 1.02, zIndex: 1 }}
        >
            <button
                className={`min-w-0 flex-1 rounded-xl border px-3 py-3 text-left transition ${selected ? "border-[#c9a24d]/60" : "border-white/5 bg-black/20 hover:border-white/20"}`}
                onClick={() => onSelect(item)}
                type="button"
            >
                <span className="block truncate text-sm text-white">{item.name}</span>
                <span className="mt-1 block truncate text-xs text-white/45">{item.categoryName} · {item.price} {item.currency}</span>
                {!item.isActive && <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-amber-200">Gizli</span>}
            </button>
            <button
                aria-label={`${item.name} ürününü sürükleyerek sırala`}
                className="touch-none cursor-grab rounded-lg border border-white/10 px-3 text-lg text-white/50 hover:border-[#c9a24d]/50 hover:text-[#c9a24d] active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
                disabled={saving}
                onPointerDown={(event) => dragControls.start(event)}
                title="Sıralamak için sürükleyin"
                type="button"
            >
                ⠿
            </button>
        </Reorder.Item>
    );
}

function SortableCategory({
    category,
    items,
    collapsed,
    selectedId,
    saving,
    onSelect,
    onItemReorder,
    onItemDragEnd,
    onCategoryDragEnd,
    onToggle,
}) {
    const dragControls = useDragControls();

    return (
        <Reorder.Item
            value={category}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            onDragEnd={onCategoryDragEnd}
            className="rounded-xl border border-white/10 bg-black/15 p-2"
            whileDrag={{ scale: 1.01, zIndex: 1 }}
        >
            <div className="flex items-center gap-2">
                <button
                    aria-label={`${items[0].categoryName} kategorisini sürükleyerek sırala`}
                    className="touch-none cursor-grab rounded-lg border border-white/10 px-3 py-3 text-lg text-[#c9a24d] hover:border-[#c9a24d]/50 active:cursor-grabbing disabled:cursor-not-allowed disabled:opacity-30"
                    disabled={saving}
                    onPointerDown={(event) => dragControls.start(event)}
                    title="Kategori sırasını değiştirmek için sürükleyin"
                    type="button"
                >
                    ⠿
                </button>
                <button
                    aria-expanded={!collapsed}
                    className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg px-2 py-2 text-left hover:bg-white/[0.04]"
                    onClick={() => onToggle(category)}
                    type="button"
                >
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-white">{items[0].categoryName}</span>
                        <span className="mt-1 block text-xs text-white/40">{items.length} ürün</span>
                    </span>
                    <span aria-hidden="true" className="text-sm text-white/45">{collapsed ? "+" : "−"}</span>
                </button>
            </div>
            {!collapsed && (
                <Reorder.Group
                    axis="y"
                    values={items}
                    onReorder={(reordered) => onItemReorder(category, reordered)}
                    className="mt-2 space-y-2"
                >
                    {items.map((item) => (
                        <SortableProductItem
                            key={item._id}
                            item={item}
                            selected={selectedId === item._id}
                            saving={saving}
                            onSelect={onSelect}
                            onDragEnd={() => onItemDragEnd(category)}
                        />
                    ))}
                </Reorder.Group>
            )}
        </Reorder.Item>
    );
}

const inputClassName = "w-full rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none transition focus:border-[#c9a24d]/70";

function Icon({ name, className = "h-4 w-4" }) {
    const paths = {
        products: <><path d="M3 7h18l-2 13H5L3 7Z" /><path d="m3 7 2-4h14l2 4M9 11v5m6-5v5" /></>,
        reservations: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 11h18m-13 4h2m4 0h2" /></>,
        sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></>,
        moon: <path d="M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z" />,
        logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
        search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
        refresh: <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M5.6 9a7 7 0 0 1 11.6-2L20 12M4 12l2.8 5a7 7 0 0 0 11.6-2" /></>,
        users: <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
        clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
        cancel: <><circle cx="12" cy="12" r="9" /><path d="m9 9 6 6m0-6-6 6" /></>,
        trash: <><path d="M3 6h18m-2 0-.9 14H5.9L5 6m4 0V4h6v2m-5 4v6m4-6v6" /></>,
        phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.18 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.8a2 2 0 0 1-.45 2.1L8.1 9.9a16 16 0 0 0 6 6l1.28-1.25a2 2 0 0 1 2.1-.45c.9.34 1.84.58 2.8.7A2 2 0 0 1 22 16.92Z" />,
    };

    return (
        <svg aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" viewBox="0 0 24 24">
            {paths[name]}
        </svg>
    );
}

export default function Admin() {
    const [adminKey, setAdminKey] = useState(
        () => window.sessionStorage.getItem("777lounge-admin-key") || "",
    );
    const [authenticated, setAuthenticated] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [form, setForm] = useState(emptyItem);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const pendingCategoryOrder = useRef({});
    const pendingCategoryGroupOrder = useRef(null);
    const [collapsedCategories, setCollapsedCategories] = useState({});
    const [activeSection, setActiveSection] = useState("products");
    const [theme, setTheme] = useState(
        () => window.localStorage.getItem("777lounge-admin-theme") || "dark",
    );
    const [reservations, setReservations] = useState([]);
    const [reservationFilter, setReservationFilter] = useState("all");
    const [reservationSearch, setReservationSearch] = useState("");
    const [reservationsLoading, setReservationsLoading] = useState(false);
    const [reservationSavingId, setReservationSavingId] = useState("");
    const [deletingAllReservations, setDeletingAllReservations] = useState(false);

    const filteredItems = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();
        return items.filter((item) =>
            `${item.name} ${item.categoryName} ${item.category}`.toLocaleLowerCase().includes(query),
        );
    }, [items, search]);

    const filteredCategories = useMemo(() => {
        const categories = new Map();
        for (const item of filteredItems) {
            if (!categories.has(item.category)) {
                categories.set(item.category, []);
            }
            categories.get(item.category).push(item);
        }
        return [...categories.entries()];
    }, [filteredItems]);

    const loadItems = async (key) => {
        setLoading(true);
        setError("");
        try {
            const loadedItems = await getAdminMenuItems(key);
            setItems(loadedItems);
            setAuthenticated(true);
            return true;
        } catch (loadError) {
            setAuthenticated(false);
            setError(loadError.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const loadReservations = async () => {
        setReservationsLoading(true);
        setError("");
        try {
            setReservations(await getAdminReservations(adminKey));
        } catch (loadError) {
            setError(loadError.message);
        } finally {
            setReservationsLoading(false);
        }
    };

    const openSection = (section) => {
        setActiveSection(section);
        setError("");
        setNotice("");
        if (section === "reservations") loadReservations();
    };

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        window.localStorage.setItem("777lounge-admin-theme", nextTheme);
    };

    const cancelReservation = async (reservation) => {
        if (!window.confirm(`${reservation.name} adlı kişinin ${reservation.date} tarihli rezervasyonunu iptal etmek istiyor musunuz?`)) return;
        setReservationSavingId(reservation._id);
        setError("");
        setNotice("");
        try {
            const cancelled = await cancelAdminReservation(adminKey, reservation._id);
            setReservations((current) => current.map((item) => item._id === cancelled._id ? cancelled : item));
            setNotice("Rezervasyon iptal edildi.");
        } catch (cancelError) {
            setError(cancelError.message);
        } finally {
            setReservationSavingId("");
        }
    };

    const deleteReservation = async (reservation) => {
        if (!window.confirm(`${reservation.name} adlı kişinin rezervasyon kaydı kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?`)) return;
        setReservationSavingId(reservation._id);
        setError("");
        setNotice("");
        try {
            await deleteAdminReservation(adminKey, reservation._id);
            setReservations((current) => current.filter((item) => item._id !== reservation._id));
            setNotice("Rezervasyon kalıcı olarak silindi.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setReservationSavingId("");
        }
    };

    const deleteAllReservations = async () => {
        if (!reservations.length || !window.confirm(`Tüm ${reservations.length} rezervasyon kalıcı olarak silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?`)) return;
        setDeletingAllReservations(true);
        setError("");
        setNotice("");
        try {
            const deletedCount = await deleteAllAdminReservations(adminKey);
            setReservations([]);
            setNotice(`${deletedCount} rezervasyon kalıcı olarak silindi.`);
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setDeletingAllReservations(false);
        }
    };

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const updateImage = (field, value) => {
        setForm((current) => ({
            ...current,
            image: { ...current.image, [field]: value },
        }));
    };

    const startNewItem = () => {
        setSelectedId("");
        setForm({
            ...emptyItem,
            categoryOrder: items.length ? Math.max(...items.map((item) => item.categoryOrder)) : 1,
        });
        setError("");
        setNotice("");
    };

    const selectItem = (item) => {
        setSelectedId(item._id);
        setForm(toFormItem(item));
        setError("");
        setNotice("");
    };

    const updateCategoryOrder = (category, reorderedVisibleItems) => {
        const visibleIds = new Set(reorderedVisibleItems.map(({ _id }) => _id));
        let visibleIndex = 0;
        const orderedVisibleIds = reorderedVisibleItems.map(({ _id }) => _id);
        const fullCategoryOrder = items
            .filter((item) => item.category === category)
            .map((item) => visibleIds.has(item._id) ? orderedVisibleIds[visibleIndex++] : item._id);
        pendingCategoryOrder.current[category] = fullCategoryOrder;

        const orderById = new Map(fullCategoryOrder.map((id, index) => [id, index + 1]));
        setItems((current) => current
            .map((item) => item.category === category
                ? { ...item, itemOrder: orderById.get(item._id) }
                : item)
            .sort((a, b) => a.categoryOrder - b.categoryOrder || a.itemOrder - b.itemOrder));
    };

    const saveCategoryOrder = async (category) => {
        if (saving || !pendingCategoryOrder.current[category]) return;
        setSaving(true);
        setError("");
        setNotice("");
        try {
            const itemIds = pendingCategoryOrder.current[category];
            await reorderMenuItems(adminKey, category, itemIds);
            const updatedItems = await getAdminMenuItems(adminKey);
            setItems(updatedItems);
            if (selectedId) {
                const selectedItem = updatedItems.find((candidate) => candidate._id === selectedId);
                if (selectedItem) {
                    setForm((current) => ({ ...current, itemOrder: selectedItem.itemOrder }));
                }
            }
            delete pendingCategoryOrder.current[category];
            setNotice("Ürün sırası güncellendi.");
        } catch (reorderError) {
            setError(reorderError.message);
        } finally {
            setSaving(false);
        }
    };

    const updateCategoryGroupOrder = (reorderedCategories) => {
        const visibleCategories = new Set(reorderedCategories);
        let visibleIndex = 0;
        const orderedVisibleCategories = [...reorderedCategories];
        const currentCategories = [...new Map(
            [...items]
                .sort((a, b) => a.categoryOrder - b.categoryOrder)
                .map((item) => [item.category, item.categoryOrder]),
        ).keys()];
        const fullOrder = currentCategories.map((category) => (
            visibleCategories.has(category) ? orderedVisibleCategories[visibleIndex++] : category
        ));
        if (fullOrder.every((category, index) => category === currentCategories[index])) return;

        pendingCategoryGroupOrder.current = fullOrder;
        const orderByCategory = new Map(fullOrder.map((category, index) => [category, index + 1]));
        setItems((current) => current
            .map((item) => ({ ...item, categoryOrder: orderByCategory.get(item.category) }))
            .sort((a, b) => a.categoryOrder - b.categoryOrder || a.itemOrder - b.itemOrder));
    };

    const saveCategoryGroupOrder = async () => {
        if (saving || !pendingCategoryGroupOrder.current) return;
        setSaving(true);
        setError("");
        setNotice("");
        try {
            await reorderMenuCategories(adminKey, pendingCategoryGroupOrder.current);
            const updatedItems = await getAdminMenuItems(adminKey);
            setItems(updatedItems);
            pendingCategoryGroupOrder.current = null;
            setNotice("Kategori sırası güncellendi.");
        } catch (reorderError) {
            setError(reorderError.message);
        } finally {
            setSaving(false);
        }
    };

    const toggleCategory = (category) => {
        setCollapsedCategories((current) => ({ ...current, [category]: !current[category] }));
    };

    const submitKey = async (event) => {
        event.preventDefault();
        const normalizedKey = adminKey.trim();
        if (await loadItems(normalizedKey)) {
            window.sessionStorage.setItem("777lounge-admin-key", normalizedKey);
        }
    };

    const saveItem = async (event) => {
        event.preventDefault();
        setSaving(true);
        setError("");
        setNotice("");
        try {
            const payload = toPayload({
                ...form,
                ...(selectedId ? { _id: selectedId } : {}),
            });
            const savedItem = await saveMenuItem(adminKey, payload);
            const updatedItems = await getAdminMenuItems(adminKey);
            setItems(updatedItems);
            setSelectedId(savedItem._id);
            setForm(toFormItem(savedItem));
            setNotice("Ürün bilgileri kaydedildi.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = async () => {
        if (!selectedId || !window.confirm("Bu ürünü silmek istediğinizden emin misiniz?")) return;

        setSaving(true);
        setError("");
        setNotice("");
        try {
            await removeMenuItem(adminKey, selectedId);
            setItems((current) => current.filter((item) => item._id !== selectedId));
            startNewItem();
            setNotice("Ürün silindi.");
        } catch (deleteError) {
            setError(deleteError.message);
        } finally {
            setSaving(false);
        }
    };

    const signOut = () => {
        window.sessionStorage.removeItem("777lounge-admin-key");
        setAdminKey("");
        setAuthenticated(false);
        setItems([]);
        setReservations([]);
        setActiveSection("products");
        startNewItem();
    };

    const filteredReservations = reservations.filter((reservation) => {
        const matchesStatus = reservationFilter === "all" || reservation.status === reservationFilter;
        const query = reservationSearch.trim().toLocaleLowerCase();
        const matchesSearch = !query || [
            reservation.name,
            reservation.phone,
            reservation.date,
            reservation.time,
            reservation.area,
            reservation.notes,
        ].some((value) => value?.toLocaleLowerCase().includes(query));
        return matchesStatus && matchesSearch;
    });
    const pendingReservations = reservations.filter(({ status }) => status === "pending").length;
    const totalGuests = reservations
        .filter(({ status }) => status !== "cancelled")
        .reduce((total, { guests }) => total + reservationGuestCount(guests), 0);

    if (!authenticated) {
        return (
            <main lang="tr" className={`admin-panel admin-${theme} flex min-h-screen items-center justify-center bg-[#090a09] px-4 text-white`}>
                <form onSubmit={submitKey} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-7 sm:p-9">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a24d]">777 Lounge</p>
                    <h1 className="mt-3 text-3xl font-light">Yönetim paneli</h1>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                        Devam etmek için sunucuda tanımlı yönetici anahtarını girin.
                    </p>
                    <Field label="Yönetici anahtarı" className="mt-7">
                        <input
                            autoComplete="current-password"
                            className={inputClassName}
                            onChange={(event) => setAdminKey(event.target.value)}
                            required
                            type="password"
                            value={adminKey}
                        />
                    </Field>
                    {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
                    <button
                        className="mt-6 w-full rounded-xl bg-[#c9a24d] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#d8b665] disabled:opacity-50"
                        disabled={loading}
                        type="submit"
                    >
                        {loading ? "Kontrol ediliyor..." : "Giriş yap"}
                    </button>
                </form>
            </main>
        );
    }

    return (
        <main lang="tr" className={`admin-panel admin-${theme} min-h-screen bg-[#090a09] px-4 py-6 text-white sm:px-6 lg:px-10`}>
            <div className="mx-auto max-w-[1500px]">
                <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a24d]">777 Lounge</p>
                        <h1 className="mt-2 text-3xl font-light sm:text-4xl">{activeSection === "products" ? "Ürün yönetimi" : "Rezervasyonlar"}</h1>
                        <p className="mt-2 text-sm text-white/45">{activeSection === "products" ? `${items.length} ürün` : `${reservations.length} rezervasyon talebi`}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/35 hover:text-white" onClick={toggleTheme} type="button">
                            <span className="flex items-center gap-2"><Icon name={theme === "dark" ? "sun" : "moon"} />{theme === "dark" ? "Açık tema" : "Koyu tema"}</span>
                        </button>
                        <button className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/35 hover:text-white" onClick={signOut} type="button">
                            <span className="flex items-center gap-2"><Icon name="logout" />Çıkış yap</span>
                        </button>
                    </div>
                </header>

                <nav aria-label="Yönetim bölümleri" className="mt-5 flex gap-2 overflow-x-auto border-b border-white/10 pb-3">
                    {[
                        ["products", "Ürünler"],
                        ["reservations", `Rezervasyonlar${pendingReservations ? ` (${pendingReservations})` : ""}`],
                    ].map(([section, label]) => (
                        <button
                            key={section}
                            aria-current={activeSection === section ? "page" : undefined}
                            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm transition ${activeSection === section ? "bg-[#c9a24d] font-semibold text-black" : "border border-white/10 text-white/65 hover:border-white/30 hover:text-white"}`}
                            onClick={() => openSection(section)}
                            type="button"
                        >
                            <span className="flex items-center gap-2"><Icon name={section} />{label}</span>
                        </button>
                    ))}
                </nav>

                {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
                {notice && <p role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}

                {activeSection === "reservations" ? (
                    <section aria-label="Rezervasyon yönetimi" className="mt-6">
                        <div className="grid gap-3 sm:grid-cols-3">
                            {[
                                ["Toplam rezervasyon", reservations.length],
                                ["Bekleyen rezervasyon", pendingReservations],
                                ["Aktif rezervasyonlardaki minimum misafir", totalGuests],
                            ].map(([label, value]) => (
                                <div key={label} className="rounded-2xl border border-white/10 bg-[#111] p-5 transition hover:-translate-y-0.5 hover:border-[#c9a24d]/30">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-white/50">{label}</p>
                                        <Icon className="h-5 w-5 text-[#c9a24d]" name={label.startsWith("Bekleyen") ? "clock" : "users"} />
                                    </div>
                                    <p className="mt-3 text-3xl font-light text-[#c9a24d]">{value}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#111] p-4 sm:flex-row sm:items-center">
                            <label className="relative flex-1 sm:max-w-md">
                                <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40" name="search" />
                                <input
                                    aria-label="Rezervasyon ara"
                                    className={`${inputClassName} pl-10`}
                                    onChange={(event) => setReservationSearch(event.target.value)}
                                    placeholder="Ad, telefon veya tarihe göre ara..."
                                    type="search"
                                    value={reservationSearch}
                                />
                            </label>
                            <select
                                aria-label="Rezervasyon durumu"
                                className={inputClassName}
                                onChange={(event) => setReservationFilter(event.target.value)}
                                value={reservationFilter}
                            >
                                <option className="bg-[#111]" value="all">Tüm durumlar</option>
                                <option className="bg-[#111]" value="pending">Bekliyor</option>
                                <option className="bg-[#111]" value="confirmed">Onaylandı</option>
                                <option className="bg-[#111]" value="cancelled">İptal edildi</option>
                            </select>
                            <button
                                className="shrink-0 rounded-xl border border-white/15 px-4 py-3 text-sm text-white/70 hover:border-white/35 hover:text-white disabled:opacity-50"
                                disabled={reservationsLoading || deletingAllReservations}
                                onClick={loadReservations}
                                type="button"
                            >
                                <span className="flex items-center justify-center gap-2"><Icon name="refresh" />{reservationsLoading ? "Yükleniyor..." : "Yenile"}</span>
                            </button>
                            <button
                                className="shrink-0 rounded-xl border border-red-400/30 px-4 py-3 text-sm text-red-200 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                                disabled={!reservations.length || reservationsLoading || deletingAllReservations}
                                onClick={deleteAllReservations}
                                type="button"
                            >
                                <span className="flex items-center justify-center gap-2"><Icon name="trash" />{deletingAllReservations ? "Tümü siliniyor..." : "Tümünü sil"}</span>
                            </button>
                        </div>

                        {reservationsLoading ? (
                            <p className="py-12 text-center text-sm text-white/50">Rezervasyonlar yükleniyor...</p>
                        ) : filteredReservations.length ? (
                            <div className="mt-5 grid gap-4 xl:grid-cols-2">
                                {filteredReservations.map((reservation) => (
                                    <article key={reservation._id} className="rounded-2xl border border-white/10 bg-[#111] p-5">
                                        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-white/10 pb-4">
                                            <div>
                                                <h2 className="text-lg font-medium">{reservation.name}</h2>
                                                <a className="mt-2 inline-flex items-center gap-2 text-sm text-[#c9a24d] hover:underline" href={`tel:${reservation.phone}`}><Icon name="phone" />{reservation.phone}</a>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs ${reservation.status === "cancelled" ? "bg-red-400/10 text-red-200" : reservation.status === "confirmed" ? "bg-emerald-400/10 text-emerald-200" : "bg-amber-300/10 text-amber-100"}`}>
                                                {reservationStatusLabels[reservation.status] || reservation.status}
                                            </span>
                                        </div>
                                        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                                            <div><dt className="text-xs text-white/40">Tarih</dt><dd className="mt-1">{formatReservationDate(reservation.date)}</dd></div>
                                            <div><dt className="text-xs text-white/40">Saat</dt><dd className="mt-1">{reservation.time}</dd></div>
                                            <div><dt className="text-xs text-white/40">Misafir sayısı</dt><dd className="mt-1">{reservation.guests}</dd></div>
                                            <div><dt className="text-xs text-white/40">Mekan</dt><dd className="mt-1">{{
                                                garden: "Bahçe",
                                                indoor: "Salon",
                                                "game-room": "Oyun salonu",
                                            }[reservation.area] || reservation.area}</dd></div>
                                        </dl>
                                        <div className="mt-4 rounded-xl bg-black/20 p-3">
                                            <p className="text-xs text-white/40">Not / özel istek</p>
                                            <p className="mt-1 whitespace-pre-wrap text-sm">{reservation.notes || "Not yok"}</p>
                                        </div>
                                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                            <time className="text-xs text-white/35" dateTime={reservation.createdAt}>
                                                Başvuru: {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(reservation.createdAt))}
                                            </time>
                                            {reservation.status !== "cancelled" && (
                                                <button
                                                    className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-200 transition hover:bg-red-400/10 disabled:opacity-50"
                                                    disabled={reservationSavingId === reservation._id}
                                                    onClick={() => cancelReservation(reservation)}
                                                    type="button"
                                                >
                                                    <span className="flex items-center gap-2"><Icon name="cancel" />{reservationSavingId === reservation._id ? "İptal ediliyor..." : "İptal et"}</span>
                                                </button>
                                            )}
                                            <button
                                                className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-200 transition hover:bg-red-400/10 disabled:opacity-50"
                                                disabled={reservationSavingId === reservation._id}
                                                onClick={() => deleteReservation(reservation)}
                                                type="button"
                                            >
                                                <span className="flex items-center gap-2"><Icon name="trash" />{reservationSavingId === reservation._id ? "Siliniyor..." : "Sil"}</span>
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <p className="mt-5 rounded-2xl border border-white/10 bg-[#111] px-4 py-12 text-center text-sm text-white/50">
                                {reservations.length ? "Bu filtreye uygun rezervasyon bulunamadı." : "Henüz rezervasyon başvurusu yok."}
                            </p>
                        )}
                    </section>
                ) : (
                <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                    <aside className="h-fit rounded-2xl border border-white/10 bg-[#111] p-4">
                        <button className="w-full rounded-xl bg-[#c9a24d] px-4 py-3 text-sm font-semibold text-black hover:bg-[#d8b665]" onClick={startNewItem} type="button">
                            + Yeni ürün
                        </button>
                        <input
                            aria-label="Ürün ara"
                            className={`${inputClassName} mt-4`}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Ürün veya kategori ara..."
                            type="search"
                            value={search}
                        />
                        <div className="mt-4 flex items-center justify-between px-1 text-xs text-white/40">
                            <span>⠿ Tutup sürükleyerek sıralayın</span>
                            <div className="flex gap-3">
                                <button
                                    className="text-[#c9a24d] hover:text-[#e0bd68]"
                                    onClick={() => setCollapsedCategories(
                                        Object.fromEntries(filteredCategories.map(([category]) => [category, false])),
                                    )}
                                    type="button"
                                >
                                    Tümünü aç
                                </button>
                                <button
                                    className="text-[#c9a24d] hover:text-[#e0bd68]"
                                    onClick={() => setCollapsedCategories(
                                        Object.fromEntries(filteredCategories.map(([category]) => [category, true])),
                                    )}
                                    type="button"
                                >
                                    Daralt
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 max-h-[65vh] overflow-y-auto pr-1">
                            {filteredCategories.length ? (
                                <Reorder.Group
                                    axis="y"
                                    values={filteredCategories.map(([category]) => category)}
                                    onReorder={updateCategoryGroupOrder}
                                    className="space-y-3"
                                >
                                    {filteredCategories.map(([category, categoryItems]) => (
                                        <SortableCategory
                                            key={category}
                                            category={category}
                                            items={categoryItems}
                                            collapsed={Boolean(collapsedCategories[category])}
                                            selectedId={selectedId}
                                            saving={saving}
                                            onSelect={selectItem}
                                            onItemReorder={updateCategoryOrder}
                                            onItemDragEnd={saveCategoryOrder}
                                            onCategoryDragEnd={saveCategoryGroupOrder}
                                            onToggle={toggleCategory}
                                        />
                                    ))}
                                </Reorder.Group>
                            ) : (
                                <p className="rounded-xl border border-white/10 px-3 py-6 text-center text-sm text-white/45">Ürün bulunamadı.</p>
                            )}
                        </div>
                    </aside>

                    <form onSubmit={saveItem} className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                            <div>
                                <h2 className="text-xl font-medium">{selectedId ? "Ürünü düzenle" : "Yeni ürün"}</h2>
                                <p className="mt-1 text-xs text-white/40">Menüdeki tüm ürün bilgileri</p>
                            </div>
                            {selectedId && (
                                <button className="rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-200 hover:bg-red-400/10" disabled={saving} onClick={deleteItem} type="button">
                                    Ürünü sil
                                </button>
                            )}
                        </div>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <Field label="Ürün adı">
                                <input className={inputClassName} onChange={(event) => updateField("name", event.target.value)} required value={form.name} />
                            </Field>
                            <Field label="Fiyat (TRY)">
                                <input className={inputClassName} min="0" onChange={(event) => updateField("price", event.target.value)} required type="number" value={form.price} />
                            </Field>
                            <Field label="Kategori adı">
                                <input className={inputClassName} onChange={(event) => updateField("categoryName", event.target.value)} required value={form.categoryName} />
                            </Field>
                            <Field label="Kategori kodu (slug)">
                                <input className={inputClassName} onChange={(event) => updateField("category", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} pattern="[a-z0-9-]+" required value={form.category} />
                            </Field>
                            <Field label="Kategori sırası">
                                <input className={inputClassName} min="1" onChange={(event) => updateField("categoryOrder", event.target.value)} required type="number" value={form.categoryOrder} />
                            </Field>
                            <Field label="Ürün sırası">
                                <input className={inputClassName} min="1" onChange={(event) => updateField("itemOrder", event.target.value)} required type="number" value={form.itemOrder} />
                            </Field>
                            <Field className="sm:col-span-2" label="Açıklama">
                                <textarea className={`${inputClassName} min-h-24 resize-y`} onChange={(event) => updateField("description", event.target.value)} required value={form.description} />
                            </Field>
                            <Field className="sm:col-span-2" label="İçerik / etiketler (her satıra bir tane)">
                                <textarea className={`${inputClassName} min-h-24 resize-y`} onChange={(event) => updateField("ingredients", event.target.value)} value={form.ingredients} />
                            </Field>
                            <Field className="sm:col-span-2" label="Görsel URL'si (HTTP/HTTPS)">
                                <input className={inputClassName} onChange={(event) => updateImage("url", event.target.value)} required type="url" value={form.image.url} />
                            </Field>
                            <Field label="Görsel alternatif metni">
                                <input className={inputClassName} onChange={(event) => updateImage("alt", event.target.value)} required value={form.image.alt} />
                            </Field>
                            <Field label="Görsel kaynağı">
                                <input className={inputClassName} onChange={(event) => updateImage("source", event.target.value)} required value={form.image.source} />
                            </Field>
                            <Field label="Para birimi">
                                <select className={inputClassName} onChange={(event) => updateField("currency", event.target.value)} value={form.currency}>
                                    <option className="bg-[#111]" value="TRY">TRY</option>
                                </select>
                            </Field>
                            <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">
                                <input checked={form.isActive} onChange={(event) => updateField("isActive", event.target.checked)} type="checkbox" />
                                Sitede yayınla
                            </label>
                        </div>

                        <button className="mt-7 rounded-xl bg-[#c9a24d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d8b665] disabled:opacity-50" disabled={saving} type="submit">
                            {saving ? "Kaydediliyor..." : "Değişiklikleri kaydet"}
                        </button>
                    </form>
                </div>
                )}
            </div>
        </main>
    );
}
