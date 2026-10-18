import { useMemo, useState } from "react";
import {
    getAdminMenuItems,
    removeMenuItem,
    saveMenuItem,
} from "../services/adminMenu.js";

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

const inputClassName = "w-full rounded-xl border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none transition focus:border-[#c9a24d]/70";

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

    const filteredItems = useMemo(() => {
        const query = search.trim().toLocaleLowerCase();
        return items.filter((item) =>
            `${item.name} ${item.categoryName} ${item.category}`.toLocaleLowerCase().includes(query),
        );
    }, [items, search]);

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
            setNotice("Məhsul məlumatları yadda saxlanıldı.");
        } catch (saveError) {
            setError(saveError.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteItem = async () => {
        if (!selectedId || !window.confirm("Bu məhsulu silmək istədiyinizə əminsiniz?")) return;

        setSaving(true);
        setError("");
        setNotice("");
        try {
            await removeMenuItem(adminKey, selectedId);
            setItems((current) => current.filter((item) => item._id !== selectedId));
            startNewItem();
            setNotice("Məhsul silindi.");
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
        startNewItem();
    };

    if (!authenticated) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#090a09] px-4 text-white">
                <form onSubmit={submitKey} className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-7 sm:p-9">
                    <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a24d]">777 Lounge</p>
                    <h1 className="mt-3 text-3xl font-light">Admin paneli</h1>
                    <p className="mt-3 text-sm leading-6 text-white/50">
                        Davam etmək üçün serverdə təyin edilmiş admin açarını daxil edin.
                    </p>
                    <Field label="Admin açarı" className="mt-7">
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
                        {loading ? "Yoxlanılır..." : "Daxil ol"}
                    </button>
                </form>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#090a09] px-4 py-6 text-white sm:px-6 lg:px-10">
            <div className="mx-auto max-w-[1500px]">
                <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.35em] text-[#c9a24d]">777 Lounge</p>
                        <h1 className="mt-2 text-3xl font-light sm:text-4xl">Məhsulların idarəsi</h1>
                        <p className="mt-2 text-sm text-white/45">{items.length} məhsul</p>
                    </div>
                    <button className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/35 hover:text-white" onClick={signOut} type="button">
                        Çıxış
                    </button>
                </header>

                {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
                {notice && <p role="status" className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">{notice}</p>}

                <div className="mt-6 grid gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
                    <aside className="h-fit rounded-2xl border border-white/10 bg-[#111] p-4">
                        <button className="w-full rounded-xl bg-[#c9a24d] px-4 py-3 text-sm font-semibold text-black hover:bg-[#d8b665]" onClick={startNewItem} type="button">
                            + Yeni məhsul
                        </button>
                        <input
                            aria-label="Məhsul axtar"
                            className={`${inputClassName} mt-4`}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Məhsul və kateqoriya axtar..."
                            type="search"
                            value={search}
                        />
                        <div className="mt-4 max-h-[65vh] space-y-2 overflow-y-auto pr-1">
                            {filteredItems.map((item) => (
                                <button
                                    key={item._id}
                                    className={`w-full rounded-xl border px-3 py-3 text-left transition ${selectedId === item._id ? "border-[#c9a24d]/60 bg-[#c9a24d]/10" : "border-white/5 bg-black/20 hover:border-white/20"}`}
                                    onClick={() => selectItem(item)}
                                    type="button"
                                >
                                    <span className="block truncate text-sm text-white">{item.name}</span>
                                    <span className="mt-1 block truncate text-xs text-white/45">{item.categoryName} · {item.price} {item.currency}</span>
                                    {!item.isActive && <span className="mt-1 inline-block text-[10px] uppercase tracking-wider text-amber-200">Gizli</span>}
                                </button>
                            ))}
                        </div>
                    </aside>

                    <form onSubmit={saveItem} className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-7">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
                            <div>
                                <h2 className="text-xl font-medium">{selectedId ? "Məhsulu redaktə et" : "Yeni məhsul"}</h2>
                                <p className="mt-1 text-xs text-white/40">Menyuya aid bütün məhsul məlumatları</p>
                            </div>
                            {selectedId && (
                                <button className="rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-200 hover:bg-red-400/10" disabled={saving} onClick={deleteItem} type="button">
                                    Məhsulu sil
                                </button>
                            )}
                        </div>

                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <Field label="Məhsul adı">
                                <input className={inputClassName} onChange={(event) => updateField("name", event.target.value)} required value={form.name} />
                            </Field>
                            <Field label="Qiymət (TRY)">
                                <input className={inputClassName} min="0" onChange={(event) => updateField("price", event.target.value)} required type="number" value={form.price} />
                            </Field>
                            <Field label="Kateqoriya adı">
                                <input className={inputClassName} onChange={(event) => updateField("categoryName", event.target.value)} required value={form.categoryName} />
                            </Field>
                            <Field label="Kateqoriya kodu (slug)">
                                <input className={inputClassName} onChange={(event) => updateField("category", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} pattern="[a-z0-9-]+" required value={form.category} />
                            </Field>
                            <Field label="Kateqoriya sırası">
                                <input className={inputClassName} min="1" onChange={(event) => updateField("categoryOrder", event.target.value)} required type="number" value={form.categoryOrder} />
                            </Field>
                            <Field label="Məhsul sırası">
                                <input className={inputClassName} min="1" onChange={(event) => updateField("itemOrder", event.target.value)} required type="number" value={form.itemOrder} />
                            </Field>
                            <Field className="sm:col-span-2" label="Təsvir">
                                <textarea className={`${inputClassName} min-h-24 resize-y`} onChange={(event) => updateField("description", event.target.value)} required value={form.description} />
                            </Field>
                            <Field className="sm:col-span-2" label="Tərkib / etiketlər (hər sətrə bir dənə)">
                                <textarea className={`${inputClassName} min-h-24 resize-y`} onChange={(event) => updateField("ingredients", event.target.value)} value={form.ingredients} />
                            </Field>
                            <Field className="sm:col-span-2" label="Şəkil URL-i (HTTP/HTTPS)">
                                <input className={inputClassName} onChange={(event) => updateImage("url", event.target.value)} required type="url" value={form.image.url} />
                            </Field>
                            <Field label="Şəkil üçün alt mətn">
                                <input className={inputClassName} onChange={(event) => updateImage("alt", event.target.value)} required value={form.image.alt} />
                            </Field>
                            <Field label="Şəkil mənbəyi">
                                <input className={inputClassName} onChange={(event) => updateImage("source", event.target.value)} required value={form.image.source} />
                            </Field>
                            <Field label="Valyuta">
                                <select className={inputClassName} onChange={(event) => updateField("currency", event.target.value)} value={form.currency}>
                                    <option className="bg-[#111]" value="TRY">TRY</option>
                                </select>
                            </Field>
                            <label className="flex items-center gap-3 self-end rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">
                                <input checked={form.isActive} onChange={(event) => updateField("isActive", event.target.checked)} type="checkbox" />
                                Saytda aktiv göstər
                            </label>
                        </div>

                        <button className="mt-7 rounded-xl bg-[#c9a24d] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#d8b665] disabled:opacity-50" disabled={saving} type="submit">
                            {saving ? "Yadda saxlanılır..." : "Dəyişiklikləri yadda saxla"}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
