'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { Controller } from 'react-hook-form';
import classNames from 'classnames';
import { twMerge } from 'tailwind-merge';
import ValidationError from '@/components/ui/form-validation-error';
import TooltipLabel from '@/components/ui/tooltip-label';
import { useState } from 'react';
import {
    Plus,
    Trash2,
    Copy,
    Grid3X3,
    X,
} from 'lucide-react';

type TableEditorProps = {
    title?: string;
    control: any;
    name: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
};

const TableEditor = ({
    title,
    control,
    name,
    error,
    required,
    disabled,
}: TableEditorProps) => {
    const [showTableCreator, setShowTableCreator] = useState(false);
    const [tableRows, setTableRows] = useState(3);
    const [tableColumns, setTableColumns] = useState(3);

    return (
        <div className="mb-5">
            {title && (
                <TooltipLabel label={title} required={required} />
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const editor = useEditor({
                        extensions: [
                            StarterKit,
                            Table.configure({
                                resizable: true,
                                handleWidth: 4,
                                cellMinWidth: 50,
                                lastColumnResizable: true,
                                allowTableNodeSelection: true,
                            }),
                            TableRow,
                            TableHeader.configure({
                                HTMLAttributes: {
                                    class: 'bg-gray-100 border border-gray-300 p-2',
                                },
                            }),
                            TableCell.configure({
                                HTMLAttributes: {
                                    class: 'border border-gray-300 p-2',
                                },
                            }),
                        ],
                        content: field.value || '',
                        editable: !disabled,
                        immediatelyRender: false,
                        onUpdate: ({ editor }) => {
                            field.onChange(editor.getHTML());
                        },
                    });

                    if (!editor) {
                        return (
                            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                                <div className="text-center text-gray-500">Chargement de l'éditeur...</div>
                            </div>
                        );
                    }

                    const handleInsertTable = () => {
                        if (tableRows > 0 && tableColumns > 0) {
                            editor
                                .chain()
                                .focus()
                                .insertTable({ rows: tableRows, cols: tableColumns })
                                .run();
                            setShowTableCreator(false);
                        }
                    };

                    return (
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            {/* Barre d'outils structurée */}
                            <div className="bg-gray-50 border-b border-gray-200 p-4">
                                {/* Groupe 1: Créer/Insérer Tableau */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-gray-700">Tableau</h3>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setShowTableCreator(!showTableCreator)}
                                        disabled={disabled}
                                        className={classNames(
                                            'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                            disabled
                                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        )}
                                    >
                                        <Grid3X3 size={16} />
                                        <span>Insérer un tableau</span>
                                    </button>
                                </div>

                                {/* Sélecteur de dimensions */}
                                {showTableCreator && (
                                    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Lignes
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={tableRows}
                                                    onChange={(e) => setTableRows(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Colonnes
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={tableColumns}
                                                    onChange={(e) => setTableColumns(Math.max(1, parseInt(e.target.value) || 1))}
                                                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={handleInsertTable}
                                                className="flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm font-medium transition-colors"
                                            >
                                                Créer le tableau
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowTableCreator(false)}
                                                className="px-3 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded text-sm font-medium transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Groupe 2: Gestion des lignes */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Lignes</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        <ToolButton
                                            icon={<Plus size={16} />}
                                            label="Ajouter ligne avant"
                                            onClick={() => {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .addRowBefore()
                                                    .run();
                                            }}
                                            disabled={disabled || !editor.isActive('table')}
                                        />
                                        <ToolButton
                                            icon={<Plus size={16} />}
                                            label="Ajouter ligne après"
                                            onClick={() => {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .addRowAfter()
                                                    .run();
                                            }}
                                            disabled={disabled || !editor.isActive('table')}
                                        />
                                        <ToolButton
                                            icon={<Trash2 size={16} />}
                                            label="Supprimer ligne"
                                            onClick={() => {
                                                editor.chain().focus().deleteRow().run();
                                            }}
                                            disabled={disabled || !editor.isActive('table')}
                                            variant="danger"
                                        />
                                    </div>
                                </div>

                                {/* Groupe 3: Gestion des colonnes */}
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Colonnes</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        <ToolButton
                                            icon={<Plus size={16} />}
                                            label="Ajouter colonne avant"
                                            onClick={() => {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .addColumnBefore()
                                                    .run();
                                            }}
                                            disabled={disabled || !editor.isActive('table')}
                                        />
                                        <ToolButton
                                            icon={<Plus size={16} />}
                                            label="Ajouter colonne après"
                                            onClick={() => {
                                                editor
                                                    .chain()
                                                    .focus()
                                                    .addColumnAfter()
                                                    .run();
                                            }}
                                            disabled={disabled || !editor.isActive('table')}
                                        />
                                        <ToolButton
                                            icon={<Trash2 size={16} />}
                                            label="Supprimer colonne"
                                            onClick={() => {
                                                editor.chain().focus().deleteColumn().run();
                                            }}
                                            disabled={disabled || !editor.isActive('table')}
                                            variant="danger"
                                        />
                                    </div>
                                </div>

                                {/* Groupe 4: Actions globales */}
                                <div>
                                    <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Actions</h4>
                                    <div className="flex gap-2 flex-wrap">
                                        <ToolButton
                                            icon={<Trash2 size={16} />}
                                            label="Supprimer le tableau"
                                            onClick={() => {
                                                editor.chain().focus().deleteTable().run();
                                            }}
                                            disabled={disabled || !editor.isActive('table')}
                                            variant="danger"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Éditeur de contenu */}
                            <div className="p-4 bg-white">
                                <EditorContent
                                    editor={editor}
                                    className={classNames(
                                        'prose prose-sm max-w-none',
                                        disabled ? 'opacity-50 pointer-events-none' : ''
                                    )}
                                />
                            </div>
                        </div>
                    );
                }}
            />

            {error && <ValidationError message={error} />}
        </div>
    );
};

// Composant réutilisable pour les boutons d'outils
interface ToolButtonProps {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'default' | 'danger';
}

const ToolButton: React.FC<ToolButtonProps> = ({
    icon,
    label,
    onClick,
    disabled = false,
    variant = 'default',
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={label}
            className={classNames(
                'flex items-center gap-1 px-3 py-2 rounded text-sm font-medium transition-colors',
                disabled && 'opacity-50 cursor-not-allowed',
                !disabled &&
                variant === 'default' &&
                'bg-gray-200 hover:bg-gray-300 text-gray-700',
                !disabled &&
                variant === 'danger' &&
                'bg-red-100 hover:bg-red-200 text-red-700'
            )}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
};

export default TableEditor;