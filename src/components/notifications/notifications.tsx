"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "next-i18next";
import { getAuthCredentials, hasAccess, adminOnly } from "@/utils/auth-utils";

type Notif = {
    id?: number | string;
    title?: string;
    message?: string;
    is_read?: boolean | number;
    link?: string;
    created_at?: string;
    type?: string;
    [k: string]: any;
};



function BellIcon({ className = "" }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
        >
            <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
    );
}

function NotificationItem({ notif, t }: { notif: Notif; t: (key: string) => string }) {
    const title = notif?.title ?? t("common:text-notifications");
    const message = notif?.message ?? "";
    const isRead = !!notif?.is_read;

    return (
        <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition cursor-pointer">
            <div className="w-10 h-10 flex items-center justify-center shrink-0 mr-7">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 01-3.46 0" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/90 truncate">{title}</p>
                <p className="text-xs text-white/60 mt-1 line-clamp-2">{message}</p>
                <div className="mt-2 flex items-center gap-3">
                    {notif?.link && (
                        <a className="text-[11px] text-accent underline" href={notif.link}>
                            {t("common:text-notification-open")}
                        </a>
                    )}
                    <span className="text-[11px] text-white/40 ml-auto">
                        {notif?.created_at ? new Date(notif.created_at).toLocaleString() : ""}
                    </span>
                </div>
            </div>
            {!isRead && <span className="ml-3 bg-red-500 text-white text-[11px] px-2 py-0.5 rounded-full">{t("common:text-notification-new")}</span>}
        </div>
    );
}

export default function Notifications() {
    const { t } = useTranslation("common");
    const [open, setOpen] = useState(false);
    const [list, setList] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(true);
    const ref = useRef<HTMLDivElement | null>(null);

    const API = (process.env.NEXT_PUBLIC_REST_API_ENDPOINT || "").replace(/\/$/, "");

    // fetch notifications & normalize result to array
    async function load() {
        setLoading(true);
        try {
            // get auth info from your util (must exist in your codebase)
            const auth = getAuthCredentials?.() ?? {};
            const permissions = auth?.permissions ?? [];
            const user = auth?.user ?? (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : null);
            console.log("auths", auth)
            const isAdmin = hasAccess(adminOnly, permissions);

            // decide endpoint according to admin vs user
            let endpoint = "";
            if (isAdmin) {
                // admin: fetch all
                endpoint = `${API}/notifications`;
            } else {
                const userId = user?.id ?? "";
                endpoint = `${API}/notifications/${userId}`;
            }

            const res = await fetch(endpoint, { cache: "no-store" });
            const json = await res.json().catch(() => null);

            // normalize
            let arr: Notif[] = [];
            if (Array.isArray(json)) arr = json;
            else if (Array.isArray(json?.data)) arr = json.data;
            else if (Array.isArray(json?.notifications)) arr = json.notifications;
            else if (Array.isArray(json?.rows)) arr = json.rows;
            else arr = [];

            setList(arr);
        } catch (err) {
            // fail silently but keep UI stable
            setList([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
        // optional: poll or subscribe for realtime later
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // close on outside click
    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return;
            if (!ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener("click", onDoc);
        return () => document.removeEventListener("click", onDoc);
    }, []);

    const unreadCount = Array.isArray(list) ? list.filter(n => !n?.is_read).length : 0;

    return (
        <div className="relative" ref={ref}>
            <button
                aria-expanded={open}
                aria-haspopup="true"
                onClick={() => setOpen(o => !o)}
                className="relative p-2.5 rounded-lg hover:bg-gray-100 transition-smooth mr-2 lg:mr-4"
                title={t("text-notifications")}
            >
                <BellIcon className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold rounded-full bg-red-500 text-white ring-2 ring-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="relative z-50">

                    {/* BACKDROP */}
                    <div
                        onClick={() => { setList([]); setOpen(false); }}
                        className="
                fixed inset-0 bg-black/30 backdrop-blur-[2px]
                animate-fadeIn
            "
                    />

                    {/* PANEL */}
                    <div
                        className="
                absolute right-0 mt-3 w-[380px] max-h-[68vh]
                rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.22)]
                bg-gradient-to-b from-[#0e0e11]/90 to-[#131316]/90
                border border-white/10 backdrop-blur-xl
                p-4
                animate-slideDown
            "
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                            <h4 className="text-sm font-semibold text-white tracking-wide">{t("text-notifications")}</h4>
                            <button
                                onClick={() => { setOpen(false); }}
                                className="text-xs text-white/40 hover:text-white/70 transition-colors px-2 py-1 rounded-md"
                            >
                                {t("text-notifications-close")}
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="mt-4 space-y-2 overflow-y-auto max-h-[52vh] pr-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {loading && (
                                <div className="p-6 text-center text-sm text-white/50">
                                    {t("text-notifications-loading")}
                                </div>
                            )}
                            {!loading && list.length === 0 && (
                                <div className="p-6 text-center text-sm text-white/40">
                                    {t("text-notifications-none")}
                                </div>
                            )}
                            {!loading &&
                                list.map((notif) => (
                                    <NotificationItem
                                        key={notif.id ?? JSON.stringify(notif)}
                                        notif={notif}
                                        t={t}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
