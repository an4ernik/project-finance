import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Archive, Edit, Plus, Search, Trash2, Undo2, X} from 'lucide-react';
import {useMemo, useState} from 'react';
import {useGetCategories} from '@/shared/api/generated/category-management/category-management';
import {CategoryResponseDTOStatus} from '@/shared/api/models/categoryResponseDTOStatus';
import {GetCategoriesTypeItem} from '@/shared/api/models/getCategoriesTypeItem';
import type {CategoryResponseDTO} from '@/shared/api/models';
import {cn} from '@/lib/utils';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import {ICONS_BY_ID} from './IconPicker';
import {useTranslation} from 'react-i18next';
import {useQueryClient} from '@tanstack/react-query';
import {
  getGetCategoriesQueryKey,
  useDeleteCategory,
  useUpdateCategory,
} from '@/shared/api/generated/category-management/category-management';
import {UpdateCategoryDTOStatus} from '@/shared/api/models/updateCategoryDTOStatus';
import {UpdateCategoryDTOType} from '@/shared/api/models/updateCategoryDTOType';
import {toast} from 'sonner';

type Props = {
  onClose: () => void;
};

function CategoriesManager({onClose}: Props) {
  const {t} = useTranslation();
  const [isArchive, setIsArchive] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponseDTO | null>(null);
  const [drafts, setDrafts] = useState<
    Record<
      number,
      {
        name?: string;
        icon?: string | null;
        status?: UpdateCategoryDTOStatus;
        type?: UpdateCategoryDTOType;
      }
    >
  >({});
  const [deletedIds, setDeletedIds] = useState<Set<number>>(new Set());
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const {mutateAsync: updateCategory} = useUpdateCategory();
  const {mutateAsync: deleteCategory} = useDeleteCategory();

  const trimmedSearch = search.trim();
  const categoriesParams = {
    name: trimmedSearch,
    type: [GetCategoriesTypeItem.INCOME],
  };

  const {data, isLoading} = useGetCategories(categoriesParams as any);

  const categories = (
    Array.isArray(data) ? data : (data?.data ?? [])
  ) as CategoryResponseDTO[];
  const mergedCategories = useMemo(() => {
    return categories
      .map(category => {
        const id = category.id;
        if (!id) return category;
        const draft = drafts[id];
        if (!draft) return category;
        return {
          ...category,
          ...draft,
        } as CategoryResponseDTO;
      })
      .filter(category => {
        const id = category.id;
        if (id && deletedIds.has(id)) {
          return false;
        }
        return true;
      });
  }, [categories, drafts, deletedIds]);

  const visibleCategories = mergedCategories.filter(category => {
    const status = category.status ?? CategoryResponseDTOStatus.ACTIVE;
    return isArchive
      ? status === CategoryResponseDTOStatus.ARCHIVED
      : status === CategoryResponseDTOStatus.ACTIVE;
  });
  const listTitle = isArchive
    ? t('income.categories.archivedTitle')
    : t('income.categories.incomeTitle');

  const hasChanges =
    deletedIds.size > 0 ||
    Object.keys(drafts).some(key => {
      const id = Number(key);
      const draft = drafts[id];
      const original = categories.find(item => item.id === id);
      if (!draft || !original) return false;
      const nextName = draft.name ?? original.name ?? '';
      const nextIcon = draft.icon ?? original.icon ?? '';
      const nextStatus =
        draft.status ?? original.status ?? CategoryResponseDTOStatus.ACTIVE;
      return (
        nextName !== (original.name ?? '') ||
        nextIcon !== (original.icon ?? '') ||
        nextStatus !== (original.status ?? CategoryResponseDTOStatus.ACTIVE)
      );
    });

  const handleToggleArchive = (category: CategoryResponseDTO) => {
    if (!category.id) return;
    const nextStatus =
      (category.status ?? CategoryResponseDTOStatus.ACTIVE) ===
      CategoryResponseDTOStatus.ARCHIVED
        ? UpdateCategoryDTOStatus.ACTIVE
        : UpdateCategoryDTOStatus.ARCHIVED;
    setDrafts(prev => ({
      ...prev,
      [category.id!]: {
        ...prev[category.id!],
        status: nextStatus,
        type: (category.type ??
          GetCategoriesTypeItem.INCOME) as UpdateCategoryDTOType,
      },
    }));
  };

  const handleDelete = (category: CategoryResponseDTO) => {
    if (!category.id) return;
    setDeletedIds(prev => {
      const next = new Set(prev);
      next.add(category.id!);
      return next;
    });
  };

  const handleSave = async () => {
    if (!hasChanges || isSaving) return;
    setIsSaving(true);
    try {
      const updatePromises = Object.entries(drafts)
        .map(([idRaw, draft]) => {
          const id = Number(idRaw);
          if (Number.isNaN(id)) return null;
          const original = categories.find(item => item.id === id);
          if (!original || deletedIds.has(id)) return null;
          const data = {
            name: draft.name ?? original.name ?? '',
            icon: draft.icon ?? original.icon,
            type: (draft.type ??
              original.type ??
              GetCategoriesTypeItem.INCOME) as UpdateCategoryDTOType,
            status: (draft.status ??
              original.status ??
              CategoryResponseDTOStatus.ACTIVE) as UpdateCategoryDTOStatus,
          };
          const isDirty =
            data.name !== (original.name ?? '') ||
            data.icon !== (original.icon ?? '') ||
            data.status !==
              (original.status ?? CategoryResponseDTOStatus.ACTIVE);
          if (!isDirty) return null;
          return updateCategory({categoryId: id, data});
        })
        .filter(Boolean) as Promise<unknown>[];

      const deletePromises = Array.from(deletedIds).map(id =>
        deleteCategory({categoryId: id}),
      );

      await Promise.all([...updatePromises, ...deletePromises]);
      await queryClient.invalidateQueries({
        queryKey: getGetCategoriesQueryKey(categoriesParams as any),
      });
      setDrafts({});
      setDeletedIds(new Set());
      toast.success(t('income.categories.saveSuccess'));
    } catch (err) {
      toast.error(t('income.categories.saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="md:fixed inset-0 flex items-center md:justify-center md:z-50 md:bg-black/40 md:backdrop-blur-[6.2px] md:p-4">
      <div className="flex h-[781px] w-full max-w-[342px] flex-col overflow-hidden rounded-2xl bg-card dark:bg-[#142624] [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] backdrop-blur-[32px] md:h-[766px] md:max-w-[900px]">
        {isAddOpen ? (
          <AddCategory
            onClose={() => setIsAddOpen(false)}
            type={GetCategoriesTypeItem.INCOME}
          />
        ) : editingCategory ? (
          <EditCategory
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
            onSave={(nextName, nextIcon) => {
              if (!editingCategory.id) return;
              setDrafts(prev => ({
                ...prev,
                [editingCategory.id!]: {
                  ...prev[editingCategory.id!],
                  name: nextName,
                  icon: nextIcon,
                },
              }));
              setEditingCategory(null);
            }}
          />
        ) : (
          <>
            <div className="flex items-center justify-between px-6 h-[79px]">
              <h2 className="text-[20px] font-medium leading-[1.167]">
                {t('income.categories.managerTitle')}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-12.5 w-12.5 items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex min-h-0 flex-1 flex-col items-center gap-2.5 px-6 pt-px">
              <div className="flex w-full max-w-[820px] items-center justify-between gap-4">
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="tab"
                    size="sm"
                    onClick={() => setIsArchive(false)}
                    className={cn(
                      'w-[88px]',
                      !isArchive &&
                        'border-transparent [background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)]',
                    )}
                  >
                    {t('income.categories.active')}
                  </Button>
                  <Button
                    type="button"
                    variant="tab"
                    size="sm"
                    onClick={() => setIsArchive(true)}
                    className={cn(
                      'w-[88px]',
                      isArchive &&
                        'border-transparent [background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)]',
                    )}
                  >
                    {t('income.categories.archived')}
                  </Button>
                </div>
                <div className="w-full max-w-[360px]">
                  <Input
                    type="search"
                    icon={<Search className="size-4" />}
                    placeholder={t('income.categories.searchPlaceholder')}
                    value={search}
                    onChange={event => setSearch(event.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={() => setIsAddOpen(true)}
                className="cursor-pointer h-12.5 w-full max-w-[820px] gap-2 border-transparent text-[#e6e6e6] [background:radial-gradient(circle_at_51%_31%,rgba(255,255,255,0.2)_0%,rgba(153,153,153,0.01)_100%),linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_50%)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]"
              >
                <Plus className="size-4" />
                {t('income.categories.createNew')}
              </Button>

              <div className="mt-2 flex w-full max-w-[820px] min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-3">
                {isLoading ? (
                  <div className="text-muted-foreground">
                    {t('income.categories.loading')}
                  </div>
                ) : visibleCategories.length > 0 ? (
                  <>
                    <p className="text-[16px] leading-[1.167] text-foreground">
                      {listTitle}
                      {` (${visibleCategories.length})`}
                    </p>
                    {visibleCategories.map(category => {
                      const Icon = category.icon
                        ? ICONS_BY_ID[category.icon]
                        : null;
                      return (
                        <div
                          key={`${category.type}-${category.name}`}
                          className={cn(
                            'flex items-center justify-between rounded-[12px] px-4 py-4 border border-white/10 bg-linear-to-b from-[rgba(49,95,85,0.18)] to-[rgba(11,21,20,0.12)] hover:border-transparent hover:[background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_60%)] transition-all duration-500',
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex size-12 items-center justify-center rounded-[10px] bg-foreground/10">
                              {Icon ? (
                                <Icon className="size-6 text-foreground" />
                              ) : null}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[16px] leading-[1.167] text-foreground">
                                {category.name}
                              </span>
                              <span className="mt-1 inline-flex w-fit items-center rounded-md bg-foreground/10 px-2 py-0.5 text-[10px] leading-[1.167] text-foreground">
                                {category.type === 'INCOME'
                                  ? t('income.categories.typeIncome')
                                  : t('income.categories.typeExpense')}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {!isArchive && (
                              <button
                                type="button"
                                onClick={() => setEditingCategory(category)}
                                className="flex size-11 items-center justify-center rounded-[10px] border border-white/30 bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] text-foreground [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
                              >
                                <Edit className="size-5" />
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleToggleArchive(category)}
                              className="flex size-11 items-center justify-center rounded-[10px] border border-white/30 bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] text-foreground [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
                            >
                              {isArchive ? (
                                <Undo2 className="size-5 text-foreground" />
                              ) : (
                                <Archive className="size-5 text-foreground" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(category)}
                              className="flex size-11 items-center justify-center rounded-[10px] border border-white/10 bg-[#8a0f0f] text-white [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.2),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
                            >
                              <Trash2 className="size-5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
                    <div
                      className="cursor-pointer flex size-20 items-center justify-center rounded-[10px] border border-[#5a736e] bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
                      onClick={() => setIsAddOpen(true)}
                    >
                      <Plus className="size-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-[16px] leading-[1.167] text-foreground">
                      {isArchive
                        ? t('income.categories.emptyArchivedTitle')
                        : t('income.categories.emptyTitle')}
                    </h3>
                    <p className="text-[14px] leading-[1.167] text-muted-foreground">
                      {isArchive
                        ? t('income.categories.emptyArchivedSubtitle')
                        : t('income.categories.emptySubtitle')}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between gap-6 border-t border-white/[0.14] px-6 py-6">
              <Button
                onClick={onClose}
                className="h-12.5 w-full max-w-[360px] text-foreground bg-linear-to-b from-[rgba(11,21,20,0.01)] via-[rgba(49,95,85,0.1)] to-[rgba(144,208,182,0.05)] border border-white/30 [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]"
              >
                {t('income.categories.cancel')}
              </Button>
              <Button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className="h-12.5 w-full max-w-[360px] [background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_100%)] [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.25),0px_4px_4px_0px_rgba(75,75,75,0.35)]"
              >
                {isSaving
                  ? t('income.categories.saving')
                  : t('income.categories.save')}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CategoriesManager;
