import 'quill-better-table/dist/quill-better-table.css';

export function registerQuillTable() {
    if (typeof window === 'undefined') return;

    const ReactQuill = require('react-quill');
    const Quill = ReactQuill?.Quill;

    if (!Quill) {
        console.warn('Quill not ready yet');
        return;
    }

    const QuillBetterTableModule = require('quill-better-table');
    const QuillBetterTable =
        QuillBetterTableModule.default || QuillBetterTableModule;

    // ⚠️ éviter double register
    if (Quill.imports && Quill.imports['modules/better-table']) {
        return;
    }

    Quill.register(
        {
            'modules/better-table': QuillBetterTable,
        },
        true
    );
}