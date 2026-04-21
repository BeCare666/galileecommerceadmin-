import React, { useState } from "react";
import {
    Building2,
    Package,
    Trash2,
    ShieldCheck,
} from "lucide-react";
import { getAuthCredentials } from "@/utils/auth-utils"; // adapte le path
import { toast } from 'react-toastify';
/* ================= TYPES ================= */

type CertificateScope = "supplier" | "product";

interface Certificate {
    badgeIcon: string;
    label: string;
    description: string;
    type: string;
    certificateType: string;
    validityPeriod: string;
    certificationAuthority: string;
    applicableSectors: string;
    applicableRegions: string;
    certificationNorms: string;
    advantages: string;
    images: string[];
    file: File | null;
    media_id?: number;
    certificateScope: CertificateScope;
}

interface Props {
    productId: number;
}

/* ================= CERTIFICATES MASTER ================= */

export const CERTIFICATE_OPTIONS = [
    {
        label: "CE",
        type: "CE",
        badgeIcon: "https://s.alicdn.com/@sc04/kf/Hdbbb6a106e8d4515be692063768d8fd4J.png",
    },
    {
        label: "ISO 9001",
        type: "ISO9001",
        badgeIcon: "https://www.iso.org/modules/isoorg-template/img/iso/iso-logo-print.gif",
    },
    {
        label: "ISO 14001",
        type: "ISO14001",
        badgeIcon: "https://www.iso.org/modules/isoorg-template/img/iso/iso-logo-print.gif",
    },
    {
        label: "ISO 45001",
        type: "ISO45001",
        badgeIcon: "https://www.iso.org/modules/isoorg-template/img/iso/iso-logo-print.gif",
    },
    {
        label: "RoHS",
        type: "ROHS",
        badgeIcon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF73k-wDCjfB-mlY2qW7rWTrcJbA_ZAKVMfQ&s",
    },
    {
        label: "FCC",
        type: "FCC",
        badgeIcon: "https://cdn.worldvectorlogo.com/logos/fcc.svg",
    },
    {
        label: "UL",
        type: "UL",
        badgeIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/UL_Mark.svg/960px-UL_Mark.svg.png",
    },
    {
        label: "SGS",
        type: "SGS",
        badgeIcon: "https://static.vecteezy.com/system/resources/previews/009/022/719/non_2x/sgs-logo-sgs-letter-sgs-letter-logo-design-initials-sgs-logo-linked-with-circle-and-uppercase-monogram-logo-sgs-typography-for-technology-business-and-real-estate-brand-vector.jpg",
    },
    {
        label: "TÜV",
        type: "TUV",
        badgeIcon: "https://logowik.com/content/uploads/images/tuv-rheinland-certified7623.jpg",
    },
    {
        label: "CSA",
        type: "CSA",
        badgeIcon: "https://s.alicdn.com/@sc04/kf/H4d63ce257be542828ef4196e9c3d45cdw.png",
    },
    {
        label: "CWB",
        type: "CWB",
        badgeIcon: "https://s.alicdn.com/@sc04/kf/H01e7137dcba34b9a9182d0fd0aa347f8L.png",
    },
    {
        label: "UKCA",
        type: "UKCA",
        badgeIcon: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/UKCA_filled.svg/960px-UKCA_filled.svg.png?_=20210207231830",
    },
];

/* ================= COMPONENT ================= */

export default function CertificatesManager({ productId }: Props) {
    const [open, setOpen] = useState<CertificateScope | null>(null);

    const [certificates, setCertificates] = useState<Certificate[]>([]);

    const [form, setForm] = useState<Certificate>({
        badgeIcon: "",
        label: "",
        description: "",
        type: "",
        certificateType: "",
        validityPeriod: "",
        certificationAuthority: "",
        applicableSectors: "",
        applicableRegions: "",
        certificationNorms: "",
        advantages: "",
        images: [],
        file: null,
        certificateScope: "product",
    });

    /* ========= UPLOAD ========= */

    const uploadFile = async (file: File | null): Promise<number> => {
        if (!file) throw new Error("No file");

        const fd = new FormData();

        // 🔥 CORRECTION ICI
        fd.append("attachment", file);

        const API = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;

        const { token } = getAuthCredentials();

        const res = await fetch(`${API}/attachments`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: fd,
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        const data = await res.json();

        // ⚠️ ton backend retourne un ARRAY
        return data[0]?.id;
    };

    /* ========= ADD CERT ========= */

    const handleSubmit = async () => {
        const media_id = await uploadFile(form.file);

        const newCert: Certificate = {
            ...form,
            media_id,
            certificateScope: open!,
        };

        setCertificates([...certificates, newCert]);
        setOpen(null);
    };

    /* ========= SEND BACK ========= */

    const submitAll = async () => {
        const API = process.env.NEXT_PUBLIC_REST_API_ENDPOINT;
        const { token } = getAuthCredentials();

        const loadingToast = toast.loading("Saving certificates...");

        try {
            const res = await fetch(`${API}/productscertificat/certificates`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // 🔥 IMPORTANT (sinon 401)
                },
                body: JSON.stringify({
                    product_id: productId,
                    certificates,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.message || "Failed to save certificates");
            }
            toast.dismiss(loadingToast);
            toast.success(`✅ ${data.inserted || certificates.length} certificates saved`);


        } catch (error: any) {
            console.error(error);
            toast.dismiss(loadingToast);
            toast.error(error.message || "❌ Error while saving certificates");
        }
    };

    /* ========= UI ========= */

    return (
        <div className="space-y-4">

            {/* ACTIONS */}
            <div className="flex gap-2">
                <button
                    onClick={() => setOpen("supplier")}
                    className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded"
                >
                    <Building2 size={16} /> Supplier
                </button>

                <button
                    onClick={() => setOpen("product")}
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded"
                >
                    <Package size={16} /> Product
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-2">
                {certificates.map((c, i) => (
                    <div key={i} className="border p-2 rounded flex gap-2 items-center">
                        <img src={c.badgeIcon} className="w-6 h-6" />
                        <span className="font-medium">{c.label}</span>
                        <span className="text-xs text-gray-500">{c.certificateScope}</span>
                        <Trash2 className="ml-auto text-red-500 cursor-pointer" size={16} />
                    </div>
                ))}
            </div>

            {/* SAVE */}
            <button
                onClick={submitAll}
                className="w-full bg-black text-white py-2 rounded"
            >
                Save Certificates
            </button>

            {/* MODAL */}
            {open && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-xl w-[500px] space-y-3">

                        <h2 className="font-bold flex gap-2 items-center">
                            <ShieldCheck /> Add Certificate
                        </h2>

                        {/* SELECT */}
                        <select
                            className="w-full border p-2 rounded"
                            onChange={(e) => {
                                const selected = CERTIFICATE_OPTIONS.find(
                                    (c) => c.type === e.target.value
                                );
                                if (selected) {
                                    setForm({
                                        ...form,
                                        label: selected.label,
                                        type: selected.type,
                                        badgeIcon: selected.badgeIcon,
                                    });
                                }
                            }}
                        >
                            <option>Select certificate</option>
                            {CERTIFICATE_OPTIONS.map((c) => (
                                <option key={c.type} value={c.type}>
                                    {c.label}
                                </option>
                            ))}
                        </select>

                        {/* PREVIEW */}
                        {form.badgeIcon && (
                            <div className="flex gap-2 items-center">
                                <img src={form.badgeIcon} className="w-8 h-8" />
                                <span>{form.label}</span>
                            </div>
                        )}

                        {/* INPUTS */}
                        {/* INPUTS COMPLETS */}
                        <input
                            placeholder="description"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, description: e.target.value })
                            }
                        />

                        <input
                            placeholder="certificateType"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, certificateType: e.target.value })
                            }
                        />

                        <input
                            placeholder="validityPeriod"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, validityPeriod: e.target.value })
                            }
                        />

                        <input
                            placeholder="certificationAuthority"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, certificationAuthority: e.target.value })
                            }
                        />

                        <input
                            placeholder="applicableSectors"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, applicableSectors: e.target.value })
                            }
                        />

                        <input
                            placeholder="applicableRegions"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, applicableRegions: e.target.value })
                            }
                        />

                        <input
                            placeholder="certificationNorms"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, certificationNorms: e.target.value })
                            }
                        />

                        <textarea
                            placeholder="advantages"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, advantages: e.target.value })
                            }
                        />


                        <input
                            placeholder="certificateType"
                            className="border p-2 w-full"
                            onChange={(e) =>
                                setForm({ ...form, certificateType: e.target.value })
                            }
                        />

                        <input
                            type="file"
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    file: e.target.files ? e.target.files[0] : null,
                                })
                            }
                        />

                        {/* ACTIONS */}
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setOpen(null)}>Cancel</button>
                            <button
                                onClick={handleSubmit}
                                className="bg-black text-white px-3 py-1 rounded"
                            >
                                Save
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}