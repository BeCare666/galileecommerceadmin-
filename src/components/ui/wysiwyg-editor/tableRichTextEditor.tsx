'use client';

import classNames from 'classnames';
import { useMemo, useRef, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { twMerge } from 'tailwind-merge';
import ValidationError from '@/components/ui/form-validation-error';
import TooltipLabel from '@/components/ui/tooltip-label';
import { registerQuillTable } from '@/utils/quill-table';
import 'react-quill/dist/quill.snow.css';

// ✅ Chargement dynamique (ANTI SSR CRASH)
const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
});

export type TableRichTextEditorProps = {
    title?: string;
    className?: string;
    editorClassName?: string;
    control: any;
    name: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    toolTipText?: string;
};

const TableRichTextEditor: React.FC<TableRichTextEditorProps> = ({
    title,
    control,
    name,
    className,
    editorClassName,
    required,
    disabled,
    error,
    toolTipText,
}) => {
    const quillRef = useRef<any>(null);

    // ✅ Enregistre le module table côté client uniquement
    useEffect(() => {
        const timer = setTimeout(() => {
            registerQuillTable();
        }, 100);

        return () => clearTimeout(timer);
    }, []);

    // ✅ Modules (chargés dynamiquement)
    const modules: any = useMemo(() => {
        if (typeof window === 'undefined') return undefined;

        const QuillBetterTableModule = require('quill-better-table');
        const QuillBetterTable =
            QuillBetterTableModule.default || QuillBetterTableModule;

        return {
            toolbar: {
                container: [['table']],
            },

            table: false,

            'better-table': {
                operationMenu: {
                    items: {
                        insertColumnRight: { text: 'Ajouter colonne droite' },
                        insertColumnLeft: { text: 'Ajouter colonne gauche' },
                        insertRowUp: { text: 'Ajouter ligne au-dessus' },
                        insertRowDown: { text: 'Ajouter ligne en dessous' },
                        deleteColumn: { text: 'Supprimer colonne' },
                        deleteRow: { text: 'Supprimer ligne' },
                        deleteTable: { text: 'Supprimer tableau' },
                    },
                },
            },

            keyboard: {
                bindings: QuillBetterTable?.keyboardBindings || {},
            },
        };
    }, []);

    const formats = ['table', 'table-cell', 'table-row'];

    return (
        <div className={twMerge(classNames('react-quill-table', className))}>
            {title && (
                <TooltipLabel
                    htmlFor={name}
                    toolTipText={toolTipText}
                    label={title}
                    required={required}
                />
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <ReactQuill
                        id={name}
                        theme="snow"
                        modules={modules}
                        formats={formats}
                        value={field.value || ''}
                        onChange={(_value, _delta, _source, editor) => {
                            field.onChange(editor.getHTML());
                        }}
                        className={twMerge(
                            classNames(
                                'relative mb-5 rounded border border-border-base',
                                editorClassName,
                                disabled
                                    ? 'select-none bg-[#EEF1F4] cursor-not-allowed'
                                    : ''
                            )
                        )}

                        readOnly={disabled}
                    />
                )}
            />

            {error && <ValidationError message={error} />}
        </div>
    );
};

export default TableRichTextEditor;