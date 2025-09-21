import SelectInput from '@/components/ui/select-input';
import Label from '@/components/ui/label';
import { Control, useFormState, useWatch, useFormContext } from 'react-hook-form';
import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'next-i18next';
import { useCategoriesQuery } from '@/data/category';
import { useRouter } from 'next/router';
import cn from 'clsx';

/** Petite icône check inline (SVG) */
function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface Props {
  control: Control<any>;
  setValue: any;
}

const ProductCategoryInput = ({ control, setValue }: Props) => {
  const { locale } = useRouter();
  const { t } = useTranslation('common');

  const { categories, loading } = useCategoriesQuery({
    limit: 999,
    language: locale,
  });

  const [openPanel, setOpenPanel] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [subCategories, setSubCategories] = useState<any[] | null>(null);
  const [subSubCategories, setSubSubCategories] = useState<any[] | null>(null);
  const [selectedSubCategories, setSelectedSubCategories] = useState<Set<number>>(new Set());
  const [selectedSubSubCategories, setSelectedSubSubCategories] = useState<Set<number>>(new Set());

  const containerRef = useRef<HTMLDivElement | null>(null);

  const API_BASE = `${process.env.NEXT_PUBLIC_REST_API_ENDPOINT}`;
  const headers = { 'Content-Type': 'application/json' };

  function toggleSet(setState: React.Dispatch<React.SetStateAction<Set<number>>>, value: number) {
    setState((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  async function loadSubCategories(categoryId: number) {
    setSubCategories(null);
    setSubSubCategories(null);
    try {
      const res = await fetch(`${API_BASE}/souscategories/bycategory?categories_id=${categoryId}`, { headers });
      if (!res.ok) throw new Error('Failed to load subcategories');
      const payload = await res.json();
      setSubCategories(payload?.data ?? []);
    } catch (err) {
      console.error(err);
      setSubCategories([]);
    }
  }

  async function loadSubSubCategories(subCategoryId: number) {
    setSubSubCategories(null);
    try {
      const res = await fetch(`${API_BASE}/subcategories/bycategory?categories_id=${subCategoryId}`, { headers });
      if (!res.ok) throw new Error('Failed to load subsubcategories');
      const payload = await res.json();
      setSubSubCategories(payload?.data ?? []);
    } catch (err) {
      console.error(err);
      setSubSubCategories([]);
    }
  }

  function handleCategoryClick(catId: number) {
    setSelectedCategory(catId);
    setSelectedSubCategories(new Set());
    setSelectedSubSubCategories(new Set());
    loadSubCategories(catId);
  }

  function handleSubCategoryClick(subId: number) {
    toggleSet(setSelectedSubCategories, subId);
    if (!selectedSubCategories.has(subId)) loadSubSubCategories(subId);
    else setSubSubCategories(null);
  }

  function handleSubSubCategoryClick(subSubId: number) {
    toggleSet(setSelectedSubSubCategories, subSubId);
  }

  function applySelection() {
    const categoriesPayload = [
      {
        categories_id: selectedCategory,
        sous_categories_id: Array.from(selectedSubCategories),
        sub_categories_id: Array.from(selectedSubSubCategories),
      },
    ];

    setValue('categories', categoriesPayload); // <-- mettre dans le tableau attendu
    setOpenPanel(false);
  }


  // close panel on outside click
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpenPanel(false);
    }
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <div className="mb-5 relative" ref={containerRef}>
      <Label>{t('form:input-label-categories')}</Label>
      <div
        onClick={() => setOpenPanel((p) => !p)}
        className="border rounded-md px-3 py-2 cursor-pointer bg-white flex justify-between items-center text-gray-500"
      >
        <span>
          {selectedCategory
            ? categories.find((c) => c.id === selectedCategory)?.name
            : t('text-select-category')}
        </span>
        <span>▾</span>
      </div>

      {openPanel && (
        <div className="absolute z-50 mt-1 w-full bg-white border shadow-lg rounded-md p-4 max-h-[400px] overflow-auto">
          {/* Categories list */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">{t('form:categories')}</h4>
            <ul className="space-y-1">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className={cn(
                    'p-2 rounded cursor-pointer text-gray-500',
                    { 'bg-pink-50': selectedCategory !== null && selectedCategory === c.id }
                  )}
                  onClick={() => handleCategoryClick(c.id)}
                >
                  {c.name} {c.has_children ? '▸' : ''}
                </li>
              ))}
            </ul>
          </div>

          {/* Subcategories */}
          {subCategories && subCategories.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2 text-gray-500">{t('form:subcategories')}</h4>
              <ul className="space-y-1">
                {subCategories.map((s) => {
                  const selected = selectedSubCategories.has(s.id);
                  return (
                    <li
                      key={s.id}
                      className={cn('flex items-center justify-between p-2 rounded cursor-pointer text-gray-500', {
                        'bg-pink-50': selected,
                      })}
                      onClick={() => handleSubCategoryClick(s.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-5 w-5 rounded-sm border flex items-center justify-center text-gray-500',
                            { 'bg-pink-500 border-pink-500 text-gray-500': selected, 'bg-white': !selected }
                          )}
                        >
                          {selected && <CheckIcon />}
                        </div>
                        {s.name}
                      </div>
                      {s.has_children ? <small>▸</small> : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {/* Sub-subcategories */}
          {subSubCategories && subSubCategories.length > 0 && (
            <div className="mb-4">
              <h4 className="font-medium mb-2">{t('form:sub-subcategories')}</h4>
              <ul className="space-y-1">
                {subSubCategories.map((ss) => {
                  const selected = selectedSubSubCategories.has(ss.id);
                  return (
                    <li
                      key={ss.id}
                      className={cn('flex items-center p-2 rounded cursor-pointer text-gray-500', {
                        'bg-pink-50': selected,
                      })}
                      onClick={() => handleSubSubCategoryClick(ss.id)}
                    >
                      <div
                        className={cn(
                          'h-5 w-5 rounded-sm border flex items-center justify-center',
                          { 'bg-pink-500 border-pink-500 text-gray-500': selected, 'bg-white': !selected }
                        )}
                      >
                        {selected && <CheckIcon />}
                      </div>
                      {ss.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <button onClick={() => setOpenPanel(false)} className="px-4 py-2 border rounded text-gray-500">
              {t('form:close')}
            </button>
            <button onClick={applySelection} className="px-4 py-2 bg-pink-500 text-gray-500 rounded">
              {t('form:apply')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategoryInput;
