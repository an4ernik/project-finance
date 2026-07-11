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
import {Tooltip, TooltipContent, TooltipTrigger} from '@/components/ui/tooltip';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {toast} from 'sonner';
import {isAxiosError} from 'axios';

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
import {TRANSACTION_THEMES} from '@/constances/constances';
import {getGetTransactionsQueryKey} from '@/shared/api/generated/transaction-management/transaction-management';
import MobileHeader from '@/components/MobileHeader';
import SideBar from '@/components/ui/SideBar';
import {
  getCategoryDisplayName,
  isGlobalCategory,
  sortGlobalCategoriesFirst,
} from './categoryDisplay';

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

  const theme = TRANSACTION_THEMES[type];

  const [isArchive, setIsArchive] = useState(false);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<CategoryResponseDTO | null>(null);
  const [confirm, setConfirm] = useState<{
    action: 'archive' | 'restore' | 'delete';
    category: CategoryResponseDTO;
  } | null>(null);
  const [needsTransfer, setNeedsTransfer] = useState(false);
  const [transferId, setTransferId] = useState<string | undefined>(undefined);

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
    return t(`${trPrefix}.categories.${fallbackSuffix ?? suffix}`);
  };

  const trimmedSearch = search.trim();
  const categoriesParams = {
    name: trimmedSearch || undefined,
    type: [type],
    archived: isArchive,
  };

  const {data: response, isLoading} = useGetCategories(categoriesParams);
  const {data: activeCategoriesResponse} = useGetCategories({
    type: [type],
    archived: false,
  });

  const categories = Array.isArray(response)
    ? response
    : Array.isArray(response)
      ? response
      : [];
  const activeCategories = Array.isArray(activeCategoriesResponse)
    ? activeCategoriesResponse
    : Array.isArray(activeCategoriesResponse)
      ? activeCategoriesResponse
      : [];

  const visibleCategories = sortGlobalCategoriesFirst(categories);

  const listTitle = isArchive ? catT('archivedTitle') : catT('categoryType');

  const invalidateCategories = async () => {
    await queryClient.invalidateQueries({queryKey: getGetCategoriesQueryKey()});
    await queryClient.invalidateQueries({
      queryKey: getGetTransactionsQueryKey(),
    });
  };

  const handleToggleArchive = async (category: CategoryResponseDTO) => {
    if (
      !category.id ||
      isGlobalCategory(category) ||
      isArchiving ||
      isRestoring
    )
      return;
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
    if (!category.id || isGlobalCategory(category) || isDeleting) return;
    try {
      await deleteCategory({
        categoryId: category.id,
        params: {
          replacementCategoryId: transferId ? Number(transferId) : undefined,
        },
      });
      await invalidateCategories();
      setConfirm(null);
      setNeedsTransfer(false);
      setTransferId(undefined);
      toast.success(t('common.success'));
    } catch (error: unknown) {
      const status = isAxiosError(error) ? error.response?.status : undefined;
      if (!transferId && (status === 400 || status === 409)) {
        setNeedsTransfer(true);
        return;
      }
      toast.error(t('common.error'));
    }
  };

  const closeConfirm = () => {
    setConfirm(null);
    setNeedsTransfer(false);
    setTransferId(undefined);
  };

  const transferOptions = activeCategories.filter(
    category => category.id && category.id !== confirm?.category.id,
  );

  function isAction<T>(item: T | false): item is T {
    return Boolean(item);
  }

  const actions = [
    !isArchive && {
      key: t(`${type.toLocaleLowerCase()}.categories.tooltip.edit`),
      title: 'edit',
      icon: Edit,
      onClick: (category: CategoryResponseDTO) => setEditingCategory(category),
      className:
        'flex p-2 sm:p-3 items-center justify-center rounded-[10px] border border-white/30',
    },

    {
      key: isArchive
        ? t(`${type.toLocaleLowerCase()}.categories.tooltip.restore`)
        : t(`${type.toLocaleLowerCase()}.categories.tooltip.archive`),
      title: 'archive',
      icon: isArchive ? ArchiveRestore : Archive,
      onClick: (category: CategoryResponseDTO) =>
        setConfirm({
          action: isArchive ? 'restore' : 'archive',
          category,
        }),
      className:
        'flex p-2 sm:p-3 items-center justify-center rounded-[10px] border border-white/30',
    },

    {
      key: t(`${type.toLocaleLowerCase()}.categories.tooltip.delete`),
      title: 'delete',
      icon: Trash,
      onClick: (category: CategoryResponseDTO) => {
        setNeedsTransfer(false);
        setTransferId(undefined);
        setConfirm({action: 'delete', category});
      },
      className:
        'flex p-2.5 sm:p-3.5 items-center justify-center rounded-[10px] text-white',
    },
  ].filter(isAction);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput.trim());
    }, 800);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const selectedCategoryName = confirm?.category?.name || '';

  return (
    <div className="fixed inset-0 z-50 flex gap-3 flex-col items-center justify-start bg-[#F2F2F2] md:bg-[#f2f2f282] dark:bg-[#0B1514] md:dark:bg-[#0b151469] md:backdrop-blur-[6.2px] md:p-6 overflow-y-auto scrollbar-hide">
      <MobileHeader
        onClick={() => setMenuOpen(true)}
        className="sticky top-0 z-50 shrink-0"
      />

      <SideBar
        variant="mobile"
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        className="z-[210]"
      />

      <div className="flex md:hidden items-start flex-col px-[25px] mt-5 mb-5.5 self-start">
        <h2 className="text-xl sm:text-2xl font-semibold">
          {t(`${type.toLocaleLowerCase()}.title`)}
        </h2>
        <p className="text-sm text-muted-foreground">
          {t(`${type.toLocaleLowerCase()}.subtitle`)}
        </p>
      </div>

      {/* MODAL CONTAINER */}
      <div
        className={cn(
          'relative flex w-[calc(100%-3rem)] md:w-full max-w-[900px] h-auto min-h-[74dvh] flex-col rounded-2xl bg-[#EEF3F2] dark:bg-[#142624] shrink-0 mb-10',
          '[box-shadow:0px_2px_2px_0px_rgba(75,75,75,0.2),inset_0px_1px_0px_0px_rgba(255,255,255,0.25)] px-3 sm:px-6 py-7',
        )}
      >
        {/* HEADER */}
        <div className="flex w-full items-center justify-between shrink-0 mb-14">
          <h2 className="text-[20px] font-medium leading-[1.167]">
            {catT('managerTitle')}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-[10px] text-muted-foreground transition-colors hover:text-foreground cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* CONTROLS */}
        <div className="flex shrink-0 flex-col md:flex-row w-full items-center justify-between gap-4">
          <div className="flex w-full justify-between gap-[42px] md:gap-[8px] md:justify-start">
            <Button
              type="button"
              variant={!isArchive ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setIsArchive(false)}
              className="h-[40px] w-full md:w-[88px]"
            >
              {t('income.categories.active')}
            </Button>

            <Button
              type="button"
              variant={isArchive ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setIsArchive(true)}
              className="h-[40px] w-full md:w-[88px]"
            >
              {t('income.categories.archived')}
            </Button>
          </div>

          <div className="w-full md:max-w-[360px]">
            <Input
              type="search"
              icon={<Search className="size-4" />}
              placeholder={catT('searchPlaceholder')}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              showErrorSlot={false}
            />
          </div>
        </div>

        {/* ADD BUTTON */}
        {!isArchive && (
          <div className="pt-4 shrink-0">
            <Button
              onClick={() => setIsAddOpen(true)}
              className="h-12.5 w-full gap-2"
              variant="primary"
            >
              <Plus className="size-4" />
              {catT('createNew')}
            </Button>
          </div>
        )}
        <p className="text-[16px] text-foreground mt-10 mb-3">
          {listTitle} ({visibleCategories.length})
        </p>

        {/* LIST */}
        <div className="flex-1">
          {isLoading ? (
            <div className="text-muted-foreground">{catT('loading')}</div>
          ) : visibleCategories.length > 0 ? (
            <>
              <div className="flex flex-col gap-3">
                {visibleCategories.map(category => {
                  const Icon = category.icon
                    ? ICONS_BY_ID[category.icon]
                    : null;
                  const canManageCategory = !isGlobalCategory(category);
                  const categoryName = getCategoryDisplayName(category, t);

                  return (
                    <div
                      key={category.id ?? `${category.type}-${category.name}`}
                      className={cn(
                        'group flex items-center justify-between rounded-[12px] border border-white/10 px-4 py-4 transition-all duration-500',
                        'bg-white dark:bg-[#193432]',
                        theme.container,
                      )}
                    >
                      {/* LEFT SECTION */}
                      <div className="flex items-center flex-1 min-w-0 gap-3">
                        {/* ICON WRAPPER */}
                        <div
                          className={cn(
                            'flex p-3 items-center justify-center rounded-lg shrink-0 transition-colors',
                            theme.bgIcon,
                          )}
                        >
                          {Icon && (
                            <Icon className={cn('size-4', theme.textIcon)} />
                          )}
                        </div>

                        {/* TEXT CONTENT - Forced truncation with min-w-0 */}
                        <div className="flex flex-col flex-1 min-w-0">
                          <span
                            className={cn(
                              'block text-[16px] truncate transition-colors',
                              theme.textTitle,
                            )}
                          >
                            {categoryName}
                          </span>

                          <span
                            className={cn(
                              'mt-1 w-fit text-[10px] px-2 py-0.5 rounded-md whitespace-nowrap',
                              theme.repeatType,
                            )}
                          >
                            {type === GetCategoriesTypeItem.INCOME
                              ? t('income.categories.typeIncome')
                              : t('expense.categories.typeExpense')}
                          </span>
                        </div>
                      </div>

                      {/* ACTIONS */}
                      {canManageCategory && (
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {actions.map(
                            ({
                              key,
                              title,
                              icon: ActionIcon,
                              onClick,
                              className,
                            }) => {
                              const isDelete = title === 'delete';
                              const btnBg = isDelete
                                ? theme.deleteIconBg
                                : theme.editIconBg;
                              const btnText = isDelete
                                ? theme.deleteIconText
                                : theme.editIconText;

                              return (
                                <Tooltip key={title}>
                                  <TooltipTrigger asChild>
                                    <button
                                      key={title}
                                      onClick={() => onClick(category)}
                                      className={cn(
                                        'flex items-center justify-center p-2 rounded-lg transition-all cursor-pointer',
                                        'animate-in fade-in slide-in-from-right-2 duration-200 [@media(hover:hover)]:hidden [@media(hover:hover)]:group-hover:flex',
                                        '[@media(hover:none)]:text-[#0B1514] dark:[@media(hover:none)]:text-white',
                                        className,
                                        btnBg,
                                        btnText,
                                      )}
                                    >
                                      <ActionIcon className="size-4 sm:size-5" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    sideOffset={1}
                                    className="border text-[#3A4A48] dark:text-[#BFD9D2] bg-[#fafafa] fill-[#eef3f2] dark:bg-[#0f453c]"
                                  >
                                    <p>{key.toLocaleLowerCase()}</p>
                                  </TooltipContent>
                                </Tooltip>
                              );
                            },
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center h-full mt-14">
              <div
                className={cn(
                  'flex justify-center items-center size-20 rounded-lg border p-4 transition-all shadow-md',
                  'bg-linear-to-b from-[#0B151403] via-[#315F551A] to-[#90D0B60D] backdrop-blur-sm',
                  'border-[#9AA7A5] shadow-[#4B4B4B40]',
                  'dark:border-[#183f35] dark:shadow-[#1d2f1c]',
                )}
              >
                {!isArchive ? (
                  <Plus className="size-10 text-[#5A736E]" />
                ) : (
                  <Archive className="size-8 text-[#5A736E]" />
                )}
              </div>
              <h3 className="text-xl">
                {isArchive ? catT('emptyArchivedTitle') : catT('emptyTitle')}
              </h3>
              <p className="dark:text-[#5A736E]">
                {isArchive
                  ? catT('emptyArchivedSubtitle')
                  : catT('emptySubtitle')}
              </p>
            </div>
          )}
        </div>

        {/* MODALS */}
        {isAddOpen && (
          <AddCategory open onOpenChange={setIsAddOpen} type={type} />
        )}

        {editingCategory && (
          <EditCategory
            open
            category={editingCategory}
            type={type}
            onOpenChange={open => {
              if (!open) setEditingCategory(null);
            }}
          />
        )}

        <CategoryActionDialog
          type={type}
          categoryName={selectedCategoryName}
          open={!!confirm}
          onOpenChange={open => {
            if (!open) closeConfirm();
          }}
          title={
            confirm?.action === 'archive'
              ? catT('modals.archiveTitle')
              : confirm?.action === 'restore'
                ? catT('modals.restoreTitle')
                : catT('modals.deleteTitle')
          }
          description={
            needsTransfer
              ? catT('modals.deleteTransferDescription')
              : confirm?.action === 'archive'
                ? catT('modals.archiveDescription')
                : confirm?.action === 'restore'
                  ? catT('modals.restoreDescription')
                  : confirm?.action === 'delete'
                    ? catT('modals.deleteDescription')
                    : undefined
          }
          cancelLabel={catT('modals.cancel')}
          confirmLabel={
            confirm?.action === 'archive'
              ? catT('modals.archiveConfirm')
              : confirm?.action === 'restore'
                ? catT('modals.restoreConfirm')
                : catT('modals.deleteConfirm')
          }
          confirmVariant={
            confirm?.action === 'delete' ? 'destructive' : 'primary'
          }
          isPending={isDeleting || isArchiving || isRestoring}
          showTransfer={needsTransfer}
          transferLabel={catT('modals.transferLabel')}
          transferPlaceholder={catT('modals.transferPlaceholder')}
          transferOptions={transferOptions}
          selectedTransferId={transferId}
          onTransferChange={setTransferId}
          onConfirm={() => {
            if (!confirm) return;
            const {action, category} = confirm;

            if (action === 'delete') {
              void handleDelete(category);
            } else {
              setConfirm(null);
              void handleToggleArchive(category);
            }
          }}
        />
      </div>
    </div>
  );
}

export default CategoriesManager;
