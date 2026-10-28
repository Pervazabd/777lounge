
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Navbar from "../layout/clinet/navbar.jsx";
import reservationImage from "../assets/EKO06195.png";
import { useLanguage } from "../useLanguage.js";
import { submitReservation } from "../services/reservations.js";

const WHATSAPP_NUMBER = "905334997211";
const LOUNGE_MAP_LINK = "https://share.google/jPCFjM8YGCXbSanEO";

const timeOptions = [
    "12:00", "12:30", "13:00", "13:30",
    "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
    "18:00", "18:30", "19:00", "19:30",
    "20:00", "20:30", "21:00", "21:30",
    "22:00", "22:30", "23:00",
];

export default function Reservation() {
    const { t } = useLanguage();
    const shouldReduceMotion = useReducedMotion();

    const reveal = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 28,
            filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)",
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    const stagger = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
        },
    };

    const [form, setForm] = useState({
        name: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        area: "garden",
        notes: "",
    });

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [minDate] = useState(() => {
        const today = new Date();
        return [
            today.getFullYear(),
            String(today.getMonth() + 1).padStart(2, "0"),
            String(today.getDate()).padStart(2, "0"),
        ].join("-");
    });

    const updateField = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setError("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (form.date < minDate) {
            setError(t("reservation.invalidDate"));
            return;
        }

        setError("");
        setIsSubmitting(true);

        const message = [
            `*777 LOUNGE — ${t("reservation.whatsappTitle")}*`,
            "",
            `*${t("reservation.nameLabel")}:* ${form.name.trim()}`,
            `*${t("reservation.phoneLabel")}:* ${form.phone.trim()}`,
            `*${t("reservation.dateLabel")}:* ${form.date}`,
            `*${t("reservation.timeLabel")}:* ${form.time}`,
            `*${t("reservation.guestsLabel")}:* ${form.guests}`,
            `*${t("reservation.areaLabel")}:* ${t({
                garden: "reservation.garden",
                indoor: "reservation.indoor",
                "game-room": "reservation.gameRoom",
            }[form.area])}`,
            "",
            `*${t("reservation.notesLabel")}:* ${form.notes.trim() || t("reservation.notSpecified")}`,
            "",
            t("reservation.whatsappMessage"),
        ].join("\n");

        const whatsappUrl =
            `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

        const whatsappWindow = window.open("", "_blank");

        try {
            await submitReservation(form);

            if (whatsappWindow) {
                whatsappWindow.opener = null;
                whatsappWindow.location.href = whatsappUrl;
            } else {
                window.location.assign(whatsappUrl);
            }
        } catch (submitError) {
            whatsappWindow?.close();
            console.error("Could not submit reservation.", submitError);
            setError(t("reservation.submitError"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass =
        "mt-2 w-full rounded-xl border border-white/10 bg-[#11110f] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-[#d8c4a0]/70";

    const labelClass =
        "text-xs font-medium tracking-wide text-white/70";

    return (
        <section
            id="reservation"
            className="relative overflow-hidden bg-[#090a09] px-4 py-20 text-white sm:px-6 sm:py-28"
        >
            <Navbar />

            <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 1.6,
                    ease: "easeOut",
                }}
                className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c9a24d]/[0.07] blur-3xl"
            />

            <div className="relative mx-auto grid max-w-6xl items-start gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">

                {/* Sol məlumat sahəsi */}
                <motion.div
                    className="lg:sticky lg:top-28"
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.p
                        variants={reveal}
                        className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#d8c4a0] sm:text-xs"
                    >
                        {t("reservation.eyebrow")}
                    </motion.p>

                    <motion.h1
                        variants={reveal}
                        className="mt-5 font-serif text-4xl font-light leading-tight sm:text-5xl lg:text-6xl"
                    >
                        {t("reservation.title")}
                        <span className="mt-2 block italic text-[#d8c4a0]">
                            {t("reservation.titleEmphasis")}
                        </span>
                    </motion.h1>

                    <motion.p
                        variants={reveal}
                        className="mt-6 max-w-md text-sm leading-7 text-white/55 sm:text-base sm:leading-8"
                    >
                        {t("reservation.description")}
                    </motion.p>

                    <motion.img
                        variants={reveal}
                        src={reservationImage}
                        alt="777 Lounge"
                        loading="lazy"
                        decoding="async"
                        className="mt-8 aspect-[4/3] w-full rounded-2xl border border-white/10 object-cover"
                    />

                    <motion.div
                        variants={stagger}
                        className="mt-9 space-y-5"
                    >
                        <motion.div
                            variants={reveal}
                            className="flex items-start gap-4"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8c4a0]/20 text-[#d8c4a0]">
                                <span aria-hidden="true">✧</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium">
                                    {t("reservation.areaTitle")}
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-white/45">
                                    {t("reservation.areaDescription")}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={reveal}
                            className="flex items-start gap-4"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8c4a0]/20 text-[#d8c4a0]">
                                <span aria-hidden="true">◷</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium">
                                    {t("reservation.timeTitle")}
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-white/45">
                                    {t("reservation.timeDescription")}
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            variants={reveal}
                            className="flex items-start gap-4"
                        >
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d8c4a0]/20 text-[#d8c4a0]">
                                <span aria-hidden="true">↗</span>
                            </div>
                            <div>
                                <h2 className="text-sm font-medium">
                                    {t("reservation.contactTitle")}
                                </h2>
                                <p className="mt-1 text-xs leading-5 text-white/45">
                                    {t("reservation.contactDescription")}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Rezervasyon formu */}
                <motion.form
                    onSubmit={handleSubmit}
                    initial={{
                        opacity: 0,
                        x: shouldReduceMotion ? 0 : 45,
                        scale: shouldReduceMotion ? 1 : 0.98,
                        filter: shouldReduceMotion ? "blur(0px)" : "blur(6px)",
                    }}
                    animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                        filter: "blur(0px)",
                    }}
                    transition={{
                        duration: 1,
                        delay: 0.25,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="rounded-2xl border border-white/10 bg-[#0e0f0d] p-5 shadow-2xl shadow-black/20 sm:p-8 lg:p-10"
                >
                    <div className="mb-8 border-b border-white/10 pb-6">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-[#d8c4a0]">
                            777 Lounge
                        </p>
                        <h2 className="mt-3 text-2xl font-light sm:text-3xl">
                            {t("reservation.formTitle")}
                        </h2>
                        <p className="mt-2 text-xs leading-5 text-white/40">
                            {t("reservation.formDescription")}
                        </p>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                            <label htmlFor="reservation-name" className={labelClass}>
                                {t("reservation.name")}
                            </label>
                            <input
                                id="reservation-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                maxLength={100}
                                value={form.name}
                                onChange={(e) => updateField("name", e.target.value)}
                                placeholder={t("reservation.namePlaceholder")}
                                className={inputClass}
                            />
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="reservation-phone" className={labelClass}>
                                {t("reservation.phone")}
                            </label>
                            <input
                                id="reservation-phone"
                                name="phone"
                                type="tel"
                                autoComplete="tel"
                                required
                                maxLength={30}
                                value={form.phone}
                                onChange={(e) => updateField("phone", e.target.value)}
                                placeholder="+90 5XX XXX XX XX"
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="reservation-date" className={labelClass}>
                                {t("reservation.date")}
                            </label>
                            <input
                                id="reservation-date"
                                name="date"
                                type="date"
                                min={minDate}
                                required
                                value={form.date}
                                onChange={(e) => updateField("date", e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <label htmlFor="reservation-time" className={labelClass}>
                                {t("reservation.time")}
                            </label>
                            <input
                                id="reservation-time"
                                name="time"
                                type="text"
                                list="reservation-time-options"
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder={t("reservation.timePlaceholder")}
                                pattern="(?:[01][0-9]|2[0-3]):[0-5][0-9]"
                                title={t("reservation.timeFormatHint")}
                                required
                                value={form.time}
                                onChange={(e) => updateField("time", e.target.value)}
                                className={inputClass}
                            />
                            <datalist id="reservation-time-options">
                                {timeOptions.map((time) => (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                ))}
                            </datalist>
                        </div>

                        <div>
                            <label htmlFor="reservation-guests" className={labelClass}>
                                {t("reservation.guests")}
                            </label>
                            <input
                                id="reservation-guests"
                                name="guests"
                                type="text"
                                list="reservation-guest-options"
                                inputMode="numeric"
                                autoComplete="off"
                                placeholder={t("reservation.guestsPlaceholder")}
                                pattern="(?:[1-9][0-9]{0,2}|20[+])"
                                title={t("reservation.guestsFormatHint")}
                                required
                                value={form.guests}
                                onChange={(e) => updateField("guests", e.target.value)}
                                className={inputClass}
                            />
                            <datalist id="reservation-guest-options">
                                {Array.from({ length: 20 }, (_, i) => i + 1).map(
                                    (count) => (
                                        <option key={count} value={String(count)}>
                                            {count} {count === 1 ? t("reservation.person") : t("reservation.people")}
                                        </option>
                                    )
                                )}
                                <option value="20+">
                                    {t("reservation.twentyPlus")}
                                </option>
                            </datalist>
                        </div>

                        <div>
                            <label htmlFor="reservation-area" className={labelClass}>
                                {t("reservation.area")}
                            </label>
                            <select
                                id="reservation-area"
                                name="area"
                                required
                                value={form.area}
                                onChange={(e) => updateField("area", e.target.value)}
                                className={inputClass}
                            >
                                <option value="garden">
                                    {t("reservation.garden")}
                                </option>
                                <option value="indoor">
                                    {t("reservation.indoor")}
                                </option>
                                <option value="game-room">
                                    {t("reservation.gameRoom")}
                                </option>
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <label htmlFor="reservation-notes" className={labelClass}>
                                {t("reservation.notes")}
                            </label>
                            <textarea
                                id="reservation-notes"
                                name="notes"
                                rows={4}
                                maxLength={1000}
                                value={form.notes}
                                onChange={(e) => updateField("notes", e.target.value)}
                                placeholder={t("reservation.notesPlaceholder")}
                                className={`${inputClass} resize-y`}
                            />
                            <p className="mt-2 text-right text-[10px] text-white/30">
                                {form.notes.length}/1000
                            </p>
                        </div>
                    </div>

                    {error && (
                        <p role="alert" className="mt-5 text-sm text-red-400">
                            {error}
                        </p>
                    )}

                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={shouldReduceMotion ? undefined : {
                            scale: 1.015,
                            boxShadow: "0 0 28px rgba(216,196,160,0.18)",
                        }}
                        whileTap={shouldReduceMotion ? undefined : {
                            scale: 0.985,
                        }}
                        transition={{ duration: 0.2 }}
                        className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-[#d8c4a0] px-5 py-4 text-xs font-semibold uppercase tracking-[0.15em] text-[#11110f] transition duration-300 hover:bg-[#ead9b9] focus:outline-none focus:ring-2 focus:ring-[#d8c4a0] focus:ring-offset-2 focus:ring-offset-[#0e0f0d] disabled:cursor-wait disabled:opacity-60"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                            aria-hidden="true"
                        >
                            <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.5 0 .15 5.34.15 11.91c0 2.1.55 4.15 1.59 5.96L0 24l6.3-1.65a11.93 11.93 0 0 0 5.77 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.17-3.48-8.42ZM12.08 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.74.98 1-3.65-.23-.37a9.83 9.83 0 0 1-1.51-5.26c0-5.46 4.45-9.9 9.9-9.9a9.83 9.83 0 0 1 7 2.9 9.83 9.83 0 0 1 2.9 7c0 5.45-4.45 9.89-9.92 9.89Zm5.43-7.41c-.3-.15-1.76-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.47-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.17.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.64.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.08-.12-.27-.2-.57-.35Z" />
                        </svg>
                        {isSubmitting ? t("reservation.submitting") : t("reservation.whatsappButton")}
                    </motion.button>

                    <p className="mt-4 text-center text-[10px] leading-5 text-white/35">
                        {t("reservation.disclaimer")}
                    </p>
                </motion.form>
            </div>

            {/* Xəritə bölməsi */}
            <motion.div
                className="relative mx-auto mt-24 max-w-6xl sm:mt-32"
                variants={reveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.12 }}
            >
                <div className="mb-8 flex flex-col justify-between gap-5 sm:mb-10 sm:flex-row sm:items-end">
                    <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-[#d8c4a0] sm:text-xs">
                            {t("reservation.visit")}
                        </p>
                        <h2 className="mt-4 font-serif text-3xl font-light sm:text-4xl">
                            {t("reservation.mapTitle")}
                            <span className="ml-2 italic text-[#d8c4a0]">
                                {t("reservation.mapEmphasis")}
                            </span>
                        </h2>
                        <p className="mt-3 max-w-lg text-sm leading-6 text-white/50">
                            {t("reservation.mapDescription")}
                        </p>
                    </div>

                    <a
                        href={LOUNGE_MAP_LINK}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-fit items-center gap-3 rounded-full border border-[#d8c4a0]/30 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8d6b5] transition hover:border-[#d8c4a0] hover:bg-[#d8c4a0]/10"
                    >
                        {t("reservation.mapButton")}
                    </a>
                </div>

                <div className="group relative overflow-hidden rounded-2xl border border-[#d8c4a0]/20 bg-[#11110f] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:rounded-3xl sm:p-3">
                    <div className="pointer-events-none absolute inset-2 z-10 rounded-xl border border-white/10 sm:inset-3 sm:rounded-2xl" />

                    <iframe
                        title={t("reservation.mapTitleAttribute")}
                        src="https://maps.google.com/maps?q=777%20Lounge&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        className="h-[320px] w-full rounded-xl grayscale-[0.7] transition duration-700 group-hover:grayscale-0 sm:h-[440px] sm:rounded-2xl"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        allowFullScreen
                    />
                </div>

                <div className="mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] text-white/35">
                    <span className="h-px w-8 bg-[#d8c4a0]/60" />
                    {t("reservation.mapFooter")}
                </div>
            </motion.div>
        </section>
    );
}
