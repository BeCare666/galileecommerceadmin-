'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';

type TableRow = {
    label: string;
    value: string;
};

export default function ProductTableInput({ control, name }: any) {
    const [rows, setRows] = useState<TableRow[]>([
        { label: '', value: '' },
    ]);

    const addRow = () => {
        setRows([...rows, { label: '', value: '' }]);
    };

    const removeRow = (index: number) => {
        const updated = [...rows];
        updated.splice(index, 1);
        setRows(updated);
    };

    const updateRow = (index: number, field: 'label' | 'value', val: string) => {
        const updated = [...rows];
        updated[index][field] = val;
        setRows(updated);
    };

    return (
        <Controller
            control={control}
            name={name}
            defaultValue={rows}
            render={({ field }) => (
                <div className="space-y-3">
                    {rows.map((row, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                placeholder="Caractéristique"
                                value={row.label}
                                onChange={(e) => {
                                    updateRow(index, 'label', e.target.value);
                                    field.onChange(rows);
                                }}
                                className="border p-2 w-1/2 rounded"
                            />

                            <input
                                placeholder="Valeur"
                                value={row.value}
                                onChange={(e) => {
                                    updateRow(index, 'value', e.target.value);
                                    field.onChange(rows);
                                }}
                                className="border p-2 w-1/2 rounded"
                            />

                            <button
                                type="button"
                                onClick={() => removeRow(index)}
                                className="text-red-500"
                            >
                                X
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={addRow}
                        className="bg-black text-white px-3 py-1 rounded"
                    >
                        + Ajouter ligne
                    </button>
                </div>
            )}
        />
    );
}