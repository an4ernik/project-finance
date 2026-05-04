import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {cn} from '@/lib/utils';
import {useQueryClient} from '@tanstack/react-query';
import {
  Archive,
  Edit,
  Plus,
  Search,
  Trash,
  ArchiveRestore,
  X,
} from 'lucide-react';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'sonner';

import {
  getGetCategoriesQueryKey,
  useDeleteCategory,
  useGetCategories,
  useArchiveCategory,
  useUnarchiveCategory,
} from '@/shared/api/generated/category-management/category-management';
import type {CategoryResponseDTO} from '@/shared/api/models';
import {GetCategoriesTypeItem} from '@/shared/api/models/getCategoriesTypeItem';

import AddCategory from './AddCategory';
import CategoryActionDialog from './CategoryActionDialog';
import EditCategory from './EditCategory';
import {ICONS_BY_ID} from './IconPicker';

type Props = {
  onClose: () => void;
  type?: GetCategoriesTypeItem; // INCOME | EXPENSE
};

function CategoriesManager({
  onClose,
  type = GetCategoriesTypeItem.INCOME,
}: Props) {
  const {t, i18n} = useTranslation();
  const queryClient = useQueryClient();

  const [isArchive, setIsArchive] = useState(false);
  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponseDTO | null>(null);
  const [confirm, setConfirm] = useState<{
    action: 'archive' | 'restore' | 'delete';
    category: CategoryResponseDTO;
  } | null>(null);

  const {mutateAsync: deleteCategory, isPending: isDeleting} =
    useDeleteCategory();
  const {mutateAsync: archiveCategory, isPending: isArchiving} =
    useArchiveCategory();
  const {mutateAsync: unarchiveCategory, isPending: isRestoring} =
    useUnarchiveCategory();

  const trPrefix =
    type === GetCategoriesTypeItem.EXPENSE ? 'expense' : 'income';
  const catT = (suffix: string, fallbackSuffix?: string) => {
    const primaryKey = `${trPrefix}.categories.${suffix}`;
    if (i18n.exists(primaryKey)) return t(primaryKey);
    return t(`income.categories.${fallbackSuffix ?? suffix}`);
  };

  const trimmedSearch = search.trim();
  const categoriesParams = {
    name: trimmedSearch || undefined,
    type: [type],
    archived: isArchive,
  };

  const {data: response, isLoading} = useGetCategories(categoriesParams);

  // Orval returns an object like: { data: CategoryResponseDTO[] | ProblemDetail; status: 200 }
  const categories = Array.isArray(response) ? response : [];

  const visibleCategories = categories;

  const listTitle = isArchive ? catT('archivedTitle') : catT('incomeTitle');

  const invalidateCategories = async () => {
    await queryClient.invalidateQueries({queryKey: getGetCategoriesQueryKey()});
  };

  const handleToggleArchive = async (category: CategoryResponseDTO) => {
    if (!category.id || isArchiving || isRestoring) return;
    try {
      if (isArchive) {
        await unarchiveCategory({categoryId: category.id});
      } else {
        await archiveCategory({categoryId: category.id});
      }
      await invalidateCategories();
      toast.success(t('common.success'));
    } catch {
      toast.error(t('common.error'));
    }
  };

  const handleDelete = async (category: CategoryResponseDTO) => {
    if (!category.id || isDeleting) return;
    try {
      await deleteCategory({categoryId: category.id});
      await invalidateCategories();
    } catch {
      toast.error(t('common.error'));
    }
  };

  return (
    <div className="md:fixed inset-0 flex items-center md:justify-center md:z-50 md:bg-black/40 md:backdrop-blur-[6.2px] md:p-4">
      <div className="flex h-[781px] w-full max-w-[342px] flex-col overflow-hidden rounded-2xl bg-card dark:bg-[#142624] [box-shadow:0px_4px_4px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] backdrop-blur-[32px] md:h-[766px] md:max-w-[900px]">
        {isAddOpen ? (
          <AddCategory open onOpenChange={setIsAddOpen} type={type} />
        ) : null}
        {editingCategory ? (
          <EditCategory
            open
            category={editingCategory}
            type={type}
            onOpenChange={open => {
              if (!open) setEditingCategory(null);
            }}
          />
        ) : null}
        <CategoryActionDialog
          open={!!confirm}
          onOpenChange={open => setConfirm(open ? confirm : null)}
          title={
            confirm?.action === 'archive'
              ? t('income.categories.modals.archiveTitle')
              : confirm?.action === 'restore'
                ? t('income.categories.modals.restoreTitle')
                : t('income.categories.modals.deleteTitle')
          }
          cancelLabel={t('income.categories.modals.cancel')}
          confirmLabel={
            confirm?.action === 'archive'
              ? t('income.categories.modals.archiveConfirm')
              : confirm?.action === 'restore'
                ? t('income.categories.modals.restoreConfirm')
                : t('income.categories.modals.deleteConfirm')
          }
          confirmVariant={
            confirm?.action === 'delete' ? 'destructive' : 'primary'
          }
          isPending={isDeleting || isArchiving || isRestoring}
          onConfirm={() => {
            if (!confirm) return;
            const {action, category} = confirm;
            setConfirm(null);
            if (action === 'delete') {
              void handleDelete(category);
            } else {
              void handleToggleArchive(category);
            }
          }}
        />
        <>
          <div className="flex h-[79px] items-center justify-between px-6">
            <h2 className="text-[20px] font-medium leading-[1.167]">
              {catT('managerTitle')}
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
            <div className="flex flex-col md:flex-row w-full max-w-[820px] items-center justify-between gap-4">
              <div className="flex w-full gap-[42px] md:gap-[8px] md:justify-start justify-between">
                <Button
                  type="button"
                  variant={!isArchive ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setIsArchive(false)}
                  className={cn('w-full md:w-[88px] h-[40px]')}
                >
                  {t('income.categories.active')}
                </Button>
                <Button
                  type="button"
                  variant={isArchive ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setIsArchive(true)}
                  className={cn('w-full md:w-[88px] h-[40px]')}
                >
                  {t('income.categories.archived')}
                </Button>
              </div>
              <div className="w-full max-w-[360px]">
                <Input
                  type="search"
                  icon={<Search className="size-4" />}
                  placeholder={catT('searchPlaceholder')}
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  showErrorSlot={false}
                />
              </div>
            </div>

            <Button
              onClick={() => setIsAddOpen(true)}
              className="h-12.5 w-full max-w-[820px] cursor-pointer gap-2"
              variant="primary"
            >
              <Plus className="size-4" />
              {catT('createNew')}
            </Button>

            <div className="mt-2 flex w-full max-w-[820px] min-h-0 flex-1 flex-col gap-3 overflow-y-auto pb-3">
              {isLoading ? (
                <div className="text-muted-foreground">{catT('loading')}</div>
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
                        key={category.id ?? `${category.type}-${category.name}`}
                        className={cn(
                          'flex items-center justify-between rounded-[12px] border border-white/10 px-4 py-4 transition-all duration-500',
                          // Figma uses solid base fill (#193432) for cards in this area.
                          'bg-[#193432] hover:border-transparent hover:[background:linear-gradient(0deg,rgba(2,98,77,0.6)_0%,rgba(4,200,158,1)_60%)]',
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
                              {type === GetCategoriesTypeItem.INCOME
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
                              className="flex size-11 items-center justify-center rounded-[10px] border border-white/30 bg-[var(--glass-bg)] text-foreground [box-shadow:var(--glass-shadow)]"
                            >
                              <Edit className="size-5" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              setConfirm({
                                action: isArchive ? 'restore' : 'archive',
                                category,
                              })
                            }
                            className="flex size-11 items-center justify-center rounded-[10px] border border-white/30 bg-[var(--glass-bg)] text-foreground [box-shadow:var(--glass-shadow)]"
                          >
                            {isArchive ? (
                              <ArchiveRestore className="size-5 text-foreground" />
                            ) : (
                              <Archive className="size-5 text-foreground" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setConfirm({action: 'delete', category})
                            }
                            className="flex size-11 items-center justify-center rounded-[10px] border border-white/10 bg-[#8a0f0f] text-white [box-shadow:inset_0px_1px_0px_0px_rgba(255,255,255,0.2),0px_4px_4px_0px_rgba(75,75,75,0.2)]"
                          >
                            <Trash className="size-5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
                  <div
                    className="flex size-20 cursor-pointer items-center justify-center rounded-[10px] border border-[#5a736e] bg-[var(--glass-bg)] [box-shadow:var(--glass-shadow)]"
                    onClick={() => setIsAddOpen(true)}
                  >
                    <Plus className="size-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-[16px] leading-[1.167] text-foreground">
                    {isArchive
                      ? catT('emptyArchivedTitle')
                      : catT('emptyTitle')}
                  </h3>
                  <p className="text-[14px] leading-[1.167] text-muted-foreground">
                    {isArchive
                      ? catT('emptyArchivedSubtitle')
                      : catT('emptySubtitle')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      </div>
    </div>
  );
}

export default CategoriesManager;
